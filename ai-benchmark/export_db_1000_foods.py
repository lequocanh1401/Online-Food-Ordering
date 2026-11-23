# -*- coding: utf-8 -*-
"""
Xuất toàn bộ 1.000 món ăn thành db_1000_foods.json để phục vụ đo kiểm Semantic Search Benchmark
"""

import json
import os
import subprocess

OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "db_1000_foods.json")

def export_foods():
    # Gọi mysql.exe xuất ra tab-separated text
    cmd = [
        "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe",
        "-h", "127.0.0.1",
        "-P", "3307",
        "-u", "root",
        "-p123456",
        "anh_food_yt",
        "--default-character-set=utf8mb4",
        "-N", "-B",
        "-e", "SELECT f.id, f.name, f.price, IFNULL(f.description, ''), f.is_vegetarian, IFNULL(c.name, 'Món Khác') FROM food f LEFT JOIN category c ON f.food_category_id = c.id;"
    ]
    
    # Đọc raw bytes và decode với errors='replace'
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = proc.communicate()
    
    text = stdout.decode("utf-8", errors="replace")
    lines = text.strip().split("\n")
    
    foods = []
    for line in lines:
        parts = line.split("\t")
        if len(parts) >= 6:
            fid = int(parts[0])
            name = parts[1].strip()
            price = int(parts[2]) if parts[2].isdigit() else 50000
            desc = parts[3].strip()
            is_veg = True if parts[4] in ["1", "\x01"] else False
            cat_name = parts[5].strip()
            
            # Tự động gán tags dựa trên tên và mô tả
            tags = []
            full_text = (name + " " + desc + " " + cat_name).lower()
            if any(w in full_text for w in ["cay", "sa tế", "ớt", "tiêu"]): tags.append("cay")
            if any(w in full_text for w in ["nóng", "lẩu", "nước", "hầm"]): tags.append("nóng")
            if any(w in full_text for w in ["bún bò", "phở", "lẩu bò", "canh", "ấm"]): tags.append("ấm bụng")
            if any(w in full_text for w in ["thanh mát", "giải nhiệt", "trà", "mát lạnh", "giải khát"]): tags.append("thanh mát")
            if is_veg or any(w in full_text for w in ["chay", "thanh đạm", "đậu hũ", "nấm"]): tags.append("chay")
            if any(w in full_text for w in ["bò", "steak", "thịt", "đùi gà", "sashimi", "protein", "đạm"]): tags.append("đạm cao")
            if any(w in full_text for w in ["bánh", "chè", "ngọt", "kem", "trà sữa", "mousse"]): tags.append("ngọt")
            if price <= 60000: tags.append("dưới 50k")
            if any(w in full_text for w in ["nhậu", "bia", "nướng"]): tags.append("nhậu")
            if any(w in full_text for w in ["huế"]): tags.append("đặc sản huế")
            if any(w in full_text for w in ["bình dân", "sinh viên", "cơm", "bún", "bánh mì"]): tags.append("bình dân")
            
            foods.append({
                "id": fid,
                "name": name,
                "category": cat_name,
                "description": desc,
                "price": price,
                "is_vegetarian": is_veg,
                "tags": tags
            })

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(foods, f, ensure_ascii=False, indent=2)

    print(f"-> Đã xuất thành công {len(foods)} món ăn vào file: {OUTPUT_FILE}")

if __name__ == "__main__":
    export_foods()
