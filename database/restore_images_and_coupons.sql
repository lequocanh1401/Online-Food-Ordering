-- Snapshot anh nha hang, anh mon an va ma giam gia da chinh sua thu cong (MySQL anh_food_yt)
USE anh_food_yt;

-- 1. Khoi phuc anh cho 15 nha hang
-- Tiệm Cơm Tấm Sài Gòn - Đặc Biệt
DELETE FROM restaurant_images WHERE restaurant_id = 1;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (1, 'https://topquangbinh.vn/wp-content/uploads/2021/12/244453982_596856808394695_5035792605248304808_n-min-1024x1024.jpg');
-- Phở Gia Truyền Bát Đàn
DELETE FROM restaurant_images WHERE restaurant_id = 102;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (102, 'https://danielfooddiary.com/wp-content/uploads/2025/12/phogiatruyen11.jpg');
-- Bún Chả Hương Liên (Obama)
DELETE FROM restaurant_images WHERE restaurant_id = 103;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (103, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD3gp0oZbGTw5L6_DGZFL2S6FqryPpcoOOVFjgpd3tDb5YLQg58NBu4kY&s=10');
-- Pizza 4P's - Lê Thánh Tôn
DELETE FROM restaurant_images WHERE restaurant_id = 104;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (104, 'https://static.kienviet.net/storage/uploads/2023/11/kienviet-pizza-4ps-1-1699925599.jpg');
-- Sushi Bar - Tôn Đức Thắng
DELETE FROM restaurant_images WHERE restaurant_id = 105;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (105, 'https://noithatkendesign.vn/storage/app/media/uploaded-files/thiet-ke-sushi-bar-5.jpg');
-- Bánh Mì Phượng Hội An
DELETE FROM restaurant_images WHERE restaurant_id = 106;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (106, 'https://vnn-imgs-f.vgcloud.vn/2022/01/10/20/sau-lum-xum-bi-keu-goi-tay-chay-banh-mi-phuong-van-phi-may-bay-ra-ha-noi-gia-60-ngan-o-cung-chay-hang.jpg?width=0&s=0QZUZV0SMlPZ08HesFN_Gg');
-- Highlands Coffee - Nguyễn Huệ
DELETE FROM restaurant_images WHERE restaurant_id = 107;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (107, 'https://www.highlandscoffee.com.vn/vnt_upload/home/web_banner_2000x2000.jpg');
-- Dim Sum Tiến Phát - Điểm Tâm Hoa
DELETE FROM restaurant_images WHERE restaurant_id = 108;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (108, 'https://img.mservice.com.vn/common/u/2e02fb5fe4f64fb55bc713540643c6f8eae702d101cea8c59afc49cfc505fc37/9d2ddbfc-4462-459f-a264-b3edb0d599b8e_938rg5.jpeg');
-- KFC Việt Nam - Bà Triệu
DELETE FROM restaurant_images WHERE restaurant_id = 109;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (109, 'https://vcdn1-kinhdoanh.vnecdn.net/2024/11/23/img-3682-jpeg-1732344951-5061-1732345066.jpg?w=1200&h=675&q=100&dpr=1&fit=crop&s=4e4ZQbJdIKfZt6Xjny43BA');
-- Lẩu Phan - Buffet Bò Mỹ
DELETE FROM restaurant_images WHERE restaurant_id = 110;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (110, 'https://cdn.lauphan.com/photo-storage/myFile-1666063686979.jpeg');
-- El Gaucho Argentinian Steakhouse
DELETE FROM restaurant_images WHERE restaurant_id = 111;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (111, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200&auto=format&fit=crop');
-- Gà Rán Jollibee - Vincom Center
DELETE FROM restaurant_images WHERE restaurant_id = 152;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (152, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=1200&auto=format&fit=crop');
-- The Coffee House - Cà Phê & Trà
DELETE FROM restaurant_images WHERE restaurant_id = 202;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (202, 'https://cafefcdn.com/thumb_w/640/203337114487263232/2025/2/21/avatar1740096715584-17400967157451708166300.jpg');
-- Trà Sữa Phê La - Đậm Vị Ô Long
DELETE FROM restaurant_images WHERE restaurant_id = 252;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (252, 'https://phela.vn/wp-content/uploads/2025/04/Update-web.jpg');
-- Bún Bò Huế Ngự Uyển
DELETE FROM restaurant_images WHERE restaurant_id = 253;
INSERT INTO restaurant_images (restaurant_id, images) VALUES (253, 'https://bloganchoi.com/wp-content/uploads/2024/07/quan-bun-bo-hue-ha-noi-ngu-uyen.jpg');

-- 2. Khoi phuc anh cho 77 mon an
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Cơm Sườn Bì Chả
DELETE FROM food_images WHERE food_id = 1;
INSERT INTO food_images (food_id, images) VALUES (1, 'http://localhost:5173/images/com_tam_suon_bi_cha.jpg');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Cơm Sườn Cây Nướng Mật Ong
DELETE FROM food_images WHERE food_id = 402;
INSERT INTO food_images (food_id, images) VALUES (402, 'http://localhost:5173/images/com_suon_cay_nuong.jpg');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Cơm Tấm Ba Rọi Nướng Giòn
DELETE FROM food_images WHERE food_id = 403;
INSERT INTO food_images (food_id, images) VALUES (403, 'http://localhost:5173/images/com_tam_ba_roi_nuong.jpg');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Chả Trứng Cua Hấp
DELETE FROM food_images WHERE food_id = 404;
INSERT INTO food_images (food_id, images) VALUES (404, 'http://localhost:5173/images/cha_trung_hap.jpg');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Trứng Ốp La Lòng Đào
DELETE FROM food_images WHERE food_id = 405;
INSERT INTO food_images (food_id, images) VALUES (405, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Đùi Gà Nướng Mật Ong
DELETE FROM food_images WHERE food_id = 406;
INSERT INTO food_images (food_id, images) VALUES (406, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Canh Khổ Qua Dồn Thịt
DELETE FROM food_images WHERE food_id = 407;
INSERT INTO food_images (food_id, images) VALUES (407, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwpid5NbmkvmgoQEmIri2U6nJHrEaQQPJLLFytYQqjnqlrbjknWDg9tuE&s=10');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Canh Cải Chua Nấu Sườn
DELETE FROM food_images WHERE food_id = 408;
INSERT INTO food_images (food_id, images) VALUES (408, 'http://localhost:5173/images/canh_cai_chua_suon.jpg');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Trà Đá Đường Phèn
DELETE FROM food_images WHERE food_id = 409;
INSERT INTO food_images (food_id, images) VALUES (409, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop');
-- [Tiệm Cơm Tấm Sài Gòn - Đặc Biệt] Nước Mía Tươi Tắc
DELETE FROM food_images WHERE food_id = 410;
INSERT INTO food_images (food_id, images) VALUES (410, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&auto=format&fit=crop');
-- [Phở Gia Truyền Bát Đàn] Phở Bò Tái
DELETE FROM food_images WHERE food_id = 302;
INSERT INTO food_images (food_id, images) VALUES (302, 'http://localhost:5173/images/pho_bo_bat_dan.jpg');
-- [Phở Gia Truyền Bát Đàn] Phở Bò Chín
DELETE FROM food_images WHERE food_id = 303;
INSERT INTO food_images (food_id, images) VALUES (303, 'https://fohlafood.vn/cdn/shop/articles/bi-quyet-nau-phi-bo-ngon-tuyet-dinh.jpg?v=1712213789');
-- [Phở Gia Truyền Bát Đàn] Phở Tái Nạm Gầu
DELETE FROM food_images WHERE food_id = 304;
INSERT INTO food_images (food_id, images) VALUES (304, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWxCckcU2Q07fv9S8GvMW1zU41yNi_Tk-iAvpBbTQbfQsyRwRwjd084ttW&s=10');
-- [Phở Gia Truyền Bát Đàn] Quẩy Nóng
DELETE FROM food_images WHERE food_id = 305;
INSERT INTO food_images (food_id, images) VALUES (305, 'http://localhost:5173/images/quay_nong.jpg');
-- [Phở Gia Truyền Bát Đàn] Trà Đá
DELETE FROM food_images WHERE food_id = 306;
INSERT INTO food_images (food_id, images) VALUES (306, 'https://media.phunutoday.vn/files/news/2026/06/22/uong-tra-da-phai-chu-y-dieu-nay-de-an-toan-5-sai-lam-nhieu-nguoi-mac-moi-ngay-050113.jpg');
-- [Bún Chả Hương Liên (Obama)] Combo Obama
DELETE FROM food_images WHERE food_id = 307;
INSERT INTO food_images (food_id, images) VALUES (307, 'http://localhost:5173/images/bun_cha_hanoi.jpg');
-- [Bún Chả Hương Liên (Obama)] Bún Chả Truyền Thống
DELETE FROM food_images WHERE food_id = 308;
INSERT INTO food_images (food_id, images) VALUES (308, 'https://cdn.realtech.com.vn/uploads/gostay/news/327/bun-cha-ha-noi.jpg');
-- [Bún Chả Hương Liên (Obama)] Nem Cua Bể
DELETE FROM food_images WHERE food_id = 309;
INSERT INTO food_images (food_id, images) VALUES (309, 'http://localhost:5173/images/nem_cua_be.jpg');
-- [Bún Chả Hương Liên (Obama)] Nem Hải Sản
DELETE FROM food_images WHERE food_id = 310;
INSERT INTO food_images (food_id, images) VALUES (310, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhI-GoYwiA6mY1l7lHQeX-ovH26wQJkcsQ32Fjr_zwRLzsRWnGtA1Yro1d&s=10');
-- [Bún Chả Hương Liên (Obama)] Bia Hà Nội
DELETE FROM food_images WHERE food_id = 311;
INSERT INTO food_images (food_id, images) VALUES (311, 'https://biahanoi.muabianhanh.com/wp-content/uploads/2023/03/2-1.png');
-- [Pizza 4P's - Lê Thánh Tôn] Pizza 4 Cheeses
DELETE FROM food_images WHERE food_id = 312;
INSERT INTO food_images (food_id, images) VALUES (312, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop');
-- [Pizza 4P's - Lê Thánh Tôn] Pizza Burrata Parma Ham
DELETE FROM food_images WHERE food_id = 313;
INSERT INTO food_images (food_id, images) VALUES (313, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop');
-- [Pizza 4P's - Lê Thánh Tôn] Mỳ Ý Sốt Kem Cua
DELETE FROM food_images WHERE food_id = 314;
INSERT INTO food_images (food_id, images) VALUES (314, 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/1_07a19cb704.png');
-- [Pizza 4P's - Lê Thánh Tôn] Salad Phô Mai Burrata
DELETE FROM food_images WHERE food_id = 315;
INSERT INTO food_images (food_id, images) VALUES (315, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop');
-- [Pizza 4P's - Lê Thánh Tôn] Bánh Tiramisu
DELETE FROM food_images WHERE food_id = 316;
INSERT INTO food_images (food_id, images) VALUES (316, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop');
-- [Sushi Bar - Tôn Đức Thắng] Sashimi Cá Hồi
DELETE FROM food_images WHERE food_id = 317;
INSERT INTO food_images (food_id, images) VALUES (317, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop');
-- [Sushi Bar - Tôn Đức Thắng] Sushi Rồng (Dragon Roll)
DELETE FROM food_images WHERE food_id = 318;
INSERT INTO food_images (food_id, images) VALUES (318, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop');
-- [Sushi Bar - Tôn Đức Thắng] Mỳ Tempura Udon
DELETE FROM food_images WHERE food_id = 319;
INSERT INTO food_images (food_id, images) VALUES (319, 'https://cdn.tgdd.vn/2020/10/content/r-800x503.jpg');
-- [Sushi Bar - Tôn Đức Thắng] Đậu Nành Nhật (Edamame)
DELETE FROM food_images WHERE food_id = 320;
INSERT INTO food_images (food_id, images) VALUES (320, 'https://nguyenhafood.vn/uploads/files/R2958-final-photo-.png');
-- [Sushi Bar - Tôn Đức Thắng] Kem Trà Xanh Matcha
DELETE FROM food_images WHERE food_id = 321;
INSERT INTO food_images (food_id, images) VALUES (321, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGeo86bn9u3Q_NYA9pj8G3xpsTAV-vx6fCnVuWv8aJYeFrsKyLdYAx6hXV&s=10');
-- [Bánh Mì Phượng Hội An] Bánh Mì Thập Cẩm
DELETE FROM food_images WHERE food_id = 322;
INSERT INTO food_images (food_id, images) VALUES (322, 'http://localhost:5173/images/banh_mi_thap_cam.jpg');
-- [Bánh Mì Phượng Hội An] Bánh Mì Gà Xé Bơ
DELETE FROM food_images WHERE food_id = 323;
INSERT INTO food_images (food_id, images) VALUES (323, 'https://xebanhmithonhiky.com.vn/wp-content/uploads/2019/07/banh-mi-ga-xe-sot-bo-ngon-kho-cuong.jpg');
-- [Bánh Mì Phượng Hội An] Bánh Mì Thịt Nướng Sả
DELETE FROM food_images WHERE food_id = 324;
INSERT INTO food_images (food_id, images) VALUES (324, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpaF3-6_U2ftXdBLX71btbqcCRy5ZbTgdXMZi12aTyR0VOT4o3rSUjdgE&s=10');
-- [Bánh Mì Phượng Hội An] Sữa Bắp Hạt Sen
DELETE FROM food_images WHERE food_id = 325;
INSERT INTO food_images (food_id, images) VALUES (325, 'https://bizweb.dktcdn.net/100/603/550/articles/sua-ngo-hat-sen-0.jpg?v=1779101585810');
-- [Bánh Mì Phượng Hội An] Nước Sấu Đá
DELETE FROM food_images WHERE food_id = 326;
INSERT INTO food_images (food_id, images) VALUES (326, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFrRk2ssezmvb0SkutlpO2H9Vkzm4DY2aPOJPE7bnxPei0mr1mo_kSL5M&s=10');
-- [Highlands Coffee - Nguyễn Huệ] Phin Sữa Đá Lớn
DELETE FROM food_images WHERE food_id = 327;
INSERT INTO food_images (food_id, images) VALUES (327, 'http://localhost:5173/images/ca_phe_sua_da.jpg');
-- [Highlands Coffee - Nguyễn Huệ] Trà Sen Vàng
DELETE FROM food_images WHERE food_id = 328;
INSERT INTO food_images (food_id, images) VALUES (328, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop');
-- [Highlands Coffee - Nguyễn Huệ] Freeze Trà Xanh
DELETE FROM food_images WHERE food_id = 329;
INSERT INTO food_images (food_id, images) VALUES (329, 'https://voucherhighlands.com/wp-content/uploads/2026/04/anh-chup-freeze-tra-xanh.jpg');
-- [Highlands Coffee - Nguyễn Huệ] Bánh Mì Thịt Nướng
DELETE FROM food_images WHERE food_id = 330;
INSERT INTO food_images (food_id, images) VALUES (330, 'https://www.huongnghiepaau.com/wp-content/uploads/2025/07/cach-ban-banh-mi-thit-nuong-dat-hang.jpg');
-- [Highlands Coffee - Nguyễn Huệ] Bánh Mousse Đào
DELETE FROM food_images WHERE food_id = 331;
INSERT INTO food_images (food_id, images) VALUES (331, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop');
-- [Dim Sum Tiến Phát - Điểm Tâm Hoa] Há Cảo Tôm
DELETE FROM food_images WHERE food_id = 332;
INSERT INTO food_images (food_id, images) VALUES (332, 'http://localhost:5173/images/dimsum_hacao.jpg');
-- [Dim Sum Tiến Phát - Điểm Tâm Hoa] Xíu Mại Tôm Thịt
DELETE FROM food_images WHERE food_id = 333;
INSERT INTO food_images (food_id, images) VALUES (333, 'https://dimsumgiabao.com/wp-content/uploads/2024/01/xiu-mai-tom-thit.jpg');
-- [Dim Sum Tiến Phát - Điểm Tâm Hoa] Bánh Bao Kim Sa
DELETE FROM food_images WHERE food_id = 334;
INSERT INTO food_images (food_id, images) VALUES (334, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop');
-- [Dim Sum Tiến Phát - Điểm Tâm Hoa] Chân Gà Hấp Tàu Xì
DELETE FROM food_images WHERE food_id = 335;
INSERT INTO food_images (food_id, images) VALUES (335, 'https://cdn.tgdd.vn/2020/07/CookRecipe/Avatar/chan-ga-tau-xi-thumbnail.jpg');
-- [Dim Sum Tiến Phát - Điểm Tâm Hoa] Trà Hoa Cúc Mật Ong
DELETE FROM food_images WHERE food_id = 336;
INSERT INTO food_images (food_id, images) VALUES (336, 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&auto=format&fit=crop');
-- [KFC Việt Nam - Bà Triệu] Combo Gà Giòn Cay
DELETE FROM food_images WHERE food_id = 337;
INSERT INTO food_images (food_id, images) VALUES (337, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&auto=format&fit=crop');
-- [KFC Việt Nam - Bà Triệu] Gà Popcorn Lớn
DELETE FROM food_images WHERE food_id = 338;
INSERT INTO food_images (food_id, images) VALUES (338, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&auto=format&fit=crop');
-- [KFC Việt Nam - Bà Triệu] Burger Tôm
DELETE FROM food_images WHERE food_id = 339;
INSERT INTO food_images (food_id, images) VALUES (339, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop');
-- [KFC Việt Nam - Bà Triệu] Khoai Tây Chiên Lớn
DELETE FROM food_images WHERE food_id = 340;
INSERT INTO food_images (food_id, images) VALUES (340, 'https://vietquangcao.org/wp-content/uploads/2023/10/nhung-chien-dich-quang-cao-doc-la-vang-doi-cua-kfc-1.jpg');
-- [KFC Việt Nam - Bà Triệu] Pepsi Ly Lớn
DELETE FROM food_images WHERE food_id = 341;
INSERT INTO food_images (food_id, images) VALUES (341, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuC2EBMVwNc0muCE5xRmJrnNuWwVHthOuH33M3KmWjHcAiuSfgMzzge_gP&s=10');
-- [Lẩu Phan - Buffet Bò Mỹ] Buffet Lẩu Bò 139k
DELETE FROM food_images WHERE food_id = 342;
INSERT INTO food_images (food_id, images) VALUES (342, 'https://pasgo.vn/Upload/anh-chi-tiet/hotpot-constructon-buffet-lau-nuong-bo-canada-ha-dong-1-normal-655061433815.webp');
-- [Lẩu Phan - Buffet Bò Mỹ] Buffet Lẩu Hải Sản 199k
DELETE FROM food_images WHERE food_id = 343;
INSERT INTO food_images (food_id, images) VALUES (343, 'https://statics.vinpearl.com/buffet-hai-san-ha-noi-1_1698585816.jpg');
-- [Lẩu Phan - Buffet Bò Mỹ] Đĩa Ba Chỉ Bò Mỹ Thêm
DELETE FROM food_images WHERE food_id = 344;
INSERT INTO food_images (food_id, images) VALUES (344, 'https://dochienxienque.com/wp-content/uploads/2021/02/ba-chi-bo-my.jpg');
-- [Lẩu Phan - Buffet Bò Mỹ] Ngô Chiên Bơ Tỏi
DELETE FROM food_images WHERE food_id = 345;
INSERT INTO food_images (food_id, images) VALUES (345, 'https://i-giadinh.vnecdn.net/2023/02/04/Thanh-pham-1-1-2273-1675483496.jpg');
-- [Lẩu Phan - Buffet Bò Mỹ] Coca Cola Chai
DELETE FROM food_images WHERE food_id = 346;
INSERT INTO food_images (food_id, images) VALUES (346, 'https://storage.googleapis.com/teko-gae.appspot.com/media/image/2023/5/11/ec4502ca-a89d-4c58-91b7-f1cc9a638fa5/Sang%20khoai%20va%20ua%20chuong.png');
-- [El Gaucho Argentinian Steakhouse] Ribeye Steak 250g
DELETE FROM food_images WHERE food_id = 347;
INSERT INTO food_images (food_id, images) VALUES (347, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy6NJONA5-2IQEPBErqVN8Lz7g2yFaevyd_Pd5QBu-sK4xonI7mL2cTcuC&s=10');
-- [El Gaucho Argentinian Steakhouse] Filet Mignon 200g
DELETE FROM food_images WHERE food_id = 348;
INSERT INTO food_images (food_id, images) VALUES (348, 'https://www.baronycountryfoods.co.uk/wp-content/uploads/2021/03/Barony-Country-Foods-Beef-21-2.jpg');
-- [El Gaucho Argentinian Steakhouse] Cá Hồi Nướng Than
DELETE FROM food_images WHERE food_id = 349;
INSERT INTO food_images (food_id, images) VALUES (349, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop');
-- [El Gaucho Argentinian Steakhouse] Caesar Salad Classic
DELETE FROM food_images WHERE food_id = 350;
INSERT INTO food_images (food_id, images) VALUES (350, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop');
-- [El Gaucho Argentinian Steakhouse] Ly Vang Đỏ Cabernet
DELETE FROM food_images WHERE food_id = 351;
INSERT INTO food_images (food_id, images) VALUES (351, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop');
-- [Gà Rán Jollibee - Vincom Center] Cơm Gà Giòn Sốt Tiêu Jollibee
DELETE FROM food_images WHERE food_id = 352;
INSERT INTO food_images (food_id, images) VALUES (352, 'https://jollibee.com.vn/media/catalog/product/cache/11f3e6435b23ab624dc55c2d3fe9479d/g/_/g_gi_n_vui_v_-_4.png');
-- [Gà Rán Jollibee - Vincom Center] Combo 2 Miếng Gà Giòn Vui Vẻ
DELETE FROM food_images WHERE food_id = 452;
INSERT INTO food_images (food_id, images) VALUES (452, 'https://jollibee.com.vn/media/catalog/product/cache/9011257231b13517d19d9bae81fd87cc/6/6/66k_-_2_cjoy.png');
-- [Gà Rán Jollibee - Vincom Center] Mỳ Ý Sốt Bò Bằm Jollibee
DELETE FROM food_images WHERE food_id = 453;
INSERT INTO food_images (food_id, images) VALUES (453, 'https://jollibee.com.vn/media/catalog/product/cache/11f3e6435b23ab624dc55c2d3fe9479d/1/2/1200x1200px_r2-compressed.jpg');
-- [Gà Rán Jollibee - Vincom Center] Khoai Tây Lắc Phô Mai
DELETE FROM food_images WHERE food_id = 454;
INSERT INTO food_images (food_id, images) VALUES (454, 'https://cdn.bcbshop.vn/products/1785385395442-fiiyq1yr2t.webp');
-- [Gà Rán Jollibee - Vincom Center] Bánh Pie Xoài Đào Giòn Rụm
DELETE FROM food_images WHERE food_id = 455;
INSERT INTO food_images (food_id, images) VALUES (455, 'https://cdn2.fptshop.com.vn/unsafe/800x0/cach_lam_banh_xoai_dao_jollibee_1_4c50e51614.jpg');
-- [The Coffee House - Cà Phê & Trà] Trà Đào Cam Sả Trứ Danh
DELETE FROM food_images WHERE food_id = 456;
INSERT INTO food_images (food_id, images) VALUES (456, 'http://localhost:5173/images/tra_dao_cam_sa.jpg');
-- [The Coffee House - Cà Phê & Trà] Cà Phê Sữa Đá Đậm Đà
DELETE FROM food_images WHERE food_id = 457;
INSERT INTO food_images (food_id, images) VALUES (457, 'https://product.hstatic.net/200000745755/product/4_ccceb5085680488b824d1e1308b49921_master.jpg');
-- [The Coffee House - Cà Phê & Trà] Trà Sữa Mắc Ca Trân Châu Trắng
DELETE FROM food_images WHERE food_id = 458;
INSERT INTO food_images (food_id, images) VALUES (458, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSfnp-aB38-PAEAwooo2kZqowpFDAlSa_C1bTTT4IrbDbDTWPmexrAqDdH&s=10');
-- [The Coffee House - Cà Phê & Trà] Bánh Mousse Tiramisu Cacao
DELETE FROM food_images WHERE food_id = 459;
INSERT INTO food_images (food_id, images) VALUES (459, 'https://r2.cms.4handy.vn/banh-tiramisu-cacao.jpg');
-- [Trà Sữa Phê La - Đậm Vị Ô Long] Ô Long Sữa Phê La Trân Châu
DELETE FROM food_images WHERE food_id = 502;
INSERT INTO food_images (food_id, images) VALUES (502, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGBv6gKBLn0X5STo1_he2aevLilhMe4DDXF-F1j30LRrx2pgjk45BRtn4&s=10');
-- [Trà Sữa Phê La - Đậm Vị Ô Long] Gấm Ô Long Nhiệt Đới
DELETE FROM food_images WHERE food_id = 503;
INSERT INTO food_images (food_id, images) VALUES (503, 'https://hunufa.vn/wp-content/uploads/2024/11/menu-phe-la-2.webp');
-- [Trà Sữa Phê La - Đậm Vị Ô Long] Khói B'lao Kem Cheese
DELETE FROM food_images WHERE food_id = 504;
INSERT INTO food_images (food_id, images) VALUES (504, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBBxu6NPhVq98ValM9GhXGN2n0GTsgAZESaPBEMpjimRm45DMmXYBPfnZq&s=10');
-- [Trà Sữa Phê La - Đậm Vị Ô Long] Bánh Croissant Nướng Bơ Pháp
DELETE FROM food_images WHERE food_id = 505;
INSERT INTO food_images (food_id, images) VALUES (505, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop');
-- [Bún Bò Huế Ngự Uyển] Bún Bò Huế Đặc Biệt Bắp Bò Chả Cua
DELETE FROM food_images WHERE food_id = 506;
INSERT INTO food_images (food_id, images) VALUES (506, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIOWT2ml4kMGj-VsERHBfSDHlhS0uhmQi6HMzQIuvFmcUxq6lKepFgOw_o&s=10');
-- [Bún Bò Huế Ngự Uyển] Bún Bò Nạm Giò Heo
DELETE FROM food_images WHERE food_id = 507;
INSERT INTO food_images (food_id, images) VALUES (507, 'https://kinhdoamthuc.com/wp-content/uploads/2023/07/cach-nau-bun-bo-gio-heo-ngon-nhat.jpg');
-- [Bún Bò Huế Ngự Uyển] Bánh Bột Lọc Tôm Thịt Cố Đô
DELETE FROM food_images WHERE food_id = 508;
INSERT INTO food_images (food_id, images) VALUES (508, 'http://localhost:5173/images/banh_bot_loc.jpg');
-- [Bún Bò Huế Ngự Uyển] Trà Cung Đình Huế Mát Lạnh
DELETE FROM food_images WHERE food_id = 509;
INSERT INTO food_images (food_id, images) VALUES (509, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq37uLSfGnIaYAdxKV0BsFayOG_lERf5R59Op3IS-6ow&s=10');

-- 3. Dong bo 8 ma giam gia (4 toan san + 4 nha hang)
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (202, b'1', 'GIAM10%', 'PERCENTAGE', 10, NULL, NULL) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (203, b'1', 'GIAM20K', 'FLAT', 20000, NULL, NULL) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (252, b'1', 'GIAM20%', 'PERCENTAGE', 20, NULL, 100000) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (253, b'1', 'GIAM30K', 'FLAT', 30000, NULL, 150000) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (302, b'1', 'COMTAM15', 'PERCENTAGE', 15, 1, 0) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (352, b'1', 'PHOBATDAN15K', 'FLAT', 15000, 102, 50000) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (353, b'1', 'PIZZA4PS20', 'PERCENTAGE', 20, 104, 200000) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
INSERT INTO coupon (id, active, code, discount_type, discount_value, restaurant_id, minimum_order_value) VALUES (354, b'1', 'JOLLIBEE25K', 'FLAT', 25000, 152, 80000) ON DUPLICATE KEY UPDATE active=VALUES(active), discount_type=VALUES(discount_type), discount_value=VALUES(discount_value), restaurant_id=VALUES(restaurant_id), minimum_order_value=VALUES(minimum_order_value);
