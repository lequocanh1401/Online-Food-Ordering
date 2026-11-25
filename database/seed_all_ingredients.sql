-- ==============================================================================
-- BỔ SUNG NGUYÊN LIỆU ĐỊNH LƯỢNG (BOM) CHO 100% NHÀ HÀNG & MÓN ĂN TRÊN TOÀN SÀN
-- ==============================================================================

-- 102. Phở Gia Truyền Bát Đàn
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt Bò & Nước Dùng', 102), ('Bánh Phở & Ăn Kèm', 102), ('Đồ Uống', 102)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bánh phở tươi', id, 102, 1, 50.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Bánh Phở & Ăn Kèm' AND restaurant_id = 102 LIMIT 1;
SET @ing_pho = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt bò tái tươi', id, 102, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò & Nước Dùng' AND restaurant_id = 102 LIMIT 1;
SET @ing_botai = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt bò chín nạm gầu', id, 102, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò & Nước Dùng' AND restaurant_id = 102 LIMIT 1;
SET @ing_bochin = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bột quẩy tươi', id, 102, 1, 60.0, 15.0, 'phần' FROM ingredient_category WHERE name = 'Bánh Phở & Ăn Kèm' AND restaurant_id = 102 LIMIT 1;
SET @ing_quay = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Trà lài pha đá', id, 102, 1, 80.0, 20.0, 'ly' FROM ingredient_category WHERE name = 'Đồ Uống' AND restaurant_id = 102 LIMIT 1;
SET @ing_trada102 = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 102;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(302, @ing_pho), (302, @ing_botai),
(303, @ing_pho), (303, @ing_bochin),
(304, @ing_pho), (304, @ing_bochin),
(305, @ing_quay),
(306, @ing_trada102);


-- 103. Bún Chả Hương Liên (Obama)
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt & Chả Nướng', 103), ('Bún & Nem', 103), ('Đồ Uống', 103)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bún tươi sợi nhỏ', id, 103, 1, 60.0, 15.0, 'kg' FROM ingredient_category WHERE name = 'Bún & Nem' AND restaurant_id = 103 LIMIT 1;
SET @ing_bun = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Chả nướng than hoa', id, 103, 1, 35.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt & Chả Nướng' AND restaurant_id = 103 LIMIT 1;
SET @ing_chanuong = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt cua bể tươi', id, 103, 1, 15.0, 3.0, 'kg' FROM ingredient_category WHERE name = 'Bún & Nem' AND restaurant_id = 103 LIMIT 1;
SET @ing_cuabe = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Hải sản tôm mực', id, 103, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Bún & Nem' AND restaurant_id = 103 LIMIT 1;
SET @ing_haisan = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bia Hà Nội ướp lạnh', id, 103, 1, 50.0, 10.0, 'chai' FROM ingredient_category WHERE name = 'Đồ Uống' AND restaurant_id = 103 LIMIT 1;
SET @ing_bia = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 103;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(307, @ing_bun), (307, @ing_chanuong),
(308, @ing_bun), (308, @ing_chanuong),
(309, @ing_cuabe),
(310, @ing_haisan),
(311, @ing_bia);


-- 104. Pizza 4P's - Lê Thánh Tôn
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Đế Bánh & Sốt', 104), ('Phô Mai & Topping', 104), ('Tráng Miệng', 104)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Đế bánh pizza tươi', id, 104, 1, 50.0, 10.0, 'cái' FROM ingredient_category WHERE name = 'Đế Bánh & Sốt' AND restaurant_id = 104 LIMIT 1;
SET @ing_depizza = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Phô mai 4 loại đặc chế', id, 104, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Phô Mai & Topping' AND restaurant_id = 104 LIMIT 1;
SET @ing_4cheese = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Phô mai Burrata tươi', id, 104, 1, 30.0, 5.0, 'quả' FROM ingredient_category WHERE name = 'Phô Mai & Topping' AND restaurant_id = 104 LIMIT 1;
SET @ing_burrata = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt cua bóc nõn', id, 104, 1, 15.0, 3.0, 'kg' FROM ingredient_category WHERE name = 'Phô Mai & Topping' AND restaurant_id = 104 LIMIT 1;
SET @ing_cuapizza = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Kem phô mai Mascarpone', id, 104, 1, 25.0, 5.0, 'hộp' FROM ingredient_category WHERE name = 'Tráng Miệng' AND restaurant_id = 104 LIMIT 1;
SET @ing_mascarpone = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 104;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(312, @ing_depizza), (312, @ing_4cheese),
(313, @ing_depizza), (313, @ing_burrata),
(314, @ing_cuapizza),
(315, @ing_burrata),
(316, @ing_mascarpone);


-- 105. Sushi Bar - Tôn Đức Thắng
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Hải Sản Tươi Sống', 105), ('Cơm & Mỳ Nhật', 105), ('Tráng Miệng', 105)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Cá hồi Nauy tươi', id, 105, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản Tươi Sống' AND restaurant_id = 105 LIMIT 1;
SET @ing_cahoi = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Cơm giấm sushi Nhật', id, 105, 1, 40.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Cơm & Mỳ Nhật' AND restaurant_id = 105 LIMIT 1;
SET @ing_comsushi = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Mỳ Udon tươi', id, 105, 1, 45.0, 10.0, 'gói' FROM ingredient_category WHERE name = 'Cơm & Mỳ Nhật' AND restaurant_id = 105 LIMIT 1;
SET @ing_udon = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Đậu nành Nhật non', id, 105, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản Tươi Sống' AND restaurant_id = 105 LIMIT 1;
SET @ing_edamame = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bột Matcha Uji Nhật', id, 105, 1, 15.0, 3.0, 'hộp' FROM ingredient_category WHERE name = 'Tráng Miệng' AND restaurant_id = 105 LIMIT 1;
SET @ing_matcha = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 105;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(317, @ing_cahoi),
(318, @ing_cahoi), (318, @ing_comsushi),
(319, @ing_udon),
(320, @ing_edamame),
(321, @ing_matcha);


-- 106. Bánh Mì Phượng Hội An
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Bánh Mì & Nhân Thịt', 106), ('Đồ Uống Giải Khát', 106)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Vỏ bánh mì giòn nóng', id, 106, 1, 80.0, 20.0, 'ổ' FROM ingredient_category WHERE name = 'Bánh Mì & Nhân Thịt' AND restaurant_id = 106 LIMIT 1;
SET @ing_vobanhmi = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Pate gan & Chả lụa', id, 106, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Bánh Mì & Nhân Thịt' AND restaurant_id = 106 LIMIT 1;
SET @ing_pate = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt gà xé sợi', id, 106, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Bánh Mì & Nhân Thịt' AND restaurant_id = 106 LIMIT 1;
SET @ing_gaxe = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt nướng sả Hội An', id, 106, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Bánh Mì & Nhân Thịt' AND restaurant_id = 106 LIMIT 1;
SET @ing_thitnuongsa = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bắp ngọt & Hạt sen', id, 106, 1, 15.0, 3.0, 'kg' FROM ingredient_category WHERE name = 'Đồ Uống Giải Khát' AND restaurant_id = 106 LIMIT 1;
SET @ing_bapsen = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Quả sấu ngâm đường', id, 106, 1, 20.0, 5.0, 'hũ' FROM ingredient_category WHERE name = 'Đồ Uống Giải Khát' AND restaurant_id = 106 LIMIT 1;
SET @ing_nuocsau = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 106;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(322, @ing_vobanhmi), (322, @ing_pate),
(323, @ing_vobanhmi), (323, @ing_gaxe),
(324, @ing_vobanhmi), (324, @ing_thitnuongsa),
(325, @ing_bapsen),
(326, @ing_nuocsau);


-- 107. Highlands Coffee - Nguyễn Huệ
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Hạt Cà Phê & Trà', 107), ('Bánh Ngọt & Mặn', 107)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Hạt cà phê Robusta rang mộc', id, 107, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hạt Cà Phê & Trà' AND restaurant_id = 107 LIMIT 1;
SET @ing_caphe = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Hạt sen tươi & Trà ô long', id, 107, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hạt Cà Phê & Trà' AND restaurant_id = 107 LIMIT 1;
SET @ing_trasen = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bột trà xanh Freeze', id, 107, 1, 20.0, 5.0, 'hộp' FROM ingredient_category WHERE name = 'Hạt Cà Phê & Trà' AND restaurant_id = 107 LIMIT 1;
SET @ing_freezetraxanh = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bánh mì que & Thịt nướng', id, 107, 1, 40.0, 10.0, 'phần' FROM ingredient_category WHERE name = 'Bánh Ngọt & Mặn' AND restaurant_id = 107 LIMIT 1;
SET @ing_banhmihighlands = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Đào miếng & Kem Mousse', id, 107, 1, 25.0, 5.0, 'hộp' FROM ingredient_category WHERE name = 'Bánh Ngọt & Mặn' AND restaurant_id = 107 LIMIT 1;
SET @ing_moussedao = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 107;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(327, @ing_caphe),
(328, @ing_trasen),
(329, @ing_freezetraxanh),
(330, @ing_banhmihighlands),
(331, @ing_moussedao);


-- 108. Dim Sum Tiến Phát - Điểm Tâm Hoa
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Vỏ Dimsum & Nhân Hải Sản', 108), ('Trà Hoa & Điểm Tâm', 108)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Tôm thẻ tươi bóc vỏ', id, 108, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Vỏ Dimsum & Nhân Hải Sản' AND restaurant_id = 108 LIMIT 1;
SET @ing_tomdimsum = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt heo xay & Nấm hương', id, 108, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Vỏ Dimsum & Nhân Hải Sản' AND restaurant_id = 108 LIMIT 1;
SET @ing_thitheodimsum = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Trứng muối Kim Sa', id, 108, 1, 50.0, 10.0, 'quả' FROM ingredient_category WHERE name = 'Vỏ Dimsum & Nhân Hải Sản' AND restaurant_id = 108 LIMIT 1;
SET @ing_trungmuoikimsa = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Chân gà rút xương tươi', id, 108, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Vỏ Dimsum & Nhân Hải Sản' AND restaurant_id = 108 LIMIT 1;
SET @ing_changa = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Hoa cúc sấy & Mật ong', id, 108, 1, 30.0, 5.0, 'hũ' FROM ingredient_category WHERE name = 'Trà Hoa & Điểm Tâm' AND restaurant_id = 108 LIMIT 1;
SET @ing_trahoacuc = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 108;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(332, @ing_tomdimsum),
(333, @ing_tomdimsum), (333, @ing_thitheodimsum),
(334, @ing_trungmuoikimsa),
(335, @ing_changa),
(336, @ing_trahoacuc);


-- 109. KFC Việt Nam - Bà Triệu
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt Gà Tươi', 109), ('Bột Chiên & Khoai Tây', 109), ('Đồ Uống', 109)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Gà tươi tẩm gia vị KFC', id, 109, 1, 50.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Gà Tươi' AND restaurant_id = 109 LIMIT 1;
SET @ing_gakfc = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Tôm tươi xay giòn', id, 109, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Gà Tươi' AND restaurant_id = 109 LIMIT 1;
SET @ing_tomkfc = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Khoai tây củ Bỉ thái sợi', id, 109, 1, 40.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Bột Chiên & Khoai Tây' AND restaurant_id = 109 LIMIT 1;
SET @ing_khoaitaykfc = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Siro Pepsi chính hãng', id, 109, 1, 50.0, 10.0, 'lít' FROM ingredient_category WHERE name = 'Đồ Uống' AND restaurant_id = 109 LIMIT 1;
SET @ing_pepsi = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 109;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(337, @ing_gakfc),
(338, @ing_gakfc),
(339, @ing_tomkfc),
(340, @ing_khoaitaykfc),
(341, @ing_pepsi);


-- 110. Lẩu Phan - Buffet Bò Mỹ
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt Bò Mỹ', 110), ('Hải Sản & Topping Lẩu', 110), ('Đồ Uống', 110)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Ba chỉ bò Mỹ đông lạnh', id, 110, 1, 60.0, 15.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò Mỹ' AND restaurant_id = 110 LIMIT 1;
SET @ing_bomy = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Mực & Tôm tươi nhúng lẩu', id, 110, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản & Topping Lẩu' AND restaurant_id = 110 LIMIT 1;
SET @ing_haisanlau = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Ngô ngọt tươi & Bơ tỏi', id, 110, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản & Topping Lẩu' AND restaurant_id = 110 LIMIT 1;
SET @ing_ngochien = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Coca Cola đóng chai', id, 110, 1, 80.0, 20.0, 'chai' FROM ingredient_category WHERE name = 'Đồ Uống' AND restaurant_id = 110 LIMIT 1;
SET @ing_cocacola = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 110;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(342, @ing_bomy),
(343, @ing_bomy), (343, @ing_haisanlau),
(344, @ing_bomy),
(345, @ing_ngochien),
(346, @ing_cocacola);


-- 111. El Gaucho Argentinian Steakhouse
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt Bò Thượng Hạng', 111), ('Hải Sản & Rau Củ', 111), ('Rượu Vang', 111)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thịt bò Black Angus Ribeye', id, 111, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò Thượng Hạng' AND restaurant_id = 111 LIMIT 1;
SET @ing_ribeye = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Thăn nội bò Filet Mignon', id, 111, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò Thượng Hạng' AND restaurant_id = 111 LIMIT 1;
SET @ing_filetmignon = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Phi lê cá hồi tươi Nauy', id, 111, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản & Rau Củ' AND restaurant_id = 111 LIMIT 1;
SET @ing_cahoisteak = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Rau Romaine & Sốt Caesar', id, 111, 1, 15.0, 3.0, 'kg' FROM ingredient_category WHERE name = 'Hải Sản & Rau Củ' AND restaurant_id = 111 LIMIT 1;
SET @ing_saladcaesar = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Vang đỏ Cabernet Sauvignon', id, 111, 1, 30.0, 5.0, 'chai' FROM ingredient_category WHERE name = 'Rượu Vang' AND restaurant_id = 111 LIMIT 1;
SET @ing_vangdo = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 111;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(347, @ing_ribeye),
(348, @ing_filetmignon),
(349, @ing_cahoisteak),
(350, @ing_saladcaesar),
(351, @ing_vangdo);


-- 152. Gà Rán Jollibee - Vincom Center
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Gà Tươi & Sốt', 152), ('Mỳ Ý & Bánh Ngọt', 152)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Đùi gà tươi tẩm ướp', id, 152, 1, 45.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Gà Tươi & Sốt' AND restaurant_id = 152 LIMIT 1;
SET @ing_gajollibee = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Mỳ sợi Ý & Thịt bò bằm', id, 152, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Mỳ Ý & Bánh Ngọt' AND restaurant_id = 152 LIMIT 1;
SET @ing_myyjollibee = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Khoai tây cọng & Bột phô mai', id, 152, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Gà Tươi & Sốt' AND restaurant_id = 152 LIMIT 1;
SET @ing_khoaijollibee = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Xoài đào tươi & Vỏ bánh pie', id, 152, 1, 15.0, 3.0, 'kg' FROM ingredient_category WHERE name = 'Mỳ Ý & Bánh Ngọt' AND restaurant_id = 152 LIMIT 1;
SET @ing_piexoai = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 152;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(352, @ing_gajollibee),
(452, @ing_gajollibee),
(453, @ing_myyjollibee),
(454, @ing_khoaijollibee),
(455, @ing_piexoai);


-- 202. The Coffee House - Cà Phê & Trà
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Cà Phê & Trà Đặc Sản', 202), ('Topping & Bánh Ngọt', 202)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Trà lài & Đào miếng đóng hộp', id, 202, 1, 35.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Cà Phê & Trà Đặc Sản' AND restaurant_id = 202 LIMIT 1;
SET @ing_tradaotch = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Hạt cà phê Arabica Cầu Đất', id, 202, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Cà Phê & Trà Đặc Sản' AND restaurant_id = 202 LIMIT 1;
SET @ing_caphetch = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Sữa hạt Mắc Ca & Trân châu', id, 202, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Topping & Bánh Ngọt' AND restaurant_id = 202 LIMIT 1;
SET @ing_suamaccatch = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bánh Mousse Tiramisu', id, 202, 1, 30.0, 5.0, 'phần' FROM ingredient_category WHERE name = 'Topping & Bánh Ngọt' AND restaurant_id = 202 LIMIT 1;
SET @ing_tiramisutch = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 202;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(456, @ing_tradaotch),
(457, @ing_caphetch),
(458, @ing_suamaccatch),
(459, @ing_tiramisutch);


-- 252. Trà Sữa Phê La - Đậm Vị Ô Long
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Trà Ô Long Đặc Sản', 252), ('Topping & Bánh Pháp', 252)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Lá trà Ô Long tươi Phê La', id, 252, 1, 40.0, 8.0, 'kg' FROM ingredient_category WHERE name = 'Trà Ô Long Đặc Sản' AND restaurant_id = 252 LIMIT 1;
SET @ing_olongphela = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Trân châu Ô Long tươi dẻo', id, 252, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Topping & Bánh Pháp' AND restaurant_id = 252 LIMIT 1;
SET @ing_tranchauolong = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Kem Cheese béo ngậy', id, 252, 1, 20.0, 5.0, 'lít' FROM ingredient_category WHERE name = 'Topping & Bánh Pháp' AND restaurant_id = 252 LIMIT 1;
SET @ing_kemcheese = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bột bánh Croissant nướng bơ', id, 252, 1, 25.0, 5.0, 'hộp' FROM ingredient_category WHERE name = 'Topping & Bánh Pháp' AND restaurant_id = 252 LIMIT 1;
SET @ing_croissant = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 252;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(502, @ing_olongphela), (502, @ing_tranchauolong),
(503, @ing_olongphela),
(504, @ing_olongphela), (504, @ing_kemcheese),
(505, @ing_croissant);


-- 253. Bún Bò Huế Ngự Uyển
INSERT INTO ingredient_category (name, restaurant_id) VALUES 
('Thịt Bò & Nước Dùng Huế', 253), ('Bún Sợi & Bánh Cố Đô', 253)
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bún sợi to xứ Huế', id, 253, 1, 50.0, 10.0, 'kg' FROM ingredient_category WHERE name = 'Bún Sợi & Bánh Cố Đô' AND restaurant_id = 253 LIMIT 1;
SET @ing_bunhue = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bắp bò hoa & Chả cua biển', id, 253, 1, 30.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò & Nước Dùng Huế' AND restaurant_id = 253 LIMIT 1;
SET @ing_bapbohue = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Nạm bò & Giò heo tươi', id, 253, 1, 25.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Thịt Bò & Nước Dùng Huế' AND restaurant_id = 253 LIMIT 1;
SET @ing_nambo = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Bột lọc & Tôm đất sông Hương', id, 253, 1, 20.0, 5.0, 'kg' FROM ingredient_category WHERE name = 'Bún Sợi & Bánh Cố Đô' AND restaurant_id = 253 LIMIT 1;
SET @ing_botlochue = LAST_INSERT_ID();

INSERT INTO ingredients_item (name, category_id, restaurant_id, in_stock, quantity, min_threshold, unit)
SELECT 'Trà thảo mộc Cung Đình Huế', id, 253, 1, 40.0, 8.0, 'gói' FROM ingredient_category WHERE name = 'Bún Sợi & Bánh Cố Đô' AND restaurant_id = 253 LIMIT 1;
SET @ing_tracungdinh = LAST_INSERT_ID();

DELETE fi FROM food_ingredients fi JOIN food f ON fi.food_id = f.id WHERE f.restaurant_id = 253;
INSERT INTO food_ingredients (food_id, ingredients_id) VALUES 
(506, @ing_bunhue), (506, @ing_bapbohue),
(507, @ing_bunhue), (507, @ing_nambo),
(508, @ing_botlochue),
(509, @ing_tracungdinh);
