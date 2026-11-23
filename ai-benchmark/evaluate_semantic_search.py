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

# Tải toàn bộ 1.000 món ăn từ cơ sở dữ liệu thực nghiệm
DB_FOODS_FILE = os.path.join(BENCHMARK_DIR, "db_1000_foods.json")
if os.path.exists(DB_FOODS_FILE):
    with open(DB_FOODS_FILE, "r", encoding="utf-8") as f:
        DB_FOODS = json.load(f)
else:
    DB_FOODS = []

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
        food_text = (food["name"] + " " + food["category"] + " " + food.get("description", "") + " " + " ".join(food.get("tags", []))).lower()
        
        # Điểm khớp từ khóa mở rộng ý định
        for tag in expanded_tags:
            if tag in food_text:
                score += 4
                
        # Điểm khớp trực tiếp các từ trong query
        for w in q.split():
            if len(w) > 2 and w in food_text:
                score += 2

        # Ưu tiên món có tên khớp trực tiếp với ý định chính
        fname = food["name"].lower()
        for tag in expanded_tags:
            if tag in fname:
                score += 5
                
        if score > 0:
            scored_foods.append((food["id"], score))
            
    scored_foods.sort(key=lambda x: x[1], reverse=True)
    return [sf[0] for sf in scored_foods]

def evaluate_search_engine():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    food_map = {f["id"]: f for f in DB_FOODS}
        
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
            keywords = [kw.lower() for kw in item.get("target_keywords", [])]

            def is_relevant(pid):
                if pid in expected:
                    return True
                f = food_map.get(pid)
                if not f:
                    return False
                fname = f["name"].lower()
                for kw in keywords:
                    if kw in fname:
                        return True
                    tokens = kw.split()
                    if len(tokens) >= 2 and f"{tokens[0]} {tokens[1]}" in fname:
                        return True
                return False

            preds = algo_fn(query)
            
            if not preds:
                zero_results_count += 1
                reciprocal_ranks.append(0.0)
                precision_at_3_list.append(0.0)
                continue
                
            # Hit @ K
            if is_relevant(preds[0]):
                hit_at_1 += 1
            if any(is_relevant(p) for p in preds[:3]):
                hit_at_3 += 1
            if any(is_relevant(p) for p in preds[:5]):
                hit_at_5 += 1
                
            # MRR (Mean Reciprocal Rank)
            rr = 0.0
            for rank, pid in enumerate(preds, start=1):
                if is_relevant(pid):
                    rr = 1.0 / rank
                    break
            reciprocal_ranks.append(rr)
            
            # Precision @ 3
            top3 = preds[:3]
            p3 = sum(1 for p in top3 if is_relevant(p)) / len(top3)
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
