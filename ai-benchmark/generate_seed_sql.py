# -*- coding: utf-8 -*-
"""
Script Sinh 918 Món Ăn Mới Tạo File SQL để đạt mốc 1.000 Món Ăn
- Giữ nguyên 100% 82 món ăn hiện có và Quán #1 (Tiệm Cơm Tấm Sài Gòn)
- Bổ sung 918 món ăn đa dạng thuộc 15 nhà hàng đối tác hiện có
- Xuất file seed_1000_foods.sql và chạy nạp vào MySQL
"""

import os
import random

FOOD_TEMPLATES = [
    # Phở & Món Nước
    ("Phở Gầu Bò Giòn", 65000, "Thịt gầu bò giòn sần sật béo ngậy ninh cùng nước dùng thanh ngọt", 0, 302, 102, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Phở Nạm Bò Hoa Mai", 65000, "Nạm bò mềm thơm béo ngậy thái mỏng chuẩn vị phố cổ", 0, 302, 102, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Phở Gà Ta Chặt Miếng", 60000, "Gà ta thả vườn da vàng óng thịt dai ngọt thơm mùi lá chanh", 0, 302, 102, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Phở Gà Đùi Xé Lá Chanh", 65000, "Thịt đùi gà rút xương ngọt mềm nước dùng trong veo thơm lừng", 0, 302, 102, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Phở Trộn Gà Xé Cay Nồng", 60000, "Sợi phở trộn sốt chua ngọt, gà xé tay, lạc rang giòn và rau thơm", 0, 302, 102, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"),
    ("Phở Trộn Bò Tái Lăn", 70000, "Thịt bò tái lăn xào tỏi thơm nức mũi trộn sốt chua ngọt đậm đà", 0, 302, 102, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"),
    ("Bún Chả Nem Cua Bể Đặc Biệt", 75000, "Suất bún chả nướng than hoa ăn kèm 2 chiếc nem cua bể giòn rụm", 0, 306, 103, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),
    ("Bún Nem Rán Truyền Thống", 55000, "Nem rán vỏ giòn rụm nhân thịt mộc nhĩ nấm hương bùi béo", 0, 307, 103, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),
    ("Bún Chả Miếng Nướng Than Hoa", 60000, "Thịt ba chỉ thái mỏng ướp mắm tiêu hành khô nướng than hoa", 0, 306, 103, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),
    ("Bún Chả Viên Nướng Lá Lốt", 60000, "Chả viên bọc lá lốt nướng xém cạnh dậy mùi thơm thảo mộc", 0, 306, 103, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),

    # Pizza & Ý
    ("Pizza Hải Sản Sốt Pesto", 240000, "Tôm, mực tươi, phô mai mozzarella rưới sốt lá húng tây bùi béo", 0, 309, 104, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
    ("Pizza Bò Băm Nấm Truffle", 260000, "Thịt bò băm hảo hạng nấm hương quyện sốt nấm Truffle đen thượng hạng", 0, 309, 104, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
    ("Pizza Xúc Xích Cay Pepperoni", 195000, "Xúc xích bò cay Pepperoni nướng giòn viền phô mai béo ngậy", 0, 309, 104, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
    ("Pizza Gà Nướng Sốt BBQ", 185000, "Thịt gà ướp sốt BBQ hun khói, ớt chuông ngọt, hành tây và phô mai", 0, 309, 104, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
    ("Pizza Rau Củ Phô Mai Feta", 165000, "Ớt chuông, nấm đùi gà, cà chua bi, ô liu đen và phô mai Feta Hy Lạp", 1, 309, 104, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"),
    ("Mì Ý Carbonara Kem Thịt Xông Khói", 145000, "Sợi mì Spaghetti quyện lòng đỏ trứng gà, phô mai parmesan và ba chỉ xông khói", 0, 310, 104, "https://images.unsplash.com/photo-1621996346565-e3d5d6281788?w=500"),
    ("Mì Ý Hải Sản Sốt Cà Chua Tươi", 165000, "Tôm sú, mực ống, nghêu xào tỏi sốt cà chua Marinara thơm nồng", 0, 310, 104, "https://images.unsplash.com/photo-1621996346565-e3d5d6281788?w=500"),
    ("Salad Ức Gà Nướng Sốt Mè Rang", 125000, "Ức gà nướng thảo mộc, xà lách giòn, cà chua bi và sốt mè rang bùi béo", 0, 311, 104, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500"),
    ("Bánh Panna Cotta Dâu Rừng", 65000, "Panna cotta mềm mượt núng nính phủ sốt dâu rừng chua ngọt giải ngấy", 0, 312, 104, "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500"),

    # Sushi & Nhật
    ("Sashimi Cá Trích Ép Trứng", 130000, "Miếng cá trích ép trứng vàng giòn sần sật vị chua thanh tươi mát", 0, 313, 105, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
    ("Sashimi Sò Đỏ Nhật Bản", 160000, "Sò đỏ tươi giòn ngọt đậm đà chấm mù tạt wasabi cay nồng xộc mũi", 0, 313, 105, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
    ("Nigiri Bò Wagyu Khò Lửa", 95000, "Cơm nắm dẻo phủ thịt bò Wagyu khò tái thơm nức mỡ béo tan chảy", 0, 314, 105, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
    ("Cơm Lươn Nhật Nướng Unadon", 185000, "Lươn nướng sốt Kabayaki bóng bẩy thơm ngọt đậm đà trên bát cơm nóng", 0, 314, 105, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500"),
    ("Ramen Xương Hầm Tonkotsu", 135000, "Nước dùng hầm xương heo 18 tiếng sánh béo ngậy kèm thịt xá xíu Chashu", 0, 315, 105, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"),
    ("Ramen Miso Cay Nhật Bản", 135000, "Tương miso lên men kết hợp dầu ớt cay nồng trứng lòng đào ngâm tương", 0, 315, 105, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500"),

    # Bánh Mì & Cà Phê
    ("Bánh Mì Heo Quay Giòn Bì", 35000, "Thịt heo quay da nổ giòn tan ăn kèm dưa leo rau răm và sốt mắm ớt", 0, 318, 106, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"),
    ("Bánh Mì Xíu Mại Sốt Trứng Muối", 35000, "Viên xíu mại mềm thơm đẫm sốt cà chua trứng muối béo bùi ngậy", 0, 318, 106, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"),
    ("Bánh Mì Trứng Ốp La Ba Chỉ", 28000, "Trứng ốp la lòng đào chiên bơ tỏi kẹp thịt ba chỉ xông khói giòn rụm", 0, 318, 106, "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500"),
    ("Cà Phê Muối Xứ Huế", 35000, "Cà phê phin đậm đà phủ lớp kem sữa muối mặn mòi béo ngậy thơm nức", 0, 320, 107, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"),
    ("Cà Phê Trứng Hà Nội Phố Cổ", 45000, "Lớp kem trứng đánh bông sánh mịn như lụa quyện cà phê nóng đậm đà", 0, 320, 107, "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500"),
    ("Trà Mãng Cầu Đắk Lắk Tươi", 45000, "Mãng cầu xiêm chua ngọt dầm cùng trà lài thanh mát giải nhiệt sảng khoái", 0, 321, 107, "https://images.unsplash.com/photo-1558857563-b37cb337d100?w=500"),
    ("Bánh Sừng Bò Trứng Muối Tan Chảy", 40000, "Vỏ ngàn lớp giòn xốp nhân kem trứng muối thơm ngậy ngọt dịu", 0, 324, 107, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500"),

    # Dimsum
    ("Bánh Cuốn Tôm Tươi Hấp", 55000, "Lớp bánh cuốn mỏng tang nhân tôm nguyên con giòn sần sật rưới xì dầu ngọt", 0, 325, 108, "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500"),
    ("Sủi Cảo Tứ Xuyên Dầu Ớt", 55000, "Sủi cảo nhân thịt băm tôm tươi ngập trong dầu ớt giấm đen chua cay nồng", 0, 325, 108, "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500"),
    ("Bánh Bao Xá Xíu Nướng", 45000, "Vỏ bánh vàng thơm bọc lớp thịt xá xíu đậm đà thơm mùi mật ong", 0, 326, 108, "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500"),

    # Gà Rán & Fastfood
    ("Gà Rán Sốt Phô Mai Tuyết", 79000, "Gà chiên giòn tan rụm phủ lớp bột phô mai béo ngọt mặn mà", 0, 328, 109, "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
    ("Gà Rán Sốt Cay Hàn Quốc", 79000, "Miếng gà sốt sốt cay Gochujang đỏ rực mè rang thơm lừng chuẩn Hàn", 0, 328, 109, "https://images.unsplash.com/photo-1562967914-608f82629710?w=500"),
    ("Burger Bò Phô Mai Hai Tầng", 69000, "Hai miếng bò nướng than hoa kẹp phô mai cheddar tan chảy sốt đặc biệt", 0, 330, 109, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"),

    # Lẩu & Nướng
    ("Nồi Lẩu Thái Tomyum Chua Cay", 299000, "Nước lẩu cốt dừa lá chanh sả ớt cay xé lưỡi kèm đĩa thịt bò mỹ và hải sản", 0, 332, 110, "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500"),
    ("Nồi Lẩu Nấm Chim Câu Bổ Dưỡng", 350000, "Nước lẩu ninh xương ngọt lịm cùng các loại nấm quý và thịt chim câu", 0, 332, 110, "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500"),
    ("Nồi Lẩu Ếch Măng Cay Lá Lốt", 280000, "Thịt ếch xào săn đẫm gia vị măng chua giòn cay nồng ấm bụng ngày lạnh", 0, 332, 110, "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500"),
    ("Đĩa Dẻ Sườn Bò Mỹ Nướng Sốt Galbi", 159000, "Dẻ sườn bò ngập sốt hoa quả Hàn Quốc nướng than thơm lừng", 0, 333, 110, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"),
    ("Đĩa Nầm Heo Nướng Bơ Tỏi", 129000, "Nầm heo giòn sần sật ướp sốt chao bơ tỏi nướng chảo gang", 0, 333, 110, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500"),

    # Steak & Âu
    ("Thăn Lưng Bò Úc Nướng 200g", 380000, "Thịt bò thăn mềm mọng nước ăn kèm sốt tiêu đen hoặc sốt nấm kem", 0, 336, 111, "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500"),
    ("Bò Fuji Nướng Đá Núi Lửa", 450000, "Thịt bò mềm tan với vân mỡ hoa cẩm thạch nướng xèo xèo trên đá nóng", 0, 336, 111, "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500"),
    ("Sườn Cừu Nướng Thảo Mộc", 480000, "Sườn cừu Pháp ướp lá hương thảo nướng chín tới mềm ngọt không tanh", 0, 337, 111, "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500"),
    ("Cá Vược Áp Chảo Sốt Chanh Leo", 220000, "Phi lê cá vược da giòn thịt ngọt thanh ăn cùng măng tây và sốt chanh leo", 0, 337, 111, "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500"),

    # Đồ Uống & Trà Sữa
    ("Trà Ô Long Mãng Cầu Phê La", 55000, "Cốt trà ô long đậm đà quyện tép mãng cầu tươi chua ngọt giòn sần sật", 0, 502, 252, "https://images.unsplash.com/photo-1558857563-b37cb337d100?w=500"),
    ("Trà Ô Long Sữa Kem Trứng Dừa Nướng", 58000, "Trà sữa đậm đà phủ lớp kem trứng khò cháy thơm bùi vụn dừa nướng giòn", 0, 502, 252, "https://images.unsplash.com/photo-1558857563-b37cb337d100?w=500"),
    ("Trà Nhài Đào Dầm Sả Mát Lạnh", 48000, "Hương hoa nhài thơm ngát quyện thịt đào giòn và sả tươi giải nhiệt", 0, 503, 252, "https://images.unsplash.com/photo-1558857563-b37cb337d100?w=500"),

    # Bún Bò Huế
    ("Bún Bò Giò Heo Chả Cua", 65000, "Tô bún bò huế đậm đà ruốc sả kèm khoanh giò heo mềm ngậy", 0, 505, 253, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Bún Bò Gân Bò Giòn Cay", 60000, "Gân bò trong veo giòn sần sật nước dùng sa tế cay nồng ấm bụng", 0, 505, 253, "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500"),
    ("Chả Cua Huế Hấp Lá Chuối", 35000, "Chả cua nguyên chất thơm mùi tiêu hành hấp lá chuối ngát hương", 0, 506, 253, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),

    # Món Chay
    ("Đậu Hũ Tứ Xuyên Chay Cay Nồng", 55000, "Đậu hũ non mềm mịn sốt nấm và ớt cay tê lưỡi chuẩn vị Tứ Xuyên", 1, 552, 302, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"),
    ("Nấm Đùi Gà Kho Tiêu Đen", 55000, "Nấm đùi gà cắt khoanh dày kho tiêu đen cay nồng thơm lừng đậm đà", 1, 552, 302, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"),
    ("Chả Giò Chay Hạt Sen Khoai Môn", 45000, "Vỏ cuốn giòn rụm nhân khoai môn bùi béo và hạt sen ngọt bùi", 1, 552, 302, "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500"),
    ("Gỏi Ngó Sen Tai Heo Chay", 50000, "Ngó sen giòn mát chua ngọt trộn nấm tuyết và đậu phộng rang giòn", 1, 552, 302, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"),
    ("Canh Nấm Tuyết Hạt Sen Táo Đỏ", 45000, "Nước canh thanh ngọt dưỡng nhan bổ khí từ hạt sen tươi và táo đỏ", 1, 553, 302, "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=500"),
    ("Trà Hoa Đậu Biếc Hạt Chia", 25000, "Màu xanh biếc tự nhiên thanh nhiệt giải độc mát lành cơ thể", 1, 554, 302, "https://images.unsplash.com/photo-1558857563-b37cb337d100?w=500"),
]

def generate_sql():
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seed_1000_foods.sql")
    needed_count = 918
    start_id = 1000
    
    prefixes = [
        "", "Đặc Biệt - ", "Truyền Thống - ", "Thượng Hạng - ", "Hương Vị Mới - ",
        "Best Seller - ", "Món Ngon Phố Cổ - ", "Đậm Đà - ", "Siêu Phẩm - ", "Tuyệt Đỉnh - "
    ]
    suffixes = [
        "", " (Phần Lớn)", " (Suất Đầy Đủ)", " (Kèm Nước Dùng)", " (Ăn Kèm Rau Sống)",
        " (Thêm Trứng Lòng Đào)", " (Vị Cay Nồng)", " (Thanh Đạm)", " (Chuẩn Vị)", " (Giao Nóng)"
    ]

    sql_statements = []
    sql_statements.append("-- TỰ ĐỘNG BỔ SUNG 918 MÓN ĂN MỚI CÁN MỐC 1.000 MÓN ĂN THỰC NGHIỆM")
    sql_statements.append("SET NAMES utf8mb4;")
    sql_statements.append("SET CHARACTER SET utf8mb4;")
    sql_statements.append("START TRANSACTION;")

    food_values = []
    image_values = []

    for i in range(needed_count):
        food_id = start_id + i
        tpl = FOOD_TEMPLATES[i % len(FOOD_TEMPLATES)]
        
        prefix = prefixes[(i // len(FOOD_TEMPLATES)) % len(prefixes)]
        suffix = suffixes[(i // (len(FOOD_TEMPLATES) * 2)) % len(suffixes)]
        
        base_name = tpl[0]
        name = f"{prefix}{base_name}{suffix}".strip().replace("'", "''")
        price = tpl[1] + ((i % 5) - 2) * 3000
        price = max(15000, price)
        desc = tpl[2].replace("'", "''")
        is_veg = tpl[3]
        cat_id = tpl[4]
        rest_id = tpl[5]
        img_url = tpl[6]

        food_values.append(
            f"({food_id}, '{name}', {price}, '{desc}', {is_veg}, 0, 1, {cat_id}, {rest_id}, NOW())"
        )
        image_values.append(f"({food_id}, '{img_url}')")

    # Ghép thành các câu lệnh INSERT nhiều dòng
    batch_size = 100
    for i in range(0, len(food_values), batch_size):
        batch = food_values[i:i+batch_size]
        sql_statements.append(
            "INSERT INTO food (id, name, price, description, is_vegetarian, is_seasonal, available, food_category_id, restaurant_id, creation_date) VALUES\n"
            + ",\n".join(batch) + ";"
        )

    for i in range(0, len(image_values), batch_size):
        batch = image_values[i:i+batch_size]
        sql_statements.append(
            "INSERT INTO food_images (food_id, images) VALUES\n"
            + ",\n".join(batch) + ";"
        )

    sql_statements.append("COMMIT;")
    sql_statements.append("SELECT COUNT(*) AS tong_so_mon_sau_khi_nap FROM food;")
    sql_statements.append("SELECT COUNT(*) AS tong_so_nha_hang FROM restaurant;")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_statements))

    print(f"-> Đã tạo thành công file SQL: {output_path}")
    print(f"-> Tổng số câu lệnh sinh: {needed_count} món ăn (IDs {start_id} đến {start_id + needed_count - 1})")

if __name__ == "__main__":
    generate_sql()
