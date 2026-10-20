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

    private final List<String> defaultSuggestedPrompts = List.of(
            "📊 Đánh giá tổng quan hiệu quả kinh doanh tuần này",
            "💡 Đề xuất chiến lược tăng doanh thu & kích cầu món ế",
            "⚠️ Cảnh báo nguyên liệu sắp hết & rủi ro gián đoạn bếp",
            "🎁 Gợi ý chương trình khuyến mãi giờ vàng tối ưu"
    );

    @Override
    public AiChatResponse chatWithCopilot(AiChatRequest request) {
        Long restaurantId = request.getRestaurantId();
        String userQuery = (request.getMessage() != null && !request.getMessage().trim().isEmpty())
                ? request.getMessage().trim()
                : "Phân tích tình hình kinh doanh tổng quan và đề xuất cải thiện.";

        // 1. Thu thập dữ liệu thực tế từ database
        Map<String, Object> metrics = collectRestaurantMetrics(restaurantId);

        // 2. Thử gọi Google Gemini API
        String aiReply = callGeminiApi(userQuery, metrics);

        // 3. Nếu không gọi được Gemini (chưa có key, lỗi mạng, rate-limit), kích hoạt Heuristic DSS Engine
        if (aiReply == null || aiReply.trim().isEmpty()) {
            aiReply = generateHeuristicBusinessInsight(metrics, userQuery);
        }

        return new AiChatResponse(
                aiReply,
                Instant.now(),
                metrics,
                defaultSuggestedPrompts
        );
    }

    @Override
    public AiChatResponse getQuickInsights(Long restaurantId) {
        Map<String, Object> metrics = collectRestaurantMetrics(restaurantId);
        String insightQuery = "Tóm tắt ngắn gọn 3 điểm mấu chốt nhất về hiệu quả kinh doanh hôm nay và 1 khuyến nghị hành động ngay.";
        
        String aiReply = callGeminiApi(insightQuery, metrics);
        if (aiReply == null || aiReply.trim().isEmpty()) {
            aiReply = generateHeuristicBusinessInsight(metrics, insightQuery);
        }

        return new AiChatResponse(
                aiReply,
                Instant.now(),
                metrics,
                defaultSuggestedPrompts
        );
    }

    /**
     * Thu thập toàn bộ chỉ số thực tế từ DB của nhà hàng
     */
    private Map<String, Object> collectRestaurantMetrics(Long restaurantId) {
        Map<String, Object> metrics = new HashMap<>();

        String restaurantName = "Toàn Sàn / Hệ Thống";
        if (restaurantId != null) {
            Restaurant r = restaurantRepository.findById(restaurantId).orElse(null);
            if (r != null) {
                restaurantName = r.getName();
            }
        }
        metrics.put("restaurantName", restaurantName);

        // Đơn hàng & Doanh thu
        List<Order> orders = (restaurantId != null)
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

        // Món ăn & Tồn kho
        List<Food> foods = (restaurantId != null)
                ? foodRepository.findByRestaurantId(restaurantId)
                : foodRepository.findAll();

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
        List<IngredientsItem> ingredients = (restaurantId != null)
                ? ingredientItemRepository.findByRestaurantId(restaurantId)
                : ingredientItemRepository.findAll();

        List<String> outOfStockIngredients = ingredients.stream()
                .filter(ing -> !ing.isInStock())
                .map(IngredientsItem::getName)
                .collect(Collectors.toList());
        metrics.put("outOfStockIngredients", outOfStockIngredients);

        // Đánh giá
        Double avgRating = 5.0;
        Long totalReviews = 0L;
        if (restaurantId != null) {
            Double rRating = reviewRepository.getAverageRatingForRestaurant(restaurantId);
            if (rRating != null) avgRating = Math.round(rRating * 10.0) / 10.0;
            Long count = reviewRepository.getCountForRestaurant(restaurantId);
            if (count != null) totalReviews = count;
        }
        metrics.put("averageRating", avgRating);
        metrics.put("totalReviews", totalReviews);

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

            // Thử endpoint chuẩn của Gemini v1beta với model gemini-2.5-flash
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
    private String generateHeuristicBusinessInsight(Map<String, Object> metrics, String userQuery) {
        String restName = (String) metrics.getOrDefault("restaurantName", "Nhà hàng");
        long revenue = (Long) metrics.getOrDefault("totalRevenue", 0L);
        long totalOrders = (Long) metrics.getOrDefault("totalOrders", 0L);
        long completedOrders = (Long) metrics.getOrDefault("completedOrders", 0L);
        long cancelledOrders = (Long) metrics.getOrDefault("cancelledOrders", 0L);
        double cancellationRate = (Double) metrics.getOrDefault("cancellationRate", 0.0);
        double avgRating = (Double) metrics.getOrDefault("averageRating", 5.0);
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

        sb.append("#### ⚡ 2. Điểm Nghẽn Vận Hành & Rủi Ro Cần Xử Lý Ngay\n");
        if (!outOfStock.isEmpty()) {
            sb.append("- **🚨 Rủi ro kho nguyên liệu**: Đang có **").append(outOfStock.size())
                    .append(" nguyên liệu cạn kiệt** (hết hàng): `").append(String.join(", ", outOfStock)).append("`.\n");
            sb.append("  ➔ *Hệ quả*: Có thể gây trễ đơn hoặc buộc nhân viên phải hủy đơn khi khách đặt các món dùng nguyên liệu này.\n");
        } else {
            sb.append("- **Kho nguyên liệu**: Tình trạng tồn kho hiện tại đáp ứng tốt công suất bếp.\n");
        }

        if (!leastFoods.isEmpty()) {
            List<String> slowNames = leastFoods.stream().map(m -> (String) m.get("name")).collect(Collectors.toList());
            sb.append("- **Món ăn bán chậm (Slow-Moving)**: `").append(String.join(", ", slowNames))
                    .append("` chưa ghi nhận lượng đặt đáng kể, gây ứ đọng chi phí nguyên liệu trữ lạnh.\n");
        }
        sb.append("\n");

        sb.append("#### 🎯 3. Đề Xuất Chiến Lược & Kế Hoạch Hành Động (Action Plan)\n");
        sb.append("1. **Kích cầu món bán chậm bằng Combo Ưu Đãi**:\n");
        if (!topFoods.isEmpty() && !leastFoods.isEmpty()) {
            String hot = (String) topFoods.get(0).get("name");
            String slow = (String) leastFoods.get(0).get("name");
            sb.append("   - Ghép món bán chạy nhất **\"").append(hot).append("\"** với món **\"").append(slow)
                    .append("\"** thành Combo Siêu Tiết Kiệm (giảm 15%), tận dụng sức hút của món hot để xả kho nguyên liệu món ế.\n");
        } else {
            sb.append("   - Tạo mã giảm giá 15% cho các món mới vào khung giờ trưa từ 11:30 - 13:00 để thúc đẩy đơn hàng.\n");
        }

        sb.append("2. **Xử lý khẩn cấp bài toán Tồn kho**:\n");
        if (!outOfStock.isEmpty()) {
            sb.append("   - Nhập bổ sung ngay các nguyên liệu: **").append(String.join(", ", outOfStock))
                    .append("** trước 10:00 sáng mai để tránh đứt gãy dây chuyền phục vụ giờ cao điểm.\n");
        } else {
            sb.append("   - Thiết lập định mức tồn kho tối thiểu (Safety Stock) để chủ động đặt hàng từ nhà cung cấp trước 24 giờ.\n");
        }

        sb.append("3. **Khai thác Khung giờ vàng (Flash Sale Promotion)**:\n");
        sb.append("   - Tung mã giảm giá vận chuyển hoặc voucher 20.000đ cho đơn từ 120.000đ vào khung giờ thấp điểm (14:30 - 17:00) nhằm tối ưu hóa chi phí cố định của mặt bằng và nhân sự quán.\n\n");

        sb.append("---\n");
        sb.append("💡 *Bạn có thể bấm vào các câu hỏi gợi ý bên dưới hoặc hỏi chi tiết về một món cụ thể để AI phân tích sâu hơn!*");

        return sb.toString();
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
