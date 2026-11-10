package com.anh.controller;

import com.anh.model.*;
import com.anh.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/public")
public class SeedController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private IngredientCategoryRepository ingredientCategoryRepository;

    @GetMapping("/seed")
    public ResponseEntity<String> seedDatabase() {
        try {
            // Danh sách thông tin 10 nhà hàng
            List<Map<String, Object>> seedData = new ArrayList<>();

            // 1. Phở Bát Đàn
            Map<String, Object> r1 = new HashMap<>();
            r1.put("ownerEmail", "batdan_owner@food.com");
            r1.put("ownerName", "Nguyen Van Bat Dan");
            r1.put("restaurantName", "Phở Gia Truyền Bát Đàn");
            r1.put("description", "Hương vị phở bò gia truyền đậm đà, nước dùng trong vắt, ngọt từ xương ống bò.");
            r1.put("cuisineType", "Phở & Bún");
            r1.put("street", "49 Bát Đàn, Cửa Đông, Hoàn Kiếm");
            r1.put("city", "Hà Nội");
            r1.put("state", "Hoàn Kiếm");
            r1.put("postalCode", "100000");
            r1.put("images", Arrays.asList("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600"));
            r1.put("openingHours", "06:00 AM - 10:00 PM");
            r1.put("phone", "02438284124");
            r1.put("foods", Arrays.asList(
                createFoodMap("Phở Bò Tái", "Thịt bò tái thái mỏng chần tái mềm ngọt", 60000L, "Món Chính", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
                createFoodMap("Phở Bò Chín", "Thịt nạm gầu bò ninh chín thơm ngậy", 60000L, "Món Chính", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
                createFoodMap("Phở Tái Nạm Gầu", "Sự kết hợp hoàn hảo giữa thịt tái nạm và gầu giòn", 65000L, "Món Chính", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
                createFoodMap("Quẩy Nóng", "Quẩy chiên giòn tan ăn kèm nước phở", 5000L, "Khai Vị", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Trà Đá", "Trà lài thơm mát giải nhiệt", 5000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r1);

            // 2. Bún Chả Hương Liên
            Map<String, Object> r2 = new HashMap<>();
            r2.put("ownerEmail", "huonglien_owner@food.com");
            r2.put("ownerName", "Le Thi Huong Lien");
            r2.put("restaurantName", "Bún Chả Hương Liên (Obama)");
            r2.put("description", "Nơi Tổng thống Obama ghé thăm năm 2016. Chả nướng thơm lừng ăn kèm nước chấm chua ngọt.");
            r2.put("cuisineType", "Bún & Mì");
            r2.put("street", "24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng");
            r2.put("city", "Hà Nội");
            r2.put("state", "Hai Bà Trưng");
            r2.put("postalCode", "100000");
            r2.put("images", Arrays.asList("https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600"));
            r2.put("openingHours", "08:00 AM - 08:30 PM");
            r2.put("phone", "02439434106");
            r2.put("foods", Arrays.asList(
                createFoodMap("Combo Obama", "Gồm 1 suất bún chả đặc biệt, 1 nem hải sản và 1 chai bia Hà Nội", 120000L, "Combo", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500"),
                createFoodMap("Bún Chả Truyền Thống", "Chả viên và chả miếng nướng than hoa thơm phức", 60000L, "Món Chính", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500"),
                createFoodMap("Nem Cua Bể", "Nem rán giòn nhân thịt cua bể tươi ngon đặc sản Hải Phòng", 25000L, "Nem Rán", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Nem Hải Sản", "Nem nhân tôm, mực sốt mayonnaise chiên xù", 20000L, "Nem Rán", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Bia Hà Nội", "Bia chai Hà Nội ướp lạnh mát lạnh", 20000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r2);

            // 3. Pizza 4P's
            Map<String, Object> r3 = new HashMap<>();
            r3.put("ownerEmail", "pizza4ps_owner@food.com");
            r3.put("ownerName", "Yosuke Masuko");
            r3.put("restaurantName", "Pizza 4P's - Lê Thánh Tôn");
            r3.put("description", "Pizza nướng củi kiểu Nhật với phô mai Burrata tự sản xuất tươi ngon thượng hạng.");
            r3.put("cuisineType", "Pizza & Pasta");
            r3.put("street", "15/12 Lê Thánh Tôn, Bến Nghé, Quận 1");
            r3.put("city", "Hồ Chí Minh");
            r3.put("state", "Quận 1");
            r3.put("postalCode", "700000");
            r3.put("images", Arrays.asList("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600"));
            r3.put("openingHours", "10:00 AM - 10:30 PM");
            r3.put("phone", "19006043");
            r3.put("foods", Arrays.asList(
                createFoodMap("Pizza 4 Cheeses", "Pizza phô mai béo ngậy rưới mật ong ngọt ngào", 220000L, "Pizza", "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
                createFoodMap("Pizza Burrata Parma Ham", "Pizza đùi heo muối Tây Ban Nha ăn kèm phô mai Burrata tươi", 290000L, "Pizza", "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
                createFoodMap("Mỳ Ý Sốt Kem Cua", "Crab Tomato Cream Spaghetti trứ danh của 4P's", 240000L, "Mỳ Ý", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Salad Phô Mai Burrata", "Salad rau củ quả tươi cùng phô mai Burrata tươi", 150000L, "Salad", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Bánh Tiramisu", "Bánh tráng miệng hương vị cà phê và cacao thơm nhẹ", 80000L, "Tráng Miệng", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r3);

            // 4. Sushi Bar
            Map<String, Object> r4 = new HashMap<>();
            r4.put("ownerEmail", "sushibar_owner@food.com");
            r4.put("ownerName", "Yamada Ken");
            r4.put("restaurantName", "Sushi Bar - Tôn Đức Thắng");
            r4.put("description", "Sushi và Sashimi tươi sống chuẩn vị Nhật Bản trong không gian ấm cúng, sang trọng.");
            r4.put("cuisineType", "Sushi & Sashimi");
            r4.put("street", "2 Tôn Đức Thắng, Bến Nghé, Quận 1");
            r4.put("city", "Hồ Chí Minh");
            r4.put("state", "Quận 1");
            r4.put("postalCode", "700000");
            r4.put("images", Arrays.asList("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600"));
            r4.put("openingHours", "11:00 AM - 10:00 PM");
            r4.put("phone", "02838238030");
            r4.put("foods", Arrays.asList(
                createFoodMap("Sashimi Cá Hồi", "5 lát cá hồi tươi rói tan ngay trong miệng", 120000L, "Sashimi", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
                createFoodMap("Sushi Rồng (Dragon Roll)", "Cuộn lươn nhật nướng thơm cùng bơ chín và trứng tôm", 180000L, "Sushi Cuộn", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
                createFoodMap("Mỳ Tempura Udon", "Mỳ udon sợi dai nóng hổi ăn kèm tôm chiên bột giòn rụm", 140000L, "Mỳ Nhật", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Đậu Nành Nhật (Edamame)", "Đậu nành luộc xóc muối ăn kèm bia lạnh cực hợp", 40000L, "Khai Vị", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Kem Trà Xanh Matcha", "Kem matcha thanh mát, đậm vị trà xanh Nhật Bản", 50000L, "Tráng Miệng", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r4);

            // 5. Bánh Mì Phượng Hội An
            Map<String, Object> r5 = new HashMap<>();
            r5.put("ownerEmail", "banhmiphuong_owner@food.com");
            r5.put("ownerName", "Truong Thi Phuong");
            r5.put("restaurantName", "Bánh Mì Phượng Hội An");
            r5.put("description", "Chiếc bánh mì kẹp nổi tiếng nhất Hội An được chuyên gia Anthony Bourdain ca ngợi.");
            r5.put("cuisineType", "Bánh Mì & Đường Phố");
            r5.put("street", "2B Phan Chu Trinh, Cẩm Châu, Hội An");
            r5.put("city", "Quảng Nam");
            r5.put("state", "Hội An");
            r5.put("postalCode", "510000");
            r5.put("images", Arrays.asList("https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800"));
            r5.put("openingHours", "06:30 AM - 09:30 PM");
            r5.put("phone", "0905904838");
            r5.put("foods", Arrays.asList(
                createFoodMap("Bánh Mì Thập Cẩm", "Đầy đủ pate bơ, chả lụa, xá xíu, lạp xưởng và nước sốt bí truyền", 35000L, "Bánh Mì", "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500"),
                createFoodMap("Bánh Mì Gà Xé Bơ", "Gà xé tay mềm ngọt quyện cùng bơ trứng gà thơm béo", 30000L, "Bánh Mì", "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500"),
                createFoodMap("Bánh Mì Thịt Nướng Sả", "Thịt lợn ướp sả nướng than thơm nồng nàn", 35000L, "Bánh Mì", "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500"),
                createFoodMap("Sữa Bắp Hạt Sen", "Thơm bùi từ bắp ngọt kết hợp hạt sen bổ dưỡng", 15000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"),
                createFoodMap("Nước Sấu Đá", "Đặc sản giải nhiệt mát lạnh chua ngọt dịu êm", 15000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r5);

            // 6. Highlands Coffee
            Map<String, Object> r6 = new HashMap<>();
            r6.put("ownerEmail", "highlands_owner@food.com");
            r6.put("ownerName", "David Thai");
            r6.put("restaurantName", "Highlands Coffee - Nguyễn Huệ");
            r6.put("description", "Hương vị cà phê và trà truyền thống Việt Nam nâng tầm phong cách hiện đại.");
            r6.put("cuisineType", "Cà Phê & Bánh");
            r6.put("street", "135 Nguyễn Huệ, Bến Nghé, Quận 1");
            r6.put("city", "Hồ Chí Minh");
            r6.put("state", "Quận 1");
            r6.put("postalCode", "700000");
            r6.put("images", Arrays.asList("https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600"));
            r6.put("openingHours", "07:00 AM - 11:00 PM");
            r6.put("phone", "19001755");
            r6.put("foods", Arrays.asList(
                createFoodMap("Phin Sữa Đá Lớn", "Cà phê phin đậm đà thơm ngậy sữa đặc", 39000L, "Cà Phê", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"),
                createFoodMap("Trà Sen Vàng", "Trà ô long thanh mát kết hợp hạt sen bùi và kem sữa béo", 45000L, "Trà", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"),
                createFoodMap("Freeze Trà Xanh", "Thức uống đá xay matcha kết hợp thạch trà xanh giòn dai", 55000L, "Đá Xay", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"),
                createFoodMap("Bánh Mì Thịt Nướng", "Bánh mì kẹp thịt nướng rưới sốt bơ Highlands", 25000L, "Bánh Mì", "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500"),
                createFoodMap("Bánh Mousse Đào", "Bánh mousse đào chua ngọt nhẹ nhàng, lớp bánh mềm tan", 35000L, "Bánh Ngọt", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r6);

            // 7. Dim Sum Tiến Phát
            Map<String, Object> r7 = new HashMap<>();
            r7.put("ownerEmail", "tienphat_owner@food.com");
            r7.put("ownerName", "Tran Chi Luong");
            r7.put("restaurantName", "Dim Sum Tiến Phát - Điểm Tâm Hoa");
            r7.put("description", "Quán điểm tâm nổi tiếng lâu đời khu Chợ Lớn với các món há cảo, sủi cảo hấp nóng hổi.");
            r7.put("cuisineType", "Dimsum & Trung Hoa");
            r7.put("street", "18 Ký Hòa, Phường 11, Quận 5");
            r7.put("city", "Hồ Chí Minh");
            r7.put("state", "Quận 5");
            r7.put("postalCode", "700000");
            r7.put("images", Arrays.asList("https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600"));
            r7.put("openingHours", "06:00 AM - 12:30 PM");
            r7.put("phone", "02838551621");
            r7.put("foods", Arrays.asList(
                createFoodMap("Há Cảo Tôm", "Lớp vỏ bột lọc trong suốt bao bọc nhân tôm tươi giòn ngọt", 55000L, "Hấp", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Xíu Mại Tôm Thịt", "Xíu mại nhân thịt băm cuộn trứng muối thơm ngon", 50000L, "Hấp", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Bánh Bao Kim Sa", "Bánh bao nhân trứng muối tan chảy béo ngậy ngọt ngào", 45000L, "Bánh Bao", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Chân Gà Hấp Tàu Xì", "Chân gà mềm rục đẫm gia vị tương đen đậm đà", 48000L, "Hấp", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Trà Hoa Cúc Mật Ong", "Ấm trà hoa cúc thanh tao, ngọt dịu ấm bụng", 15000L, "Trà", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r7);

            // 8. KFC Việt Nam
            Map<String, Object> r8 = new HashMap<>();
            r8.put("ownerEmail", "kfc_owner@food.com");
            r8.put("ownerName", "Colonel Sanders VN");
            r8.put("restaurantName", "KFC Việt Nam - Bà Triệu");
            r8.put("description", "Gà rán giòn cay thơm ngon chuẩn vị từ công thức 11 loại thảo mộc và gia vị của Harland Sanders.");
            r8.put("cuisineType", "Gà Rán & Fastfood");
            r8.put("street", "292 Bà Triệu, Lê Đại Hành, Hai Bà Trưng");
            r8.put("city", "Hà Nội");
            r8.put("state", "Hai Bà Trưng");
            r8.put("postalCode", "100000");
            r8.put("images", Arrays.asList("https://images.unsplash.com/photo-1562967914-608f82629710?w=600"));
            r8.put("openingHours", "09:00 AM - 10:00 PM");
            r8.put("phone", "19006886");
            r8.put("foods", Arrays.asList(
                createFoodMap("Combo Gà Giòn Cay", "2 miếng gà giòn cay, 1 khoai tây chiên nhỏ và 1 cốc Pepsi", 89000L, "Combo Gà", "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
                createFoodMap("Gà Popcorn Lớn", "Gà viên không xương lăn bột chiên xù giòn tan", 45000L, "Ăn Kèm", "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
                createFoodMap("Burger Tôm", "Burger nhân chả tôm chiên giòn, rau xà lách và sốt dầu trứng", 50000L, "Burger", "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
                createFoodMap("Khoai Tây Chiên Lớn", "Khoai tây chiên muối vàng ươm chấm tương cà", 28000L, "Ăn Kèm", "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
                createFoodMap("Pepsi Ly Lớn", "Nước ngọt có ga sảng khoái mát lạnh", 18000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r8);

            // 9. Lẩu Phan
            Map<String, Object> r9 = new HashMap<>();
            r9.put("ownerEmail", "lauphan_owner@food.com");
            r9.put("ownerName", "Phan Thanh Nam");
            r9.put("restaurantName", "Lẩu Phan - Buffet Bò Mỹ");
            r9.put("description", "Thương hiệu buffet lẩu bò Mỹ giá sinh viên nổi tiếng nhất Hà Nội. Nước lẩu Thái chua cay tuyệt hảo.");
            r9.put("cuisineType", "Lẩu & Nướng");
            r9.put("street", "7 Đào Duy Anh, Phương Mai, Đống Đa");
            r9.put("city", "Hà Nội");
            r9.put("state", "Đống Đa");
            r9.put("postalCode", "100000");
            r9.put("images", Arrays.asList("https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600"));
            r9.put("openingHours", "11:00 AM - 11:00 PM");
            r9.put("phone", "19002808");
            r9.put("foods", Arrays.asList(
                createFoodMap("Buffet Lẩu Bò 139k", "Buffet gọi thịt bò ba chỉ Mỹ không giới hạn cùng các loại rau nấm", 139000L, "Buffet Lẩu", "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500"),
                createFoodMap("Buffet Lẩu Hải Sản 199k", "Gồm bò Mỹ, tôm, mực, ngao, bạch tuộc tươi ngon không giới hạn", 199000L, "Buffet Lẩu", "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500"),
                createFoodMap("Đĩa Ba Chỉ Bò Mỹ Thêm", "Đĩa thịt ba chỉ bò Mỹ thái cuộn thêm", 59000L, "Gọi Thêm", "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500"),
                createFoodMap("Ngô Chiên Bơ Tỏi", "Rổ ngô chiên bơ tỏi ngọt giòn thơm ngậy", 30000L, "Khai Vị", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Coca Cola Chai", "Chai coca lạnh sảng khoái", 15000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r9);

            // 10. El Gaucho Argentinian Steakhouse
            Map<String, Object> r10 = new HashMap<>();
            r10.put("ownerEmail", "elgaucho_owner@food.com");
            r10.put("ownerName", "Dmitry Cohen");
            r10.put("restaurantName", "El Gaucho Argentinian Steakhouse");
            r10.put("description", "Không gian ẩm thực bít tết đẳng cấp thế giới theo phong cách Argentina đích thực.");
            r10.put("cuisineType", "Steak & Wine");
            r10.put("street", "74/1 Hai Bà Trưng, Bến Nghé, Quận 1");
            r10.put("city", "Hồ Chí Minh");
            r10.put("state", "Quận 1");
            r10.put("postalCode", "700000");
            r10.put("images", Arrays.asList("https://images.unsplash.com/photo-1544025162-d76694265947?w=600"));
            r10.put("openingHours", "11:00 AM - 11:30 PM");
            r10.put("phone", "02838272090");
            r10.put("foods", Arrays.asList(
                createFoodMap("Ribeye Steak 250g", "Thịt đầu thăn vai bò Mỹ Black Angus thơm mềm mọng nước", 850000L, "Steak", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Filet Mignon 200g", "Thịt thăn nội bò Úc siêu mềm ngon như lụa", 920000L, "Steak", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Cá Hồi Nướng Than", "Cá hồi Na Uy nướng than ăn kèm măng tây sốt bơ tỏi", 450000L, "Món Chính", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Caesar Salad Classic", "Xà lách romaine, sốt caesar, phô mai parmesan và thịt muối giòn", 180000L, "Salad", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Ly Vang Đỏ Cabernet", "Ly rượu vang đỏ thượng hạng phù hợp ăn bít tết", 250000L, "Đồ Uống", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500")
            ));
            seedData.add(r10);

            int usersCreated = 0;
            int restaurantsCreated = 0;
            int categoriesCreated = 0;
            int foodsCreated = 0;

            for (Map<String, Object> data : seedData) {
                String ownerEmail = (String) data.get("ownerEmail");
                
                // 1. Tạo/Lấy Chủ Nhà Hàng
                User owner = userRepository.findByEmail(ownerEmail);
                if (owner == null) {
                    owner = new User();
                    owner.setEmail(ownerEmail);
                    owner.setFullName((String) data.get("ownerName"));
                    owner.setPassword(passwordEncoder.encode("123456"));
                    owner.setRole(USER_ROLE.ROLE_RESTAURANT_OWNER);
                    owner = userRepository.save(owner);
                    usersCreated++;
                }

                // Kiểm tra xem chủ nhà hàng đã sở hữu nhà hàng nào chưa
                // Vì quan hệ là @OneToOne nên nếu đã có rồi thì bỏ qua không tạo trùng lặp
                Restaurant existingRestaurant = restaurantRepository.findByOwnerId(owner.getId());
                if (existingRestaurant != null) {
                    continue;
                }

                // 2. Tạo Địa Chỉ
                Address addr = new Address();
                addr.setStreetAddress((String) data.get("street"));
                addr.setCity((String) data.get("city"));
                addr.setStateProvince((String) data.get("state"));
                addr.setPostalCode((String) data.get("postalCode"));
                addr.setCountry("Vietnam");
                addr = addressRepository.save(addr);

                // 3. Tạo Nhà Hàng
                Restaurant rest = new Restaurant();
                rest.setOwner(owner);
                rest.setName((String) data.get("restaurantName"));
                rest.setDescription((String) data.get("description"));
                rest.setCuisineType((String) data.get("cuisineType"));
                rest.setAddress(addr);
                rest.setOpeningHours((String) data.get("openingHours"));
                rest.setImages((List<String>) data.get("images"));
                rest.setRegistrationDate(LocalDateTime.now());
                rest.setOpen(true);

                ContactInformation contact = new ContactInformation();
                contact.setEmail(ownerEmail);
                contact.setMobile((String) data.get("phone"));
                rest.setContactInformation(contact);

                rest = restaurantRepository.save(rest);
                restaurantsCreated++;

                // 4. Tạo Món Ăn và Danh Mục
                List<Map<String, Object>> foodsList = (List<Map<String, Object>>) data.get("foods");
                Map<String, Category> categoryCache = new HashMap<>();

                for (Map<String, Object> fMap : foodsList) {
                    String catName = (String) fMap.get("category");
                    
                    // Lấy hoặc tạo mới Category cho nhà hàng hiện tại
                    Category cat = categoryCache.get(catName);
                    if (cat == null) {
                        // Tìm xem đã lưu trong DB chưa
                        List<Category> dbCats = categoryRepository.findByRestaurantId(rest.getId());
                        Optional<Category> optCat = dbCats.stream().filter(c -> c.getName().equalsIgnoreCase(catName)).findFirst();
                        if (optCat.isPresent()) {
                            cat = optCat.get();
                        } else {
                            cat = new Category();
                            cat.setName(catName);
                            cat.setRestaurant(rest);
                            cat = categoryRepository.save(cat);
                            categoriesCreated++;
                        }
                        categoryCache.put(catName, cat);
                    }

                    // Tạo Món Ăn
                    Food food = new Food();
                    food.setName((String) fMap.get("name"));
                    food.setDescription((String) fMap.get("description"));
                    food.setPrice((Long) fMap.get("price"));
                    food.setFoodCategory(cat);
                    food.setImages(Arrays.asList((String) fMap.get("imageUrl")));
                    food.setAvailable(true);
                    food.setRestaurant(rest);
                    food.setVegetarian(false);
                    food.setSeasonal(false);
                    food.setCreationDate(new Date());

                    foodRepository.save(food);
                    foodsCreated++;
                }
            }

            // 5. Tạo tài khoản Super Admin (nếu chưa tồn tại)
            User adminUser = userRepository.findByEmail("admin");
            boolean adminCreated = false;
            if (adminUser == null) {
                adminUser = new User();
                adminUser.setEmail("admin");
                adminUser.setFullName("Super Admin");
                adminUser.setPassword(passwordEncoder.encode("admin"));
                adminUser.setRole(USER_ROLE.ROLE_ADMIN);
                adminUser = userRepository.save(adminUser);
                
                Cart adminCart = new Cart();
                adminCart.setCustomer(adminUser);
                cartRepository.save(adminCart);
                
                adminCreated = true;
            }

            return ResponseEntity.ok(String.format(
                "Đã seed dữ liệu mẫu thành công!\n" +
                "- Số chủ nhà hàng tạo mới: %d\n" +
                "- Số nhà hàng tạo mới: %d\n" +
                "- Số danh mục tạo mới: %d\n" +
                "- Số món ăn tạo mới: %d\n" +
                "- Đã tạo tài khoản Admin tổng: %s\n" +
                "\nTất cả các tài khoản chủ nhà hàng đều có mật khẩu mặc định là: 123456\n" +
                "Ví dụ tài khoản đăng nhập: batdan_owner@food.com, pizza4ps_owner@food.com, highlands_owner@food.com\n" +
                "Tài khoản Admin tổng: admin / admin",
                usersCreated, restaurantsCreated, categoriesCreated, foodsCreated, (adminCreated ? "THÀNH CÔNG" : "ĐÃ TỒN TẠI")
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Thất bại khi seed dữ liệu: " + e.getMessage());
        }
    }

    @GetMapping("/owners")
    public ResponseEntity<List<Map<String, String>>> listOwners() {
        try {
            List<Restaurant> restaurants = restaurantRepository.findAll();
            List<Map<String, String>> result = new ArrayList<>();
            for (Restaurant r : restaurants) {
                Map<String, String> map = new HashMap<>();
                map.put("restaurantName", r.getName());
                map.put("ownerEmail", r.getOwner() != null ? r.getOwner().getEmail() : "No Owner");
                result.add(map);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/fix-images")
    public ResponseEntity<String> fixImages(@RequestParam(defaultValue = "false") boolean confirm) {
        if (!confirm) {
            return ResponseEntity.status(403).body("Endpoint đã được khóa bảo vệ để tránh ghi đè ảnh nhà hàng đã chỉnh sửa.");
        }
        try {
            int fixedCount = 0;
            // 1. Tìm Tiệm Cơm Tấm Sài Gòn
            User owner1 = userRepository.findByEmail("chuquan@gmail.com");
            if (owner1 != null) {
                owner1.setPassword(passwordEncoder.encode("123456"));
                userRepository.save(owner1);
                
                Restaurant r1 = restaurantRepository.findByOwnerId(owner1.getId());
                if (r1 != null) {
                    r1.setImages(Arrays.asList("http://localhost:5173/images/com_tam_suon_bi_cha.jpg"));
                    restaurantRepository.save(r1);
                    fixedCount++;
                }
            }

            // 2. Tìm Bánh Mì Phượng Hội An
            User owner2 = userRepository.findByEmail("banhmiphuong_owner@food.com");
            if (owner2 != null) {
                Restaurant r2 = restaurantRepository.findByOwnerId(owner2.getId());
                if (r2 != null) {
                    r2.setImages(Arrays.asList("http://localhost:5173/images/banh_mi_thap_cam.jpg"));
                    restaurantRepository.save(r2);
                    fixedCount++;
                }
            }

            return ResponseEntity.ok(String.format("Đã sửa ảnh lỗi cho %d nhà hàng thành công!", fixedCount));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Thất bại khi sửa ảnh: " + e.getMessage());
        }
    }

    @GetMapping("/seed-comtam")
    public ResponseEntity<String> seedComTamCategoriesAndFoods() {
        try {
            User owner1 = userRepository.findByEmail("chuquan@gmail.com");
            Restaurant r1 = null;
            if (owner1 != null) {
                r1 = restaurantRepository.findByOwnerId(owner1.getId());
            }
            if (r1 == null) {
                r1 = restaurantRepository.findById(1L).orElse(null);
            }
            if (r1 == null) {
                return ResponseEntity.status(404).body("Không tìm thấy Tiệm Cơm Tấm!");
            }

            // 1. Cập nhật hoặc tạo các Category thực tế cho quán Cơm Tấm
            List<Category> existingCats = categoryRepository.findByRestaurantId(r1.getId());
            Category catComTam = null;
            for (Category c : existingCats) {
                if (c.getName().equalsIgnoreCase("Món Chính") || c.getName().equalsIgnoreCase("Cơm Tấm Đặc Biệt") || c.getName().equalsIgnoreCase("Cơm Tấm")) {
                    c.setName("Cơm Tấm Đặc Biệt");
                    catComTam = categoryRepository.save(c);
                    break;
                }
            }
            if (catComTam == null) {
                catComTam = new Category();
                catComTam.setName("Cơm Tấm Đặc Biệt");
                catComTam.setRestaurant(r1);
                catComTam = categoryRepository.save(catComTam);
            }

            Category catMonThem = existingCats.stream().filter(c -> c.getName().equalsIgnoreCase("Món Gọi Thêm") || c.getName().equalsIgnoreCase("Món Thêm")).findFirst().orElse(null);
            if (catMonThem == null) {
                catMonThem = new Category();
                catMonThem.setName("Món Gọi Thêm");
                catMonThem.setRestaurant(r1);
                catMonThem = categoryRepository.save(catMonThem);
            }

            Category catCanh = existingCats.stream().filter(c -> c.getName().equalsIgnoreCase("Canh Nóng") || c.getName().equalsIgnoreCase("Canh")).findFirst().orElse(null);
            if (catCanh == null) {
                catCanh = new Category();
                catCanh.setName("Canh Nóng");
                catCanh.setRestaurant(r1);
                catCanh = categoryRepository.save(catCanh);
            }

            Category catNuoc = existingCats.stream().filter(c -> c.getName().equalsIgnoreCase("Nước Giải Khát") || c.getName().equalsIgnoreCase("Đồ Uống")).findFirst().orElse(null);
            if (catNuoc == null) {
                catNuoc = new Category();
                catNuoc.setName("Nước Giải Khát");
                catNuoc.setRestaurant(r1);
                catNuoc = categoryRepository.save(catNuoc);
            }

            // Cập nhật món Cơm Sườn Bì Chả cũ sang catComTam
            List<Food> existingFoods = foodRepository.findByRestaurantId(r1.getId());
            for (Food f : existingFoods) {
                if (f.getName().toLowerCase().contains("sườn") || f.getFoodCategory() == null || f.getFoodCategory().getName().equalsIgnoreCase("Món Chính")) {
                    f.setFoodCategory(catComTam);
                    foodRepository.save(f);
                }
            }

            // Tạo thêm các món ăn hấp dẫn chuẩn quán cơm tấm nếu chưa có
            List<Map<String, Object>> newFoods = Arrays.asList(
                createFoodMap("Cơm Sườn Cây Nướng Mật Ong", "Sườn cây ướp sốt mật ong thơm lừng, thịt mềm ngọt đậm vị", 55000L, "Cơm Tấm Đặc Biệt", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"),
                createFoodMap("Cơm Tấm Ba Rọi Nướng Giòn", "Thịt ba chỉ heo ướp sả ớt nướng than hoa da giòn béo ngậy", 48000L, "Cơm Tấm Đặc Biệt", "https://images.unsplash.com/photo-1544025162-d76694265947?w=500"),
                createFoodMap("Chả Trứng Cua Hấp", "Chả trứng thịt cua béo bùi, vàng óng lòng đỏ trứng muối", 15000L, "Món Gọi Thêm", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500"),
                createFoodMap("Trứng Ốp La Lòng Đào", "Trứng gà ta chiên viền giòn lòng đào béo ngậy", 8000L, "Món Gọi Thêm", "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500"),
                createFoodMap("Đùi Gà Nướng Mật Ong", "Đùi gà góc tư tẩm ướp đậm đà, da nâu bóng thơm lừng", 32000L, "Món Gọi Thêm", "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500"),
                createFoodMap("Canh Khổ Qua Dồn Thịt", "Canh khổ qua nhồi thịt nạc băm thanh mát giải ngấy", 18000L, "Canh Nóng", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"),
                createFoodMap("Canh Cải Chua Nấu Sườn", "Canh dưa cải chua nấu sườn non chua ngọt đậm đà", 18000L, "Canh Nóng", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500"),
                createFoodMap("Trà Đá Đường Phèn", "Trà lài thơm mát đá lạnh giải nhiệt thanh mát", 5000L, "Nước Giải Khát", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"),
                createFoodMap("Nước Mía Tươi Tắc", "Nước mía nguyên chất ép kèm trái tắc thơm dịu mát lạnh", 12000L, "Nước Giải Khát", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500")
            );

            int addedCount = 0;
            for (Map<String, Object> fMap : newFoods) {
                String fName = (String) fMap.get("name");
                boolean exists = existingFoods.stream().anyMatch(f -> f.getName().equalsIgnoreCase(fName));
                if (!exists) {
                    String cName = (String) fMap.get("category");
                    Category assignedCat = catComTam;
                    if (cName.equals("Món Gọi Thêm")) assignedCat = catMonThem;
                    else if (cName.equals("Canh Nóng")) assignedCat = catCanh;
                    else if (cName.equals("Nước Giải Khát")) assignedCat = catNuoc;

                    Food food = new Food();
                    food.setName(fName);
                    food.setDescription((String) fMap.get("description"));
                    food.setPrice((Long) fMap.get("price"));
                    food.setFoodCategory(assignedCat);
                    food.setImages(Arrays.asList((String) fMap.get("imageUrl")));
                    food.setAvailable(true);
                    food.setRestaurant(r1);
                    food.setVegetarian(false);
                    food.setSeasonal(false);
                    food.setCreationDate(new Date());

                    foodRepository.save(food);
                    addedCount++;
                }
            }

            return ResponseEntity.ok(String.format("Đã cập nhật danh mục thực tế cho quán %s: đổi 'Món Chính' thành 'Cơm Tấm Đặc Biệt' và thêm %d món ăn mới!", r1.getName(), addedCount));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/seed-extra")
    public ResponseEntity<String> seedOrdersAndReviews() {
        try {
            // 1. Tạo 5 khách hàng mẫu
            List<User> customers = new ArrayList<>();
            String[][] customerData = {
                {"customer1@gmail.com", "Nguyễn Văn Minh"},
                {"customer2@gmail.com", "Trần Thị Lan"},
                {"customer3@gmail.com", "Lê Hoàng Nam"},
                {"customer4@gmail.com", "Phạm Hồng Ngọc"},
                {"customer5@gmail.com", "Vũ Văn Hùng"}
            };

            for (String[] data : customerData) {
                User user = userRepository.findByEmail(data[0]);
                if (user == null) {
                    user = new User();
                    user.setEmail(data[0]);
                    user.setFullName(data[1]);
                    user.setPassword(passwordEncoder.encode("123456"));
                    user.setRole(USER_ROLE.ROLE_CUSTOMER);
                    user = userRepository.save(user);
                    
                    Cart cart = new Cart();
                    cart.setCustomer(user);
                    cartRepository.save(cart);
                }
                customers.add(user);
            }

            // 2. Tìm tất cả nhà hàng
            List<Restaurant> restaurants = restaurantRepository.findAll();
            int ordersCreated = 0;
            int reviewsCreated = 0;
            Random rand = new Random();

            String[] posComments = {
                "Đồ ăn ngon tuyệt vời, giao hàng siêu nhanh!",
                "Hương vị đậm đà chuẩn vị, sẽ ủng hộ tiếp.",
                "Món ăn đóng gói cẩn thận, nóng hổi khi nhận hàng.",
                "Rất hài lòng về chất lượng đồ ăn và cách phục vụ.",
                "Ăn rất vừa miệng, giá cả hợp lý.",
                "Đồ ăn sạch sẽ, trình bày đẹp mắt."
            };
            String[] neuComments = {
                "Đồ ăn tạm ổn, nước dùng hơi nhạt một chút.",
                "Giao hàng đúng giờ nhưng đồ ăn nguội đi một tí.",
                "Món ăn ăn được, phục vụ tương đối tốt.",
                "Giá hơi đắt nhưng chất lượng ổn."
            };

            for (Restaurant restaurant : restaurants) {
                List<Food> foods = foodRepository.findByRestaurantId(restaurant.getId());
                if (foods.isEmpty()) {
                    continue;
                }

                // Tạo 8 - 12 đơn hàng cho mỗi nhà hàng
                int orderCount = 8 + rand.nextInt(5);
                for (int i = 0; i < orderCount; i++) {
                    User customer = customers.get(rand.nextInt(customers.size()));
                    
                    // Tạo Địa Chỉ Giao Hàng
                    Address addr = new Address();
                    addr.setStreetAddress((10 + rand.nextInt(100)) + " Đường Láng, Đống Đa");
                    addr.setCity("Hà Nội");
                    addr.setCountry("Vietnam");
                    addr = addressRepository.save(addr);

                    // Tạo đơn hàng
                    Order order = new Order();
                    order.setCustomer(customer);
                    order.setRestaurant(restaurant);
                    order.setDeliveryAddress(addr);
                    
                    // Trạng thái ngẫu nhiên: COMPLETED, DELIVERED, PENDING, OUT_FOR_DELIVERY
                    int statusRand = rand.nextInt(10);
                    if (statusRand < 5) {
                        order.setOrderStatus("COMPLETED");
                    } else if (statusRand < 7) {
                        order.setOrderStatus("DELIVERED");
                    } else if (statusRand < 9) {
                        order.setOrderStatus("PENDING");
                    } else {
                        order.setOrderStatus("OUT_FOR_DELIVERY");
                    }

                    // Thời gian ngẫu nhiên trong 7 ngày qua
                    Calendar cal = Calendar.getInstance();
                    cal.add(Calendar.DAY_OF_YEAR, -rand.nextInt(7));
                    cal.add(Calendar.HOUR_OF_DAY, -rand.nextInt(24));
                    cal.add(Calendar.MINUTE, -rand.nextInt(60));
                    order.setCreatedAt(cal.getTime());

                    // Thêm 1 - 3 món ăn ngẫu nhiên
                    List<OrderItem> items = new ArrayList<>();
                    int itemTypesCount = 1 + rand.nextInt(3);
                    long totalRevenueOrder = 0;
                    int totalItemsCount = 0;

                    for (int j = 0; j < itemTypesCount; j++) {
                        Food food = foods.get(rand.nextInt(foods.size()));
                        int qty = 1 + rand.nextInt(3);

                        OrderItem orderItem = new OrderItem();
                        orderItem.setFood(food);
                        orderItem.setQuantity(qty);
                        orderItem.setTotalPrice(food.getPrice() * qty);
                        orderItem.setIngredients(new ArrayList<>());
                        orderItem = orderItemRepository.save(orderItem);
                        
                        items.add(orderItem);
                        totalRevenueOrder += orderItem.getTotalPrice();
                        totalItemsCount += qty;
                    }

                    order.setItems(items);
                    order.setTotalPrice(totalRevenueOrder);
                    order.setTotalAmount(totalRevenueOrder);
                    order.setTotalItem(totalItemsCount);
                    
                    orderRepository.save(order);
                    ordersCreated++;
                }

                // Tạo 3 - 5 đánh giá cho mỗi nhà hàng
                int reviewCount = 3 + rand.nextInt(3);
                for (int i = 0; i < reviewCount; i++) {
                    User customer = customers.get(rand.nextInt(customers.size()));
                    
                    Review review = new Review();
                    review.setCustomer(customer);
                    review.setRestaurant(restaurant);
                    
                    double rating = 3.0 + rand.nextInt(3); // 3.0, 4.0, 5.0
                    review.setRating(rating);
                    
                    if (rating >= 4.0) {
                        review.setComment(posComments[rand.nextInt(posComments.length)]);
                    } else {
                        review.setComment(neuComments[rand.nextInt(neuComments.length)]);
                    }

                    Calendar cal = Calendar.getInstance();
                    cal.add(Calendar.DAY_OF_YEAR, -rand.nextInt(7));
                    review.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                    
                    reviewRepository.save(review);
                    reviewsCreated++;
                }
            }

            return ResponseEntity.ok(String.format(
                "Đã nạp thêm dữ liệu mẫu thành công!\n" +
                "- Số khách hàng mẫu kiểm tra: %d\n" +
                "- Số đơn hàng ảo đã tạo: %d\n" +
                "- Số đánh giá ảo đã tạo: %d\n" +
                "Hãy làm mới trang web để xem sự thay đổi biểu đồ doanh thu và đánh giá!",
                customers.size(), ordersCreated, reviewsCreated
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi nạp dữ liệu đơn hàng và đánh giá: " + e.getMessage());
        }
    }

    @GetMapping("/seed-photos-and-reviews")
    public ResponseEntity<String> seedPhotosAndReviews(@RequestParam(defaultValue = "false") boolean confirm) {
        if (!confirm) {
            return ResponseEntity.status(403).body("Endpoint đã được khóa bảo vệ để tránh ghi đè ảnh và dữ liệu hiện tại.");
        }
        try {
            Random rand = new Random();

            // 1. Tạo hoặc lấy khách hàng mẫu
            List<User> customers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_CUSTOMER)
                .collect(java.util.stream.Collectors.toList());

            if (customers.isEmpty()) {
                User c1 = new User();
                c1.setEmail("khachhang1@gmail.com");
                c1.setFullName("Lê Minh Khang");
                c1.setRole(com.anh.model.USER_ROLE.ROLE_CUSTOMER);
                c1.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456"));
                customers.add(userRepository.save(c1));

                User c2 = new User();
                c2.setEmail("khachhang2@gmail.com");
                c2.setFullName("Nguyễn Thảo Vy");
                c2.setRole(com.anh.model.USER_ROLE.ROLE_CUSTOMER);
                c2.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("123456"));
                customers.add(userRepository.save(c2));
            }

            // 2. Cập nhật nhiều ảnh cho từng nhà hàng
            List<Restaurant> allRestaurants = restaurantRepository.findAll();
            int restUpdated = 0;
            String[] extraRestImages = {
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200",
                "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200"
            };

            for (Restaurant r : allRestaurants) {
                List<String> rImgs = new ArrayList<>();
                if (r.getImages() != null && !r.getImages().isEmpty()) {
                    rImgs.add(r.getImages().get(0));
                } else {
                    rImgs.add("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200");
                }
                for (String extra : extraRestImages) {
                    if (!rImgs.contains(extra) && rImgs.size() < 4) {
                        rImgs.add(extra);
                    }
                }
                r.setImages(rImgs);
                restaurantRepository.save(r);
                restUpdated++;
            }

            // 3. Cập nhật nhiều ảnh cho từng món ăn + tạo nhận xét chi tiết cho từng món
            List<Food> allFoods = foodRepository.findAll();
            int foodUpdated = 0;
            int reviewsCreated = 0;

            String[] extraFoodImages = {
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
                "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
                "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
            };

            String[] foodPosComments = {
                "Món này ngon xuất sắc, vị ướp rất vừa miệng, thịt mềm mọng nước!",
                "Đồ ăn giao tới còn bốc khói nóng hổi, phần ăn đầy đặn hơn mong đợi.",
                "Gia vị đậm đà thơm nức mũi, đóng gói cẩn thận sạch sẽ. Rất đáng tiền!",
                "Thơm ngon chuẩn vị! Cả nhà mình ai ăn cũng khen nức nở. Sẽ tiếp tục đặt lại.",
                "Chất lượng đồ ăn 10/10, nước chấm pha rất đỉnh, cho quán 5 sao tuyệt đối!"
            };

            for (Food f : allFoods) {
                List<String> fImgs = new ArrayList<>();
                if (f.getImages() != null && !f.getImages().isEmpty()) {
                    fImgs.add(f.getImages().get(0));
                } else {
                    fImgs.add("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800");
                }
                for (String extra : extraFoodImages) {
                    if (!fImgs.contains(extra) && fImgs.size() < 3) {
                        fImgs.add(extra);
                    }
                }
                f.setImages(fImgs);
                foodRepository.save(f);
                foodUpdated++;

                // Tạo 1-2 nhận xét cho mỗi món ăn nếu chưa có nhận xét
                List<Review> existingReviews = reviewRepository.findByFoodIdOrderByCreatedAtDesc(f.getId());
                if (existingReviews.isEmpty() && !customers.isEmpty()) {
                    int numReviews = 1 + rand.nextInt(2);
                    for (int i = 0; i < numReviews; i++) {
                        User reviewer = customers.get(rand.nextInt(customers.size()));
                        Review r = new Review();
                        r.setCustomer(reviewer);
                        r.setRestaurant(f.getRestaurant());
                        r.setFood(f);
                        r.setRating(rand.nextBoolean() ? 5.0 : 4.5);
                        r.setComment(foodPosComments[rand.nextInt(foodPosComments.length)]);
                        Calendar cal = Calendar.getInstance();
                        cal.add(Calendar.DAY_OF_YEAR, -rand.nextInt(5));
                        r.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                        reviewRepository.save(r);
                        reviewsCreated++;
                    }
                }
            }

            return ResponseEntity.ok(String.format(
                "Đã nạp thành công bộ sưu tập nhiều ảnh và nhận xét từng món ăn!\n" +
                "- Số nhà hàng được cập nhật album ảnh: %d\n" +
                "- Số món ăn được cập nhật nhiều góc chụp: %d\n" +
                "- Số nhận xét chi tiết từng món đã tạo: %d",
                restUpdated, foodUpdated, reviewsCreated
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/user-stats")
    public ResponseEntity<?> getUserStats() {
        try {
            List<User> allUsers = userRepository.findAll();
            long customers = allUsers.stream().filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_CUSTOMER).count();
            long owners = allUsers.stream().filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_RESTAURANT_OWNER).count();
            long admins = allUsers.stream().filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_ADMIN).count();

            List<Map<String, Object>> ownerList = allUsers.stream()
                .filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_RESTAURANT_OWNER)
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("email", u.getEmail());
                    m.put("fullName", u.getFullName());
                    return m;
                })
                .collect(java.util.stream.Collectors.toList());

            List<Map<String, Object>> customerList = allUsers.stream()
                .filter(u -> u.getRole() == com.anh.model.USER_ROLE.ROLE_CUSTOMER)
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("email", u.getEmail());
                    m.put("fullName", u.getFullName());
                    return m;
                })
                .collect(java.util.stream.Collectors.toList());

            Map<String, Object> res = new HashMap<>();
            res.put("totalUsers", allUsers.size());
            res.put("customerCount", customers);
            res.put("ownerCount", owners);
            res.put("adminCount", admins);
            res.put("owners", ownerList);
            res.put("customers", customerList);

            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/optimize-thesis-data")
    public ResponseEntity<String> optimizeThesisData(@RequestParam(defaultValue = "false") boolean confirm) {
        if (!confirm) {
            return ResponseEntity.status(403).body("Endpoint đã được khóa bảo vệ để tránh ghi đè dữ liệu và ảnh nhà hàng.");
        }
        try {
            Random rand = new Random();

            // 1. TỐI ƯU CÁC TÀI KHOẢN CHỦ QUÁN VÀ NHÀ HÀNG TEST
            Map<String, String[]> merchantUpgrades = new HashMap<>();
            // email -> [ownerName, restaurantName, cuisineType, description, street, city, img1, img2, img3]
            merchantUpgrades.put("chunhahang@gmail.com", new String[]{
                "Nguyễn Hoàng Long",
                "Trà Sữa Phê La - Đậm Vị Ô Long",
                "Trà Sữa & Đồ Uống",
                "Thương hiệu trà sữa và đồ uống Oolong đặc sản Đà Lạt đậm vị, thơm lừng và tươi mới.",
                "24 Hàng Cót, Hàng Mã, Hoàn Kiếm",
                "Hà Nội",
                "https://images.unsplash.com/photo-1558857563-b371033873b8?w=1200",
                "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1200",
                "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200"
            });
            merchantUpgrades.put("nva@gmail.com", new String[]{
                "Đỗ Thị Bích Hạnh",
                "Bún Bò Huế Ngự Uyển",
                "Bún Bò & Đặc Sản Huế",
                "Bún bò chuẩn vị cố đô Huế với nước dùng ngọt xương thơm mùi sả ruốc, thịt bắp bò hoa giòn sần sật và chả cua béo ngậy.",
                "32 Lĩnh Nam, Mai Động, Hoàng Mai",
                "Hà Nội",
                "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200",
                "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200",
                "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200"
            });
            merchantUpgrades.put("cnh@gmail.com", new String[]{
                "Võ Thành Trung",
                "Gà Rán Jollibee - Vincom Center",
                "Gà Rán & Fastfood",
                "Gà Giòn Vui Vẻ số 1 Philippines với lớp vỏ giòn rụm, thịt mọng nước chấm cùng sốt tiêu ớt độc quyền thơm ngon khó cưỡng.",
                "191 Bà Triệu, Lê Đại Hành, Hai Bà Trưng",
                "Hà Nội",
                "https://images.unsplash.com/photo-1562967914-608f82629710?w=1200",
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
                "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200"
            });
            merchantUpgrades.put("anhquan.camluong@gmail.com", new String[]{
                "Lê Văn Quân",
                "The Coffee House - Cà Phê & Trà",
                "Cà Phê & Bánh",
                "Ngôi nhà cà phê ấm cúng với những tách Cà Phê Sữa Đá, Trà Đào Cam Sả thơm lừng và bánh ngọt tươi mới mỗi ngày.",
                "56 Bà Triệu, Hàng Bài, Hoàn Kiếm",
                "Hà Nội",
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200"
            });

            for (Map.Entry<String, String[]> entry : merchantUpgrades.entrySet()) {
                String email = entry.getKey();
                String[] info = entry.getValue();
                User user = userRepository.findByEmail(email);
                if (user != null) {
                    user.setFullName(info[0]);
                    userRepository.save(user);

                    Restaurant rest = restaurantRepository.findByOwnerId(user.getId());
                    if (rest == null) {
                        rest = new Restaurant();
                        rest.setOwner(user);
                        rest.setName(info[1]);
                        rest.setCuisineType(info[2]);
                        rest.setDescription(info[3]);
                        rest.setOpeningHours("08:00 - 22:00");
                        rest.setRegistrationDate(LocalDateTime.now());
                        rest.setOpen(true);
                        Address addr = new Address();
                        addr.setStreetAddress(info[4]);
                        addr.setCity(info[5]);
                        addr.setStateProvince(info[5]);
                        addr.setCountry("Vietnam");
                        addr = addressRepository.save(addr);
                        rest.setAddress(addr);
                        ContactInformation ci = new ContactInformation();
                        ci.setEmail(user.getEmail());
                        ci.setMobile("0988123456");
                        rest.setContactInformation(ci);
                        rest.setImages(new ArrayList<>(Arrays.asList(info[6], info[7], info[8])));
                        rest = restaurantRepository.save(rest);
                    } else {
                        rest.setName(info[1]);
                        rest.setCuisineType(info[2]);
                        rest.setDescription(info[3]);
                        if (rest.getAddress() != null) {
                            rest.getAddress().setStreetAddress(info[4]);
                            rest.getAddress().setCity(info[5]);
                            addressRepository.save(rest.getAddress());
                        }
                        List<String> imgs = new ArrayList<>(Arrays.asList(info[6], info[7], info[8]));
                        rest.setImages(imgs);
                        rest = restaurantRepository.save(rest);
                    }

                    // Thêm thực đơn món ăn đặc trưng thơm ngon cho các quán này
                    if (email.equals("chunhahang@gmail.com")) {
                        Category catOlong = addCategoryIfNotExist(rest, "Ô Long Đặc Sản");
                        Category catTropical = addCategoryIfNotExist(rest, "Ô Long Nhiệt Đới");
                        Category catBakery = addCategoryIfNotExist(rest, "Bánh Nướng Phép Màu");
                        addFoodIfNotExist(rest, "Ô Long Sữa Phê La Trân Châu", "Trà ô long đặc sản Bảo Lộc pha sữa tươi thanh béo, đậm hậu vị trà, kèm trân châu ô long dẻo thơm.", 55000L, catOlong, "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800", "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800");
                        addFoodIfNotExist(rest, "Gấm Ô Long Nhiệt Đới", "Hương hoa quả tươi mát hòa quyện cùng cốt trà Ô Long đậm đà giải nhiệt sảng khoái.", 50000L, catTropical, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800");
                        addFoodIfNotExist(rest, "Khói B'lao Kem Cheese", "Hương khói mộc mạc đặc trưng của núi rừng B'lao phủ lớp kem phô mai béo ngậy mằn mặn.", 55000L, catOlong, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800", "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800");
                        addFoodIfNotExist(rest, "Bánh Croissant Nướng Bơ Pháp", "Bánh sừng bò ngàn lớp thơm lừng bơ Pháp, vỏ giòn xốp ruột mềm thơm.", 35000L, catBakery, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800");
                    } else if (email.equals("nva@gmail.com")) {
                        Category catBunBo = addCategoryIfNotExist(rest, "Bún Bò Huế");
                        Category catKhaiVi = addCategoryIfNotExist(rest, "Đặc Sản Huế");
                        Category catNuoc = addCategoryIfNotExist(rest, "Nước Giải Khát");
                        addFoodIfNotExist(rest, "Bún Bò Huế Đặc Biệt Bắp Bò Chả Cua", "Tô bún đầy đặn bắp hoa bò giòn sần sật, chả cua Huế thơm bùi, nước dùng cay nồng thơm lừng ruốc sả.", 65000L, catBunBo, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800");
                        addFoodIfNotExist(rest, "Bún Bò Nạm Giò Heo", "Thịt nạm bò mềm ngậy kèm khoanh giò heo ninh nhừ thơm phức đậm đà.", 55000L, catBunBo, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800", "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800");
                        addFoodIfNotExist(rest, "Bánh Bột Lọc Tôm Thịt Cố Đô", "Đĩa 10 chiếc bánh bột lọc trong suốt nhân tôm thịt đậm vị chấm nước mắm ớt cay xè.", 35000L, catKhaiVi, "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800");
                        addFoodIfNotExist(rest, "Trà Cung Đình Huế Mát Lạnh", "Trà thảo mộc cung đình thanh nhiệt giải độc thơm dịu ngọt hậu.", 15000L, catNuoc, "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800");
                    } else if (email.equals("cnh@gmail.com")) {
                        Category catGa = addCategoryIfNotExist(rest, "Gà Giòn Vui Vẻ");
                        Category catMy = addCategoryIfNotExist(rest, "Mỳ Ý & Burger");
                        Category catKem = addCategoryIfNotExist(rest, "Tráng Miệng & Đồ Uống");
                        addFoodIfNotExist(rest, "Combo 2 Miếng Gà Giòn Vui Vẻ", "2 miếng gà rán da giòn rụm, thịt mọng nước kèm khoai tây chiên và nước ngọt mát lạnh.", 85000L, catGa, "https://images.unsplash.com/photo-1562967914-608f82629710?w=800", "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800");
                        addFoodIfNotExist(rest, "Mỳ Ý Sốt Bò Bằm Jollibee", "Mỳ Ý sốt cà chua thịt bò bằm ngọt dịu phủ phô mai bào béo ngậy được trẻ nhỏ yêu thích.", 45000L, catMy, "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800", "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800");
                        addFoodIfNotExist(rest, "Khoai Tây Lắc Phô Mai", "Khoai tây chiên vàng giòn lắc bột phô mai béo mặn thơm lừng.", 28000L, catKem, "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800", "https://images.unsplash.com/photo-1562967914-608f82629710?w=800");
                        addFoodIfNotExist(rest, "Bánh Pie Xoài Đào Giòn Rụm", "Vỏ bánh giòn tan bọc lớp nhân mứt xoài đào nóng sốt chua ngọt hấp dẫn.", 20000L, catKem, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800");
                    } else if (email.equals("anhquan.camluong@gmail.com")) {
                        Category catTra = addCategoryIfNotExist(rest, "Trà Trái Cây & Macchiato");
                        Category catCafe = addCategoryIfNotExist(rest, "Cà Phê Truyền Thống");
                        Category catBanh = addCategoryIfNotExist(rest, "Bánh Ngọt Mỗi Ngày");
                        addFoodIfNotExist(rest, "Trà Đào Cam Sả Trứ Danh", "Vị trà thanh tao quyện cùng vị ngọt của đào tươi, hương thơm ấm nồng của sả và chua nhẹ của cam vàng.", 52000L, catTra, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800");
                        addFoodIfNotExist(rest, "Cà Phê Sữa Đá Đậm Đà", "Hạt cà phê Robusta & Arabica phối trộn cân bằng, pha phin truyền thống thơm nồng quyện sữa đặc béo ngậy.", 39000L, catCafe, "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800", "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800");
                        addFoodIfNotExist(rest, "Trà Sữa Mắc Ca Trân Châu Trắng", "Trà sữa mắc ca thơm bùi béo ngọt nhẹ, kết hợp trân châu trắng giòn sần sật.", 55000L, catTra, "https://images.unsplash.com/photo-1558857563-b371033873b8?w=800", "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800");
                        addFoodIfNotExist(rest, "Bánh Mousse Tiramisu Cacao", "Lớp bánh mềm ẩm quyện phô mai mascarpone và hương cà phê cacao thơm ngát.", 39000L, catBanh, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800");
                    }
                }
            }

            // Đảm bảo Tiệm Cơm Tấm Sài Gòn của chuquan@gmail.com có tên và địa chỉ tuyệt đẹp
            User chuQuan = userRepository.findByEmail("chuquan@gmail.com");
            if (chuQuan != null) {
                chuQuan.setFullName("Chủ Quán Quốc Anh");
                userRepository.save(chuQuan);
                Restaurant restComTam = restaurantRepository.findByOwnerId(chuQuan.getId());
                if (restComTam != null) {
                    restComTam.setName("Tiệm Cơm Tấm Sài Gòn - Đặc Biệt");
                    restComTam.setCuisineType("Cơm Tấm Truyền Thống");
                    restComTam.setDescription("Sườn nướng than hoa thơm lừng đậm đà, chả trứng cua béo ngậy, bì giòn chuẩn vị Chợ Lớn Sài Gòn.");
                    if (restComTam.getAddress() != null) {
                        restComTam.getAddress().setStreetAddress("Số 1, Phố Chùa Láng, Láng Thượng, Đống Đa");
                        restComTam.getAddress().setCity("Hà Nội");
                        addressRepository.save(restComTam.getAddress());
                    }
                    restaurantRepository.save(restComTam);
                }
            }

            // 2. TẠO HOẶC CẬP NHẬT 30 TÀI KHOẢN KHÁCH HÀNG THỰC TẾ
            String[][] customerData = {
                {"lequocanh14012005@gmail.com", "Lê Quốc Anh"},
                {"nam.nguyen@gmail.com", "Nguyễn Hoàng Nam"},
                {"thao.tran@gmail.com", "Trần Phương Thảo"},
                {"tuan.pham@gmail.com", "Phạm Minh Tuấn"},
                {"ha.do@gmail.com", "Đỗ Thu Hà"},
                {"khang.vu@gmail.com", "Vũ Đình Khang"},
                {"maianh.hoang@gmail.com", "Hoàng Mai Anh"},
                {"huy.bui@gmail.com", "Bùi Quang Huy"},
                {"thanhtruc.dang@gmail.com", "Đặng Thanh Trúc"},
                {"bao.ngo@gmail.com", "Ngô Quốc Bảo"},
                {"ngocanh.duong@gmail.com", "Dương Ngọc Ánh"},
                {"congminh.trinh@gmail.com", "Trịnh Công Minh"},
                {"myduyen.phan@gmail.com", "Phan Mỹ Duyên"},
                {"duc.mai@gmail.com", "Mai Văn Đức"},
                {"thuylinh.cao@gmail.com", "Cao Thùy Linh"},
                {"giahuy.dinh@gmail.com", "Đinh Gia Huy"},
                {"khanhvy.lam@gmail.com", "Lâm Khánh Vy"},
                {"quangthang.ta@gmail.com", "Tạ Quang Thắng"},
                {"haidang.chau@gmail.com", "Châu Hải Đăng"},
                {"kieutrang.ha@gmail.com", "Hà Kiều Trang"},
                {"giabao.luong@gmail.com", "Lương Gia Bảo"},
                {"nhatminh.doan@gmail.com", "Đoàn Nhật Minh"},
                {"dieuhoa.truong@gmail.com", "Trương Diệu Hoa"},
                {"customer1@gmail.com", "Nguyễn Văn Minh"},
                {"customer2@gmail.com", "Trần Thị Lan"},
                {"customer3@gmail.com", "Lê Hoàng Nam"},
                {"customer4@gmail.com", "Phạm Hồng Ngọc"},
                {"customer5@gmail.com", "Vũ Văn Hùng"},
                {"anguyen@gmail.com", "Nguyễn Văn An"},
                {"demo_facebook_8744@gmail.com", "Khách Hàng Facebook"}
            };

            List<User> customers = new ArrayList<>();
            String encodedPass = passwordEncoder.encode("123456");

            for (String[] cd : customerData) {
                User u = userRepository.findByEmail(cd[0]);
                if (u == null) {
                    u = new User();
                    u.setEmail(cd[0]);
                    u.setFullName(cd[1]);
                    u.setPassword(encodedPass);
                    u.setRole(com.anh.model.USER_ROLE.ROLE_CUSTOMER);
                    u = userRepository.save(u);
                } else {
                    u.setFullName(cd[1]);
                    u.setRole(com.anh.model.USER_ROLE.ROLE_CUSTOMER);
                    u = userRepository.save(u);
                }
                customers.add(u);
            }

            // 3. TẠO CÁC ĐƠN HÀNG VÀ ĐÁNH GIÁ CHÂN THỰC CHO TẤT CẢ KHÁCH HÀNG
            List<Restaurant> allRestaurants = restaurantRepository.findAll();
            int newOrdersCreated = 0;
            int newReviewsCreated = 0;

            String[] deliveryAddresses = {
                "144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội (ĐH Công Nghệ - ĐHQGHN)",
                "Ký túc xá Mễ Trì, 182 Lương Thế Vinh, Thanh Xuân, Hà Nội",
                "Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội",
                "Tòa nhà Keangnam Landmark 72, Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
                "Số 8 Tôn Thất Thuyết, Mỹ Đình 2, Nam Từ Liêm, Hà Nội",
                "Chung cư D'Capitale, 119 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
                "227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh"
            };

            String[] foodieComments = {
                "Đồ ăn nóng hổi, giao hàng rất nhanh và đóng gói chỉn chu, sạch sẽ 10/10!",
                "Sườn nướng than hoa mềm thơm đậm đà, hạt cơm tấm tơi xốp, nước mắm kẹo sền sệt siêu ngon!",
                "Vị ướp rất vừa miệng, thịt tươi ngọt không bị khô, phần ăn đầy đặn no căng bụng.",
                "Trà thơm đậm vị đặc sản, trân châu dẻo bùi nhai rất thích, độ ngọt vừa vặn thanh mát.",
                "Pizza nướng củi thơm phức giòn rụm, phô mai béo ngậy rưới mật ong ăn đỉnh thật sự!",
                "Nước dùng thanh ngọt tự nhiên từ xương ống, thịt bò tái mềm ngọt, bánh phở tươi ngon.",
                "Gà rán da giòn rụm ráo dầu, bên trong thịt vẫn mọng nước chấm cùng sốt tiêu thơm lừng.",
                "Bánh mì giòn tan, pate thơm ngậy quyện sốt bơ trứng đặc trưng đúng chuẩn Hội An.",
                "Chất lượng vượt xa mong đợi, shipper lịch sự và cẩn thận, chắc chắn sẽ tiếp tục ủng hộ quán!",
                "Cả nhà mình ai ăn cũng khen tấm tắc, giá cả hoàn toàn xứng đáng với chất lượng 5 sao!"
            };

            // Đảm bảo riêng tài khoản chính của Lê Quốc Anh có 4 đơn hàng đa dạng trạng thái để demo
            User mainUser = userRepository.findByEmail("lequocanh14012005@gmail.com");
            if (mainUser != null && !allRestaurants.isEmpty()) {
                Restaurant rComTam = allRestaurants.stream().filter(r -> r.getName().contains("Cơm Tấm")).findFirst().orElse(allRestaurants.get(0));
                Restaurant rPizza = allRestaurants.stream().filter(r -> r.getName().contains("Pizza")).findFirst().orElse(allRestaurants.get(0));
                Restaurant rDrink = allRestaurants.stream().filter(r -> r.getName().contains("Phê La") || r.getName().contains("Coffee")).findFirst().orElse(allRestaurants.get(0));
                Restaurant rPho = allRestaurants.stream().filter(r -> r.getName().contains("Phở") || r.getName().contains("Bún")).findFirst().orElse(allRestaurants.get(0));

                createSingleOrderWithReview(mainUser, rComTam, "COMPLETED", 2, "Sườn nướng thơm phức đậm đà, chả trứng béo ngậy, canh nóng hổi. Rất ngon miệng!", true);
                createSingleOrderWithReview(mainUser, rPizza, "COMPLETED", 5, "Pizza phô mai béo ngậy rưới mật ong thơm lừng, mỳ Ý kem cua đậm đà xuất sắc!", true);
                createSingleOrderWithReview(mainUser, rDrink, "DELIVERING", 0, null, false);
                createSingleOrderWithReview(mainUser, rPho, "PENDING", 0, null, false);
                newOrdersCreated += 4;
                newReviewsCreated += 2;
            }

            // Tạo thêm 2-3 đơn hàng và đánh giá cho từng khách hàng còn lại
            for (User cust : customers) {
                if (cust.getEmail().equals("lequocanh14012005@gmail.com")) continue;

                int ordersForCust = 2 + rand.nextInt(2);
                for (int o = 0; o < ordersForCust; o++) {
                    Restaurant rest = allRestaurants.get(rand.nextInt(allRestaurants.size()));
                    List<Food> foods = foodRepository.findByRestaurantId(rest.getId());
                    if (foods == null || foods.isEmpty()) continue;

                    Order order = new Order();
                    order.setCustomer(cust);
                    order.setRestaurant(rest);

                    Address addr = new Address();
                    addr.setStreetAddress(deliveryAddresses[rand.nextInt(deliveryAddresses.length)]);
                    addr.setCity("Hà Nội");
                    addr.setStateProvince("Hà Nội");
                    addr.setPostalCode("100000");
                    addr.setCountry("Việt Nam");
                    addr = addressRepository.save(addr);
                    order.setDeliveryAddress(addr);

                    int daysAgo = rand.nextInt(28);
                    Calendar cal = Calendar.getInstance();
                    cal.add(Calendar.DAY_OF_YEAR, -daysAgo);
                    cal.add(Calendar.HOUR_OF_DAY, -rand.nextInt(12));
                    order.setCreatedAt(cal.getTime());

                    // Đa số đơn hàng là COMPLETED để có doanh thu và nhận xét
                    String st = rand.nextInt(100) < 80 ? "COMPLETED" : (rand.nextBoolean() ? "DELIVERING" : "PENDING");
                    order.setOrderStatus(st);
                    order.setPaymentMethod(rand.nextBoolean() ? "COD" : "STRIPE");

                    int numFoods = 1 + rand.nextInt(2);
                    List<OrderItem> items = new ArrayList<>();
                    long totalAmt = 0;
                    int totalQty = 0;

                    for (int fIdx = 0; fIdx < numFoods; fIdx++) {
                        Food f = foods.get(rand.nextInt(foods.size()));
                        int q = 1 + rand.nextInt(2);
                        OrderItem oi = new OrderItem();
                        oi.setFood(f);
                        oi.setQuantity(q);
                        oi.setTotalPrice(f.getPrice() * q);
                        oi = orderItemRepository.save(oi);
                        items.add(oi);
                        totalAmt += oi.getTotalPrice();
                        totalQty += q;
                    }

                    order.setItems(items);
                    order.setTotalPrice(totalAmt);
                    order.setTotalAmount(totalAmt);
                    order.setTotalItem(totalQty);
                    order = orderRepository.save(order);
                    newOrdersCreated++;

                    // Nếu đơn COMPLETED, tự động tạo nhận xét chân thực cho nhà hàng và món ăn
                    if ("COMPLETED".equals(st)) {
                        Review restRev = new Review();
                        restRev.setCustomer(cust);
                        restRev.setRestaurant(rest);
                        restRev.setRating(rand.nextBoolean() ? 5.0 : 4.5);
                        restRev.setComment(foodieComments[rand.nextInt(foodieComments.length)]);
                        restRev.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                        reviewRepository.save(restRev);
                        newReviewsCreated++;

                        // Nhận xét cho món ăn cụ thể trong đơn
                        if (!items.isEmpty() && items.get(0).getFood() != null) {
                            Review foodRev = new Review();
                            foodRev.setCustomer(cust);
                            foodRev.setRestaurant(rest);
                            foodRev.setFood(items.get(0).getFood());
                            foodRev.setRating(rand.nextBoolean() ? 5.0 : 4.5);
                            foodRev.setComment(foodieComments[rand.nextInt(foodieComments.length)]);
                            foodRev.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                            reviewRepository.save(foodRev);
                            newReviewsCreated++;
                        }
                    }
                }
            }

            // 5. ĐẢM BẢO DỮ LIỆU THỰC CHIẾN CHO 2 TÁC TỬ AI (AGENTIC AI DEMO)
            // 5.1. Tạo 1 Đánh giá vi phạm tiêu chuẩn cộng đồng để demo "AI Content Moderation Sentinel" của Super Admin
            boolean hasToxicReview = reviewRepository.findAll().stream().anyMatch(r -> 
                r.getComment() != null && (r.getComment().contains("rác rưởi") || r.getComment().contains("mất dạy")));
            if (!hasToxicReview) {
                User toxicUser = customers.stream().filter(u -> "Trần Quốc Bảo".equals(u.getFullName())).findFirst().orElse(!customers.isEmpty() ? customers.get(0) : null);
                Restaurant comTamRest = restaurantRepository.findAll().stream().filter(r -> r.getName() != null && r.getName().contains("Cơm Tấm")).findFirst().orElse(null);
                if (comTamRest == null) {
                    List<Restaurant> allRests = restaurantRepository.findAll();
                    if (!allRests.isEmpty()) comTamRest = allRests.get(0);
                }
                if (toxicUser != null && comTamRest != null) {
                    Review tr = new Review();
                    tr.setCustomer(toxicUser);
                    tr.setRestaurant(comTamRest);
                    tr.setRating(1.0);
                    tr.setComment("Đồ ăn như rác rưởi, sườn thiu thối mà vẫn đem bán, nhân viên thì mất dạy thách thức khách! Đề nghị tẩy chay quán lừa đảo này ngay lập tức!!!");
                    tr.setCreatedAt(LocalDateTime.now().minusDays(1));
                    reviewRepository.save(tr);
                    newReviewsCreated++;
                }
            }

            // 5.2. Cấu hình nguyên liệu cạn kho cho Tiệm Cơm Tấm Sài Gòn để demo "Smart Inventory Agent" của Chủ quán
            Restaurant comTam = restaurantRepository.findAll().stream().filter(r -> r.getName() != null && r.getName().contains("Cơm Tấm")).findFirst().orElse(null);
            if (comTam != null) {
                IngredientCategory catThit = ingredientCategoryRepository.findByRestaurantId(comTam.getId()).stream().filter(c -> c.getName().equalsIgnoreCase("Thịt Tươi Sống") || c.getName().equalsIgnoreCase("Thịt")).findFirst().orElse(null);
                if (catThit == null) {
                    catThit = new IngredientCategory();
                    catThit.setName("Thịt Tươi Sống");
                    catThit.setRestaurant(comTam);
                    catThit = ingredientCategoryRepository.save(catThit);
                }
                IngredientCategory catTopping = ingredientCategoryRepository.findByRestaurantId(comTam.getId()).stream().filter(c -> c.getName().equalsIgnoreCase("Topping")).findFirst().orElse(null);
                if (catTopping == null) {
                    catTopping = new IngredientCategory();
                    catTopping.setName("Topping");
                    catTopping.setRestaurant(comTam);
                    catTopping = ingredientCategoryRepository.save(catTopping);
                }

                // Sườn cây tươi - ĐÃ CẠN KHO (0 kg)
                IngredientsItem suonCay = ingredientItemRepository.findByRestaurantId(comTam.getId()).stream().filter(i -> i.getName().equalsIgnoreCase("Sườn cây tươi")).findFirst().orElse(null);
                if (suonCay == null) {
                    suonCay = new IngredientsItem();
                    suonCay.setName("Sườn cây tươi");
                    suonCay.setCategory(catThit);
                    suonCay.setRestaurant(comTam);
                }
                suonCay.setQuantity(0.0);
                suonCay.setUnit("kg");
                suonCay.setMinThreshold(10.0);
                suonCay.setInStock(false);
                suonCay = ingredientItemRepository.save(suonCay);

                // Trứng gà ta - SẮP HẾT (2 quả)
                IngredientsItem trungGa = ingredientItemRepository.findByRestaurantId(comTam.getId()).stream().filter(i -> i.getName().equalsIgnoreCase("Trứng gà ta")).findFirst().orElse(null);
                if (trungGa == null) {
                    trungGa = new IngredientsItem();
                    trungGa.setName("Trứng gà ta");
                    trungGa.setCategory(catTopping);
                    trungGa.setRestaurant(comTam);
                }
                trungGa.setQuantity(2.0);
                trungGa.setUnit("quả");
                trungGa.setMinThreshold(10.0);
                trungGa.setInStock(true);
                trungGa = ingredientItemRepository.save(trungGa);

                // Gắn nguyên liệu vào món Cơm Sườn Cây Nướng Mật Ong
                List<Food> comTamFoods = foodRepository.findByRestaurantId(comTam.getId());
                for (Food f : comTamFoods) {
                    if (f.getName().contains("Sườn Cây")) {
                        if (!f.getIngredients().contains(suonCay)) {
                            f.getIngredients().add(suonCay);
                        }
                        if (!f.getIngredients().contains(trungGa)) {
                            f.getIngredients().add(trungGa);
                        }
                        foodRepository.save(f);
                    }
                }
            }

            return ResponseEntity.ok(String.format(
                "Đã tối ưu hóa toàn bộ hệ thống F&B cho buổi bảo vệ khóa luận thành công!\n" +
                "- 15 nhà hàng đều có danh mục món thực tế, ảnh đẹp nhiều góc chụp.\n" +
                "- 30 khách hàng thực tế (ROLE_CUSTOMER) có đầy đủ họ tên tiếng Việt và mật khẩu: 123456\n" +
                "- Đã tạo thêm %d đơn hàng thực tế rải đều 30 ngày qua (đủ các trạng thái Hoàn thành, Đang giao, Đang chuẩn bị).\n" +
                "- Đã tạo thêm %d nhận xét & đánh giá chân thực cho cả nhà hàng lẫn từng món ăn.\n" +
                "- Tài khoản chính của bạn (lequocanh14012005@gmail.com) đã có sẵn 4 đơn hàng đẹp mắt để demo trực tiếp!",
                newOrdersCreated, newReviewsCreated
            ));
        } catch (Exception e) {
            e.printStackTrace();
            String trace = e.getStackTrace().length > 0 ? e.getStackTrace()[0].toString() : "";
            return ResponseEntity.status(500).body("Lỗi tối ưu dữ liệu: " + e.toString() + " at " + trace);
        }
    }

    private void createSingleOrderWithReview(User customer, Restaurant rest, String status, int daysAgo, String comment, boolean addReview) {
        try {
            List<Food> foods = foodRepository.findByRestaurantId(rest.getId());
            if (foods == null || foods.isEmpty()) return;

            Order order = new Order();
            order.setCustomer(customer);
            order.setRestaurant(rest);

            Address addr = new Address();
            addr.setStreetAddress("144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội (ĐH Công Nghệ - ĐHQGHN)");
            addr.setCity("Hà Nội");
            addr.setStateProvince("Hà Nội");
            addr.setPostalCode("100000");
            addr.setCountry("Việt Nam");
            addr = addressRepository.save(addr);
            order.setDeliveryAddress(addr);

            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_YEAR, -daysAgo);
            order.setCreatedAt(cal.getTime());
            order.setOrderStatus(status);
            order.setPaymentMethod("STRIPE");

            List<OrderItem> items = new ArrayList<>();
            long total = 0;
            int count = 0;
            int numItems = Math.min(2, foods.size());
            for (int i = 0; i < numItems; i++) {
                Food f = foods.get(i);
                OrderItem oi = new OrderItem();
                oi.setFood(f);
                oi.setQuantity(1);
                oi.setTotalPrice(f.getPrice());
                oi = orderItemRepository.save(oi);
                items.add(oi);
                total += f.getPrice();
                count++;
            }
            order.setItems(items);
            order.setTotalPrice(total);
            order.setTotalAmount(total);
            order.setTotalItem(count);
            order = orderRepository.save(order);

            if (addReview && "COMPLETED".equals(status)) {
                Review r = new Review();
                r.setCustomer(customer);
                r.setRestaurant(rest);
                r.setRating(5.0);
                r.setComment(comment != null ? comment : "Đồ ăn rất ngon, đóng gói sạch sẽ và phục vụ chuyên nghiệp!");
                r.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                reviewRepository.save(r);

                if (!items.isEmpty()) {
                    Review fr = new Review();
                    fr.setCustomer(customer);
                    fr.setRestaurant(rest);
                    fr.setFood(items.get(0).getFood());
                    fr.setRating(5.0);
                    fr.setComment(comment != null ? comment : "Món ăn nóng hổi, thơm ngon chuẩn vị!");
                    fr.setCreatedAt(LocalDateTime.ofInstant(cal.toInstant(), cal.getTimeZone().toZoneId()));
                    reviewRepository.save(fr);
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private Food addFoodIfNotExist(Restaurant rest, String name, String desc, Long price, Category cat, String... imageUrls) {
        List<Food> existing = foodRepository.findByRestaurantId(rest.getId());
        for (Food f : existing) {
            if (f.getName().equalsIgnoreCase(name)) {
                return f;
            }
        }
        Food food = new Food();
        food.setName(name);
        food.setDescription(desc);
        food.setPrice(price);
        food.setRestaurant(rest);
        food.setFoodCategory(cat);
        food.setAvailable(true);
        food.setCreationDate(new Date());
        food.setVegetarian(false);
        food.setSeasonal(false);
        food.setImages(new ArrayList<>(Arrays.asList(imageUrls)));
        return foodRepository.save(food);
    }

    private Category addCategoryIfNotExist(Restaurant rest, String catName) {
        List<Category> existing = categoryRepository.findByRestaurantId(rest.getId());
        for (Category c : existing) {
            if (c.getName().equalsIgnoreCase(catName)) {
                return c;
            }
        }
        Category c = new Category();
        c.setName(catName);
        c.setRestaurant(rest);
        return categoryRepository.save(c);
    }

    @GetMapping("/update-curated-images")
    public ResponseEntity<String> updateAllCuratedImages(@RequestParam(defaultValue = "false") boolean confirm) {
        if (!confirm) {
            return ResponseEntity.status(403).body("Endpoint đã được khóa bảo vệ để tránh ghi đè ảnh nhà hàng và món ăn bạn đã tự chỉnh sửa!");
        }
        try {
            // 1. Cập nhật ảnh chuẩn cho 15 Nhà Hàng
            Map<String, String> restImgMap = new HashMap<>();
            restImgMap.put("Tiệm Cơm Tấm Sài Gòn - Đặc Biệt", "https://topquangbinh.vn/wp-content/uploads/2021/12/244453982_596856808394695_5035792605248304808_n-min-1024x1024.jpg");
            restImgMap.put("Phở Gia Truyền Bát Đàn", "https://danielfooddiary.com/wp-content/uploads/2025/12/phogiatruyen11.jpg");
            restImgMap.put("Bún Chả Hương Liên (Obama)", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD3gp0oZbGTw5L6_DGZFL2S6FqryPpcoOOVFjgpd3tDb5YLQg58NBu4kY&s=10");
            restImgMap.put("Pizza 4P's - Lê Thánh Tôn", "https://static.kienviet.net/storage/uploads/2023/11/kienviet-pizza-4ps-1-1699925599.jpg");
            restImgMap.put("Sushi Bar - Tôn Đức Thắng", "https://noithatkendesign.vn/storage/app/media/uploaded-files/thiet-ke-sushi-bar-5.jpg");
            restImgMap.put("Bánh Mì Phượng Hội An", "https://vnn-imgs-f.vgcloud.vn/2022/01/10/20/sau-lum-xum-bi-keu-goi-tay-chay-banh-mi-phuong-van-phi-may-bay-ra-ha-noi-gia-60-ngan-o-cung-chay-hang.jpg?width=0&s=0QZUZV0SMlPZ08HesFN_Gg");
            restImgMap.put("Highlands Coffee - Nguyễn Huệ", "https://www.highlandscoffee.com.vn/vnt_upload/home/web_banner_2000x2000.jpg");
            restImgMap.put("Dim Sum Tiến Phát - Điểm Tâm Hoa", "https://img.mservice.com.vn/common/u/2e02fb5fe4f64fb55bc713540643c6f8eae702d101cea8c59afc49cfc505fc37/9d2ddbfc-4462-459f-a264-b3edb0d599b8e_938rg5.jpeg");
            restImgMap.put("KFC Việt Nam - Bà Triệu", "https://vcdn1-kinhdoanh.vnecdn.net/2024/11/23/img-3682-jpeg-1732344951-5061-1732345066.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=4e4ZQbJdIKfZt6Xjny43BA");
            restImgMap.put("Lẩu Phan - Buffet Bò Mỹ", "https://cdn.lauphan.com/photo-storage/myFile-1666063686979.jpeg");
            restImgMap.put("El Gaucho Argentinian Steakhouse", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&auto=format&fit=crop");
            restImgMap.put("Gà Rán Jollibee - Vincom Center", "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop");
            restImgMap.put("The Coffee House - Cà Phê & Trà", "https://cafefcdn.com/thumb_w/640/203337114487263232/2025/2/21/avatar1740096715584-17400967157451708166300.jpg");
            restImgMap.put("Trà Sữa Phê La - Đậm Vị Ô Long", "https://phela.vn/wp-content/uploads/2025/04/Update-web.jpg");
            restImgMap.put("Bún Bò Huế Ngự Uyển", "https://bloganchoi.com/wp-content/uploads/2024/07/quan-bun-bo-hue-ha-noi-ngu-uyen.jpg");
            restImgMap.put("Nhà Hàng Chay Hoa Anh Đào - Hội An", "http://localhost:5173/images/chay_hoian_facade.jpg");

            List<Restaurant> restaurants = restaurantRepository.findAll();
            for (Restaurant r : restaurants) {
                if (r.getName() == null) continue;
                String rName = r.getName().trim().toLowerCase();
                boolean matched = false;
                for (Map.Entry<String, String> entry : restImgMap.entrySet()) {
                    if (rName.equalsIgnoreCase(entry.getKey().trim().toLowerCase())) {
                        r.setImages(new ArrayList<>(Collections.singletonList(entry.getValue())));
                        restaurantRepository.save(r);
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    if (rName.contains("cơm tấm")) {
                        r.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/com_tam_suon_bi_cha.jpg")));
                        restaurantRepository.save(r);
                    } else if (rName.contains("phở")) {
                        r.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/pho_bo_bat_dan.jpg")));
                        restaurantRepository.save(r);
                    } else if (rName.contains("bún chả")) {
                        r.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/bun_cha_hanoi.jpg")));
                        restaurantRepository.save(r);
                    } else if (rName.contains("bánh mì")) {
                        r.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/banh_mi_thap_cam.jpg")));
                        restaurantRepository.save(r);
                    } else if (rName.contains("bún bò")) {
                        r.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/bun_bo_hue.jpg")));
                        restaurantRepository.save(r);
                    }
                }
            }

            // 2. Cập nhật ảnh chuẩn chính xác cho từng món ăn
            Map<String, String> foodImgMap = new HashMap<>();
            // Tiệm Cơm Tấm Sài Gòn - Đặc Biệt
            foodImgMap.put("Cơm Sườn Bì Chả", "http://localhost:5173/images/com_tam_suon_bi_cha.jpg");
            foodImgMap.put("Cơm Sườn Cây Nướng Mật Ong", "http://localhost:5173/images/com_suon_cay_nuong.jpg");
            foodImgMap.put("Cơm Tấm Ba Rọi Nướng Giòn", "http://localhost:5173/images/com_tam_ba_roi_nuong.jpg");
            foodImgMap.put("Chả Trứng Cua Hấp", "http://localhost:5173/images/cha_trung_hap.jpg");
            foodImgMap.put("Trứng Ốp La Lòng Đào", "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop");
            foodImgMap.put("Đùi Gà Nướng Mật Ong", "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop");
            foodImgMap.put("Canh Khổ Qua Dồn Thịt", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwpid5NbmkvmgoQEmIri2U6nJHrEaQQPJLLFytYQqjnqlrbjknWDg9tuE&s=10");
            foodImgMap.put("Canh Cải Chua Nấu Sườn", "http://localhost:5173/images/canh_cai_chua_suon.jpg");
            foodImgMap.put("Trà Đá Đường Phèn", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop");
            foodImgMap.put("Nước Mía Tươi Tắc", "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop");

            // Phở Gia Truyền Bát Đàn
            foodImgMap.put("Phở Bò Tái", "http://localhost:5173/images/pho_bo_bat_dan.jpg");
            foodImgMap.put("Phở Bò Chín", "https://fohlafood.vn/cdn/shop/articles/bi-quyet-nau-phi-bo-ngon-tuyet-dinh.jpg?v=1712213789");
            foodImgMap.put("Phở Tái Nạm Gầu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWxCckcU2Q07fv9S8GvMW1zU41yNi_Tk-iAvpBbTQbfQsyRwRwjd084ttW&s=10");
            foodImgMap.put("Quẩy Nóng", "http://localhost:5173/images/quay_nong.jpg");
            foodImgMap.put("Trà Đá", "https://media.phunutoday.vn/files/news/2026/06/22/uong-tra-da-phai-chu-y-dieu-nay-de-an-toan-5-sai-lam-nhieu-nguoi-mac-moi-ngay-050113.jpg");

            // Bún Chả Hương Liên (Obama)
            foodImgMap.put("Combo Obama", "http://localhost:5173/images/bun_cha_hanoi.jpg");
            foodImgMap.put("Bún Chả Truyền Thống", "https://cdn.realtech.com.vn/uploads/gostay/news/327/bun-cha-ha-noi.jpg");
            foodImgMap.put("Nem Cua Bể", "http://localhost:5173/images/nem_cua_be.jpg");
            foodImgMap.put("Nem Hải Sản", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhI-GoYwiA6mY1l7lHQeX-ovH26wQJkcsQ32Fjr_zwRLzsRWnGtA1Yro1d&s=10");
            foodImgMap.put("Bia Hà Nội", "https://biahanoi.muabianhanh.com/wp-content/uploads/2023/03/2-1.png");

            // Pizza 4P's - Lê Thánh Tôn
            foodImgMap.put("Pizza 4 Cheeses", "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop");
            foodImgMap.put("Pizza Burrata Parma Ham", "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop");
            foodImgMap.put("Mỳ Ý Sốt Kem Cua", "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/1_07a19cb704.png");
            foodImgMap.put("Salad Phô Mai Burrata", "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop");
            foodImgMap.put("Bánh Tiramisu", "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop");

            // Sushi Bar - Tôn Đức Thắng
            foodImgMap.put("Sashimi Cá Hồi", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop");
            foodImgMap.put("Sushi Rồng (Dragon Roll)", "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop");
            foodImgMap.put("Mỳ Tempura Udon", "https://cdn.tgdd.vn/2020/10/content/r-800x503.jpg");
            foodImgMap.put("Đậu Nành Nhật (Edamame)", "https://nguyenhafood.vn/uploads/files/R2958-final-photo-.png");
            foodImgMap.put("Kem Trà Xanh Matcha", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGeo86bn9u3Q_NYA9pj8G3xpsTAV-vx6fCnVuWv8aJYeFrsKyLdYAx6hXV&s=10");

            // Bánh Mì Phượng Hội An
            foodImgMap.put("Bánh Mì Thập Cẩm", "http://localhost:5173/images/banh_mi_thap_cam.jpg");
            foodImgMap.put("Bánh Mì Gà Xé Bơ", "https://xebanhmithonhiky.com.vn/wp-content/uploads/2019/07/banh-mi-ga-xe-sot-bo-ngon-kho-cuong.jpg");
            foodImgMap.put("Bánh Mì Thịt Nướng Sả", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpaF3-6_U2ftXdBLX71btbqcCRy5ZbTgdXMZi12aTyR0VOT4o3rSUjdgE&s=10");
            foodImgMap.put("Sữa Bắp Hạt Sen", "https://bizweb.dktcdn.net/100/603/550/articles/sua-ngo-hat-sen-0.jpg?v=1779101585810");
            foodImgMap.put("Nước Sấu Đá", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFrRk2ssezmvb0SkutlpO2H9Vkzm4DY2aPOJPE7bnxPei0mr1mo_kSL5M&s=10");

            // Highlands Coffee - Nguyễn Huệ
            foodImgMap.put("Phin Sữa Đá Lớn", "http://localhost:5173/images/ca_phe_sua_da.jpg");
            foodImgMap.put("Trà Sen Vàng", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop");
            foodImgMap.put("Freeze Trà Xanh", "https://voucherhighlands.com/wp-content/uploads/2026/04/anh-chup-freeze-tra-xanh.jpg");
            foodImgMap.put("Bánh Mì Thịt Nướng", "https://www.huongnghiepaau.com/wp-content/uploads/2025/07/cach-ban-banh-mi-thit-nuong-dat-hang.jpg");
            foodImgMap.put("Bánh Mousse Đào", "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop");

            // Dim Sum Tiến Phát - Điểm Tâm Hoa
            foodImgMap.put("Há Cảo Tôm", "http://localhost:5173/images/dimsum_hacao.jpg");
            foodImgMap.put("Xíu Mại Tôm Thịt", "https://dimsumgiabao.com/wp-content/uploads/2024/01/xiu-mai-tom-thit.jpg");
            foodImgMap.put("Bánh Bao Kim Sa", "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop");
            foodImgMap.put("Chân Gà Hấp Tàu Xì", "https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/chan-ga-tau-xi-thumbnail.jpg");
            foodImgMap.put("Trà Hoa Cúc Mật Ong", "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop");

            // KFC Việt Nam - Bà Triệu
            foodImgMap.put("Combo Gà Giòn Cay", "https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop");
            foodImgMap.put("Gà Popcorn Lớn", "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop");
            foodImgMap.put("Burger Tôm", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop");
            foodImgMap.put("Khoai Tây Chiên Lớn", "https://vietquangcao.org/wp-content/uploads/2023/10/nhung-chien-dich-quang-cao-doc-la-vang-doi-cua-kfc-1.jpg");
            foodImgMap.put("Pepsi Ly Lớn", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuC2EBMVwNc0muCE5xRmJrnNuWwVHthOuH33M3KmWjHcAiuSfgMzzge_gP&s=10");

            // Lẩu Phan - Buffet Bò Mỹ
            foodImgMap.put("Buffet Lẩu Bò 139k", "https://pasgo.vn/Upload/anh-chi-tiet/hotpot-constructon-buffet-lau-nuong-bo-canada-ha-dong-1-normal-655061433815.webp");
            foodImgMap.put("Buffet Lẩu Hải Sản 199k", "https://statics.vinpearl.com/buffet-hai-san-ha-noi-1_1698585816.jpg");
            foodImgMap.put("Đĩa Ba Chỉ Bò Mỹ Thêm", "https://dochienxienque.com/wp-content/uploads/2021/02/ba-chi-bo-my.jpg");
            foodImgMap.put("Ngô Chiên Bơ Tỏi", "https://i-giadinh.vnecdn.net/2023/02/04/Thanh-pham-1-1-2273-1675483496.jpg");
            foodImgMap.put("Coca Cola Chai", "https://storage.googleapis.com/teko-gae.appspot.com/media/image/2023/5/11/ec4502ca-a89d-4c58-91b7-f1cc9a638fa5/Sang%20khoai%20va%20ua%20chuong.png");

            // El Gaucho Argentinian Steakhouse
            foodImgMap.put("Ribeye Steak 250g", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy6NJONA5-2IQEPBErqVN8Lz7g2yFaevyd_Pd5QBu-sK4xonI7mL2cTcuC&s=10");
            foodImgMap.put("Filet Mignon 200g", "https://www.baronycountryfoods.co.uk/wp-content/uploads/2021/03/Barony-Country-Foods-Beef-21-2.jpg");
            foodImgMap.put("Cá Hồi Nướng Than", "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop");
            foodImgMap.put("Caesar Salad Classic", "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop");
            foodImgMap.put("Ly Vang Đỏ Cabernet", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop");

            // Gà Rán Jollibee - Vincom Center
            foodImgMap.put("Cơm Gà Giòn Sốt Tiêu Jollibee", "https://jollibee.com.vn/media/catalog/product/cache/11f3e6435b23ab624dc55c2d3fe9479d/g/_/g_gi_n_vui_v_-_4.png");
            foodImgMap.put("Combo 2 Miếng Gà Giòn Vui Vẻ", "https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/6/6/66k_-_2_cjoy.png");
            foodImgMap.put("Mỳ Ý Sốt Bò Bằm Jollibee", "https://jollibee.com.vn/media/catalog/product/cache/11f3e6435b23ab624dc55c2d3fe9479d/1/2/1200x1200px_r2-compressed.jpg");
            foodImgMap.put("Khoai Tây Lắc Phô Mai", "https://cdn.bcbshop.vn/products/1785385395442-fiiyq1yr2t.webp");
            foodImgMap.put("Bánh Pie Xoài Đào Giòn Rụm", "https://cdn2.fptshop.com.vn/unsafe/800x0/cach_lam_banh_xoai_dao_jollibee_1_4c50e51614.jpg");

            // The Coffee House - Cà Phê & Trà
            foodImgMap.put("Trà Đào Cam Sả Trứ Danh", "http://localhost:5173/images/tra_dao_cam_sa.jpg");
            foodImgMap.put("Cà Phê Sữa Đá Đậm Đà", "https://product.hstatic.net/200000745755/product/4_ccceb5085680488b824d1e1308b49921_master.jpg");
            foodImgMap.put("Trà Sữa Mắc Ca Trân Châu Trắng", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSfnp-aB38-PAEAwooo2kZqowpFDAlSa_C1bTTT4IrbDbDTWPmexrAqDdH&s=10");
            foodImgMap.put("Bánh Mousse Tiramisu Cacao", "https://r2.cms.4handy.vn/banh-tiramisu-cacao.jpg");

            // Trà Sữa Phê La - Đậm Vị Ô Long
            foodImgMap.put("Ô Long Sữa Phê La Trân Châu", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGBv6gKBLn0X5STo1_he2aevLilhMe4DDXF-F1j30LRrx2pgjk45BRtn4&s=10");
            foodImgMap.put("Gấm Ô Long Nhiệt Đới", "https://hunufa.vn/wp-content/uploads/2024/11/menu-phe-la-2.webp");
            foodImgMap.put("Khói B'lao Kem Cheese", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBBxu6NPhVq98ValM9GhXGN2n0GTsgAZESaPBEMpjimRm45DMmXYBPfnZq&s=10");
            foodImgMap.put("Bánh Croissant Nướng Bơ Pháp", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop");

            // Bún Bò Huế Ngự Uyển
            foodImgMap.put("Bún Bò Huế Đặc Biệt Bắp Bò Chả Cua", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIOWT2ml4kMGj-VsERHBfSDHlhS0uhmQi6HMzQIuvFmcUxq6lKepFgOw_o&s=10");
            foodImgMap.put("Bún Bò Nạm Giò Heo", "https://kinhdoamthuc.com/wp-content/uploads/2023/07/cach-nau-bun-bo-gio-heo-ngon-nhat.jpg");
            foodImgMap.put("Bánh Bột Lọc Tôm Thịt Cố Đô", "http://localhost:5173/images/banh_bot_loc.jpg");
            foodImgMap.put("Trà Cung Đình Huế Mát Lạnh", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq37uLSfGnIaYAdxKV0BsFayOG_lERf5R59Op3IS-6ow&s=10");

            // Nhà Hàng Chay Hoa Anh Đào - Hội An
            foodImgMap.put("Cao Lầu Chay Hội An", "http://localhost:5173/images/cao_lau_chay.jpg");
            foodImgMap.put("Cơm Chay Thập Cẩm Xứ Quảng", "http://localhost:5173/images/com_chay_thap_cam.jpg");
            foodImgMap.put("Bánh Xèo Chay Giòn Rụm", "http://localhost:5173/images/banh_xeo_chay.jpg");
            foodImgMap.put("Canh Củ Sen Nấm Thanh Đạm", "http://localhost:5173/images/canh_nam_hat_sen.jpg");
            foodImgMap.put("Trà Hoa Cúc Thảo Mộc Hội An", "http://localhost:5173/images/tra_thao_moc_hoian.jpg");

            List<Food> foods = foodRepository.findAll();
            for (Food f : foods) {
                if (f.getName() == null) continue;
                String fName = f.getName().trim().toLowerCase();

                // Sửa món 352 bị nhầm tên ở Jollibee
                if (fName.contains("cơm tấm") && f.getRestaurant() != null && f.getRestaurant().getName() != null && f.getRestaurant().getName().toLowerCase().contains("jollibee")) {
                    f.setName("Cơm Gà Giòn Sốt Tiêu Jollibee");
                    f.setDescription("Cơm gà rán giòn rụm rưới sốt tiêu nấm thơm ngon đặc trưng Jollibee");
                    f.setImages(new ArrayList<>(Collections.singletonList("https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop")));
                    foodRepository.save(f);
                    continue;
                }

                boolean updated = false;
                for (Map.Entry<String, String> entry : foodImgMap.entrySet()) {
                    if (fName.equalsIgnoreCase(entry.getKey().trim().toLowerCase())) {
                        f.setImages(new ArrayList<>(Collections.singletonList(entry.getValue())));
                        foodRepository.save(f);
                        updated = true;
                        break;
                    }
                }

                if (!updated) {
                    // Keyword-based fallback matching
                    if (fName.contains("cơm sườn") || fName.contains("cơm tấm")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/com_tam_suon_bi_cha.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("phở")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/pho_bo_bat_dan.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("bún chả")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/bun_cha_hanoi.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("bún bò")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/bun_bo_hue.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("bánh mì")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/banh_mi_thap_cam.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("bột lọc")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/banh_bot_loc.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("quẩy")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/quay_nong.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("chả trứng")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/cha_trung_hap.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("nem cua")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/nem_cua_be.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("há cảo") || fName.contains("xíu mại")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/dimsum_hacao.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("trà đào")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/tra_dao_cam_sa.jpg")));
                        foodRepository.save(f);
                    } else if (fName.contains("cà phê sữa") || fName.contains("phin sữa")) {
                        f.setImages(new ArrayList<>(Collections.singletonList("http://localhost:5173/images/ca_phe_sua_da.jpg")));
                        foodRepository.save(f);
                    }
                }
            }

            return ResponseEntity.ok("Đã cập nhật ảnh chuẩn 100% cho toàn bộ " + restaurants.size() + " nhà hàng và " + foods.size() + " món ăn thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi cập nhật ảnh: " + e.getMessage());
        }
    }

    private Map<String, Object> createFoodMap(String name, String desc, Long price, String category, String imageUrl) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("description", desc);
        map.put("price", price);
        map.put("category", category);
        map.put("imageUrl", imageUrl);
        return map;
    }
}
