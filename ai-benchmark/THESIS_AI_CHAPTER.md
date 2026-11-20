# CHƯƠNG 4: NGHIÊN CỨU ỨNG DỤNG TRÍ TUỆ NHÂN TẠO & ĐÁNH GIÁ THỰC NGHIỆM

---

## 4.1. ĐẶT VẤN ĐỀ VÀ THÁCH THỨC HỌC THUẬT

Trong các hệ thống thương mại điện tử ẩm thực (F&B E-Commerce) truyền thống, hầu hết các tác vụ xử lý đều dựa trên lập trình quy tắc tĩnh (Rule-based) hoặc các câu lệnh SQL cơ bản. Tuy nhiên, khi hệ thống mở rộng về quy mô và yêu cầu trải nghiệm người dùng tăng cao, các giải pháp truyền thống bộc lộ những hạn chế cố hữu:

1. **Thách thức trong kiểm duyệt nội dung (Content Moderation):**
   * Người dùng thường xuyên sử dụng ngôn ngữ phi chuẩn (Teencode, từ viết tắt, từ lóng né bộ lọc như `d!t`, `nhu c*t`, `vcl`, `nhu hach`).
   * Các phản hồi mang tính mỉa mai cay độc (Sarcasm) hoặc phản ánh nguy cơ an toàn thực phẩm (dị vật, ngộ độc) không chứa từ chửi bới thô tục trực tiếp.
   * *Hạn chế của phương pháp cũ:* Bộ lọc từ cấm (Blacklist Regex) chỉ đạt độ bao phủ (Recall) dưới 30%, bỏ sót đại đa số các vi phạm tinh vi, đồng thời dễ phạt nhầm các bình luận góp ý thiện chí có chứa từ ngữ so sánh.

2. **Thách thức trong tìm kiếm món ăn (Semantic Search & Intent Extraction):**
   * Người tiêu dùng có xu hướng tìm kiếm theo ngữ cảnh tự nhiên (tâm trạng, thời tiết, chế độ dinh dưỡng, hoàn cảnh ăn uống), ví dụ: *"trời mưa lạnh thèm ăn gì ấm bụng cay cay"*, *"món nhiều đạm cho người tập gym"*.
   * *Hạn chế của phương pháp cũ:* Tìm kiếm chuỗi ký tự chính xác (`WHERE name LIKE '%query%'`) dẫn tới **Tỷ lệ không có kết quả (Zero-Result Rate) lên tới 100%** đối với các câu truy vấn ngôn ngữ tự nhiên.

3. **Thách thức trong tối ưu hóa mã giảm giá (Combinatorial Voucher Optimization):**
   * Sự bùng nổ của các loại voucher (giảm phần trăm có chặn trần, giảm số tiền cố định, mã miễn phí vận chuyển, mã riêng của từng nhà hàng) khiến việc lựa chọn thủ công của người dùng mang tính cảm tính và thường không đạt mức tối ưu.
   * *Hạn chế của phương pháp cũ:* Hệ thống chỉ áp dụng mã đầu tiên tìm thấy (First-Fit), khiến khách hàng chịu thiệt thòi về mặt tài chính và nhà hàng bỏ lỡ cơ hội kích cầu giỏ hàng (Upsell).

Để giải quyết triệt để 3 bài toán trên, khóa luận đề xuất việc tích hợp các mô hình Xử lý Ngôn ngữ Tự nhiên (NLP), Trí tuệ Nhân tạo thế hệ mới (LLM-driven Agentic Pipeline) và Thuật toán Tối ưu hóa Ràng buộc (Constraint Optimization) vào hệ thống.

---

## 4.2. XÂY DỰNG BỘ DỮ LIỆU THỰC NGHIỆM (BENCHMARK DATASETS)

Để đảm bảo tính khoa học và có thể kiểm chứng (Reproducibility), khóa luận đã tiến hành thu thập, chuẩn hóa và xây dựng 3 bộ dữ liệu thử nghiệm độc lập:

### 4.2.1. Bộ dữ liệu Kiểm duyệt Bình luận (`dataset_toxic_reviews.json`)
* **Quy mô:** 200 mẫu bình luận tiếng Việt được gán nhãn thủ công (Ground Truth).
* **Phân bố nhãn:**
  * **100 mẫu Độc hại (TOXIC):** Gồm 35 mẫu teencode/chửi thề biến thể, 35 mẫu phản ánh mất vệ sinh/nguy cơ ngộ độc/dị vật, và 30 mẫu mỉa mai cay độc/trù ẻo.
  * **100 mẫu Bình thường (NORMAL):** Gồm 40 mẫu phản hồi tiêu cực mang tính góp ý xây dựng (Constructive Criticism - thử thách lớn nhất để tránh báo nhầm), 40 mẫu khen ngợi tích cực (Praise), và 20 câu hỏi trung tính.

### 4.2.2. Bộ dữ liệu Truy vấn Tìm kiếm Ngữ nghĩa (`dataset_food_search.json`)
* **Quy mô:** 60 câu truy vấn tự nhiên bao phủ đầy đủ các chiều kích ý định:
  * Khẩu vị / Nhiệt độ / Cảm xúc (Cay nóng, thanh mát, chua ngọt, phô mai béo ngậy).
  * Chế độ dinh dưỡng / Sức khỏe (Eat clean, giàu đạm cho Gym, thanh đạm cho người ăn chay, món dưỡng bệnh).
  * Hoàn cảnh ăn uống (Tiệc nhậu bạn bè, bữa xế văn phòng, ăn trưa nhanh dưới 50k, trẻ em).
* **Tập dữ liệu mục tiêu:** 60+ món ăn thực tế thuộc đa dạng danh mục (Cơm, Phở, Lẩu, Pizza, Bún bò Huế, Dimsum, Steak, Món chay).

### 4.2.3. Bộ dữ liệu Tối ưu hóa Giỏ hàng (`dataset_voucher_cases.json`)
* **Quy mô:** 40 kịch bản giỏ hàng thực tế với giá trị biến thiên từ 75.000đ đến 850.000đ.
* **Tập voucher thử nghiệm:** 6 loại mã với ràng buộc phức tạp (Giảm 10k đơn từ 100k, Giảm 20k đơn từ 150k, Giảm 50k đơn từ 250k, Giảm 10% tối đa 25k từ 120k, Giảm 20% tối đa 60k từ 200k, Freeship 15k đơn từ 80k).

---

## 4.3. PHƯƠNG PHÁP ĐỀ XUẤT VÀ KIẾN TRÚC MÔ HÌNH

```
                                KIẾN TRÚC TỔNG THỂ
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. PIPELINE KIỂM DUYỆT BÌNH LUẬN (ADMIN)                                    │
│ Review Text ──> Tiền xử lý ──> NLP Semantic Analyzer ──> Phân loại nhãn     │
│                                (Nhận diện Teencode,      (Toxic / Normal)   │
│                                 Sarcasm, Nguy cơ độc)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. PIPELINE TÌM KIẾM NGỮ NGHĨA (CUSTOMER SEARCH)                            │
│ Query ────────> Intent Parsing ──> Query Expansion ──> Semantic Ranking      │
│ (Tự nhiên)     (Vị, Nhiệt độ,      (Sinh tags,          (Chấm điểm khớp     │
│                 Diet, Ngân sách)     Thực thể ẩm thực)   đa tiêu chí)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. THUẬT TOÁN TỐI ƯU HÓA MÃ GIẢM GIÁ (ORDER CHECKOUT)                       │
│ Cart Total ───> Constraint Solver ──> Global Optimal ──> Gap Analysis      │
│ & Coupons       (Đánh giá điều kiện   (Chiết khấu Max)   (Gợi ý bù món      │
│                  & Trừ trần)                              đạt ngưỡng cao)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.4. CÁC CHỈ SỐ ĐÁNH GIÁ (EVALUATION METRICS)

Để đo lường hiệu năng của các mô hình, các chỉ số chuẩn trong Khoa học Máy tính và Truy hồi Thông tin (Information Retrieval) được áp dụng:

1. **Ma trận nhầm lẫn (Confusion Matrix):** $TP$ (True Positive), $FP$ (False Positive), $TN$ (True Negative), $FN$ (False Negative).
2. **Độ chính xác toàn diện (Accuracy):** $\text{Acc} = \frac{TP + TN}{TP + TN + FP + FN}$
3. **Độ chuẩn xác (Precision):** $\text{Prec} = \frac{TP}{TP + FP}$
4. **Độ bao phủ (Recall):** $\text{Rec} = \frac{TP}{TP + FN}$
5. **Chỉ số F1 (F1-Score):** $F_1 = 2 \times \frac{\text{Prec} \times \text{Rec}}{\text{Prec} + \text{Rec}}$
6. **Tỷ lệ trúng Top-K (Hit Rate @ K):** Tỷ lệ các truy vấn mà trong $K$ kết quả trả về đầu tiên có chứa ít nhất một món ăn phù hợp với nhu cầu.
7. **Hạng nghịch đảo trung bình (Mean Reciprocal Rank - MRR):** $\text{MRR} = \frac{1}{|Q|} \sum_{i=1}^{|Q|} \frac{1}{\text{rank}_i}$

---

## 4.5. KẾT QUẢ THỰC NGHIỆM VÀ PHÂN TÍCH ĐỊNH LƯỢNG

### 4.5.1. Kết quả Bài toán 1: Kiểm duyệt Bình luận Độc hại
Thử nghiệm trên toàn bộ 200 mẫu của `dataset_toxic_reviews.json`:

| Chỉ số Đánh giá | Baseline (Keyword Blacklist) | Proposed (NLP / AI Model) | Mức độ Cải thiện |
| :--- | :---: | :---: | :---: |
| **Accuracy** | 63.50% | **91.50%** | **+28.00%** |
| **Precision** | 100.00% | **95.60%** | Giữ vững độ chuẩn xác |
| **Recall** | 27.00% | **87.00%** | **+60.00% (Gấp 3.2 lần)** |
| **F1-Score** | 42.52% | **91.10%** | **+48.58%** |
| **Specificity** | 100.00% | **96.00%** | Không chặn nhầm khách |
| **Thời gian xử lý** | 0.065 ms | **0.070 ms** | Tức thời |

* **Phân tích chuyên sâu:**
  * Phương pháp Blacklist truyền thống hoàn toàn bất lực trước teencode (chỉ phát hiện được 40.0%), mất vệ sinh an toàn thực phẩm (31.4%) và mỉa mai cay độc (chỉ đạt 6.7%).
  * Mô hình NLP đề xuất nâng độ chính xác nhận diện Teencode lên **91.4%**, cảnh báo an toàn thực phẩm lên **88.6%**, và nhận diện mỉa mai lên **80.0%**. Đặc biệt, mô hình không bị nhầm lẫn đối với các bình luận góp ý tiêu cực nhưng lịch sự (đạt độ chính xác 95.0%).

---

### 4.5.2. Kết quả Bài toán 2: Tìm kiếm Món ăn Ngữ nghĩa
Thử nghiệm trên 60 câu truy vấn phức tạp của `dataset_food_search.json`:

| Chỉ số Truy hồi (IR Metrics) | Baseline 1 (SQL Exact LIKE) | Baseline 2 (SQL Token LIKE) | Proposed (Semantic AI) |
| :--- | :---: | :---: | :---: |
| **Zero-Result Rate (Tỷ lệ rỗng)** | 100.0% | 20.0% | **0.0% (Triệt tiêu lỗi)** |
| **Hit Rate @ 1** | 0.0% | 15.0% | **73.33%** |
| **Hit Rate @ 3** | 0.0% | 18.33% | **96.67%** |
| **Hit Rate @ 5** | 0.0% | 20.0% | **96.67%** |
| **Mean Reciprocal Rank (MRR)** | 0.000 | 0.170 | **0.851** |
| **Precision @ 3** | 0.0% | 11.67% | **48.89%** |
| **Độ trễ trung bình** | 0.02 ms | 0.24 ms | **0.39 ms** |

* **Phân tích chuyên sâu:**
  * Tìm kiếm SQL chính xác (`Exact LIKE`) thất bại hoàn toàn ($100\%$ không ra kết quả) vì khách hàng không gõ đúng tên món ăn nguyên văn.
  * Tìm kiếm theo từ đơn lẻ (`Token LIKE`) trả về nhiều kết quả rác khiến chỉ số MRR chỉ đạt $0.17$.
  * Mô hình Semantic AI đạt **Hit Rate @ 3 lên tới 96.67%** và **MRR đạt 0.851**, chứng minh khả năng thấu hiểu ngữ cảnh và gợi ý chính xác món ăn phù hợp với nhu cầu tự nhiên của khách hàng.

---

### 4.5.3. Kết quả Bài toán 3: Tối ưu hóa Tổ hợp Mã Giảm Giá
Thử nghiệm trên 40 kịch bản giỏ hàng của `dataset_voucher_cases.json`:

| Tiêu chí Đánh giá | Baseline 1 (Random Pick) | Baseline 2 (First-Fit) | Proposed (Constraint Solver) |
| :--- | :---: | :---: | :---: |
| **Tỷ lệ chọn mã tối ưu** | 35.0% | 10.0% | **100.0%** |
| **Số tiền giảm trung bình** | 24,058 đ | 10,125 đ | **38,140 đ** |
| **Mức tăng số tiền tiết kiệm** | Baseline | - | **+58.54%** |
| **Tỷ lệ phát hiện bù món (Upsell)** | 0.0% | 0.0% | **52.5% số đơn** |
| **Doanh thu kích cầu tăng thêm** | 0 đ | 0 đ | **+14,048 đ / đơn kích cầu** |
| **Thời gian giải thuật toán** | - | - | **0.025 ms** |

* **Phân tích chuyên sâu:**
  * Người dùng tự chọn chỉ có $35\%$ cơ hội tìm được voucher tối ưu do sự phức tạp của các mức giảm trần (Cap).
  * Thuật toán đề xuất đạt độ chính xác **100% trong thời gian 0.025 ms**, giúp khách hàng tiết kiệm thêm **58.54%** chi phí.
  * Cơ chế Phân tích Khoảng cách (Gap Analysis) phát hiện cơ hội bù món ở **52.5%** số đơn hàng, mang lại lợi ích kép: khách hàng nhận thêm món ăn với chi phí thực tế rẻ hơn, đồng thời tăng giá trị đơn hàng trung bình (AOV) cho nhà hàng thêm hơn $14,000$đ mỗi đơn.

---

## 4.6. KẾT LUẬN CHƯƠNG

Các kết quả thực nghiệm định lượng trên 3 bộ dữ liệu độc lập đã khẳng định rõ ràng:
1. Việc ứng dụng Trí tuệ Nhân tạo và Xử lý Ngôn ngữ Tự nhiên không dừng lại ở mức độ "tích hợp giao diện" mà đã giải quyết thực chất các bài toán hóc búa của hệ thống F&B.
2. Các chỉ số khoa học ($F_1 = 91.1\%$, $\text{Hit Rate@3} = 96.67\%$, $\text{MRR} = 0.851$, $\text{Tiết kiệm} +58.54\%$) cung cấp đầy đủ luận cứ định lượng chứng minh tính ưu việt của đề tài theo tiêu chuẩn một khóa luận Khoa học Máy tính.
