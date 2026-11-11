# 🎓 KHÓA LUẬN TỐT NGHIỆP ĐẠI HỌC - VNU-UET
## Đề tài: Nghiên cứu và Phát triển Nền tảng Thương mại Điện tử F&B Tích hợp Quản trị Thông minh
**Sinh viên thực hiện:** Lê Quốc Anh  
**Ngành:** Công nghệ thông tin -- Trường Đại học Công nghệ, ĐHQGHN  

---

## 📁 Cấu Trúc Thư Mục Khóa Luận

```text
uet-graduation-thesis/
│
├── uetgraduation.cls        # Lớp tài liệu LaTeX chuẩn quy chế tốt nghiệp VNU-UET
├── sizes.clo                # Định nghĩa cỡ chữ, giãn dòng và ngắt trang
├── UET logo.pdf             # Logo chính thức Trường Đại học Công nghệ
│
├── main.tex                 # Tệp mã nguồn LaTeX hoàn chỉnh (6 chương chuẩn học thuật)
├── compile.bat              # Script biên dịch tự động 1-click trên Windows (LuaLaTeX)
│
├── BAO_CAO_KHOA_LUAN_TOT_NGHIEP.md # Bản báo cáo toàn văn định dạng Markdown (đọc/xem trước ngay trong VS Code)
│
└── figures/                 # Danh mục hình vẽ, sơ đồ kiến trúc & ảnh chụp giao diện
    ├── fig_usecase_general.puml / .png       # Biểu đồ Use Case tổng quát (Guest/Customer, Owner, Admin)
    ├── fig_deployment.puml / .png            # Sơ đồ triển khai hệ thống (Tomcat WS, MySQL, Stripe, Gemini 2.5)
    ├── fig_sequence_auth.puml / .png         # Sơ đồ tuần tự Đăng ký/Đăng nhập JWT
    ├── fig_sequence_order_coupon.puml / .png # Sơ đồ tuần tự Giỏ hàng & Coupon Engine
    ├── fig_sequence_stripe_payment.puml/.png # Sơ đồ tuần tự Thanh toán Stripe Checkout & COD
    ├── fig_sequence_order_status.puml / .png # Sơ đồ tuần tự Điều phối & Máy trạng thái Đơn hàng
    ├── fig_sequence_admin_review.puml / .png # Sơ đồ tuần tự Kiểm duyệt đánh giá Super Admin
    ├── fig_sequence_websocket_ai.puml / .png # Sơ đồ tuần tự WebSocket & Dual-Persona Agentic AI
    ├── fig_sequence_chatbot_rag.puml / .png  # Sơ đồ tuần tự AI Concierge & Menu Catalog RAG
    ├── fig_erd_full.puml / .png              # Sơ đồ Cơ sở dữ liệu quan hệ (ERD 21 bảng 3NF)
    ├── fig_ui_home.jpg                       # Ảnh thật Trang chủ & Carousel "Hôm Nay Ăn Gì?"
    ├── fig_ui_cart.jpg                       # Ảnh thật Giỏ hàng, Mã ưu đãi & Thanh toán Stripe/COD
    ├── fig_ui_owner_dashboard.jpg            # Ảnh thật Bảng điều khiển Quản trị Chủ nhà hàng
    ├── fig_ui_superadmin.jpg                 # Ảnh thật Kiểm duyệt Đánh giá Toàn sàn Super Admin
    ├── fig_ui_ai_copilot.jpg                 # Ảnh thật AI Copilot & Tác tử Hành động 1-Click
    └── fig_ui_chatbot_rag.jpg                # Ảnh thật Trợ lý Ẩm thực Khách hàng Menu Catalog RAG
```

---

## 🚀 Hướng Dẫn Sử Dụng & Biên Dịch Khóa Luận

### Cách 1: Sử dụng Overleaf (Khuyên Dùng - Nhanh Chóng & Tiện Lợi Nhất)
1. Nén toàn bộ thư mục `uet-graduation-thesis` thành tệp `.zip`.
2. Truy cập [Overleaf](https://www.overleaf.com), chọn **New Project** $\to$ **Upload Project** và tải tệp `.zip` lên.
3. **Cực kỳ quan trọng:** Vào mục **Menu** (góc trên bên trái của Overleaf) $\to$ tại mục **Compiler**, chuyển từ *pdfLaTeX* sang **LuaLaTeX**.
4. Nhấn nút **Recompile** (Ctrl + S) để sinh ra bản PDF hoàn hảo đúng chuẩn mẫu UET.

---

### Cách 2: Biên dịch Ngoại Tuyến (Local với MiKTeX hoặc TeX Live)
1. Cài đặt bản phân phối TeX (khuyên dùng [TeX Live](https://www.tug.org/texlive/) hoặc [MiKTeX](https://miktex.org/)).
2. Đảm bảo hệ thống có font chữ *Times New Roman* (mặc định đã có sẵn trên hệ điều hành Windows).
3. Mở Terminal tại thư mục `uet-graduation-thesis` và chạy:
   ```cmd
   compile.bat
   ```
   Hoặc chạy lệnh trực tiếp bằng dòng lệnh:
   ```cmd
   lualatex -synctex=1 -interaction=nonstopmode main.tex
   lualatex -synctex=1 -interaction=nonstopmode main.tex
   ```
   *(Chạy 2 lần để LaTeX cập nhật số trang, mục lục và danh mục bảng biểu).*

---

### Cách 3: Đọc và Chỉnh Sửa Trực Tiếp Trên VS Code
* Bạn có thể mở trực tiếp tệp [BAO_CAO_KHOA_LUAN_TOT_NGHIEP.md](file:///d:/Code/Online%20Food%20Ordering/uet-graduation-thesis/BAO_CAO_KHOA_LUAN_TOT_NGHIEP.md) trong Visual Studio Code và nhấn `Ctrl + Shift + V` để xem trước giao diện báo cáo kèm đầy đủ bảng biểu, mã nguồn và hình ảnh minh họa chất lượng cao.
* Dễ dàng sao chép sang Microsoft Word hoặc Google Docs để nộp bản thảo cho Thầy/Cô hướng dẫn xem trước.

---

## ✏️ Tùy Biến Thông Tin Cá Nhân trong `main.tex`

Mở file [main.tex](file:///d:/Code/Online%20Food%20Ordering/uet-graduation-thesis/main.tex) và cập nhật các dòng sau ở phần đầu nếu cần thay đổi:
* Dòng 43: `\studentname{Lê Quốc Anh}` (Họ và tên của bạn)
* Dòng 48: `\supervisor{TS. [Họ và tên Cán bộ hướng dẫn]}` (Thay bằng tên Thầy/Cô hướng dẫn thực tế)
* Dòng 53: `\englishsupervisor{Dr. [Supervisor Name]}` (Tên Thầy/Cô bằng tiếng Anh)
* Dòng 47: `\year{2026}` (Năm bảo vệ khóa luận)
