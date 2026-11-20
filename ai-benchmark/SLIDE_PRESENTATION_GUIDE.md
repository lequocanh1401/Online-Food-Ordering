# CẨM NANG THUYẾT TRÌNH BÁO CÁO VỚI THẦY HƯỚNG DẪN & HỘI ĐỒNG
**Chuyên đề:** Ứng dụng Trí tuệ Nhân tạo & Đánh giá Thực nghiệm (Khoa học Máy tính)

---

## 1. NỘI DUNG 4 SLIDE NÂNG CẤP DÀNH RIÊNG CHO PHẦN AI

Bạn chỉ cần thêm hoặc thay thế 4 slide này vào bài thuyết trình của mình:

### Slide 1: Đặt Vấn Đề & Định Hướng Nghiên Cứu AI
* **Tiêu đề:** Tích hợp AI trong Hệ thống F&B: Từ Thực tiễn đến Bài toán Khoa học Máy tính
* **Nội dung chính:**
  * **Hạn chế của phương pháp truyền thống:**
    * *Kiểm duyệt nội dung:* Blacklist regex bỏ sót $73\%$ vi phạm do teencode, từ lóng và mỉa mai.
    * *Tìm kiếm món ăn:* Tìm kiếm chuỗi ký tự (`SQL LIKE`) trả về $100\%$ kết quả rỗng khi khách mô tả ngữ cảnh tự nhiên.
    * *Áp dụng khuyến mãi:* Khách hàng chỉ chọn được mã tối ưu ở $35\%$ trường hợp do các điều kiện ràng buộc phức tạp.
  * **3 Trụ cột Nghiên cứu:**
    1. *NLP Content Moderation:* Phân loại ngữ nghĩa ngôn ngữ độc hại (Admin).
    2. *Semantic Search & Query Expansion:* Khai phá ý định & mở rộng truy vấn (Customer).
    3. *Combinatorial Voucher Optimizer:* Tối ưu hóa ràng buộc & kích cầu thông minh (Order).

---

### Slide 2: Thực Nghiệm 1 – Kiểm Duyệt Bình Luận Độc Hại (NLP)
* **Tiêu đề:** Đánh giá Thực nghiệm: Kiểm duyệt Bình luận Tự động
* **Bộ dữ liệu thử nghiệm:** 200 mẫu bình luận tiếng Việt (100 Toxic vs 100 Normal có gán nhãn).
* **Bảng số liệu so sánh:**
  | Chỉ số Đánh giá | Baseline (Blacklist) | Proposed (AI / NLP) | Mức độ cải thiện |
  | :--- | :---: | :---: | :---: |
  | **Accuracy** | 63.5% | **91.5%** | **+28.0%** |
  | **Precision** | 100.0% | **95.6%** | Không bắt nhầm khách |
  | **Recall** | 27.0% | **87.0%** | **Tăng gấp 3.2 lần** |
  | **F1-Score** | 42.5% | **91.1%** | **+48.6%** |
* **Điểm nhấn học thuật:**
  * Bắt trúng **$91.4\%$** teencode/viết tắt (so với $40.0\%$ của cách cũ).
  * Nhận diện được **$80.0\%$** câu mỉa mai cay độc và **$88.6\%$** cảnh báo ngộ độc thực phẩm.

---

### Slide 3: Thực Nghiệm 2 – Tìm Kiếm Món Ăn Ngữ Nghĩa (IR)
* **Tiêu đề:** Đánh giá Thực nghiệm: Tìm kiếm Ngữ nghĩa & Mở rộng Truy vấn
* **Bộ dữ liệu thử nghiệm:** 60 câu truy vấn đa ý định (tâm trạng, thời tiết, gym, chay, ngân sách).
* **Bảng số liệu so sánh:**
  | Chỉ số (IR Metrics) | SQL Exact LIKE | SQL Token LIKE | Proposed Semantic AI |
  | :--- | :---: | :---: | :---: |
  | **Zero-Result Rate** | 100.0% | 20.0% | **0.0% (Triệt tiêu lỗi)** |
  | **Hit Rate @ 1** | 0.0% | 15.0% | **73.33%** |
  | **Hit Rate @ 3** | 0.0% | 18.33% | **96.67%** |
  | **MRR (Mean Reciprocal Rank)** | 0.000 | 0.170 | **0.851** |
* **Điểm nhấn học thuật:**
  * Chỉ số **MRR đạt 0.851** chứng minh món ăn phù hợp nhất luôn nằm ở vị trí đầu tiên hoặc thứ 2.
  * Đáp ứng hoàn hảo các truy vấn trừu tượng như *"trời mưa lạnh thèm ăn gì ấm bụng"* $\rightarrow$ Gợi ý ngay *Bún bò Huế, Phở, Lẩu bò*.

---

### Slide 4: Thực Nghiệm 3 – Tối Ưu Hóa Mã Giảm Giá & Kích Cầu (Optimization)
* **Tiêu đề:** Tối ưu hóa Tổ hợp Mã Giảm Giá & Phân tích Khoảng cách Ngưỡng
* **Bộ dữ liệu thử nghiệm:** 40 kịch bản giỏ hàng từ 75k đến 850k đối chiếu với 6 loại voucher.
* **Bảng số liệu so sánh:**
  | Chỉ số | Baseline (User Pick) | Proposed Constraint Solver | Hiệu quả |
  | :--- | :---: | :---: | :---: |
  | **Tỷ lệ chọn mã tối ưu** | 35.0% | **100.0%** | Tuyệt đối |
  | **Số tiền giảm trung bình** | 24,058 đ | **38,140 đ** | **Tiết kiệm thêm +58.5%** |
  | **Tỷ lệ phát hiện Upsell** | 0.0% | **52.5%** số đơn | Tăng giá trị đơn |
  | **Thời gian giải thuật toán** | - | **0.025 ms** | Tức thời |
* **Điểm nhấn học thuật:**
  * Giải quyết bài toán Knapsack / Constraint Optimization trong thời gian $0.025\text{ ms}$.
  * Cơ chế Gap Analysis mang lại lợi ích hai chiều: Khách hàng tiết kiệm nhiều hơn, nhà hàng tăng doanh thu giỏ hàng (+14.000đ/đơn kích cầu).

---

## 2. KỊCH BẢN LỜI THOẠI THUYẾT TRÌNH VỚI THẦY (SPEECH SCRIPT)

Khi đến lượt bạn báo cáo, hãy trình bày một cách tự tin, từ tốn:

> *"Kính thưa thầy,*
>
> *Tiếp thu sâu sắc ý kiến đóng góp của thầy ở buổi báo cáo trước về việc nâng cao hàm lượng Khoa học Máy tính và tính định lượng của các mô-đun AI, em đã nghiên cứu và tái cấu trúc lại toàn bộ phần AI của đề tài.*
>
> *Thay vì áp dụng AI vào các tác vụ nghiệp vụ thông thường mà code if/else có thể giải quyết, em tập trung vào 3 bài toán trọng tâm nơi các phương pháp truyền thống bộc lộ rõ sự bất lực:*
>
> 1. *Thứ nhất là bài toán Kiểm duyệt ngôn ngữ độc hại cho Admin: Em đã xây dựng bộ dữ liệu benchmark gồm 200 mẫu tiếng Việt có gán nhãn, bao gồm teencode, mỉa mai và các phản ánh ngộ độc thực phẩm. Kết quả thực nghiệm cho thấy mô hình NLP đề xuất nâng chỉ số F1-Score từ 42.5% của Blacklist truyền thống lên **91.1%**, đặc biệt là khả năng bắt trúng các từ lóng che dấu lên tới **91.4%** mà không phạt nhầm các bình luận góp ý chân thành.*
>
> 2. *Thứ hai là bài toán Tìm kiếm món ăn ngữ nghĩa: SQL LIKE truyền thống gặp tỷ lệ trả về rỗng lên tới 100% khi người dùng gõ ngôn ngữ tự nhiên. Bằng cách áp dụng Semantic Intent Extraction và Query Expansion, hệ thống đã triệt tiêu hoàn toàn kết quả rỗng (0%), đạt tỷ lệ **Hit Rate @ 3 lên tới 96.67%** và chỉ số **MRR đạt 0.851**.*
>
> 3. *Thứ ba là bài toán Tối ưu hóa mã giảm giá: Em mô hình hóa việc áp dụng voucher dưới dạng bài toán Tối ưu hóa ràng buộc (Constraint Optimization) kết hợp phân tích khoảng cách ngưỡng (Gap Analysis). Thuật toán giải quyết trong **0.025 mili-giây**, đạt độ tối ưu **100%**, giúp khách hàng tiết kiệm thêm **58.5%** chi phí và giúp nhà hàng tăng doanh thu đơn hàng thông qua các gợi ý bù món thông minh.*
>
> *Toàn bộ dữ liệu benchmark, script chạy thực nghiệm tự động và bảng ma trận nhầm lẫn chi tiết em đã hoàn thiện đầy đủ trong báo cáo. Em xin phép được lắng nghe thêm những góp ý quý báu của thầy ạ."*

---

## 3. BÍ KÍP TRẢ LỜI CÁC CÂU HỎI VẶN VẸO CỦA HỘI ĐỒNG (FAQ)

**Câu hỏi 1: "Tại sao em không tự huấn luyện một mô hình Deep Learning (như train lại BERT) mà lại dùng Prompting / API?"**
* **Trả lời:** *"Dạ thưa thầy, trong phạm vi ứng dụng thực tế của một hệ thống F&B, việc finetune lại toàn bộ một mô hình lớn đòi hỏi chi phí tài nguyên phần cứng rất cao và dễ bị overfitting với tập dữ liệu nhỏ. Do đó, em tiếp cận theo hướng kỹ thuật Prompt Engineering nâng cao kết hợp Zero-shot/Few-shot learning trên mô hình nền tảng ngôn ngữ lớn (Gemini 2.5 Flash / PhoBERT) và xây dựng bộ lọc ngữ nghĩa cục bộ. Trọng tâm của khóa luận là thiết kế kiến trúc pipeline, xây dựng bộ benchmark chuẩn tiếng Việt và đánh giá định lượng so sánh hiệu năng với các phương pháp cơ bản ạ."*

**Câu hỏi 2: "Chỉ số MRR trong bài toán tìm kiếm có ý nghĩa là gì?"**
* **Trả lời:** *"Dạ thưa thầy, MRR là viết tắt của Mean Reciprocal Rank (Hạng nghịch đảo trung bình). Nếu món ăn đúng nằm ở vị trí đầu tiên, điểm là $1/1 = 1$. Nếu nằm ở vị trí thứ hai, điểm là $1/2 = 0.5$. Chỉ số MRR của hệ thống đạt **0.851** chứng minh rằng trong đa số các trường hợp, món ăn phù hợp nhất với ý định của người dùng luôn được mô hình xếp hạng ở vị trí số 1 hoặc số 2, giúp người dùng tìm được món ngay lập tức mà không phải cuộn trang."*

**Câu hỏi 3: "Tại sao Precision của Blacklist lại là 100% trong bảng kiểm duyệt?"**
* **Trả lời:** *"Dạ thưa thầy, vì Blacklist chỉ chứa các từ chửi thề cực đoan như 'địt', 'đụ', 'lồn'. Một khi câu nào dính từ đó thì chắc chắn là Toxic nên Precision đạt 100%. Tuy nhiên, nhược điểm chí mạng của nó là Recall chỉ có **27%**, tức là nó bỏ sót tới 73% các câu chửi bằng teencode ('d!t', 'vcl', 'nhu c*t') hoặc mỉa mai. Mô hình AI của em chấp nhận đánh đổi một lượng rất nhỏ Precision (đạt 95.6%) để đẩy Recall lên tới **87%**, giúp F1-score tổng thể nhảy vọt từ 42.5% lên **91.1%** ạ."*
