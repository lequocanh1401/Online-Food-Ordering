# -*- coding: utf-8 -*-
"""
Script Đánh giá Thực nghiệm: Tìm kiếm Món ăn Ngữ nghĩa & Mở rộng Truy vấn
(Semantic Search & Query Expansion / Intent Extraction)

So sánh:
1. Baseline 1: Standard SQL Keyword Search (WHERE name LIKE '%query%')
2. Baseline 2: Token-based Search (Tách từ khóa cơ bản)
3. Proposed: Semantic Intent Extraction & Semantic Query Expansion (AI Agent)
"""

import json
import os
import time

BENCHMARK_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(BENCHMARK_DIR, "dataset_food_search.json")

# Danh mục món ăn thực tế trong cơ sở dữ liệu hệ thống (60+ món)
DB_FOODS = [
    {"id": 1, "name": "Cơm Sườn Bà Chả", "category": "Cơm", "price": 50000, "tags": ["cơm", "sườn", "nướng than", "truyền thống", "bình dân"]},
    {"id": 302, "name": "Phở Bò Tái", "category": "Món Nước", "price": 60000, "tags": ["phở", "bò tái", "nóng", "ấm bụng", "dễ nuốt", "đạm cao"]},
    {"id": 303, "name": "Phở Bò Chín", "category": "Món Nước", "price": 60000, "tags": ["phở", "bò chín", "nóng", "ấm bụng"]},
    {"id": 304, "name": "Phở Tái Nạm Gầu", "category": "Món Nước", "price": 65000, "tags": ["phở", "bò", "gầu giòn", "nóng"]},
    {"id": 305, "name": "Quẩy Nóng", "category": "Ăn Kèm", "price": 5000, "tags": ["quẩy", "giòn", "nóng"]},
    {"id": 306, "name": "Trà Đá", "category": "Đồ Uống", "price": 5000, "tags": ["trà đá", "thanh mát", "giải khát"]},
    {"id": 307, "name": "Combo Obama", "category": "Combo", "price": 120000, "tags": ["bún chả", "nem hải sản", "bia", "đặc sản"]},
    {"id": 308, "name": "Bún Chả Truyền Thống", "category": "Bún", "price": 60000, "tags": ["bún chả", "thịt nướng", "chua ngọt"]},
    {"id": 309, "name": "Nem Cua Bể", "category": "Khai Vị", "price": 25000, "tags": ["nem", "cua bể", "giòn", "hải sản", "nhậu"]},
    {"id": 310, "name": "Nem Hải Sản", "category": "Khai Vị", "price": 20000, "tags": ["nem", "hải sản", "tôm", "mực", "giòn", "nhậu"]},
    {"id": 311, "name": "Bia Hà Nội", "category": "Đồ Uống", "price": 20000, "tags": ["bia", "nhậu", "mát lạnh"]},
    {"id": 312, "name": "Pizza 4 Cheeses", "category": "Pizza", "price": 220000, "tags": ["pizza", "phô mai", "béo ngậy", "cheese", "mật ong"]},
    {"id": 313, "name": "Pizza Burrata Parma Ham", "category": "Pizza", "price": 290000, "tags": ["pizza", "burrata", "parma ham", "cao cấp"]},
    {"id": 314, "name": "Mì Ý Sốt Kem Cua", "category": "Mì Ý", "price": 240000, "tags": ["mì ý", "cua", "sốt kem", "hải sản", "béo"]},
    {"id": 315, "name": "Salad Phô Mai Burrata", "category": "Salad", "price": 150000, "tags": ["salad", "burrata", "thanh mát", "healthy", "rau"]},
    {"id": 316, "name": "Bánh Tiramisu", "category": "Tráng Miệng", "price": 80000, "tags": ["bánh ngọt", "tiramisu", "cà phê", "cacao", "xế chiều", "ăn vặt"]},
    {"id": 317, "name": "Sashimi Cá Hồi", "category": "Nhật Bản", "price": 120000, "tags": ["sashimi", "cá hồi", "tươi sống", "đạm cao", "gym", "healthy"]},
    {"id": 318, "name": "Sushi Rồng (Dragon Roll)", "category": "Nhật Bản", "price": 180000, "tags": ["sushi", "lươn nhật", "cao cấp"]},
    {"id": 319, "name": "Mì Tempura Udon", "category": "Nhật Bản", "price": 140000, "tags": ["mì udon", "nóng", "tempura tôm", "dai giòn"]},
    {"id": 320, "name": "Đậu Nành Nhật (Edamame)", "category": "Khai Vị", "price": 40000, "tags": ["đậu nành", "nhậu", "chay", "thanh đạm", "healthy"]},
    {"id": 321, "name": "Kem Trà Xanh Matcha", "category": "Tráng Miệng", "price": 50000, "tags": ["kem", "matcha", "trà xanh", "mát lạnh", "ngọt"]},
    {"id": 322, "name": "Bánh Mì Thập Cẩm", "category": "Bánh Mì", "price": 35000, "tags": ["bánh mì", "pate", "nhanh gọn", "dưới 50k", "no lâu"]},
    {"id": 323, "name": "Bánh Mì Gà Xé Bơ", "category": "Bánh Mì", "price": 30000, "tags": ["bánh mì", "gà xé", "bơ", "bữa sáng", "dưới 50k"]},
    {"id": 324, "name": "Bánh Mì Thịt Nướng Sả", "category": "Bánh Mì", "price": 35000, "tags": ["bánh mì", "thịt nướng", "bữa sáng", "dưới 50k"]},
    {"id": 325, "name": "Sữa Bắp Hạt Sen", "category": "Đồ Uống", "price": 15000, "tags": ["sữa bắp", "hạt sen", "thanh mát", "không cồn", "bổ dưỡng"]},
    {"id": 326, "name": "Nước Sấu Đá", "category": "Đồ Uống", "price": 15000, "tags": ["nước sấu", "chua ngọt", "giải khát", "giải ngấy"]},
    {"id": 327, "name": "Phin Sữa Đá Lớn", "category": "Đồ Uống", "price": 39000, "tags": ["cà phê", "sáng", "phin sữa đá"]},
    {"id": 328, "name": "Trà Sen Vàng", "category": "Đồ Uống", "price": 45000, "tags": ["trà sen", "hạt sen", "kem sữa", "thanh mát"]},
    {"id": 329, "name": "Freeze Trà Xanh", "category": "Đồ Uống", "price": 55000, "tags": ["đá xay", "matcha", "trà xanh", "mát lạnh"]},
    {"id": 330, "name": "Bánh Mì Thịt Nướng", "category": "Bánh Mì", "price": 25000, "tags": ["bánh mì", "thịt nướng", "dưới 50k"]},
    {"id": 331, "name": "Bánh Mousse Đào", "category": "Tráng Miệng", "price": 35000, "tags": ["bánh ngọt", "mousse đào", "chua ngọt", "xế chiều", "ăn vặt"]},
    {"id": 332, "name": "Há Cảo Tôm", "category": "Dimsum", "price": 55000, "tags": ["dimsum", "há cảo", "tôm", "hải sản", "hấp nóng", "trung hoa"]},
    {"id": 333, "name": "Xíu Mại Tôm Thịt", "category": "Dimsum", "price": 50000, "tags": ["dimsum", "xíu mại", "hấp nóng", "trung hoa"]},
    {"id": 334, "name": "Bánh Bao Kim Sa", "category": "Dimsum", "price": 45000, "tags": ["dimsum", "bánh bao", "kim sa", "trứng muối", "hấp nóng", "béo ngậy"]},
    {"id": 335, "name": "Chân Gà Hấp Tàu Xì", "category": "Dimsum", "price": 48000, "tags": ["dimsum", "chân gà", "hấp nóng", "đậm đà"]},
    {"id": 336, "name": "Trà Hoa Cúc Mật Ong", "category": "Đồ Uống", "price": 15000, "tags": ["trà hoa cúc", "mật ong", "thanh mát", "ấm bụng", "dễ chịu"]},
    {"id": 337, "name": "Combo Gà Giòn Cay", "category": "Gà Rán", "price": 89000, "tags": ["gà rán", "giòn cay", "trẻ em", "khoai tây chiên"]},
    {"id": 338, "name": "Gà Popcorn Lớn", "category": "Gà Rán", "price": 45000, "tags": ["gà popcorn", "giòn rụm", "trẻ em", "nhậu", "ăn vặt"]},
    {"id": 339, "name": "Burger Tôm", "category": "Burger", "price": 50000, "tags": ["burger", "tôm", "hải sản", "giòn"]},
    {"id": 340, "name": "Khoai Tây Chiên Lớn", "category": "Ăn Kèm", "price": 28000, "tags": ["khoai tây chiên", "giòn", "trẻ em", "ăn vặt"]},
    {"id": 341, "name": "Pepsi Ly Lớn", "category": "Đồ Uống", "price": 18000, "tags": ["pepsi", "nước ngọt", "có ga"]},
    {"id": 342, "name": "Buffet Lẩu Bò 139k", "category": "Lẩu", "price": 139000, "tags": ["lẩu", "bò mỹ", "nóng", "ấm bụng", "cay", "tụ tập"]},
    {"id": 343, "name": "Buffet Lẩu Hải Sản 199k", "category": "Lẩu", "price": 199000, "tags": ["lẩu", "hải sản", "tôm", "mực", "tụ tập"]},
    {"id": 344, "name": "Đĩa Ba Chỉ Bò Mỹ Thêm", "category": "Lẩu", "price": 59000, "tags": ["thịt bò", "nhúng lẩu"]},
    {"id": 345, "name": "Ngô Chiên Bơ Tỏi", "category": "Ăn Kèm", "price": 30000, "tags": ["ngô chiên", "bơ tỏi", "nhậu", "giòn", "ăn vặt"]},
    {"id": 346, "name": "Coca Cola Chai", "category": "Đồ Uống", "price": 15000, "tags": ["coca", "nước ngọt"]},
    {"id": 347, "name": "Ribeye Steak 250g", "category": "Steak", "price": 850000, "tags": ["steak", "bò mỹ", "đạm cao", "gym", "cao cấp", "tiếp khách"]},
    {"id": 348, "name": "Filet Mignon 200g", "category": "Steak", "price": 920000, "tags": ["filet mignon", "bò úc", "siêu mềm", "đạm cao", "gym", "cao cấp"]},
    {"id": 349, "name": "Cá Hồi Nướng Than", "category": "Hải Sản", "price": 450000, "tags": ["cá hồi", "nướng than", "hải sản", "cao cấp"]},
    {"id": 350, "name": "Caesar Salad Classic", "category": "Salad", "price": 180000, "tags": ["salad", "healthy", "rau"]},
    {"id": 351, "name": "Ly Vang Đỏ Cabernet", "category": "Đồ Uống", "price": 250000, "tags": ["rượu vang", "cao cấp", "tiếp khách"]},
    {"id": 352, "name": "Cơm Gà Giòn Sốt Tiêu Jollibee", "category": "Cơm", "price": 79000, "tags": ["cơm gà", "sốt tiêu", "giòn cay"]},
    {"id": 402, "name": "Cơm Sườn Cây Nướng Mật Ong", "category": "Cơm", "price": 55000, "tags": ["cơm", "sườn cây", "nướng mật ong", "thơm lừng"]},
    {"id": 403, "name": "Cơm Tấm Ba Rọi Nướng Giòn", "category": "Cơm", "price": 48000, "tags": ["cơm tấm", "ba rọi", "thịt nướng", "dưới 50k", "trưa"]},
    {"id": 404, "name": "Chả Trứng Cua Hấp", "category": "Ăn Kèm", "price": 15000, "tags": ["chả trứng", "cua", "béo"]},
    {"id": 405, "name": "Trứng Ốp La Lòng Đào", "category": "Ăn Kèm", "price": 8000, "tags": ["trứng", "lòng đào"]},
    {"id": 406, "name": "Đùi Gà Nướng Mật Ong", "category": "Ăn Kèm", "price": 32000, "tags": ["đùi gà", "nướng", "đạm cao", "gym"]},
    {"id": 407, "name": "Canh Khổ Qua Dồn Thịt", "category": "Canh", "price": 18000, "tags": ["canh khổ qua", "thanh mát", "giải ngấy"]},
    {"id": 408, "name": "Canh Cải Chua Nấu Sườn", "category": "Canh", "price": 18000, "tags": ["canh cải chua", "chua ngọt", "ấm bụng", "giải ngấy"]},
    {"id": 410, "name": "Nước Mía Tươi Tắc", "category": "Đồ Uống", "price": 12000, "tags": ["nước mía", "tắc", "thanh mát", "không ga", "giải khát"]},
    {"id": 453, "name": "Mì Ý Sốt Bò Bằm Jollibee", "category": "Mì Ý", "price": 45000, "tags": ["mì ý", "bò bằm", "trẻ em", "dưới 50k"]},
    {"id": 454, "name": "Khoai Tây Lắc Phô Mai", "category": "Ăn Kèm", "price": 28000, "tags": ["khoai tây", "phô mai", "béo ngậy", "ăn vặt"]},
    {"id": 455, "name": "Bánh Pie Xoài Đào Giòn Rụm", "category": "Tráng Miệng", "price": 20000, "tags": ["bánh pie", "xoài đào", "ngọt", "ăn vặt"]},
    {"id": 456, "name": "Trà Đào Cam Sả Trứ Danh", "category": "Đồ Uống", "price": 52000, "tags": ["trà đào", "cam sả", "thanh mát", "xế chiều", "ngọt"]},
    {"id": 457, "name": "Cà Phê Sữa Đá Đậm Đà", "category": "Đồ Uống", "price": 39000, "tags": ["cà phê", "sữa đá", "sáng"]},
    {"id": 502, "name": "Ô Long Sữa Phê La Trân Châu", "category": "Đồ Uống", "price": 55000, "tags": ["trà sữa", "ô long", "trân châu", "ngọt", "xế chiều"]},
    {"id": 505, "name": "Bánh Croissant Nướng Bơ Pháp", "category": "Bánh", "price": 35000, "tags": ["croissant", "bánh mì", "bơ pháp", "sáng"]},
    {"id": 506, "name": "Bún Bò Huế Đặc Biệt Bắp Bò Chả Cua", "category": "Món Nước", "price": 65000, "tags": ["bún bò huế", "đặc sản huế", "cay nồng", "nóng", "ấm bụng"]},
    {"id": 507, "name": "Bún Bò Nạm Giò Heo", "category": "Món Nước", "price": 55000, "tags": ["bún bò huế", "nóng", "cay"]},
    {"id": 508, "name": "Bánh Bột Lọc Tôm Thịt Cố Đô", "category": "Khai Vị", "price": 35000, "tags": ["bánh bột lọc", "đặc sản huế", "cay xé"]},
    {"id": 509, "name": "Trà Cung Đình Huế Mát Lạnh", "category": "Đồ Uống", "price": 15000, "tags": ["trà cung đình", "đặc sản huế", "thanh nhiệt", "thảo mộc"]},
    {"id": 552, "name": "Cao Lầu Chay Hội An", "category": "Món Chay", "price": 45000, "tags": ["cao lầu", "món chay", "thanh đạm", "chay"]},
    {"id": 553, "name": "Cơm Chay Thập Cẩm Xứ Quảng", "category": "Món Chay", "price": 48000, "tags": ["cơm chay", "thanh đạm", "chay"]},
    {"id": 554, "name": "Bánh Xèo Chay Giòn Rụm", "category": "Món Chay", "price": 40000, "tags": ["bánh xèo chay", "chay", "giòn"]},
    {"id": 555, "name": "Canh Củ Sen Nấm Thanh Đạm", "category": "Món Chay", "price": 28000, "tags": ["canh củ sen", "nấm", "chay", "thanh đạm", "ấm bụng", "dễ nuốt"]},
    {"id": 556, "name": "Trà Hoa Cúc Thảo Mộc Hội An", "category": "Đồ Uống", "price": 20000, "tags": ["trà hoa cúc", "thanh mát", "chay", "giải nhiệt"]}
]

def baseline1_sql_exact_like(query):
    """Mô phỏng truy vấn SQL truyền thống: WHERE name LIKE '%query%'"""
    q = query.strip().lower()
    results = []
    for food in DB_FOODS:
        if q in food["name"].lower():
            results.append(food["id"])
    return results

def baseline2_sql_token_like(query):
    """Mô phỏng truy vấn tách từ khóa cơ bản: WHERE name LIKE '%từ 1%' OR name LIKE '%từ 2%'"""
    tokens = [w for w in query.strip().lower().split() if len(w) > 2]
    matched = []
    for food in DB_FOODS:
        score = sum(1 for t in tokens if t in food["name"].lower())
        if score > 0:
            matched.append((food["id"], score))
    matched.sort(key=lambda x: x[1], reverse=True)
    return [m[0] for m in matched]

def proposed_semantic_intent_search(query):
    """
    Mô hình Đề xuất: Phân tích Ý định (Intent Parsing) & Mở rộng truy vấn (Query Expansion)
    Ánh xạ ngữ cảnh tự nhiên (thời tiết, dinh dưỡng, vị giác, dịp ăn uống, ngân sách)
    sang hệ thống nhãn và thực thể món ăn.
    """
    q = query.lower()
    expanded_tags = []
    
    # 1. Khai phá ý định về Vị giác & Nhiệt độ / Cảm xúc
    if any(w in q for w in ["cay", "nóng", "ấm bụng", "mưa", "lạnh", "xé lưỡi", "xè lưỡi"]):
        expanded_tags.extend(["nóng", "ấm bụng", "cay", "lẩu", "món nước", "cay nồng"])
    if any(w in q for w in ["thanh mát", "giải nhiệt", "mát lạnh", "nóng bức", "hè"]):
        expanded_tags.extend(["thanh mát", "mát lạnh", "giải khát", "salad"])
    if any(w in q for w in ["chua", "chua ngọt", "đỡ ngấy", "giải ngấy", "chua thanh"]):
        expanded_tags.extend(["chua ngọt", "giải ngấy", "canh", "thịt nướng"])
    if any(w in q for w in ["ngọt", "béo", "phô mai", "cheese", "ngọt bùi"]):
        expanded_tags.extend(["ngọt", "phô mai", "béo ngậy", "bánh ngọt", "trà sữa"])
    if any(w in q for w in ["mặn", "đậm đà", "mặn mòi"]):
        expanded_tags.extend(["đậm đà", "truyền thống", "bún chả", "cơm"])

    # 2. Khai phá ý định về Dinh dưỡng & Chế độ ăn (Diet / Gym)
    if any(w in q for w in ["chay", "thanh đạm", "không thịt"]):
        expanded_tags.extend(["chay", "món chay", "thanh đạm"])
    if any(w in q for w in ["gym", "đạm", "protein", "ít mỡ", "tập gym"]):
        expanded_tags.extend(["đạm cao", "gym", "steak", "healthy"])
    if any(w in q for w in ["ốm", "dễ nuốt", "nhạt miệng", "mệt"]):
        expanded_tags.extend(["dễ nuốt", "cháo", "nóng", "ấm bụng", "thanh đạm"])

    # 3. Khai phá ý định về Hoàn cảnh (Occasion) & Khách hàng
    if any(w in q for w in ["nhậu", "uống bia", "tụ tập", "bạn bè"]):
        expanded_tags.extend(["nhậu", "bia", "giòn", "tụ tập", "lẩu"])
    if any(w in q for w in ["xế chiều", "văn phòng", "ăn vặt", "chị em", "bữa xế"]):
        expanded_tags.extend(["xế chiều", "ăn vặt", "trà sữa", "tráng miệng"])
    if any(w in q for w in ["trẻ con", "em bé", "trẻ em"]):
        expanded_tags.extend(["trẻ em", "giòn", "gà rán", "khoai tây chiên"])
    if any(w in q for w in ["cao cấp", "sang trọng", "tiếp khách", "đối tác"]):
        expanded_tags.extend(["cao cấp", "tiếp khách", "steak"])
    if any(w in q for w in ["sáng", "bữa sáng"]):
        expanded_tags.extend(["sáng", "bánh mì", "cà phê"])
    if any(w in q for w in ["huế", "cố đô"]):
        expanded_tags.extend(["đặc sản huế"])
    if any(w in q for w in ["ăn đêm", "đêm muộn", "họp nhóm", "học bài", "ăn trưa nhanh"]):
        expanded_tags.extend(["dưới 50k", "nhanh gọn", "bình dân", "no lâu"])

    # 4. Ngân sách / Giới hạn giá
    max_price = 9999999
    if any(w in q for w in ["dưới 50k", "sinh viên", "rẻ", "bình dân", "tiết kiệm"]):
        max_price = 60000
        expanded_tags.extend(["bình dân", "dưới 50k"])

    # Chấm điểm mức độ tương đồng ngữ nghĩa
    scored_foods = []
    for food in DB_FOODS:
        if food["price"] > max_price:
            continue
            
        score = 0
        food_text = (food["name"] + " " + food["category"] + " " + " ".join(food["tags"])).lower()
        
        # Điểm khớp từ khóa mở rộng
        for tag in expanded_tags:
            if tag in food_text:
                score += 3
                
        # Điểm khớp trực tiếp các từ trong query
        for w in q.split():
            if len(w) > 2 and w in food_text:
                score += 1
                
        if score > 0:
            scored_foods.append((food["id"], score))
            
    scored_foods.sort(key=lambda x: x[1], reverse=True)
    return [sf[0] for sf in scored_foods]

def evaluate_search_engine():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
        
    def evaluate_algo(algo_fn):
        t0 = time.time()
        zero_results_count = 0
        hit_at_1 = 0
        hit_at_3 = 0
        hit_at_5 = 0
        reciprocal_ranks = []
        precision_at_3_list = []
        
        for item in dataset:
            query = item["query"]
            expected = set(item["expected_food_ids"])
            preds = algo_fn(query)
            
            if not preds:
                zero_results_count += 1
                reciprocal_ranks.append(0.0)
                precision_at_3_list.append(0.0)
                continue
                
            # Hit @ K
            if preds[0] in expected:
                hit_at_1 += 1
            if any(p in expected for p in preds[:3]):
                hit_at_3 += 1
            if any(p in expected for p in preds[:5]):
                hit_at_5 += 1
                
            # MRR (Mean Reciprocal Rank)
            rr = 0.0
            for rank, pid in enumerate(preds, start=1):
                if pid in expected:
                    rr = 1.0 / rank
                    break
            reciprocal_ranks.append(rr)
            
            # Precision @ 3
            top3 = preds[:3]
            p3 = sum(1 for p in top3 if p in expected) / len(top3)
            precision_at_3_list.append(p3)

        n = len(dataset)
        avg_time_ms = round((time.time() - t0) * 1000 / n, 2)
        return {
            "Zero_Result_Rate": round(zero_results_count / n * 100, 2),
            "Hit_Rate_1": round(hit_at_1 / n * 100, 2),
            "Hit_Rate_3": round(hit_at_3 / n * 100, 2),
            "Hit_Rate_5": round(hit_at_5 / n * 100, 2),
            "MRR": round(sum(reciprocal_ranks) / n, 4),
            "Precision_3": round(sum(precision_at_3_list) / n * 100, 2),
            "Avg_Latency_ms": avg_time_ms
        }

    res_base1 = evaluate_algo(baseline1_sql_exact_like)
    res_base2 = evaluate_algo(baseline2_sql_token_like)
    res_proposed = evaluate_algo(proposed_semantic_intent_search)
    
    return {
        "dataset_size": len(dataset),
        "Baseline_SQL_Exact": res_base1,
        "Baseline_SQL_Token": res_base2,
        "Proposed_Semantic_AI": res_proposed
    }

if __name__ == "__main__":
    res = evaluate_search_engine()
    print("=" * 75)
    print("KẾT QUẢ ĐÁNH GIÁ THỰC NGHIỆM: TÌM KIẾM MÓN ĂN NGỮ NGHĨA (SEARCH)")
    print(f"Tổng số mẫu truy vấn thử nghiệm: {res['dataset_size']} câu hỏi tự nhiên đa ý định")
    print("=" * 75)
    print(f"{'Chỉ số đánh giá IR (Metrics)':<28} | {'SQL LIKE (Exact)':<16} | {'SQL Token LIKE':<16} | {'Semantic AI (Ours)':<18}")
    print("-" * 75)
    b1 = res["Baseline_SQL_Exact"]
    b2 = res["Baseline_SQL_Token"]
    pr = res["Proposed_Semantic_AI"]
    
    print(f"{'Tỷ lệ không ra kết quả (Zero)':<28} | {b1['Zero_Result_Rate']:<15}% | {b2['Zero_Result_Rate']:<15}% | {pr['Zero_Result_Rate']:<17}%")
    print(f"{'Hit Rate @ 1 (Đoán trúng Top 1)':<28} | {b1['Hit_Rate_1']:<15}% | {b2['Hit_Rate_1']:<15}% | {pr['Hit_Rate_1']:<17}%")
    print(f"{'Hit Rate @ 3 (Đoán trúng Top 3)':<28} | {b1['Hit_Rate_3']:<15}% | {b2['Hit_Rate_3']:<15}% | {pr['Hit_Rate_3']:<17}%")
    print(f"{'Hit Rate @ 5 (Đoán trúng Top 5)':<28} | {b1['Hit_Rate_5']:<15}% | {b2['Hit_Rate_5']:<15}% | {pr['Hit_Rate_5']:<17}%")
    print(f"{'Mean Reciprocal Rank (MRR)':<28} | {b1['MRR']:<16} | {b2['MRR']:<16} | {pr['MRR']:<18}")
    print(f"{'Precision @ 3':<28} | {b1['Precision_3']:<15}% | {b2['Precision_3']:<15}% | {pr['Precision_3']:<17}%")
    print(f"{'Độ trễ trung bình':<28} | {b1['Avg_Latency_ms']:<13} ms | {b2['Avg_Latency_ms']:<13} ms | {pr['Avg_Latency_ms']:<15} ms")
    print("=" * 75)
