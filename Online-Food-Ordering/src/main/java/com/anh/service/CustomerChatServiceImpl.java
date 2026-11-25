package com.anh.service;

import com.anh.model.Coupon;
import com.anh.model.Food;
import com.anh.repository.CouponRepository;
import com.anh.repository.FoodRepository;
import com.anh.request.ChatRagRequest;
import com.anh.response.ChatRagResponse;
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
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class CustomerChatServiceImpl implements CustomerChatService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(3))
            .build();

    private static final Pattern DISH_ID_PATTERN = Pattern.compile("<<<RECOMMENDED_DISH_ID:\\s*\\{\\s*\"dishId\"\\s*:\\s*(\\d+|null)\\s*\\}>>>");

    @Override
    public ChatRagResponse chat(ChatRagRequest request) {
        String userQuery = (request != null && request.getMessage() != null) ? request.getMessage().trim() : "";
        List<Long> dislikedIds = (request != null && request.getDislikedFoodIds() != null) ? request.getDislikedFoodIds() : Collections.emptyList();

        if (userQuery.isEmpty()) {
            return new ChatRagResponse("Xin chào! Tôi có thể giúp gì cho bạn hôm nay?", null, "HEURISTIC_MCDM_FALLBACK");
        }

        // 1. Kiểm tra API Key của Gemini. Nếu chưa có, kích hoạt Fallback ngay
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || "none".equalsIgnoreCase(geminiApiKey.trim())) {
            return new ChatRagResponse(null, null, "FALLBACK_TO_CLIENT_HEURISTIC");
        }

        try {
            // 2. GIAI ĐOẠN 1: RETRIEVAL (Truy xuất từ MySQL)
            List<Food> allFoods = foodRepository.findAll();
            List<Food> availableFoods = allFoods.stream()
                    .filter(f -> f.isAvailable() && f.getRestaurant() != null && !dislikedIds.contains(f.getId()))
                    .collect(Collectors.toList());

            if (availableFoods.isEmpty()) {
                return new ChatRagResponse(null, null, "FALLBACK_TO_CLIENT_HEURISTIC");
            }

            // Xây dựng tóm tắt thực đơn
            StringBuilder menuContext = new StringBuilder();
            int count = 0;
            for (Food f : availableFoods) {
                String restName = f.getRestaurant() != null ? f.getRestaurant().getName() : "Nhà Hàng";
                String catName = f.getFoodCategory() != null ? f.getFoodCategory().getName() : "Món";
                menuContext.append(String.format("- [ID: %d] %s | Giá: %,d đ | Quán: %s | Danh mục: %s | Chay: %s\n",
                        f.getId(), f.getName(), f.getPrice(), restName, catName, f.isVegetarian() ? "Có" : "Không"));
                count++;
                if (count >= 50) break; // Giới hạn 50 món tiêu biểu để prompt gọn nhẹ
            }

            // Lấy coupon
            List<Coupon> coupons = couponRepository.findAll();
            StringBuilder couponContext = new StringBuilder();
            for (Coupon c : coupons) {
                if (c.isActive()) {
                    couponContext.append(String.format("- Mã: %s (Giảm %,d đ, đơn từ %,d đ)\n",
                            c.getCode(), c.getDiscountValue(), c.getMinimumOrderValue()));
                }
            }

            // 3. GIAI ĐOẠN 2: AUGMENTATION (Đóng gói In-Context Prompt cho Gemini)
            String promptContext = buildRagPrompt(userQuery, menuContext.toString(), couponContext.toString());

            Map<String, Object> part = Map.of("text", promptContext);
            Map<String, Object> contentObj = Map.of("role", "user", "parts", List.of(part));
            Map<String, Object> requestBodyMap = Map.of(
                    "contents", List.of(contentObj),
                    "generationConfig", Map.of(
                            "temperature", 0.4, // Nhiệt độ thấp để đảm bảo bám sát dữ liệu thật (Grounding)
                            "topK", 30,
                            "topP", 0.9,
                            "maxOutputTokens", 1500,
                            "thinkingConfig", Map.of("thinkingBudget", 0)
                    )
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey.trim();

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(8)) // Timeout 8s đảm bảo phản hồi đầy đủ
                    .build();

            // 4. GIAI ĐOẠN 3: GENERATION (Gọi Google Gemini 2.5 Flash)
            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(httpResponse.body());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        String rawReply = textNode.asText();

                        // Bóc tách dishId từ câu trả lời của Gemini
                        Long recommendedDishId = null;
                        Matcher matcher = DISH_ID_PATTERN.matcher(rawReply);
                        if (matcher.find()) {
                            String idStr = matcher.group(1);
                            if (idStr != null && !idStr.equalsIgnoreCase("null")) {
                                try {
                                    recommendedDishId = Long.parseLong(idStr);
                                } catch (NumberFormatException ignored) {}
                            }
                            rawReply = matcher.replaceAll("").trim();
                        }

                        Food recommendedFood = null;
                        if (recommendedDishId != null) {
                            recommendedFood = foodRepository.findById(recommendedDishId).orElse(null);
                        }

                        return new ChatRagResponse(rawReply, recommendedFood, "GEMINI_2_5_FLASH");
                    }
                }
            } else {
                System.err.println("Gemini RAG API returned error status " + httpResponse.statusCode() + ": " + httpResponse.body());
            }

        } catch (Exception e) {
            System.err.println("Gemini RAG API call failed: " + e.getMessage());
        }

        // Nếu Gemini lỗi, timeout hoặc vượt hạn ngạch: Kích hoạt Heuristic Fallback
        return new ChatRagResponse(null, null, "FALLBACK_TO_CLIENT_HEURISTIC");
    }

    private String buildRagPrompt(String userQuery, String menuContext, String couponContext) {
        return "Bạn là Trợ lý Ẩm thực AI Concierge của sàn đặt đồ ăn trực tuyến Online Food Ordering.\n" +
                "Dưới đây là KHO THỰC ĐƠN THẬT được truy xuất trực tiếp từ Database MySQL của hệ thống:\n" +
                "=== DANH SÁCH THỰC ĐƠN HIỆN CÓ ===\n" +
                menuContext +
                "==================================\n" +
                "=== MÃ GIẢM GIÁ ĐANG ÁP DỤNG ===\n" +
                couponContext +
                "==================================\n\n" +
                "QUY TẮC RAG NGHIÊM NGẶT (STRICT GROUNDING):\n" +
                "1. Bạn CHỈ ĐƯỢC gợi ý các món ăn có trong danh sách trên. TUYỆT ĐỐI KHÔNG tự bịa ra món ăn hay giá tiền ngoài danh sách.\n" +
                "2. PHÂN BIỆT RÕ: Nếu khách hỏi đồ uống -> CHỈ gợi ý đồ uống (trà, cà phê, ô long, sinh tố); Nếu khách hỏi đồ ăn -> KHÔNG gợi ý đồ uống; Nếu khách hỏi món chay -> CHỈ gợi ý món chay thực thụ.\n" +
                "3. Nếu khách hỏi món quán chưa có (bún đậu mắm tôm, tacos, bánh xèo, cháo lòng...) HOẶC câu hỏi ngoài lề (làm thơ, thời tiết, chứng khoán, khen chê vu vơ...) -> Lịch sự phản hồi: Hiện tại chưa tìm thấy món ăn hoặc đồ uống hoàn toàn khớp trong thực đơn và nhiệt tình gợi ý 1 món Best-Seller nổi tiếng từ danh sách thực đơn trên (như Cơm Sườn Bì Chả Sài Gòn, Phở Bò Tái Lăn Bát Đàn, Pizza 4 Cheeses, Trà Ô Long Phê La) để khách tham khảo!\n" +
                "5. Giọng điệu: Thân thiện, hào hứng, tự nhiên, súc tích (1-3 câu ngắn gọn).\n" +
                "6. BẮT BUỘC Ở CUỐI CÂU TRẢ LỜI: Hãy đính kèm mã định danh món được gợi ý theo cú pháp chính xác: <<<RECOMMENDED_DISH_ID:{\"dishId\": <id số nguyên hoặc null>}>>>\n\n" +
                "Câu hỏi của khách hàng: \"" + userQuery + "\"";
    }
}
