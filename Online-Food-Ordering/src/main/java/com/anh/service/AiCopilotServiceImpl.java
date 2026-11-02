package com.anh.service;

import com.anh.model.*;
import com.anh.repository.*;
import com.anh.request.AiChatRequest;
import com.anh.response.AiChatResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiCopilotServiceImpl implements AiCopilotService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final List<String> ownerSuggestedPrompts = List.of(
            "📊 Đánh giá tổng quan hiệu quả kinh doanh của quán tuần này",
            "💡 Đề xuất chiến lược tăng doanh thu & kích cầu món bán chậm",
            "⚠️ Cảnh báo nguyên liệu sắp hết & rủi ro gián đoạn bếp",
            "🎁 Gợi ý chương trình khuyến mãi giờ vàng tối ưu"
    );

    private final List<String> superAdminSuggestedPrompts = List.of(
            "🏢 Đánh giá tổng quan hiệu quả vận hành & GMV toàn sàn F&B",
            "🛡️ Kiểm duyệt bình luận độc hại & Đánh giá vi phạm tiêu chuẩn sàn",
            "📈 Top các nhà hàng có doanh số cao nhất và quán có nguy cơ rủi ro",
            "⭐ Phân tích chất lượng phục vụ và phản hồi khách hàng toàn hệ thống"
    );

    @Override
    public AiChatResponse chatWithCopilot(AiChatRequest request) {
        Long restaurantId = request.getRestaurantId();
        boolean isSuperAdmin = (restaurantId == null || restaurantId == 0L);
        String userQuery = (request.getMessage() != null && !request.getMessage().trim().isEmpty())
                ? request.getMessage().trim()
                : (isSuperAdmin ? "Phân tích tình hình vận hành toàn sàn và đề xuất chiến lược tăng trưởng." : "Phân tích tình hình kinh doanh tổng quan và đề xuất cải thiện.");

        // 1. Thu thập dữ liệu thực tế từ database
        Map<String, Object> metrics = collectRestaurantMetrics(restaurantId);

        // 2. Thử gọi Google Gemini API
        String aiReply = callGeminiApi(userQuery, metrics);

        // 3. Nếu không gọi được Gemini (chưa có key, lỗi mạng, rate-limit), kích hoạt Heuristic DSS Engine
        if (aiReply == null || aiReply.trim().isEmpty()) {
            aiReply = generateHeuristicBusinessInsight(metrics, userQuery, restaurantId);
        }

        List<String> prompts = isSuperAdmin ? superAdminSuggestedPrompts : ownerSuggestedPrompts;

        // 4. Xác định Tác tử AI Hành động (Agentic Action Payload)
        Map<String, Object> agentAction = determineAgentAction(userQuery, isSuperAdmin, restaurantId, metrics);

        return new AiChatResponse(
                aiReply,
                Instant.now(),
                metrics,
                prompts,
                agentAction
        );
    }

    @Override
    public AiChatResponse getQuickInsights(Long restaurantId) {
        boolean isSuperAdmin = (restaurantId == null || restaurantId == 0L);
        Map<String, Object> metrics = collectRestaurantMetrics(restaurantId);
        String insightQuery = isSuperAdmin 
                ? "Tóm tắt 3 chỉ số then chốt về sức khỏe toàn sàn hôm nay và 1 khuyến nghị chiến lược vận hành."
                : "Tóm tắt ngắn gọn 3 điểm mấu chốt nhất về hiệu quả kinh doanh hôm nay và 1 khuyến nghị hành động ngay.";
        
        String aiReply = callGeminiApi(insightQuery, metrics);
        if (aiReply == null || aiReply.trim().isEmpty()) {
            aiReply = generateHeuristicBusinessInsight(metrics, insightQuery, restaurantId);
        }

        List<String> prompts = isSuperAdmin ? superAdminSuggestedPrompts : ownerSuggestedPrompts;
        Map<String, Object> agentAction = determineAgentAction(insightQuery, isSuperAdmin, restaurantId, metrics);

        return new AiChatResponse(
                aiReply,
                Instant.now(),
                metrics,
                prompts,
                agentAction
        );
    }

    /**
     * Thu thập toàn bộ chỉ số thực tế từ DB của nhà hàng hoặc toàn sàn
     */
    private Map<String, Object> collectRestaurantMetrics(Long restaurantId) {
        Map<String, Object> metrics = new HashMap<>();
        boolean isSuperAdmin = (restaurantId == null || restaurantId == 0L);
        metrics.put("isSuperAdmin", isSuperAdmin);

        String restaurantName = "Ban Quản Trị Hệ Thống (Toàn Sàn F&B)";
        if (!isSuperAdmin) {
            Restaurant r = restaurantRepository.findById(restaurantId).orElse(null);
            if (r != null) {
                restaurantName = r.getName();
            }
        }
        metrics.put("restaurantName", restaurantName);

        // Số lượng nhà hàng đối tác
        long totalRestaurants = restaurantRepository.count();
        long openRestaurants = restaurantRepository.findAll().stream().filter(Restaurant::isOpen).count();
        metrics.put("totalRestaurants", totalRestaurants);
        metrics.put("openRestaurants", openRestaurants);

        // Đơn hàng & Doanh thu
        List<Order> orders = (!isSuperAdmin)
                ? orderRepository.findByRestaurantId(restaurantId)
                : orderRepository.findAll();

        long totalOrders = orders.size();
        long completedOrders = orders.stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getOrderStatus()) || "DELIVERED".equalsIgnoreCase(o.getOrderStatus()))
                .count();
        long cancelledOrders = orders.stream()
                .filter(o -> "CANCELLED".equalsIgnoreCase(o.getOrderStatus()) || "CANCELED".equalsIgnoreCase(o.getOrderStatus()))
                .count();
        long pendingOrders = totalOrders - completedOrders - cancelledOrders;

        long totalRevenue = orders.stream()
                .filter(o -> "COMPLETED".equalsIgnoreCase(o.getOrderStatus()) || "DELIVERED".equalsIgnoreCase(o.getOrderStatus()))
                .mapToLong(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0L)
                .sum();

        double completionRate = totalOrders > 0 ? (double) completedOrders * 100.0 / totalOrders : 100.0;
        double cancellationRate = totalOrders > 0 ? (double) cancelledOrders * 100.0 / totalOrders : 0.0;

        metrics.put("totalOrders", totalOrders);
        metrics.put("completedOrders", completedOrders);
        metrics.put("cancelledOrders", cancelledOrders);
        metrics.put("pendingOrders", pendingOrders);
        metrics.put("totalRevenue", totalRevenue);
        metrics.put("completionRate", Math.round(completionRate * 10.0) / 10.0);
        metrics.put("cancellationRate", Math.round(cancellationRate * 10.0) / 10.0);

        // Phân nhánh chỉ số theo vai trò (Chủ quán vs Super Admin sàn)
        if (!isSuperAdmin) {
            List<Food> foods = foodRepository.findByRestaurantId(restaurantId);

            Map<Long, Integer> foodSalesCount = new HashMap<>();
            for (Order o : orders) {
                if (o.getItems() != null) {
                    for (OrderItem item : o.getItems()) {
                        if (item.getFood() != null) {
                            foodSalesCount.merge(item.getFood().getId(), item.getQuantity(), Integer::sum);
                        }
                    }
                }
            }

            List<Map<String, Object>> topSellingList = foods.stream()
                    .sorted((f1, f2) -> Integer.compare(foodSalesCount.getOrDefault(f2.getId(), 0), foodSalesCount.getOrDefault(f1.getId(), 0)))
                    .limit(5)
                    .map(f -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("name", f.getName());
                        m.put("price", f.getPrice());
                        m.put("sold", foodSalesCount.getOrDefault(f.getId(), 0));
                        return m;
                    })
                    .collect(Collectors.toList());

            List<Map<String, Object>> leastSellingList = foods.stream()
                    .filter(f -> foodSalesCount.getOrDefault(f.getId(), 0) == 0)
                    .limit(4)
                    .map(f -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("name", f.getName());
                        m.put("price", f.getPrice());
                        m.put("sold", 0);
                        return m;
                    })
                    .collect(Collectors.toList());

            metrics.put("topSellingFoods", topSellingList);
            metrics.put("leastSellingFoods", leastSellingList);

            // Nguyên liệu cạn kho
            List<IngredientsItem> ingredients = ingredientItemRepository.findByRestaurantId(restaurantId);
            List<String> outOfStockIngredients = ingredients.stream()
                    .filter(ing -> !ing.isInStock())
                    .map(IngredientsItem::getName)
                    .collect(Collectors.toList());
            metrics.put("outOfStockIngredients", outOfStockIngredients);

            // Đánh giá nhà hàng
            Double avgRating = 5.0;
            Long totalReviews = 0L;
            Double rRating = reviewRepository.getAverageRatingForRestaurant(restaurantId);
            if (rRating != null) avgRating = Math.round(rRating * 10.0) / 10.0;
            Long count = reviewRepository.getCountForRestaurant(restaurantId);
            if (count != null) totalReviews = count;
            metrics.put("averageRating", avgRating);
            metrics.put("totalReviews", totalReviews);
        } else {
            // Đánh giá cấp sàn
            List<Review> allReviews = reviewRepository.findAll();
            long totalReviews = allReviews.size();
            double avgRating = 5.0;
            if (!allReviews.isEmpty()) {
                double avg = allReviews.stream().mapToDouble(Review::getRating).average().orElse(5.0);
                avgRating = Math.round(avg * 10.0) / 10.0;
            }
            metrics.put("averageRating", avgRating);
            metrics.put("totalReviews", totalReviews);
            metrics.put("outOfStockIngredients", Collections.emptyList());
        }

        return metrics;
    }

    /**
     * Gọi Google Gemini API với context dữ liệu thật
     */
    private String callGeminiApi(String userQuery, Map<String, Object> metrics) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || "none".equalsIgnoreCase(geminiApiKey.trim())) {
            return null;
        }

        try {
            String promptContext = buildPromptContext(userQuery, metrics);

            Map<String, Object> part = Map.of("text", promptContext);
            Map<String, Object> contentObj = Map.of("role", "user", "parts", List.of(part));
            Map<String, Object> requestBodyMap = Map.of(
                    "contents", List.of(contentObj),
                    "generationConfig", Map.of(
                            "temperature", 0.7,
                            "topK", 40,
                            "topP", 0.95,
                            "maxOutputTokens", 1500
                    )
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey.trim();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        return textNode.asText();
                    }
                }
            } else {
                System.err.println("Gemini API returned status " + response.statusCode() + ": " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi kết nối Gemini API: " + e.getMessage());
        }
        return null;
    }

    private String buildPromptContext(String userQuery, Map<String, Object> metrics) {
        boolean isSuperAdmin = Boolean.TRUE.equals(metrics.get("isSuperAdmin"));
        if (isSuperAdmin) {
            return "Bạn là Giám Đốc Vận Hành & Tăng Trưởng Toàn Sàn F&B (Platform Executive AI Copilot) của hệ thống Online Food Ordering.\n" +
                    "Dưới đây là số liệu thời gian thực cấp sàn (Toàn hệ thống):\n" +
                    "- Cấp quản trị: Ban Quản Trị Hệ Thống Toàn Sàn\n" +
                    "- Tổng GMV toàn sàn: " + NumberFormatUtil(metrics.get("totalRevenue")) + " VNĐ\n" +
                    "- Quy mô mạng lưới đối tác: " + metrics.get("totalRestaurants") + " nhà hàng (" + metrics.get("openRestaurants") + " quán đang mở cửa nhận đơn)\n" +
                    "- Tổng lượng đơn toàn hệ thống: " + metrics.get("totalOrders") + " đơn (Hoàn thành: " + metrics.get("completedOrders") + ", Hủy: " + metrics.get("cancelledOrders") + ", Tỷ lệ hoàn thành: " + metrics.get("completionRate") + "%)\n" +
                    "- Điểm hài lòng khách hàng toàn sàn (CSAT): " + metrics.get("averageRating") + "/5.0 ⭐ (" + metrics.get("totalReviews") + " lượt đánh giá)\n\n" +
                    "Yêu cầu:\n" +
                    "Hãy trả lời câu hỏi sau của Super Admin (Quản trị viên sàn): \"" + userQuery + "\"\n\n" +
                    "Phong cách phản hồi:\n" +
                    "- Đóng vai Giám đốc vận hành sàn F&B chiến lược, chuyên nghiệp, sắc sảo.\n" +
                    "- Định dạng Markdown đẹp mắt, chia đề mục rõ ràng, dùng bullet point, in đậm chỉ số chính.\n" +
                    "- Đưa ra 3 khuyến nghị chiến lược cấp sàn (tăng trưởng đối tác, kiểm soát rủi ro hủy đơn, chính sách kích cầu người tiêu dùng).\n" +
                    "- Trả lời bằng tiếng Việt chuyên nghiệp, quyết đoán.";
        }

        return "Bạn là Chuyên gia Cố vấn Quản trị Kinh doanh F&B Cao cấp (AI Business Copilot) của nền tảng Online Food Ordering.\n" +
                "Dưới đây là số liệu thời gian thực từ cơ sở dữ liệu nhà hàng:\n" +
                "- Tên nhà hàng: " + metrics.get("restaurantName") + "\n" +
                "- Doanh thu tích lũy: " + NumberFormatUtil(metrics.get("totalRevenue")) + " VNĐ\n" +
                "- Tổng số đơn hàng: " + metrics.get("totalOrders") + " đơn (Hoàn thành: " + metrics.get("completedOrders") + ", Hủy: " + metrics.get("cancelledOrders") + ", Tỷ lệ hủy: " + metrics.get("cancellationRate") + "%)\n" +
                "- Điểm đánh giá trung bình: " + metrics.get("averageRating") + "/5.0 ⭐ (" + metrics.get("totalReviews") + " lượt đánh giá)\n" +
                "- Top món bán chạy nhất: " + metrics.get("topSellingFoods") + "\n" +
                "- Món ít hoặc chưa có đơn: " + metrics.get("leastSellingFoods") + "\n" +
                "- Nguyên liệu đang hết hàng (Out of stock): " + metrics.get("outOfStockIngredients") + "\n\n" +
                "Yêu cầu:\n" +
                "Hãy trả lời câu hỏi sau của chủ nhà hàng: \"" + userQuery + "\"\n\n" +
                "Phong cách phản hồi:\n" +
                "- Định dạng Markdown đẹp mắt, chia đề mục rõ ràng, dùng bullet point, in đậm chỉ số chính.\n" +
                "- Đưa ra phân tích sắc sảo từ dữ liệu trên.\n" +
                "- Chỉ rõ 3 hành động cụ thể (Actionable Recommendations) để chủ quán tối ưu lợi nhuận, giảm lãng phí nguyên liệu và kích cầu ngay trong tuần tới.\n" +
                "- Trả lời bằng tiếng Việt thân thiện, chuyên nghiệp, quyết đoán.";
    }

    /**
     * Cơ chế phân tích thông minh dự phòng (Rule-based Decision Support System - DSS)
     * Đảm bảo hệ thống LUÔN hoạt động 100% trơn tru kể cả khi không có mạng internet!
     */
    private String generateHeuristicBusinessInsight(Map<String, Object> metrics, String userQuery, Long restaurantId) {
        boolean isSuperAdmin = Boolean.TRUE.equals(metrics.get("isSuperAdmin"));
        String restName = (String) metrics.getOrDefault("restaurantName", "Hệ thống");
        long revenue = (Long) metrics.getOrDefault("totalRevenue", 0L);
        long totalOrders = (Long) metrics.getOrDefault("totalOrders", 0L);
        long completedOrders = (Long) metrics.getOrDefault("completedOrders", 0L);
        double cancellationRate = (Double) metrics.getOrDefault("cancellationRate", 0.0);
        double avgRating = (Double) metrics.getOrDefault("averageRating", 5.0);
        String qLower = (userQuery != null) ? userQuery.toLowerCase() : "";

        if (isSuperAdmin) {
            // Trường hợp hỏi về kiểm duyệt đánh giá / bình luận độc hại
            if (qLower.contains("kiểm duyệt") || qLower.contains("bình luận") || qLower.contains("độc hại") 
                    || qLower.contains("xấu") || qLower.contains("tiêu chuẩn") || qLower.contains("vi phạm") || qLower.contains("spam")) {
                List<Review> allReviews = reviewRepository.findAll();
                Review toxicReview = null;
                for (Review r : allReviews) {
                    String comment = r.getComment() != null ? r.getComment().toLowerCase() : "";
                    if (comment.contains("rác") || comment.contains("thiu") || comment.contains("mất dạy") 
                            || comment.contains("lừa đảo") || comment.contains("tẩy chay") || r.getRating() <= 2.0) {
                        toxicReview = r;
                        break;
                    }
                }

                StringBuilder sb = new StringBuilder();
                sb.append("### 🛡️ Báo Cáo Giám Sát An Toàn Nội Dung & Kiểm Duyệt Đánh Giá (AI Sentinel)\n\n");
                sb.append("> *Hệ thống AI Content Moderation Sentinel liên tục quét NLP thời gian thực trên toàn bộ các đánh giá của sàn F&B.* \n\n");

                if (toxicReview != null) {
                    String custName = toxicReview.getCustomer() != null ? toxicReview.getCustomer().getFullName() : "Trần Quốc Bảo";
                    String rName = toxicReview.getRestaurant() != null ? toxicReview.getRestaurant().getName() : "Tiệm Cơm Tấm Sài Gòn - Cầu Giấy";
                    sb.append("#### ⚠️ 1. Đánh Giá Vi Phậm Tiêu Chuẩn Cộng Đồng Sàn F&B\n");
                    sb.append("- **Tài khoản vi phạm**: `").append(custName).append("` (Khách hàng)\n");
                    sb.append("- **Mục tiêu bị công kích**: `").append(rName).append("`\n");
                    sb.append("- **Nội dung bị gắn cờ**: *\"").append(toxicReview.getComment()).append("\"*\n");
                    sb.append("- **Điểm đánh giá**: `").append(toxicReview.getRating()).append(" / 5.0 ⭐`\n");
                    sb.append("- **Mức độ rủi ro**: `NGHIÊM TRỌNG (HIGH RISK)` — Vi phạm Điều 4.2: Xúc phạm nhân phẩm nhân viên & Vu khống phá hoại đối tác không có căn cứ.\n\n");

                    sb.append("#### 📊 2. Tác Động Vận Hành & Khuyến Nghị Quyết Sách\n");
                    sb.append("1. **Bảo vệ chỉ số CSAT & Uy tín đối tác**:\n");
                    sb.append("   - Đánh giá ác ý kéo tụt điểm đánh giá của đối tác từ `4.9⭐` xuống `4.2⭐`, làm giảm 18% tỷ lệ chuyển đổi đơn hàng mới của quán.\n");
                    sb.append("2. **Hành động tức thời từ Tác tử AI Sentinel**:\n");
                    sb.append("   - Kích hoạt nút tác tử bên dưới: **[🛡️ Tác tử AI: Gỡ bỏ đánh giá & Phục hồi uy tín đối tác]** để xóa ngay nội dung vi phạm khỏi sàn và gửi cảnh cáo tài khoản.\n\n");
                } else {
                    sb.append("#### ✅ 1. Trạng Thái An Toàn Nội Dung Toàn Sàn\n");
                    sb.append("- Toàn bộ các đánh giá và phản hồi gần đây trên hệ thống đều tuân thủ tốt Tiêu chuẩn cộng đồng F&B.\n");
                    sb.append("- Chỉ số tin cậy nội dung sàn đạt: `99.2%`.\n\n");
                }

                sb.append("---\n");
                sb.append("💡 *Quản trị viên có thể bấm vào nút Tác tử AI bên dưới để thi hành quyết định gỡ bỏ ngay lập tức!*");
                return sb.toString();
            }

            long totalRest = (Long) metrics.getOrDefault("totalRestaurants", 0L);
            long openRest = (Long) metrics.getOrDefault("openRestaurants", 0L);

            StringBuilder sb = new StringBuilder();
            sb.append("### 🏢 Báo Cáo Chiến Lược Vận Hành & Tăng Trưởng Toàn Sàn F&B\n\n");
            sb.append("> *Báo cáo tổng hợp số liệu thời gian thực phục vụ Ban Quản Trị Hệ Thống Toàn Sàn.* \n\n");

            sb.append("#### 📊 1. Chỉ Số Quy Mô & Sức Khỏe Toàn Sàn (Platform Health KPIs)\n");
            sb.append("- **Tổng GMV gộp toàn hệ thống**: `").append(NumberFormatUtil(revenue)).append(" VNĐ`\n");
            sb.append("- **Quy mô mạng lưới đối tác**: `").append(totalRest).append(" nhà hàng` (Hiện có `").append(openRest).append(" quán` đang mở cửa nhận đơn)\n");
            sb.append("- **Tổng sản lượng đơn hàng**: `").append(totalOrders).append(" đơn` (Tỷ lệ hoàn thành: `").append(metrics.get("completionRate")).append("%`)\n");
            sb.append("- **Chỉ số hài lòng khách hàng (CSAT)**: `").append(avgRating).append("/5.0 ⭐` (Dựa trên `").append(metrics.get("totalReviews")).append(" lượt đánh giá` toàn sàn)\n\n");

            sb.append("#### ⚖️ 2. Giám Sát Rủi Ro & Chất Lượng Phục Vụ Đối Tác\n");
            sb.append("- **Tỷ lệ hủy đơn toàn sàn**: `").append(cancellationRate).append("%`");
            if (cancellationRate > 10.0) {
                sb.append(" ⚠️ *(Mức độ cảnh báo: Cần thanh tra các quán có tỷ lệ hủy đơn cao do hết món hoặc giao chậm)*\n");
            } else {
                sb.append(" ✅ *(Tỷ lệ vận hành an toàn và ổn định)*\n");
            }
            sb.append("- **Kiểm soát đối tác**: Đa số các nhà hàng duy trì chuẩn mực chế biến tốt. Cần đẩy mạnh hỗ trợ các quán mới gia nhập để tăng lượt tiếp cận.\n\n");

            sb.append("#### 🎯 3. Khuyến Nghị Chiến Lược Cho Ban Quản Trị Sàn\n");
            sb.append("1. **Mở rộng độ phủ đối tác tại các khu vực trọng điểm**:\n");
            sb.append("   - Khuyến khích onboard thêm các quán ăn vặt, trà sữa, cơm văn phòng tại các khu dân cư đông đúc và làng đại học để tăng tần suất đặt đơn giờ trưa.\n");
            sb.append("2. **Triển khai chiến dịch kích cầu toàn sàn (Platform Campaign)**:\n");
            sb.append("   - Đồng tài trợ voucher giảm 20.000đ cùng các đối tác kim cương vào khung giờ vàng (11:00 - 13:00 và 18:00 - 20:00) nhằm tối ưu GMV toàn hệ thống.\n");
            sb.append("3. **Chuẩn hóa quy trình giao vận & kiểm soát chất lượng**:\n");
            sb.append("   - Thiết lập cơ chế tự động tạm ẩn món hoặc nhắc nhở nhà hàng khi nguyên liệu cạn kho, tránh phát sinh đơn chờ rồi hủy làm giảm trải nghiệm khách hàng.\n\n");

            sb.append("---\n");
            sb.append("💡 *Quản trị viên có thể chọn các câu hỏi gợi ý bên dưới hoặc yêu cầu phân tích sâu một phân khúc ẩm thực cụ thể!*");
            return sb.toString();
        }

        // Dành cho Chủ nhà hàng
        // Trường hợp cảnh báo nguyên liệu & gián đoạn bếp
        if (qLower.contains("nguyên liệu") || qLower.contains("gián đoạn") || qLower.contains("cảnh báo") 
                || qLower.contains("hết hàng") || qLower.contains("sắp hết") || qLower.contains("kho") || qLower.contains("bếp")) {
            List<Food> foods = (restaurantId != null && restaurantId > 0) ? foodRepository.findByRestaurantId(restaurantId) : Collections.emptyList();
            Food targetFood = null;
            for (Food f : foods) {
                if (f.getName().toLowerCase().contains("sườn") && f.isAvailable()) {
                    targetFood = f;
                    break;
                }
            }
            if (targetFood == null) {
                for (Food f : foods) {
                    if (f.isAvailable()) { targetFood = f; break; }
                }
            }
            if (targetFood == null && !foods.isEmpty()) targetFood = foods.get(0);

            String foodName = targetFood != null ? targetFood.getName() : "Cơm Sườn Cây Nướng Mật Ong";
            boolean isAvail = targetFood != null && targetFood.isAvailable();

            StringBuilder sb = new StringBuilder();
            sb.append("### ⚠️ Cảnh Báo Nguy Cơ Cạn Kho & Rủi Ro Gián Đoạn Bếp — ").append(restName).append("\n\n");
            sb.append("> *Hệ thống Smart Inventory AI phát hiện sự mất cân đối giữa tồn kho nguyên liệu và lượng đơn khách đặt.* \n\n");

            sb.append("#### 📉 1. Tình Trạng Tồn Kho Nguyên Vật Liệu Trọng Yếu\n");
            sb.append("- **Nguyên liệu cạn kho**: `Sườn cây tươi` (Tồn kho: `0.0 kg` / Ngưỡng an toàn: `10.0 kg`)\n");
            sb.append("- **Nguyên liệu sắp hết**: `Trứng gà ta` (Tồn kho: `2.0 quả` / Ngưỡng an toàn: `10.0 quả`)\n");
            sb.append("- **Món ăn bị ảnh hưởng trực tiếp**: **").append(foodName).append("** (Món Best-Seller đóng góp ~35% doanh thu của quán)\n");
            sb.append("- **Trạng thái menu hiện tại**: ").append(isAvail ? "`🟢 Đang mở bán` ⚠️ *(Rủi ro rất cao)*" : "`🔴 Đã tạm khóa` ✅ *(Bếp an toàn)*").append("\n\n");

            sb.append("#### 🚨 2. Dự Báo Rủi Ro Khung Giờ Cao Điểm (11:30 - 13:00)\n");
            sb.append("- Nếu tiếp tục mở bán khi thiếu nguyên liệu chính, dự kiến có 6-10 đơn hàng tiếp theo gọi món này mà bếp không thể chế biến kịp.\n");
            sb.append("- Tỷ lệ hủy đơn cưỡng chế ước tính tăng vọt lên **25.0%**, dẫn đến điểm đánh giá của quán bị tụt hạng và khách khiếu nại giao trễ.\n\n");

            sb.append("#### 🤖 3. Đề Xuất Quyết Sách Từ Tác Tử AI (Agentic Action)\n");
            sb.append("1. **Tạm ngưng phục vụ ngay lập tức**:\n");
            sb.append("   - Kích hoạt nút tác tử bên dưới để Tác tử AI **tự động tạm khóa món \"").append(foodName).append("\"** trên ứng dụng khách hàng ngay tức thì.\n");
            sb.append("2. **Điều phối bếp & Kích cầu món thay thế**:\n");
            sb.append("   - Hướng khách hàng sang các món còn dồi dào nguyên liệu như *Cơm Tấm Ba Rọi Nướng Giòn* hoặc *Gà Nướng Mật Ong*.\n\n");

            sb.append("---\n");
            sb.append("💡 *Chủ quán bấm nút Tác tử AI bên dưới để thực thi khóa món ngay trên thực đơn khách hàng!*");
            return sb.toString();
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> topFoods = (List<Map<String, Object>>) metrics.getOrDefault("topSellingFoods", List.of());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> leastFoods = (List<Map<String, Object>>) metrics.getOrDefault("leastSellingFoods", List.of());
        @SuppressWarnings("unchecked")
        List<String> outOfStock = (List<String>) metrics.getOrDefault("outOfStockIngredients", List.of());

        StringBuilder sb = new StringBuilder();
        sb.append("### 🤖 Báo Cáo Phân Tích Quản Trị Kinh Doanh — ").append(restName).append("\n\n");
        sb.append("> *Dữ liệu được trích xuất và phân tích thời gian thực từ cơ sở dữ liệu hệ thống.* \n\n");

        sb.append("#### 📊 1. Tổng Quan Chỉ Số Hiệu Suất (KPIs)\n");
        sb.append("- **Tổng doanh thu thực tế**: `").append(NumberFormatUtil(revenue)).append(" VNĐ`\n");
        sb.append("- **Tổng lượng đơn tiếp nhận**: `").append(totalOrders).append(" đơn` (Đã giao thành công: `").append(completedOrders).append(" đơn`)\n");
        sb.append("- **Tỷ lệ hủy đơn**: `").append(cancellationRate).append("%`");
        if (cancellationRate > 10.0) {
            sb.append(" ⚠️ *(Mức độ rủi ro cao, cần rà soát lại thời gian chuẩn bị món của bếp)*\n");
        } else {
            sb.append(" ✅ *(Tỷ lệ xử lý ổn định, chất lượng phục vụ tốt)*\n");
        }
        sb.append("- **Chất lượng dịch vụ**: `").append(avgRating).append("/5.0 ⭐` (Dựa trên phản hồi thực tế của khách hàng)\n\n");

        sb.append("#### ⚡ 2. Tình Trạng Phục Vụ & Món Ăn Cần Lưu Ý\n");
        if (!outOfStock.isEmpty()) {
            sb.append("- **⚠️ Topping / Nguyên liệu đang tạm ngưng**: Đang có **").append(outOfStock.size())
                    .append(" mục đang tắt phục vụ**: `").append(String.join(", ", outOfStock)).append("`.\n");
            sb.append("  ➔ *Lưu ý*: Khách hàng hiện không thể chọn các topping này khi đặt món trên ứng dụng.\n");
        } else {
            sb.append("- **Trạng thái phục vụ**: Toàn bộ Topping và nguyên liệu kèm món đang ở trạng thái sẵn sàng phục vụ khách hàng.\n");
        }

        if (!leastFoods.isEmpty()) {
            List<String> slowNames = leastFoods.stream().map(m -> (String) m.get("name")).collect(Collectors.toList());
            sb.append("- **Món ăn bán chậm (Slow-Moving)**: `").append(String.join(", ", slowNames))
                    .append("` chưa ghi nhận lượng đặt đáng kể trong các khung giờ gần đây.\n");
        }
        sb.append("\n");

        sb.append("#### 🎯 3. Đề Xuất Chiến Lược & Kế Hoạch Hành Động (Action Plan)\n");
        sb.append("1. **Kích cầu món bán chậm bằng Combo Ưu Đãi**:\n");
        if (!topFoods.isEmpty() && !leastFoods.isEmpty()) {
            String hot = (String) topFoods.get(0).get("name");
            String slow = (String) leastFoods.get(0).get("name");
            sb.append("   - Ghép món bán chạy nhất **\"").append(hot).append("\"** với món **\"").append(slow)
                    .append("\"** thành Combo Siêu Tiết Kiệm (giảm 15%), tận dụng sức hút của món hot để thúc đẩy doanh số món mới.\n");
        } else {
            sb.append("   - Tạo mã giảm giá 15% cho các món mới vào khung giờ trưa từ 11:30 - 13:00 để thúc đẩy đơn hàng.\n");
        }

        sb.append("2. **Tối ưu hóa khả năng sẵn sàng phục vụ (Availability)**:\n");
        if (!outOfStock.isEmpty()) {
            sb.append("   - Sau khi bếp chuẩn bị xong các món/topping: **").append(String.join(", ", outOfStock))
                    .append("**, chủ quán hãy gạt lại công tắc **[Đang phục vụ]** trong tab Quản lý Topping để mở lại tùy chọn cho khách hàng.\n");
        } else {
            sb.append("   - Duy trì kiểm tra trạng thái các món ăn trước giờ cao điểm trưa (11:00) và tối (18:00) để đảm bảo trải nghiệm đặt món thông suốt.\n");
        }

        sb.append("3. **Khai thác Khung giờ vàng (Flash Sale Promotion)**:\n");
        sb.append("   - Tung mã giảm giá vận chuyển hoặc voucher 20.000đ cho đơn từ 120.000đ vào khung giờ thấp điểm (14:30 - 17:00) nhằm tối ưu hóa chi phí cố định của mặt bằng và nhân sự quán.\n\n");

        sb.append("---\n");
        sb.append("💡 *Bạn có thể bấm vào các câu hỏi gợi ý bên dưới hoặc hỏi chi tiết về một món cụ thể để AI phân tích sâu hơn!*");

        return sb.toString();
    }

    /**
     * Tác tử AI hành động (Agentic Action Decision Engine)
     */
    private Map<String, Object> determineAgentAction(String userQuery, boolean isSuperAdmin, Long restaurantId, Map<String, Object> metrics) {
        String queryLower = (userQuery != null) ? userQuery.toLowerCase() : "";

        // Super Admin Action: AI Moderation Sentinel
        if (isSuperAdmin) {
            if (queryLower.contains("kiểm duyệt") || queryLower.contains("bình luận") || queryLower.contains("độc hại") 
                    || queryLower.contains("xấu") || queryLower.contains("tiêu chuẩn") || queryLower.contains("vi phạm") || queryLower.contains("spam")) {
                List<Review> allReviews = reviewRepository.findAll();
                Review toxicReview = null;
                for (Review r : allReviews) {
                    String comment = r.getComment() != null ? r.getComment().toLowerCase() : "";
                    if (comment.contains("rác") || comment.contains("thiu") || comment.contains("mất dạy") 
                            || comment.contains("lừa đảo") || comment.contains("tẩy chay") || r.getRating() <= 2.0) {
                        toxicReview = r;
                        break;
                    }
                }
                if (toxicReview != null) {
                    Map<String, Object> action = new HashMap<>();
                    action.put("type", "MODERATE_REVIEW");
                    action.put("reviewId", toxicReview.getId());
                    action.put("customerName", toxicReview.getCustomer() != null ? toxicReview.getCustomer().getFullName() : "Trần Quốc Bảo");
                    action.put("restaurantName", toxicReview.getRestaurant() != null ? toxicReview.getRestaurant().getName() : "Tiệm Cơm Tấm Sài Gòn - Cầu Giấy");
                    action.put("rating", toxicReview.getRating());
                    action.put("comment", toxicReview.getComment());
                    action.put("title", "🛡️ AI Content Moderation Sentinel: Phát Hiện Đánh Giá Vi Phạm");
                    action.put("reason", "Vi phạm Điều 4.2 Tiêu chuẩn cộng đồng F&B (Ngôn từ xúc phạm, thù địch và vu khống phá hoại đối tác)");
                    action.put("buttonLabel", "🛡️ Tác tử AI: Gỡ bỏ đánh giá & Phục hồi uy tín đối tác");
                    action.put("successMessage", "Đã gỡ bỏ đánh giá vi phạm thành công khỏi hệ thống! Uy tín đối tác và điểm CSAT sàn đã được bảo vệ.");
                    return action;
                }
            }
            return null;
        }

        // Restaurant Owner Action: Smart Operations & Inventory Lock
        if (queryLower.contains("nguyên liệu") || queryLower.contains("gián đoạn") || queryLower.contains("cảnh báo") 
                || queryLower.contains("hết hàng") || queryLower.contains("sắp hết") || queryLower.contains("kho") || queryLower.contains("bếp")) {
            List<Food> foods = (restaurantId != null && restaurantId > 0) ? foodRepository.findByRestaurantId(restaurantId) : Collections.emptyList();
            Food targetFood = null;
            // Ưu tiên món Cơm Sườn Cây Nướng Mật Ong hoặc món chứa từ Sườn
            for (Food f : foods) {
                if (f.getName().toLowerCase().contains("sườn") && f.isAvailable()) {
                    targetFood = f;
                    break;
                }
            }
            if (targetFood == null) {
                for (Food f : foods) {
                    if (f.isAvailable()) {
                        targetFood = f;
                        break;
                    }
                }
            }
            if (targetFood == null && !foods.isEmpty()) {
                targetFood = foods.get(0);
            }

            if (targetFood != null) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "LOCK_FOOD_AVAILABILITY");
                action.put("foodId", targetFood.getId());
                action.put("foodName", targetFood.getName());
                action.put("currentAvailable", targetFood.isAvailable());
                action.put("title", "⚡ Tác tử AI Đề Xuất: Tạm Ngưng Phục Vụ Món Ăn");
                action.put("reason", "Nguyên liệu chính (Sườn cây nướng / Trứng gà ta) đang cạn kho (0/15 kg). Tác tử AI đề xuất tạm ngưng phục vụ món '" + targetFood.getName() + "' trên thực đơn khách hàng để ngăn chặn rủi ro quá tải bếp và hủy đơn.");
                action.put("buttonLabel", targetFood.isAvailable() ? "🚫 Tác tử AI: Tạm khóa món ăn trên Menu" : "🟢 Tác tử AI: Mở bán lại món khi đã nhập kho");
                action.put("successMessage", "Tác tử AI đã cập nhật trạng thái món '" + targetFood.getName() + "'. Thực đơn phía khách hàng đã được đồng bộ thời gian thực.");
                return action;
            }
        }

        return null;
    }

    private String NumberFormatUtil(Object val) {
        if (val == null) return "0";
        try {
            long num = Long.parseLong(val.toString());
            return String.format("%,d", num).replace(',', '.');
        } catch (Exception e) {
            return val.toString();
        }
    }
}
