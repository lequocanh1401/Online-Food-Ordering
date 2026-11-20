# -*- coding: utf-8 -*-
"""
Script Đánh giá Thực nghiệm: Tối ưu hóa Tổ hợp Mã Giảm Giá & Kích Cầu Giỏ Hàng Thông Minh
(Smart Voucher Combinatorial Optimization & Upsell Gap Analysis)

So sánh:
1. Baseline 1: Lựa chọn ngẫu nhiên của người dùng (Random Eligible Pick)
2. Baseline 2: Áp dụng mã đầu tiên tìm thấy (First-Fit Greedy)
3. Proposed: Thuật toán Tối ưu hóa Ràng buộc & Phân tích Khoảng cách Giá trị (Constraint Optimizer)
"""

import json
import os
import random
import time

BENCHMARK_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(BENCHMARK_DIR, "dataset_voucher_cases.json")

def baseline_random_pick(case, seed=42):
    random.seed(seed + case["test_id"])
    eligible = []
    cart_total = case["cart_total"]
    for c in case["available_coupons"]:
        if cart_total >= c["min_spend"]:
            if c["type"] == "FLAT":
                disc = c["value"]
            else:
                disc = min(c.get("max_cap", 999999), cart_total * c["value"] // 100)
            eligible.append((c["code"], disc))
            
    if not eligible:
        return None, 0
    return random.choice(eligible)

def baseline_first_fit(case):
    cart_total = case["cart_total"]
    for c in case["available_coupons"]:
        if cart_total >= c["min_spend"]:
            if c["type"] == "FLAT":
                disc = c["value"]
            else:
                disc = min(c.get("max_cap", 999999), cart_total * c["value"] // 100)
            return c["code"], disc
    return None, 0

def proposed_smart_optimizer(case, max_gap_threshold=35000):
    """
    Thuật toán Tối ưu hóa Ràng buộc Đề xuất:
    1. Tìm mã giảm giá cho mức chiết khấu cực đại (Global Maximum Discount)
    2. Phân tích khoảng cách giá trị (Gap Analysis) với các tầng mã cao hơn
    3. Sinh gợi ý bù món thông minh giúp tối đa hóa thặng dư người tiêu dùng
    """
    cart_total = case["cart_total"]
    coupons = case["available_coupons"]
    
    # 1. Tối ưu mã hiện tại
    best_code = None
    best_disc = 0
    for c in coupons:
        if cart_total >= c["min_spend"]:
            if c["type"] == "FLAT":
                disc = c["value"]
            else:
                disc = min(c.get("max_cap", 999999), cart_total * c["value"] // 100)
            if disc > best_disc:
                best_disc = disc
                best_code = c["code"]
                
    # 2. Phân tích Upsell Gap
    upsell_rec = None
    for c in coupons:
        if cart_total < c["min_spend"]:
            gap = c["min_spend"] - cart_total
            if gap <= max_gap_threshold:
                if c["type"] == "FLAT":
                    target_disc = c["value"]
                else:
                    target_disc = min(c.get("max_cap", 999999), c["min_spend"] * c["value"] // 100)
                
                net_saved = target_disc - best_disc - gap
                upsell_rec = {
                    "target_code": c["code"],
                    "gap": gap,
                    "target_disc": target_disc,
                    "net_saved": net_saved,
                    "message": f"Mua thêm {gap:,}đ để dùng mã {c['code']} (giảm {target_disc:,}đ)"
                }
                break

    return best_code, best_disc, upsell_rec

def run_voucher_evaluation():
    with open(DATASET_FILE, "r", encoding="utf-8") as f:
        cases = json.load(f)
        
    n = len(cases)
    
    # Metrics
    optimal_matches_b1 = 0
    optimal_matches_b2 = 0
    optimal_matches_prop = 0
    
    total_disc_b1 = 0
    total_disc_b2 = 0
    total_disc_prop = 0
    
    upsell_detected_count = 0
    simulated_aov_gain = 0
    
    t0 = time.time()
    for case in cases:
        gt_code = case["ground_truth_best_coupon"]
        gt_disc = case["ground_truth_discount"]
        
        # B1
        c1, d1 = baseline_random_pick(case)
        if d1 == gt_disc:
            optimal_matches_b1 += 1
        total_disc_b1 += d1
        
        # B2
        c2, d2 = baseline_first_fit(case)
        if d2 == gt_disc:
            optimal_matches_b2 += 1
        total_disc_b2 += d2
        
        # Proposed
        cp, dp, up = proposed_smart_optimizer(case)
        if dp == gt_disc:
            optimal_matches_prop += 1
        total_disc_prop += dp
        
        if up is not None:
            upsell_detected_count += 1
            simulated_aov_gain += up["gap"]

    avg_latency_ms = round((time.time() - t0) * 1000 / n, 3)

    return {
        "total_cases": n,
        "Optimal_Rate_Random": round(optimal_matches_b1 / n * 100, 2),
        "Optimal_Rate_FirstFit": round(optimal_matches_b2 / n * 100, 2),
        "Optimal_Rate_Proposed": round(optimal_matches_prop / n * 100, 2),
        "Avg_Discount_Random": round(total_disc_b1 / n),
        "Avg_Discount_FirstFit": round(total_disc_b2 / n),
        "Avg_Discount_Proposed": round(total_disc_prop / n),
        "Discount_Improvement_Percent": round((total_disc_prop - total_disc_b1) / (total_disc_b1 if total_disc_b1 > 0 else 1) * 100, 2),
        "Upsell_Trigger_Rate": round(upsell_detected_count / n * 100, 2),
        "Avg_AOV_Lift_VND": round(simulated_aov_gain / (upsell_detected_count if upsell_detected_count > 0 else 1)),
        "Avg_Latency_ms": avg_latency_ms
    }

if __name__ == "__main__":
    res = run_voucher_evaluation()
    print("=" * 70)
    print("KẾT QUẢ ĐÁNH GIÁ THỰC NGHIỆM: TỐI ƯU HÓA MÃ GIẢM GIÁ (VOUCHER)")
    print(f"Tổng số tình huống giỏ hàng thử nghiệm: {res['total_cases']} kịch bản")
    print("=" * 70)
    print(f"{'Chỉ số tối ưu':<32} | {'Baseline 1 (Random)':<17} | {'Baseline 2 (First)':<17} | {'Proposed Solver':<15}")
    print("-" * 70)
    print(f"{'Tỷ lệ chọn mã tối ưu nhất':<32} | {res['Optimal_Rate_Random']:<16}% | {res['Optimal_Rate_FirstFit']:<16}% | {res['Optimal_Rate_Proposed']:<14}%")
    print(f"{'Số tiền giảm trung bình':<32} | {res['Avg_Discount_Random']:<14} đ | {res['Avg_Discount_FirstFit']:<14} đ | {res['Avg_Discount_Proposed']:<12} đ")
    print("-" * 70)
    print(f"-> Mức độ gia tăng số tiền tiết kiệm cho khách : +{res['Discount_Improvement_Percent']}%")
    print(f"-> Tỷ lệ phát hiện cơ hội bù món (Upsell)       : {res['Upsell_Trigger_Rate']}% số đơn hàng")
    print(f"-> Giá trị đơn hàng tăng thêm cho nhà hàng     : +{res['Avg_AOV_Lift_VND']:,} đ / đơn kích cầu")
    print(f"-> Thời gian giải thuật toán                    : {res['Avg_Latency_ms']} ms (O(N) Constraint Solver)")
    print("=" * 70)
