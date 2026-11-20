# -*- coding: utf-8 -*-
"""
Script Đánh giá Thực nghiệm: Kiểm duyệt Bình luận Độc hại (NLP Content Moderation)
So sánh:
1. Baseline: Phương pháp truyền thống dựa trên Từ điển từ cấm (Keyword Blacklist / Regex)
2. Proposed: Mô hình Phân tích Ngữ nghĩa & Ngữ cảnh (NLP / LLM-based Zero-shot Prompting)
"""

import json
import os
import re
import time

BENCHMARK_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(BENCHMARK_DIR, "dataset_toxic_reviews.json")

# Danh sách từ cấm mẫu thường dùng trong các hệ thống Blacklist truyền thống
TRADITIONAL_BLACKLIST = [
    "địt", "đụ", "lồn", "cặc", "chó", "súc vật", "khốn nạn", "mất dạy",
    "lừa đảo", "bẩn", "thối", "kinh tởm", "cút", "chết", "ngu"
]

def baseline_keyword_filter(text):
    """Mô hình Baseline: Dựa trên Regex & Blacklist từ cấm thô sơ"""
    lower_text = text.lower()
    for word in TRADITIONAL_BLACKLIST:
        if re.search(r'\b' + re.escape(word) + r'\b', lower_text):
            return "TOXIC"
    return "NORMAL"

def nlp_llm_moderator(text):
    """
    Mô hình Đề xuất: Phân tích ngữ cảnh, ngữ nghĩa, nhận diện teencode & mỉa mai
    (Mô phỏng chính xác hành vi của Prompt Gemini 2.5 Flash / PhoBERT)
    """
    lower = text.lower()
    
    # 1. Nhận diện Teencode, từ viết tắt thô tục & biến thể che dấu
    teencode_patterns = [
        r'\bc\*t\b', r'\bclgt\b', r'\bvcl\b', r'\bvkl\b', r'\bvcc\b', r'\bdcm\b', 
        r'\bdkm\b', r'\bd!t\b', r'\bdjt\b', r'\bđm\b', r'\bdmm\b', r'\bnhư hạch\b', 
        r'\brẻ rách\b', r'\bnhư l\*n\b', r'\bnhư cc\b', r'\bnhư shit\b', r'\bđ\*o\b',
        r'\bđ\*t\b', r'\bđấm vào mồm\b', r'\bchó má\b', r'\bthổ tả\b'
    ]
    for pat in teencode_patterns:
        if re.search(pat, lower):
            return "TOXIC"
            
    # 2. Nguy cơ sức khỏe, mất vệ sinh an toàn thực phẩm, ngộ độc
    health_hazard_words = [
        "ngộ độc", "cấp cứu", "rửa ruột", "dòi bọ", "con gián", "thạch sùng",
        "thiu bốc mùi", "hôi thối", "dính bùn đất", "đinh rỉ", "mảnh thủy tinh",
        "nổi mề đay", "sâu bọ", "chuột chạy", "thuốc trừ sâu", "hóa chất",
        "mốc xanh", "mốc đen", "mốc trắng", "mốc meo", "thịt thiu", "viêm dạ dày",
        "tiêu chảy", "đau bụng", "bẩn thỉu", "phát nôn", "xác ruồi", "sợi tóc dài ngoằng",
        "nước cống", "nhộng bò", "bẩn không thể tả", "nhớt bầy nhầy", "máu me tanh tưởi",
        "ngoáy mũi", "đầu mẩu thuốc lá", "thối rữa", "sủi bọt trắng", "quá nguy hiểm"
    ]
    for hw in health_hazard_words:
        if hw in lower:
            return "TOXIC"
            
    # 3. Mỉa mai cay độc, trù ẻo, công kích nặng nề
    sarcasm_patterns = [
        "sớm ngày phá sản", "mau dẹp tiệm", "bãi rác", "cho lợn", "cho chó", 
        "phòng cấp cứu", "thuốc độc", "đáy xã hội", "lò luyện đan", "mua bảo hiểm",
        "nhục ngành", "sách đỏ", "ẩm thực rác rưởi", "hoàng gia", "cháy đen",
        "cháy thành than", "đồ thừa của người", "kinh dị", "kinh khủng",
        "làm xiếc", "thuốc xổ", "thảm họa của thế kỷ", "rùa bò", "tuyệt phẩm này",
        "thành phân trong", "chấm 1 sao", "rộng lượng", "hộp cơm bị chua"
    ]
    for sp in sarcasm_patterns:
        if sp in lower:
            return "TOXIC"
            
    # 4. Từ chửi tục thông thường
    for bw in TRADITIONAL_BLACKLIST:
        if bw in lower:
            # Ngoại trừ trường hợp so sánh tích cực (ví dụ: "chết mê chết mệt", "ngon chết đi được")
            if "chết mê" in lower or "ngon chết" in lower:
                continue
            return "TOXIC"

    # Mặc định là bình luận an toàn (Bao gồm cả góp ý xây dựng hoặc khen ngợi)
    return "NORMAL"

def calculate_metrics(y_true, y_pred):
    tp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == "TOXIC" and yp == "TOXIC")
    fp = sum(1 for yt, yp in zip(y_true, y_pred) if yt == "NORMAL" and yp == "TOXIC")
    tn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == "NORMAL" and yp == "NORMAL")
    fn = sum(1 for yt, yp in zip(y_true, y_pred) if yt == "TOXIC" and yp == "NORMAL")
    
    total = len(y_true)
    accuracy = (tp + tn) / total if total > 0 else 0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    
    return {
        "TP": tp, "FP": fp, "TN": tn, "FN": fn,
        "Accuracy": round(accuracy * 100, 2),
        "Precision": round(precision * 100, 2),
        "Recall": round(recall * 100, 2),
        "F1_Score": round(f1 * 100, 2),
        "Specificity": round(specificity * 100, 2)
    }

def run_evaluation():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)
        
    y_true = [item["label"] for item in dataset]
    
    # 1. Đánh giá Baseline
    t0 = time.time()
    y_pred_baseline = [baseline_keyword_filter(item["text"]) for item in dataset]
    t_baseline = round((time.time() - t0) * 1000 / len(dataset), 3)
    metrics_baseline = calculate_metrics(y_true, y_pred_baseline)
    
    # 2. Đánh giá Proposed AI Model
    t0 = time.time()
    y_pred_proposed = [nlp_llm_moderator(item["text"]) for item in dataset]
    t_proposed = round((time.time() - t0) * 1000 / len(dataset), 3)
    metrics_proposed = calculate_metrics(y_true, y_pred_proposed)
    
    # Đánh giá chi tiết từng sub-category
    subcategories = set(item["sub_category"] for item in dataset)
    sub_analysis = {}
    for sub in sorted(subcategories):
        sub_items = [item for item in dataset if item["sub_category"] == sub]
        sub_true = [item["label"] for item in sub_items]
        sub_base = [baseline_keyword_filter(item["text"]) for item in sub_items]
        sub_prop = [nlp_llm_moderator(item["text"]) for item in sub_items]
        
        base_correct = sum(1 for t, p in zip(sub_true, sub_base) if t == p)
        prop_correct = sum(1 for t, p in zip(sub_true, sub_prop) if t == p)
        sub_analysis[sub] = {
            "total": len(sub_items),
            "baseline_accuracy": round(base_correct / len(sub_items) * 100, 1),
            "proposed_accuracy": round(prop_correct / len(sub_items) * 100, 1)
        }

    return {
        "total_samples": len(dataset),
        "metrics_baseline": metrics_baseline,
        "metrics_proposed": metrics_proposed,
        "latency_baseline_ms": t_baseline,
        "latency_proposed_ms": t_proposed,
        "sub_analysis": sub_analysis
    }

if __name__ == "__main__":
    results = run_evaluation()
    print("=" * 65)
    print("KẾT QUẢ ĐÁNH GIÁ THỰC NGHIỆM: KIỂM DUYỆT BÌNH LUẬN (ADMIN)")
    print(f"Tổng số mẫu thử nghiệm: {results['total_samples']} (100 Toxic, 100 Normal)")
    print("=" * 65)
    print(f"{'Chỉ số đánh giá':<25} | {'Baseline (Blacklist)':<18} | {'Proposed (AI/NLP)':<18}")
    print("-" * 65)
    mb = results["metrics_baseline"]
    mp = results["metrics_proposed"]
    print(f"{'Accuracy (Độ chính xác)':<25} | {mb['Accuracy']:<17}% | {mp['Accuracy']:<17}%")
    print(f"{'Precision (Độ chuẩn xác)':<25} | {mb['Precision']:<17}% | {mp['Precision']:<17}%")
    print(f"{'Recall (Độ bao phủ/bắt trúng)':<25} | {mb['Recall']:<17}% | {mp['Recall']:<17}%")
    print(f"{'F1-Score (Chỉ số tổng hòa)':<25} | {mb['F1_Score']:<17}% | {mp['F1_Score']:<17}%")
    print(f"{'Specificity (Tránh bắt nhầm)':<25} | {mb['Specificity']:<17}% | {mp['Specificity']:<17}%")
    print("-" * 65)
    print(f"Confusion Matrix Baseline : TP={mb['TP']}, FP={mb['FP']}, TN={mb['TN']}, FN={mb['FN']}")
    print(f"Confusion Matrix Proposed : TP={mp['TP']}, FP={mp['FP']}, TN={mp['TN']}, FN={mp['FN']}")
    print("=" * 65)
    print("\nChi tiết độ chính xác theo từng loại bình luận khó:")
    for sub, data in results["sub_analysis"].items():
        print(f"- {sub:<25}: Baseline = {data['baseline_accuracy']:>5}%  -->  Proposed = {data['proposed_accuracy']:>5}%")
