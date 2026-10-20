package com.anh.controller;

import com.anh.model.*;
import com.anh.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ResponseEntity<String> fixImages() {
        try {
            int fixedCount = 0;
            // 1. Tìm Tiệm Cơm Tấm Sài Gòn
            User owner1 = userRepository.findByEmail("chuquan@gmail.com");
            if (owner1 != null) {
                owner1.setPassword(passwordEncoder.encode("123456"));
                userRepository.save(owner1);
                
                Restaurant r1 = restaurantRepository.findByOwnerId(owner1.getId());
                if (r1 != null) {
                    r1.setImages(Arrays.asList("https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800"));
                    restaurantRepository.save(r1);
                    fixedCount++;
                }
            }

            // 2. Tìm Bánh Mì Phượng Hội An
            User owner2 = userRepository.findByEmail("banhmiphuong_owner@food.com");
            if (owner2 != null) {
                Restaurant r2 = restaurantRepository.findByOwnerId(owner2.getId());
                if (r2 != null) {
                    r2.setImages(Arrays.asList("https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800"));
                    restaurantRepository.save(r2);
                    fixedCount++;
                }
            }

            return ResponseEntity.ok(String.format("Đã sửa ảnh lỗi cho %d nhà hàng thành công!", fixedCount));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Thất bại khi sửa ảnh: " + e.getMessage());
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
