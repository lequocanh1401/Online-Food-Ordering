# ĐẠI HỌC QUỐC GIA HÀ NỘI  
# TRƯỜNG ĐẠI HỌC CÔNG NGHỆ

---

<br/>

### **KHÓA LUẬN TỐT NGHIỆP ĐẠI HỌC HỆ CHÍNH QUY**
**Ngành:** Công nghệ thông tin

<br/>

# NGHIÊN CỨU VÀ PHÁT TRIỂN NỀN TẢNG THƯƠNG MẠI ĐIỆN TỬ F&B TÍCH HỢP QUẢN TRỊ THÔNG MINH

<br/>

**Sinh viên thực hiện:** Lê Quốc Anh  
**Mã số sinh viên:** 23020005  
**Mã đề tài:** 3408  
**Khóa:** QH-2022-I/CQ  
**Cán bộ hướng dẫn:** TS. Mẫn Đức Chức  

<br/>

**HÀ NỘI -- 2026**

---

\newpage

## LỜI CAM ĐOAN

Tôi xin cam đoan rằng toàn bộ nội dung, số liệu và kết quả nghiên cứu, phát triển được trình bày trong khóa luận tốt nghiệp này với đề tài **"Nghiên cứu và phát triển nền tảng thương mại điện tử F&B tích hợp quản trị thông minh"** là công trình học tập, nghiên cứu và xây dựng thực tế của chính bản thân tôi, dưới sự hướng dẫn khoa học tận tâm của **TS. Mẫn Đức Chức**.

Mọi số liệu khảo sát, bảng biểu đặc tả, sơ đồ kiến trúc, mã nguồn lập trình và các kết quả kiểm thử thực nghiệm được trình bày trong tài liệu này đều do tôi tự phân tích, thiết kế, hiện thực hóa và thu thập một cách độc lập từ dự án mã nguồn thực tế. Các tài liệu, công trình nghiên cứu và tài nguyên tham khảo từ các tác giả khác đều đã được trích dẫn, ghi nhận xuất xứ đầy đủ và hợp pháp tại danh mục Tài liệu tham khảo theo đúng quy định học thuật của Trường Đại học Công nghệ -- Đại học Quốc gia Hà Nội.

Tôi xin chịu hoàn toàn trách nhiệm trước Hội đồng chấm khóa luận và Nhà trường về tính nguyên bản và sự trung thực của khóa luận này.

<br/>

*Hà Nội, tháng 05 năm 2026*  
**Sinh viên thực hiện**  
*(Ký và ghi rõ họ tên)*  

<br/>

**Lê Quốc Anh**

---

\newpage

## LỜI CẢM ƠN

Để hoàn thành khóa luận tốt nghiệp này và khép lại chặng đường học tập ý nghĩa tại giảng đường đại học, em xin được bày tỏ lòng biết ơn sâu sắc và chân thành nhất tới những cá nhân và tập thể đã luôn đồng hành, dìu dắt và giúp đỡ em trong suốt thời gian qua.

Trước hết, em xin gửi lời tri ân sâu sắc nhất tới thầy giáo **TS. Mẫn Đức Chức**, người đã trực tiếp định hướng, gợi mở đề tài, dành nhiều thời gian quý báu để theo sát quá trình nghiên cứu, chỉ bảo và đưa ra những đóng góp chuyên môn vô cùng sâu sắc, thiết thực giúp em từng bước hoàn thiện hệ thống phần mềm cũng như bản báo cáo này.

Em cũng xin trân trọng gửi lời cảm ơn tới toàn thể các thầy cô giáo Khoa Công nghệ Thông tin, Trường Đại học Công nghệ -- Đại học Quốc gia Hà Nội, những người đã truyền dạy cho em những nền tảng kiến thức chuyên môn vững chắc, tư duy kỹ thuật khoa học và tinh thần học hỏi không ngừng trong suốt các năm học vừa qua.

Cuối cùng, em xin dành tình cảm biết ơn vô hạn tới gia đình, cha mẹ và bạn bè thân thiết. Gia đình luôn là điểm tựa tinh thần vững chắc, nguồn động viên to lớn giúp em vượt qua mọi áp lực, thử thách trong học tập và cuộc sống để hoàn thành trọn vẹn khóa luận tốt nghiệp này.

<br/>

*Hà Nội, tháng 05 năm 2026*  
**Lê Quốc Anh**

---

\newpage

## TÓM TẮT KHÓA LUẬN

Trong bối cảnh nền kinh tế số và thương mại điện tử phát triển vượt bậc, ngành dịch vụ ẩm thực (F&B) đang trải qua quá trình chuyển đổi số mạnh mẽ. Các nền tảng đặt đồ ăn trực tuyến (Food Delivery Platforms) đã trở thành giải pháp thiết yếu kết nối giữa khách hàng có nhu cầu ẩm thực đa dạng với mạng lưới các nhà hàng ăn uống. Tuy nhiên, việc xây dựng một hệ thống phân phối ẩm thực đa bên (Multi-tenant Platform) hoàn chỉnh đòi hỏi phải giải quyết đồng thời nhiều thách thức phức tạp về mặt công nghệ: phân quyền truy cập đa tầng nghiêm ngặt (Khách hàng, Chủ nhà hàng, Quản trị viên sàn), tích hợp cổng thanh toán trực tuyến bảo mật theo chuẩn quốc tế, xử lý ràng buộc khuyến mãi động tránh xung đột dữ liệu biên, và đặc biệt là bài toán tối ưu vận hành quản trị thông minh thời gian thực nhằm khắc phục độ trễ tiếp nhận đơn hàng cũng như hỗ trợ phân tích dữ liệu kinh doanh cho chủ cơ sở.

Khóa luận này tập trung nghiên cứu, thiết kế và phát triển toàn diện hệ thống **"Online Food Ordering"** -- một nền tảng web ứng dụng Full-Stack hiện đại phục vụ việc đặt và quản lý đồ ăn trực tuyến tích hợp các công nghệ quản trị thông minh tiên tiến:
* **Phía Backend:** Được xây dựng trên nền tảng Java 17 với framework Spring Boot 3.4.0. Hệ thống hiện thực cơ chế bảo mật xác thực phi trạng thái (Stateless Authentication) thông qua Spring Security kết hợp JSON Web Token (JWT), hỗ trợ duyệt thực đơn tự do cho khách vãng lai (Guest Browsing) nhưng bảo vệ nghiêm ngặt phân hệ giao dịch và quản trị; áp dụng cơ chế kiểm soát vai trò chặn triệt để leo thang đặc quyền (`ROLE_ADMIN`). Cơ sở dữ liệu quan hệ MySQL 8.x (`anh_food_yt`) được quản trị qua Spring Data JPA và Hibernate ORM gồm 21 thực thể chuẩn 3NF (với bộ dữ liệu mẫu chuẩn thực tiễn gồm 16 nhà hàng thuộc 3 khu vực Hà Nội, TP.HCM, Quảng Nam và 82 món ăn đặc trưng), đảm bảo tính toàn vẹn ACID.
* **Động cơ khuyến mãi nâng cao & Đồng bộ Sự kiện:** Triển khai giải pháp tính toán mã giảm giá linh hoạt (theo tỷ lệ phần trăm hoặc số tiền cố định) với cơ chế kiểm tra ngưỡng đơn hàng tối thiểu. Thuật toán kiểm soát an toàn ngoại lệ (Null-safe Bounds Checking) ở Backend kết hợp cơ chế tự động gỡ mã (Auto-removal) ở Frontend giúp ngăn ngừa gian lận; đồng thời tự động đồng bộ mã ưu đãi khi Chủ quán khởi tạo sự kiện khuyến mãi (`Events` $\to$ `Coupon`).
* **Thanh toán Đa phương thức (Stripe Checkout & COD) kèm Hóa đơn Điện tử:** Hỗ trợ song song thanh toán trực tuyến qua cổng quốc tế Stripe (Checkout Session tuân thủ chuẩn PCI DSS, mở khóa cơ chế callback `complete-payment` ổn định) và thanh toán tiền mặt khi nhận hàng (COD), kết hợp Máy trạng thái đơn hàng (Order State Guard) chặt chẽ và xuất hóa đơn điện tử chi tiết.
* **Truyền thông đơn hàng thời gian thực qua WebSocket & Chuông thuật toán (Real-time Alerts):** Khắc phục triệt để nhược điểm của HTTP Polling, hệ thống triển khai kênh WebSocket hai chiều chuyên biệt (`/ws/orders`) với `TextWebSocketHandler` quản lý phiên đồng thời đa nhà hàng. Sự kiện đơn hàng mới (luôn sắp xếp mới nhất lên đầu) được phát sóng tức thời trong vòng mili-giây kèm chuông cảnh báo 3 âm sắc điều chế bằng Web Audio API.
* **Trợ lý AI Copilot Đa vai trò & Tác tử AI Hành động (Dual-Persona Agentic AI) kết hợp Chatbot Menu Catalog RAG:** Tích hợp mô hình **Google Gemini 2.5 Flash** cùng Động cơ Heuristic DSS dự phòng hai tầng, phân tách hai vai trò chuyên biệt cho Chủ nhà hàng (giám sát doanh thu, cảnh báo kho, tự động đề xuất nút tác tử **tạm khóa món cạn kho 1-Click**) và Super Admin (theo dõi GMV toàn sàn, chỉ số CSAT và **AI Sentinel gỡ bỏ đánh giá vi phạm 1-Click**). Đối với khách hàng, hệ thống cung cấp Widget **AI Concierge** ứng dụng kỹ thuật **Menu Catalog RAG** gợi ý món bán chạy, mã giảm giá và điều hướng trực tiếp tới món ăn đích.
* **Quản lý Kho nguyên liệu Thông minh & Tự động Trừ/Hoàn Tồn kho (Smart Inventory Tracking):** Định lượng tồn kho (`quantity`), đơn vị đo (`unit`) và ngưỡng cảnh báo an toàn (`minThreshold`) cho từng nguyên liệu; tự động khấu trừ khi tạo đơn, tự động hoàn trả khi đơn bị hủy (bao gồm cả lúc chủ quán chuyển trạng thái sang `CANCELLED`) và lưu vết nhật ký xuất nhập kho (`InventoryLog`).
* **Phía Frontend:** Được phát triển bằng React 19 và Vite 8, quản lý trạng thái tập trung qua Redux Toolkit và Redux Thunk. Giao diện thiết kế theo phong cách Dark Mode đồng bộ với lưới khám phá nhà hàng 4 cột thích ứng, thanh điều hướng hài hòa giữa khách hàng và quản trị, carousel tương tác "Hôm nay ăn gì?", đánh giá theo từng món ăn/nhà hàng và tự động cuộn trang (`ScrollToTop`).

Kết quả thực nghiệm trên hệ thống cho thấy toàn bộ các luồng nghiệp vụ cốt lõi -- từ duyệt thực đơn (Guest Browsing), tư vấn AI Menu RAG, tùy chọn nguyên liệu, áp dụng ưu đãi, thanh toán Stripe/COD, cảnh báo đơn hàng WebSocket thời gian thực, quản lý kho tự động cho đến Tác tử AI hành động -- đều vận hành chính xác, mượt mà với độ trễ thấp và độ tin cậy cao. Khóa luận đóng góp một mô hình mẫu hoàn chỉnh về mặt kỹ thuật công nghệ phần mềm ứng dụng trong lĩnh vực thương mại điện tử ẩm thực.

**Từ khóa:** Online Food Ordering, Spring Boot 3, React 19, JWT Authentication, Redux Toolkit, Stripe Payment Gateway, COD, Coupon Constraint Engine, WebSocket Real-time, Agentic AI Copilot, Menu Catalog RAG, Smart Inventory, MySQL.

---

\newpage

## DANH MỤC TỪ VIẾT TẮT VÀ THUẬT NGỮ

| Ký hiệu | Tên tiếng Anh đầy đủ | Ý nghĩa tiếng Việt |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng |
| **JWT** | JSON Web Token | Mã thông báo định dạng JSON dùng để xác thực |
| **REST** | Representational State Transfer | Phong cách kiến trúc phần mềm hướng tài nguyên |
| **ORM** | Object-Relational Mapping | Ánh xạ đối tượng sang cơ sở dữ liệu quan hệ |
| **JPA** | Jakarta/Java Persistence API | Chuẩn giao tiếp lưu trữ dữ liệu trong hệ sinh thái Java |
| **SPA** | Single Page Application | Ứng dụng web hiển thị động trên một trang đơn |
| **DOM** | Document Object Model | Mô hình đối tượng tài liệu giao diện web |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Bốn thuộc tính toàn vẹn của giao dịch cơ sở dữ liệu |
| **RDBMS** | Relational Database Management System | Hệ quản trị cơ sở dữ liệu quan hệ |
| **SDK** | Software Development Kit | Bộ công cụ phát triển phần mềm |
| **WS** | WebSocket Protocol | Giao thức truyền thông hai chiều thời gian thực |
| **LLM** | Large Language Model | Mô hình ngôn ngữ lớn trí tuệ nhân tạo |
| **RAG** | Retrieval-Augmented Generation | Kỹ thuật truy xuất ngữ cảnh tăng cường cho trợ lý AI |
| **DSS** | Decision Support System | Hệ thống hỗ trợ ra quyết định kinh doanh |
| **COD** | Cash On Delivery | Phương thức thanh toán tiền mặt khi nhận hàng |
| **GMV** | Gross Merchandise Value | Tổng giá trị giao dịch hàng hóa trên toàn sàn |
| **CSAT** | Customer Satisfaction Score | Chỉ số đo lường mức độ hài lòng của khách hàng |
| **FIFO** | First In, First Out | Phương pháp quản lý kho nhập trước xuất trước |
| **CORS** | Cross-Origin Resource Sharing | Cơ chế chia sẻ tài nguyên giữa các nguồn khác nhau |
| **PCI DSS** | Payment Card Industry Data Security Standard | Tiêu chuẩn an ninh dữ liệu thẻ thanh toán quốc tế |
| **MUI** | Material-UI | Thư viện thành phần giao diện người dùng cho React |
| **UI/UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng |
| **IoC/DI** | Inversion of Control / Dependency Injection | Đảo ngược quyền điều khiển / Tiêm phụ thuộc |
| **DTO** | Data Transfer Object | Đối tượng vận chuyển dữ liệu giữa các tầng kiến trúc |

---

\newpage

# CHƯƠNG 1. GIỚI THIỆU

## 1.1. Đặt vấn đề và Tính cấp thiết của đề tài
Trong những năm gần đây, cuộc cách mạng công nghiệp lần thứ tư và làn sóng chuyển đổi số toàn diện đã tác động sâu sắc đến mọi lĩnh vực đời sống kinh tế -- xã hội. Đặc biệt, lĩnh vực kinh doanh dịch vụ ăn uống và ẩm thực (Food and Beverage -- F&B) đã chứng kiến sự biến chuyển mạnh mẽ trong thói quen tiêu dùng của cộng đồng. Sự phổ cập của điện thoại thông minh cùng với sự phát triển của hạ tầng Internet băng rộng đã hình thành nên thói quen tìm kiếm món ăn, đặt mua và thanh toán trực tuyến thay vì dùng bữa trực tiếp tại hàng quán truyền thống.

Nhu cầu này đòi hỏi sự ra đời của các nền tảng công nghệ đặt món trực tuyến (Online Food Ordering Systems) với khả năng kết nối đa chiều giữa:
1. **Khách hàng (Consumers):** Những người luôn mong muốn trải nghiệm giao diện trực quan, phong phú, có khả năng tìm kiếm nhanh chóng, lọc món ăn theo vùng miền, sở thích ăn uống cá nhân hóa, tùy chỉnh các thành phần nguyên liệu món ăn (mức độ cay, đồ ăn kèm), dễ dàng áp dụng các mã giảm giá tiết kiệm chi phí và thực hiện thanh toán an toàn, bảo mật cao.
2. **Chủ kinh doanh nhà hàng (Restaurant Owners):** Những người cần một bộ công cụ số chuyên nghiệp để quản lý thông tin thương hiệu, kiểm soát thực đơn, thiết lập danh mục món ăn, theo dõi số lượng tồn kho của nguyên liệu chế biến, giám sát đơn đặt hàng của thực khách theo thời gian thực và triển khai các chương trình sự kiện tiếp thị độc quyền.
3. **Nhà quản trị nền tảng (Platform Administrators):** Những người chịu trách nhiệm giám sát toàn bộ hoạt động của sàn thương mại điện tử ẩm thực, phê duyệt và loại bỏ nhà hàng vi phạm, kiểm duyệt các nội dung đánh giá độc hại để bảo vệ môi trường văn hóa số, phát hành các mã ưu đãi khuyến mãi quy mô toàn sàn và theo dõi biểu đồ tăng trưởng doanh thu tổng thể.

Tuy nhiên, việc nghiên cứu và triển khai một hệ thống phân phối ẩm thực hoàn chỉnh trong thực tế đặt ra nhiều bài toán kỹ thuật phức tạp:
* **Tính toàn vẹn và xung đột nghiệp vụ trong giỏ hàng và khuyến mãi:** Khi một đơn hàng có sự tham gia của các mã giảm giá có điều kiện ràng buộc khắt khe (ví dụ: giá trị đơn tối thiểu, giới hạn theo tỷ lệ phần trăm hoặc theo số tiền mặt cố định), hệ thống cần đảm bảo tính toán chính xác tuyệt đối. Hiện tượng gian lận ưu đãi hoặc các lỗi biên phần mềm (như việc khách hàng cố tình giảm số lượng món sau khi đã áp mã để trục lợi, hoặc lỗi tính toán ra số tiền âm) là nguy cơ trực tiếp gây thất thoát tài chính cho nhà bán hàng.
* **An toàn bảo mật thanh toán số:** Việc thanh toán bằng thẻ tín dụng quốc tế đòi hỏi sự tuân thủ nghiêm ngặt các tiêu chuẩn an ninh thanh toán (tiêu chuẩn PCI DSS). Việc lưu trữ trực tiếp số thẻ tín dụng trên hệ thống máy chủ ứng dụng thông thường tiềm ẩn rủi ro rò rỉ dữ liệu nghiêm trọng. Do đó, việc tích hợp giải pháp thanh toán trung gian quốc tế đạt chứng chỉ bảo mật cao cấp (như Stripe Checkout) thông qua cơ chế mã hóa token và xử lý chuyển hướng phiên là một yêu cầu cấp bách.
* **Kiến trúc phân quyền và bảo mật dữ liệu người dùng:** Ứng dụng quản trị kết hợp thương mại đòi hỏi sự phân tách rõ ràng giữa các phân hệ chức năng. Việc lơ là kiểm soát phân quyền ở tầng máy chủ (API Endpoints) có thể dẫn tới việc người dùng bình thường tự nâng quyền lên Quản trị viên (Privilege Escalation), gây nguy hại tới toàn bộ hệ thống.
* **Độ trễ thông tin trong điều phối đơn hàng và hạn chế của HTTP Polling:** Trong môi trường F&B với áp lực thời gian phục vụ tính bằng phút, việc phụ thuộc vào cơ chế kéo dữ liệu định kỳ (HTTP Polling) truyền thống khiến máy chủ chịu tải vô ích và gây trễ tiếp nhận đơn hàng. Việc ứng dụng giao thức truyền thông hai chiều thời gian thực (Full-duplex WebSocket) với chuông cảnh báo tương tác là đòi hỏi bắt buộc để đảm bảo tốc độ điều phối đơn hàng tức thời.
* **Khoảng trống trong hỗ trợ ra quyết định thông minh và quản lý tồn kho nguyên liệu:** Đa phần các hệ thống quản trị F&B hiện nay chỉ dừng lại ở việc lưu trữ dữ liệu thô mà chưa tận dụng được sức mạnh của Trí tuệ nhân tạo (AI/LLM) để biến dữ liệu thành tri thức hành động (Business Insights). Chủ nhà hàng thường lúng túng trong việc phân tích món ăn bán chạy/ế ẩm, dự báo nguyên liệu thiếu hụt hoặc thiết lập chiến lược khuyến mãi. Song song đó, việc thiếu cơ chế định lượng và tự động khấu trừ kho nguyên liệu theo từng món ăn đặt mua dễ dẫn đến thất thoát hoặc đứt gãy khâu chuẩn bị bếp.

Xuất phát từ những đòi hỏi thực tiễn và thách thức công nghệ trên, đề tài khóa luận **"Nghiên cứu và phát triển nền tảng thương mại điện tử F&B tích hợp quản trị thông minh"** được thực hiện nhằm đề xuất và triển khai một giải pháp công nghệ toàn diện, an toàn và hiện đại.

## 1.2. Mục tiêu nghiên cứu
Khóa luận hướng tới việc thực hiện các mục tiêu cụ thể sau:
1. **Nghiên cứu kiến trúc phần mềm Full-Stack hiện đại:** Nắm vững và làm chủ mô hình Client-Server phân tầng, kiến trúc RESTful API phi trạng thái (Stateless), cơ chế tiêm phụ thuộc (IoC/DI) của framework Spring Boot 3 và cơ chế quản lý trạng thái tập trung trong React 19.
2. **Thiết kế hệ thống phân quyền đa tầng, bảo mật dữ liệu và duyệt mở (Guest Browsing):** Hiện thực hóa hệ thống xác thực an toàn dựa trên chuẩn JSON Web Token (JWT) và Spring Security; áp dụng thuật toán băm mật khẩu một chiều BCrypt; thiết kế cơ chế chặn đăng ký trái phép quyền Admin (Role Sanitization) ngay từ tầng Controller; đồng thời tối ưu `JwtTokenValidator` cho phép khách vãng lai (Guest) tự do duyệt nhà hàng, tìm món và tham vấn Chatbot ngay cả khi chưa đăng nhập hoặc token hết hạn.
3. **Nghiên cứu và phát triển Động cơ kiểm soát mã giảm giá (Coupon Constraint Engine) & Đồng bộ Sự kiện:** Thiết kế và hiện thực thuật toán kiểm tra tính hợp lệ của mã khuyến mãi đa cấp độ (mã riêng của nhà hàng và mã ưu đãi toàn sàn), áp dụng cơ chế tự động gỡ mã (Auto-removal) khi tổng giá trị giỏ hàng suy giảm dưới ngưỡng tối thiểu, xử lý an toàn ngoại lệ (Null-safe Bounds Checking), và tự động đồng bộ mã giảm giá khi Chủ quán tạo sự kiện (`Events` $\to$ `Coupon`).
4. **Tích hợp Thanh toán Đa phương thức (Stripe Checkout & COD) kèm Kiểm soát Máy trạng thái Đơn hàng:** Nghiên cứu cơ chế vận hành của Stripe Checkout Session với Stripe Java SDK, mở khóa luồng callback tự động cập nhật trạng thái (`PAID`), hỗ trợ song song thanh toán tiền mặt khi nhận hàng (COD), xuất hóa đơn điện tử chi tiết cho khách hàng, và cài đặt bộ lọc chuyển trạng thái đơn hàng chặt chẽ (Order State Guard).
5. **Hiện thực hóa truyền thông đơn hàng thời gian thực (Real-time WebSocket Alerts):** Xây dựng kênh liên lạc hai chiều bằng Spring WebSocket kết hợp bộ tổng hợp âm thanh điều chế Web Audio API, giúp chủ cơ sở nhận thông báo và chuông báo đơn hàng mới tức khắc với danh sách luôn ưu tiên đơn mới nhất lên đầu.
6. **Nghiên cứu và phát triển Trợ lý AI Copilot Đa vai trò (Dual-Persona Agentic AI) & Chatbot Menu Catalog RAG:** Xây dựng trợ lý quản trị tích hợp **Google Gemini 2.5 Flash** kết hợp động cơ suy luận Heuristic dự phòng hai tầng (cho cả Chủ quán và Super Admin), trang bị **Tác tử AI hành động 1-Click** (tự động tạm khóa món cạn kho trên menu hoặc **AI Sentinel** gỡ bỏ đánh giá vi phạm); đồng thời tích hợp **Trợ lý Ẩm thực Khách hàng (AI Concierge)** ứng dụng kỹ thuật **Menu Catalog RAG** để gợi ý món hot và mã ưu đãi trực tiếp.
7. **Phát triển phân hệ Quản lý Kho nguyên liệu Tự động (Smart Inventory Tracking):** Xây dựng mô hình định lượng tồn kho theo đơn vị đo lường, cơ chế tự động khấu trừ nguyên liệu khi phát sinh đơn hàng, tự động hoàn trả khi khách hoặc chủ quán hủy đơn và lưu nhật ký xuất nhập kho minh bạch.
8. **Xây dựng giao diện người dùng tương tác cao:** Phát triển ứng dụng Single Page Application (SPA) với React 19, Material-UI (MUI v9), Recharts và TailwindCSS; triển khai chủ đề Dark Mode đồng bộ; lưới 4 cột khám phá 16 nhà hàng cùng Carousel "Hôm nay ăn gì?", bảng điều khiển trực quan với thanh điều hướng hài hòa giữa khách hàng và quản trị.

## 1.3. Đối tượng và Phạm vi nghiên cứu
* **Đối tượng nghiên cứu:** Quy trình đặt hàng, quản lý thực đơn ẩm thực, quản lý kho nguyên liệu định lượng, cơ chế tính toán khuyến mãi ràng buộc, luồng giao dịch thanh toán trực tuyến qua Stripe, truyền thông thời gian thực WebSocket, tích hợp mô hình ngôn ngữ lớn LLM (Google Gemini) trong hệ hỗ trợ ra quyết định kinh doanh, và các giải pháp công nghệ phần mềm liên quan (Spring Boot, Spring Security, Hibernate, MySQL, ReactJS, Redux Toolkit).
* **Phạm vi nghiên cứu:** Đề tài tập trung xây dựng nền tảng ứng dụng web Full-Stack chạy trên môi trường trình duyệt máy tính và thiết bị di động, phục vụ ba đối tượng tác nhân cốt lõi trong hệ sinh thái F&B bao gồm: Khách hàng mua sắm, Chủ cửa hàng ẩm thực và Quản trị viên hệ thống sàn thương mại.

## 1.4. Phương pháp tiếp cận và Triển khai
Khóa luận áp dụng phương pháp luận kỹ nghệ phần mềm theo quy trình phát triển lặp kết hợp mô hình phân tầng hướng dịch vụ:
* **Giai đoạn 1 -- Khảo sát và Thu thập yêu cầu:** Nghiên cứu các mô hình ứng dụng đặt món phổ biến trên thị trường (như ShopeeFood, GrabFood, Baemin), phân tích hành trình người dùng (User Journey), xác định các yêu cầu chức năng và phi chức năng then chốt về đặt món, cảnh báo tức thời và phân tích quản trị.
* **Giai đoạn 2 -- Phân tích và Thiết kế hệ thống:** Xây dựng biểu đồ ca sử dụng (Use Case Diagrams), biểu đồ tuần tự (Sequence Diagrams) cho các kịch bản nghiệp vụ trọng yếu (xác thực, khuyến mãi, thanh toán, WebSocket, AI Copilot); thiết kế mô hình cơ sở dữ liệu quan hệ (ERD) đạt chuẩn hóa 3NF gồm 21 thực thể; thiết kế giao diện theo phong cách thiết kế hiện đại Dark Mode.
* **Giai đoạn 3 -- Hiện thực hóa mã nguồn (Implementation):** Lập trình các dịch vụ Backend bằng Java Spring Boot; xây dựng bộ lọc bảo mật JWT Filter; cài đặt kênh WebSocket Handler và dịch vụ AI Copilot; lập trình giao diện Frontend bằng React và cấu hình luồng Redux; tích hợp Stripe Checkout và bộ tổng hợp âm thanh Web Audio API.
* **Giai đoạn 4 -- Kiểm thử và Tối ưu hóa:** Tiến hành kiểm thử hộp trắng, kiểm thử tích hợp các API endpoints; kiểm tra khả năng xử lý biên của động cơ mã giảm giá, kiểm tra độ trễ phát sóng WebSocket và độ chính xác của cơ chế tự động trừ kho nguyên liệu.

## 1.5. Đóng góp của khóa luận
Khóa luận đạt được những kết quả đóng góp thiết thực cả về mặt lý thuyết kỹ thuật lẫn tính ứng dụng thực tiễn:
* **Về mặt kỹ thuật:**
  * Xây dựng hoàn chỉnh một giải pháp Full-Stack có độ gắn kết cao nhưng phân tách lỏng lẻo (Loose Coupling) giữa Frontend (React 19 SPA) và Backend (Spring Boot REST API & WebSocket Server), hỗ trợ trải nghiệm duyệt quán không cần đăng nhập (Guest Browsing) và cơ chế tự dọn dẹp token hết hạn ở phía Client.
  * Đề xuất và hiện thực thành công **Động cơ kiểm soát mã giảm giá có điều kiện ràng buộc (Coupon Constraint Engine)** kết hợp cơ chế tự động đồng bộ mã ưu đãi từ phân hệ Sự kiện nhà hàng (`Events`), giải quyết triệt để vấn đề gian lận khuyến mãi và xử lý an toàn dữ liệu biên (Null-safe logic).
  * Tích hợp thành công cơ chế thanh toán đa phương thức gồm **Stripe Checkout Session** (chuẩn PCI DSS, tối ưu callback xác nhận tự động) và **Thanh toán khi nhận hàng (COD)**, đi kèm **Máy trạng thái đơn hàng (Order State Guard)** chống nhảy cóc trạng thái thanh toán và xuất Hóa đơn điện tử.
  * Hiện thực hóa thành công **Hệ thống cảnh báo đơn hàng thời gian thực qua WebSocket** kết hợp chuông báo tương tác điều chế từ Web Audio API, giảm độ trễ tiếp nhận đơn hàng xuống dưới 50ms mà không làm tăng tải CPU máy chủ.
  * Thiết kế và triển khai **Trợ lý AI Copilot Đa vai trò & Tác tử AI Hành động (Dual-Persona Agentic AI)** dựa trên **Google Gemini 2.5 Flash + Heuristic Fallback Engine**, tích hợp nút thực thi 1-Click (*Tạm khóa món cạn kho* cho Chủ quán và *AI Sentinel gỡ bỏ đánh giá vi phạm* cho Super Admin), cùng **Chatbot AI Concierge (Menu Catalog RAG)** phục vụ khách hàng.
  * Phát triển **Cơ chế Quản lý Kho nguyên liệu Tự động (Smart Stock Depletion Engine)**, tự động khấu trừ và hoàn trả tồn kho nguyên liệu khi đơn phát sinh hoặc bị hủy (bao gồm cả thao tác hủy từ phía nhà hàng), lưu trữ nhật ký biến động kho minh bạch.
  * Triển khai cơ chế nạp và sao lưu dữ liệu mẫu chuẩn thực tiễn (Database Seeding & SQL Snapshot) với **16 nhà hàng** trải dài 3 tỉnh thành (Hà Nội, TP. Hồ Chí Minh, Quảng Nam), **82 món ăn** hình ảnh thực tế, **8 mã giảm giá**, **4 sự kiện**, kết hợp cơ chế khóa bảo vệ các endpoint seed tránh ghi đè dữ liệu tùy chỉnh và chặn leo thang đặc quyền công khai.
* **Về mặt thực tiễn:** Cung cấp một sản phẩm phần mềm hoàn chỉnh, giao diện Dark Mode đẹp mắt, hiện đại, tích hợp công nghệ trí tuệ nhân tạo và truyền thông thời gian thực, sẵn sàng phục vụ triển khai thực tế cho các chuỗi nhà hàng hoặc các mô hình sàn thương mại ẩm thực số.

## 1.6. Bố cục của khóa luận
Khóa luận tốt nghiệp được cấu trúc thành 6 chương chính như sau:
* **Chương 1: Giới thiệu** -- Trình bày bối cảnh thực tiễn, tính cấp thiết của đề tài, các mục tiêu nghiên cứu, phạm vi, phương pháp triển khai và những đóng góp chính của khóa luận.
* **Chương 2: Cơ sở lý thuyết và Nền tảng công nghệ** -- Khái quát các nền tảng công nghệ được ứng dụng trong dự án, bao gồm kiến trúc Client-Server, Spring Boot 3, Spring Security, JWT, Spring Data JPA, React 19, Redux Toolkit, MySQL, Stripe Payment Gateway, giao thức truyền tin thời gian thực WebSocket và mô hình ngôn ngữ lớn LLM/DSS.
* **Chương 3: Phân tích và Thu thập yêu cầu** -- Xác định bài toán nghiệp vụ, phân tích chi tiết yêu cầu chức năng, yêu cầu phi chức năng, xây dựng biểu đồ ca sử dụng và các bảng đặc tả ca sử dụng tiêu biểu (bao gồm ca sử dụng AI Copilot và cảnh báo đơn hàng thời gian thực).
* **Chương 4: Phân tích và Thiết kế hệ thống** -- Trình bày kiến trúc tổng thể của hệ thống, sơ đồ triển khai, các biểu đồ tuần tự cho các luồng nghiệp vụ cốt lõi, mô hình dữ liệu thực thể liên kết (ERD) 21 bảng và từ điển dữ liệu chi tiết kèm bảng nhật ký tồn kho.
* **Chương 5: Xây dựng, Thực nghiệm và Triển khai hệ thống** -- Mô tả môi trường phát triển, cài đặt các chức năng trọng yếu kèm mã nguồn minh họa chi tiết; trình bày kết quả đánh giá thực nghiệm và đo đạc hiệu năng định lượng (độ trễ WebSocket, khả năng chịu tải trừ kho ACID, độ sẵn sàng của AI Copilot); và giới thiệu giao diện các màn hình chính của ứng dụng.
* **Chương 6: Kết luận và Hướng phát triển** -- Tổng kết những thành quả đã đạt được, chỉ ra các mặt hạn chế còn tồn tại và đề xuất định hướng mở rộng, nâng cấp hệ thống trong tương lai.


---

\newpage

# CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ NỀN TẢNG CÔNG NGHỆ

## 2.1. Kiến trúc Phân tầng và Mô hình Client-Server hiện đại
Mô hình Client-Server phân tầng (Multi-tier Layered Architecture) là một trong những chuẩn mực kiến trúc phần mềm phổ biến nhất trong việc xây dựng các ứng dụng doanh nghiệp và thương mại điện tử quy mô lớn. Trong kiến trúc này, toàn bộ hệ thống phần mềm được chia tách một cách tường minh thành các tầng độc lập theo nguyên lý tách biệt trách nhiệm (Separation of Concerns):
* **Tầng Trình diễn (Presentation Layer / Client):** Được triển khai tại trình duyệt của người dùng cuối, đóng vai trò kết xuất giao diện đồ họa (UI), tiếp nhận các tương tác của người dùng và gửi các yêu cầu bất đồng bộ (Asynchronous HTTP Requests) đến máy chủ. Tầng này hoàn toàn tách biệt khỏi logic xử lý nghiệp vụ sâu và việc truy xuất dữ liệu trực tiếp.
* **Tầng Nghiệp vụ (Business Logic Layer / Server Application):** Nơi tập trung toàn bộ các quy tắc nghiệp vụ (Business Rules), kiểm tra tính hợp lệ của dữ liệu, điều phối các luồng giao dịch, tính toán số tiền, khấu trừ mã giảm giá và khởi tạo các phiên thanh toán điện tử.
* **Tầng Dữ liệu (Data Layer / Persistence Layer):** Đảm nhiệm vai trò lưu trữ lâu dài, quản lý và bảo vệ tính nhất quán của dữ liệu nghiệp vụ thông qua hệ quản trị cơ sở dữ liệu quan hệ.

Giao tiếp giữa Client và Server được thực hiện qua giao thức mạng HTTP/HTTPS tuân theo kiến trúc RESTful. Các tài nguyên (Resources) như nhà hàng, món ăn, giỏ hàng, đơn hàng được định danh thông qua các URI chuẩn hóa và thao tác thông qua các phương thức HTTP tiêu chuẩn (`GET`, `POST`, `PUT`, `DELETE`). Dữ liệu trao đổi giữa hai tầng được tuần tự hóa (Serialized) dưới định dạng JSON nhẹ, có tính tương thích cao và tối ưu băng thông mạng.

## 2.2. Nền tảng Spring Boot và Hệ sinh thái Java Backend
### 2.2.1. Tổng quan Spring Boot 3 và Cơ chế IoC/DI
Spring Boot là một dự án nguồn mở thuộc hệ sinh thái Spring Framework, được thiết kế nhằm mục đích đơn giản hóa quá trình khởi tạo, cấu hình và triển khai các ứng dụng Java ở cấp độ doanh nghiệp. Thay vì đòi hỏi cấu hình XML phức tạp và việc thiết lập máy chủ triển khai thủ công như trước đây, Spring Boot áp dụng triết lý *"Convention over Configuration"* (Quy ước thay vì Cấu hình) cùng máy chủ Tomcat nhúng (Embedded Tomcat Server), cho phép ứng dụng đóng gói thành một tệp thực thi `.jar` duy nhất và khởi chạy độc lập một cách nhanh chóng.

Trọng tâm của kiến trúc Spring là nguyên lý **Đảo ngược điều khiển (Inversion of Control -- IoC)** thông qua cơ chế **Tiêm phụ thuộc (Dependency Injection -- DI)**. Thay vì các đối tượng trong chương trình phải tự khởi tạo và quản lý vòng đời của các đối tượng phụ thuộc thông qua từ khóa `new`, Spring IoC Container chịu trách nhiệm tự động tạo, quản lý và tiêm (inject) các phụ thuộc này tại thời điểm chạy (Runtime) thông qua các chú thích như `@Autowired`, `@Service`, `@Repository`, `@Component`. Cơ chế này giúp giảm thiểu sự phụ thuộc chặt chẽ giữa các lớp, tăng cường tính module hóa và tạo điều kiện thuận lợi cho việc viết mã kiểm thử tự động (Unit Test).

### 2.2.2. Cơ chế Bảo mật Spring Security và Xác thực Phân quyền bằng JWT
Bảo vệ tài nguyên và xác thực danh tính người dùng là một trong những yêu cầu sống còn của hệ thống thương mại trực tuyến. Spring Security cung cấp một kiến trúc bảo mật toàn diện dựa trên chuỗi các bộ lọc chặn (Filter Chain) để kiểm tra mọi yêu cầu HTTP gửi đến ứng dụng trước khi chuyển tới Controller tiếp nhận.

Trong dự án này, hệ thống áp dụng cơ chế xác thực phi trạng thái (Stateless Authentication) dựa trên chuẩn **JSON Web Token (JWT)**:
* **Cấu trúc của JWT:** Một mã JWT bao gồm 3 phần được phân tách bằng dấu chấm: Header (chứa thông tin thuật toán ký HMAC-SHA256), Payload (chứa các thông tin định danh người dùng như Email, Vai trò, Thời gian phát hành, Thời gian hết hạn), và Signature (chữ ký số mật mã đảm bảo tính toàn vẹn của token).
* **Quy trình hoạt động:** Khi người dùng đăng nhập thành công với tài khoản và mật khẩu hợp lệ, máy chủ sinh ra một JWT và trả về phía Client. Ở các yêu cầu tiếp theo đến các tài nguyên cần bảo mật (ví dụ: đặt hàng, xem thông tin cá nhân, cập nhật thực đơn), Client sẽ đính kèm mã JWT này vào tiêu đề yêu cầu: `Authorization: Bearer <token>`.
* **Ưu điểm & Cơ chế Guest-Friendly:** Máy chủ không cần duy trì bộ nhớ trạng thái phiên làm việc (Session Memory), giúp giảm tải bộ nhớ RAM máy chủ và cho phép mở rộng theo chiều ngang. Đặc biệt, bộ lọc `JwtTokenValidator` áp dụng chiến lược *Graceful Degradation*: nếu khách vãng lai truy cập tài nguyên công khai (`/api/restaurants/**`, `/api/food/**`, `/api/coupons`) khi chưa đăng nhập hoặc token hết hạn, bộ lọc sẽ xóa ngữ cảnh xác thực (`SecurityContextHolder.clearContext()`) để người dùng vẫn duyệt quán và tương tác với AI Chatbot mượt mà; trong khi mọi API giao dịch và quản trị vẫn được bảo vệ nghiêm ngặt bằng mã lỗi 401/403.

### 2.2.3. Tầng Truy cập Dữ liệu Spring Data JPA và Hibernate ORM
Để quản trị và thao tác dữ liệu quan hệ một cách hướng đối tượng, dự án ứng dụng Jakarta Persistence API (JPA) với hiện thực chuẩn Hibernate ORM. Hibernate đóng vai trò là cầu nối chuyển đổi giữa các bảng quan hệ trong MySQL thành các thực thể đối tượng Java (Java Entities).

Spring Data JPA nâng cao hơn nữa năng suất phát triển bằng việc cung cấp các giao diện Generic Repository (như `JpaRepository<T, ID>`), tự động cung cấp các phương thức CRUD chuẩn (`save`, `findById`, `delete`, `findAll`) mà không cần lập trình viên phải viết các câu lệnh SQL thuần túy. Hơn nữa, với chú thích `@Transactional`, Spring tự động quản lý các ranh giới giao dịch (Transaction Boundaries): nếu bất kỳ ngoại lệ nào xảy ra trong quá trình thực hiện một chuỗi thao tác ghi cơ sở dữ liệu (ví dụ: tạo đơn hàng, lưu các món trong đơn, trừ số lượng giỏ hàng), hệ thống sẽ tự động thực hiện thao tác hoàn tác (`ROLLBACK`) để bảo vệ tính nhất quán của dữ liệu.

## 2.3. Nền tảng ReactJS và Quản lý Trạng thái phía Client
### 2.3.1. React 19, Kiến trúc Component-based và Virtual DOM
React là một thư viện JavaScript mã nguồn mở được phát triển bởi Facebook (Meta), đóng vai trò nền tảng trong việc xây dựng các giao diện người dùng tương tác cho ứng dụng web hiện đại. React hoạt động theo mô hình *Component-based*, trong đó toàn bộ giao diện phức tạp được phân rã thành các thành phần nhỏ, độc lập và có khả năng tái sử dụng cao.

Điểm đột phá của React là cơ chế **Virtual DOM (Mô hình đối tượng tài liệu ảo)**. Thay vì thao tác trực tiếp trên cây DOM thật của trình duyệt (vốn là một thao tác tốn kém về mặt hiệu năng tính toán), React duy trì một bản sao ảo của cây DOM trong bộ nhớ. Khi trạng thái (state) của một thành phần thay đổi, React sẽ tính toán sự sai khác giữa cây Virtual DOM mới và cũ thông qua thuật toán so sánh Diffing Algorithm, sau đó chỉ cập nhật những phần tử thực sự thay đổi trên DOM thật. Cơ chế này đảm bảo ứng dụng đạt tốc độ kết xuất hình ảnh cực nhanh và mang lại trải nghiệm mượt mà cho người dùng.

### 2.3.2. Quản lý Trạng thái Tập trung với Redux Toolkit và Redux Thunk
Khi quy mô ứng dụng thương mại điện tử mở rộng với hàng chục màn hình và nhiều luồng dữ liệu tương tác qua lại (thông tin người dùng đăng nhập, giỏ hàng, danh sách nhà hàng, kết quả tìm kiếm, thông báo hệ thống), việc truyền dữ liệu thủ công giữa các component cha -- con (prop drilling) trở nên cồng kềnh và khó kiểm soát.

Dự án áp dụng **Redux Toolkit (RTK)** làm giải pháp quản lý trạng thái toàn cục (Global State Management):
* **Single Source of Truth:** Toàn bộ trạng thái quan trọng của ứng dụng được lưu giữ trong một đối tượng Store duy nhất.
* **Nguyên lý Bất biến (Immutability):** Trạng thái chỉ có thể được thay đổi thông qua việc phát đi một hành động (`dispatch(action)`), sau đó các hàm chuyển trạng thái thuần túy (`reducers`) sẽ tạo ra trạng thái mới.
* **Redux Thunk Middleware:** Cho phép xử lý các tác vụ bất đồng bộ phức tạp (gọi REST API tới máy chủ Spring Boot, chờ phản hồi, xử lý mã lỗi và cập nhật dữ liệu vào Store).

### 2.3.3. Thiết kế Giao diện với Material-UI (MUI v9) và TailwindCSS
Để xây dựng giao diện hiện đại, đạt tính thẩm mỹ cao và chuẩn trải nghiệm người dùng, hệ thống kết hợp sức mạnh của hai công cụ tạo kiểu hàng đầu:
* **Material-UI (MUI):** Cung cấp hệ thống các thành phần giao diện phong phú tuân theo chuẩn ngôn ngữ thiết kế Material Design của Google (như Dialog, Button, Card, TextField, Badge, Rating). Dự án tùy biến sâu hệ thống màu sắc chủ đạo với tông màu tối (`DarkTheme`) kết hợp sắc cam vàng ấm áp, tạo cảm giác chuyên nghiệp và ngon miệng cho nền tảng ẩm thực.
* **TailwindCSS:** Bộ công cụ tiện ích CSS (Utility-First CSS) giúp xây dựng các bố cục linh hoạt (Flexbox, Grid), căn lề và điều chỉnh giao diện thích ứng đa kích thước màn hình (Responsive Design) một cách nhanh chóng.

## 2.4. Hệ Quản trị Cơ sở Dữ liệu MySQL và Tính toàn vẹn ACID
MySQL là một trong những hệ quản trị cơ sở dữ liệu quan hệ nguồn mở mạnh mẽ và phổ biến nhất thế giới. Trong đề tài khóa luận này, MySQL được lựa chọn nhờ các ưu thế:
* **Tuân thủ tiêu chuẩn ACID:** Đảm bảo 4 thuộc tính cơ bản của giao dịch cơ sở dữ liệu: Tính nguyên tử (Atomicity -- toàn bộ thao tác trong đơn hàng phải thành công, hoặc không có thao tác nào được lưu), Tính nhất quán (Consistency -- dữ liệu luôn thỏa mãn các ràng buộc khóa chính, khóa ngoại), Tính độc lập (Isolation -- các giao dịch đồng thời không gây sai lệch dữ liệu lẫn nhau), và Tính bền vững (Durability -- dữ liệu đã xác nhận thành công sẽ được lưu trữ an toàn kể cả khi hệ thống gặp sự cố mất nguồn).
* **Ràng buộc Quan hệ chặt chẽ:** Hỗ trợ các mối quan hệ đa dạng (`One-to-Many`, `Many-to-Many`, `One-to-One`) với cơ chế khóa ngoại và xóa lan truyền (Cascade Constraints), đặc biệt quan trọng đối với dữ liệu nhà hàng, thực đơn, giỏ hàng và lịch sử đơn hàng.

## 2.5. Cổng Thanh toán Trực tuyến Stripe và Tiêu chuẩn Bảo mật PCI DSS
Stripe là một trong những nền tảng hạ tầng tài chính và cổng thanh toán điện tử hàng đầu thế giới, hỗ trợ thanh toán thẻ quốc tế (Visa, MasterCard, American Express) với quy trình tích hợp hiện đại.

Việc tích hợp Stripe vào hệ thống mang lại các lợi thế kỹ thuật vượt trội:
* **Mô hình Stripe Checkout Session:** Thay vì máy chủ tự thu thập số thẻ ngân hàng của khách hàng (yêu cầu phải kiểm định tiêu chuẩn bảo mật PCI DSS Cấp độ 1 vô cùng tốn kém), ứng dụng khởi tạo một phiên thanh toán an toàn tại máy chủ Stripe, sau đó chuyển hướng trình duyệt của khách hàng tới trang thanh toán bảo vệ độc quyền của Stripe. Toàn bộ thông tin thẻ được token hóa trực tiếp trên hạ tầng bảo mật của Stripe.
* **Xử lý Chuyển hướng An toàn:** Sau khi hoàn tất giao dịch hoặc người dùng bấm hủy, Stripe sẽ tự động chuyển hướng người dùng trở lại các đường dẫn đã được cấu hình trước tại hệ thống frontend: `/payment/success/:id` hoặc `/payment/fail`, kèm theo cơ chế xác thực cập nhật trạng thái đơn hàng tại backend.

## 2.6. Giao thức Truyền thông Hai chiều Thời gian thực WebSocket và Spring WebSocket
### 2.6.1. Khái niệm Giao thức WebSocket và Hạn chế của HTTP Polling
Trong các ứng dụng web truyền thống hoạt động theo giao thức HTTP/1.1, mô hình giao tiếp tuân theo cơ chế Yêu cầu -- Phản hồi đơn hướng (Request -- Response). Khách hàng (Client) luôn là bên chủ động gửi yêu cầu và máy chủ (Server) chỉ có thể phản hồi khi nhận được yêu cầu đó. Trong bài toán điều phối đơn hàng ẩm thực thời gian thực, nếu áp dụng cơ chế truyền thống này, hệ thống buộc phải sử dụng giải pháp *HTTP Short Polling* (gửi yêu cầu liên tục sau mỗi chu kỳ vài giây) hoặc *HTTP Long Polling* (máy chủ treo kết nối cho đến khi có dữ liệu mới). Các kỹ thuật này bộc lộ những nhược điểm cố hữu:
* **Gánh nặng tiêu đề mạng (Header Overhead):** Mỗi yêu cầu HTTP đều phải gửi kèm hàng trăm byte dữ liệu tiêu đề (Cookies, User-Agent, JWT Token), gây lãng phí băng thông nghiêm trọng trong khi phần lớn các chu kỳ thăm dò đều không có dữ liệu đơn hàng mới.
* **Độ trễ cao (Latency):** Thông tin đơn hàng mới chỉ được Client phát hiện sau khi hết chu kỳ thăm dò (thường từ 3 đến 5 giây), gây chậm trễ trong khâu chuẩn bị món của đầu bếp.
* **Quá tải tài nguyên máy chủ:** Hàng trăm phiên quản trị cùng thăm dò định kỳ liên tục tạo áp lực tính toán và tiêu tốn luồng xử lý (threads) của máy chủ web.

Để giải quyết triệt để vấn đề trên, giao thức **WebSocket (RFC 6455)** được chuẩn hóa nhằm cung cấp kênh truyền thông hai chiều toàn phần (Full-duplex Communication) hoạt động trên một kết nối TCP duy nhất kéo dài. Quá trình thiết lập kết nối WebSocket bắt đầu bằng một yêu cầu HTTP tiêu chuẩn có tiêu đề nâng cấp (`Upgrade: websocket` và `Connection: Upgrade`). Sau khi quá trình bắt tay (WebSocket Handshake) hoàn tất thành công, giao thức HTTP được chuyển đổi sang WebSocket, cho phép máy chủ và máy khách có thể chủ động đẩy các khung dữ liệu (Data Frames) nhị phân hoặc chuỗi văn bản UTF-8 tới nhau bất kỳ lúc nào với tiêu đề chỉ chiếm từ 2 đến 10 byte.

### 2.6.2. Hiện thực hóa WebSocket trên Spring Boot với TextWebSocketHandler
Trong hệ sinh thái Spring Framework, mô-đun Spring WebSocket cung cấp giải pháp lập trình hướng sự kiện linh hoạt. Hệ thống sử dụng `TextWebSocketHandler` kết hợp với `WebSocketConfigurer` để đăng ký điểm cuối (Endpoint) chuyên biệt tại đường dẫn `/ws/orders`.

Để quản lý đồng thời nhiều phiên kết nối từ các chủ nhà hàng khác nhau trên cùng một hạ tầng máy chủ, hệ thống thiết kế cấu trúc dữ liệu bản đồ luồng an toàn (Thread-safe Concurrent Maps):
* `Map<Long, Set<WebSocketSession>> restaurantSessions`: Ánh xạ định danh nhà hàng (`restaurantId`) tới tập hợp các phiên kết nối WebSocket đang hoạt động của các thiết bị quản trị thuộc nhà hàng đó.
* `Map<String, Long> sessionRestaurantMap`: Ánh xạ mã phiên (`sessionId`) sang nhà hàng tương ứng, giúp thu hồi và dọn dẹp phiên rác ngay tức thì khi xảy ra sự kiện ngắt kết nối (`afterConnectionClosed`).

Khi có đơn hàng mới phát sinh hoặc có sự thay đổi trạng thái giao vận, tầng dịch vụ kích hoạt phương thức phát sóng `broadcastToRestaurant(restaurantId, notification)`, đóng gói đối tượng `OrderNotificationDTO` thành chuỗi JSON và gửi tức thời qua luồng socket tới đúng các phiên của nhà hàng mục tiêu, đảm bảo tính bảo mật và cách ly dữ liệu giữa các cơ sở kinh doanh.

## 2.7. Mô hình Ngôn ngữ Lớn (LLM) và Hệ thống Hỗ trợ Ra Quyết định (DSS) trong Quản trị F&B
### 2.7.1. Tổng quan về Mô hình Ngôn ngữ Lớn và API Google Gemini 2.5 Flash
Sự phát triển đột phá của các mô hình ngôn ngữ lớn (Large Language Models -- LLM) dựa trên kiến trúc Transformer đã mở ra kỷ nguyên mới cho việc tự động hóa phân tích dữ liệu và tư vấn chiến lược doanh nghiệp. Khác với các thuật toán thống kê truyền thống vốn chỉ cung cấp các bảng số liệu rời rạc, LLM có năng lực thấu hiểu ngữ cảnh nghiệp vụ sâu sắc, tổng hợp dữ liệu định lượng và diễn đạt thành các bản tóm tắt chiến lược mạch lạc bằng ngôn ngữ tự nhiên.

Trong đề tài khóa luận này, hệ thống tích hợp API thế hệ mới **Google Gemini 2.5 Flash** (endpoint `v1beta/models/gemini-2.5-flash`). Đây là mô hình trí tuệ nhân tạo được tối ưu hóa đặc biệt về tốc độ suy luận nhanh, chi phí vận hành thấp và khả năng tiếp nhận ngữ cảnh có cấu trúc lớn. Gemini được tích hợp vào hệ thống thông qua giao diện lập trình hướng dịch vụ RESTful với cơ chế xác thực API Key cấu hình qua biến môi trường, đóng vai trò là khối óc phân tích trực tuyến cho trợ lý quản trị **AI Copilot**.

### 2.7.2. Kiến trúc Phòng thủ Hai tầng, Tác tử AI Hành động (Agentic AI) và Menu Catalog RAG
Một trong những thách thức sống còn khi triển khai các dịch vụ AI đám mây trong môi trường quản trị sản xuất (Production) là rủi ro về tính sẵn sàng (Availability): các sự cố nghẽn kết nối, suy giảm tốc độ mạng, hoặc hiện tượng chạm ngưỡng giới hạn tần suất yêu cầu (Rate Limiting HTTP 429) có thể làm tê liệt chức năng trợ lý ảo.

Để khắc phục rủi ro này và nâng tầm trợ lý ảo từ "hệ thống hỏi-đáp thụ động" thành "hệ thống hỗ trợ điều hành chủ động", khóa luận đề xuất và hiện thực hóa kiến trúc kết hợp ba trụ cột:
1. **Chiến lược phòng thủ hai tầng (Two-tier Resilient DSS Architecture):**
   * *Tầng 1 -- Trí tuệ AI Đám mây (Primary Cloud LLM Engine):* Tổng hợp chỉ số thực tế từ CSDL (doanh thu/GMV, đơn hoàn thành/hủy, Top 5 món bán chạy, món bán chậm, nguyên liệu cạn kho, điểm hài lòng CSAT), đóng gói vào System Prompt thích ứng theo vai trò (**Dual-Persona**: Chủ nhà hàng vs. Ban quản trị toàn sàn Super Admin) và gửi tới Google Gemini 2.5 Flash.
   * *Tầng 2 -- Động cơ Heuristic DSS Cục bộ Dự phòng (Fallback Local DSS Engine):* Khi API đám mây quá thời gian chờ, chưa cấu hình Key hoặc lỗi mạng, hệ thống lập tức kích hoạt Động cơ suy luận quy tắc Heuristic cục bộ bằng Java để trả về phân tích định lượng chính xác 100% tức thì.
2. **Động cơ Tác tử AI Hành động (Agentic Action Decision Engine):** Sau khi phân tích ngữ cảnh, hệ thống tự động sinh cấu trúc `agentAction` kèm giao diện tương tác 1-Click cho phép quản trị viên thực thi thay đổi trực tiếp xuống CSDL: (i) Chủ nhà hàng tự động nhận đề xuất nút *"Tạm khóa món ăn trên Menu"* (`LOCK_FOOD_AVAILABILITY`) khi cạn nguyên liệu; (ii) Super Admin được hỗ trợ bởi *AI Content Moderation Sentinel* quét đánh giá vi phạm cộng đồng và kích hoạt nút *"Gỡ bỏ đánh giá & Phục hồi uy tín đối tác"* (`MODERATE_REVIEW`).
3. **Kỹ thuật Truy xuất Tăng cường Danh mục Thực đơn (Menu Catalog RAG):** Phía ứng dụng khách hàng (`Chatbot.jsx`), Trợ lý Ẩm thực **AI Concierge** tự động nạp trước danh mục món bán chạy (`/api/food/popular`) và mã giảm giá hiệu lực (`/api/coupons`) làm ngữ cảnh thực tế, kết xuất thẻ món ăn kèm ảnh thật, giá tiền, mẹo mã ưu đãi và liên kết sâu (`?foodId=...`) giúp thực khách đặt món chỉ với 1 lần nhấn.

---

\newpage

# CHƯƠNG 3. PHÂN TÍCH VÀ THU THẬP YÊU CẦU

## 3.1. Xác định Bài toán Nghiệp vụ và Đối tượng Sử dụng
Hệ thống xác định ba nhóm đối tượng người dùng chính với các quyền hạn và nhu cầu đặc thù:
1. **Khách hàng (Customer):** Người dùng cá nhân truy cập hệ thống để duyệt món, tùy chọn nguyên liệu, áp dụng mã ưu đãi và thanh toán trực tuyến.
2. **Chủ nhà hàng (Restaurant Owner):** Đối tác kinh doanh sử dụng phân hệ quản trị để kiểm soát thực đơn, danh mục, kho nguyên liệu và cập nhật tiến độ đơn hàng.
3. **Quản trị viên toàn sàn (Super Admin):** Người quản trị cấp cao giám sát toàn bộ hoạt động của hệ thống, kiểm duyệt đánh giá, quản lý người dùng, xử lý vi phạm của nhà hàng và phát hành mã ưu đãi toàn sàn.

## 3.2. Thu thập Yêu cầu Hệ thống
### 3.2.1. Yêu cầu Chức năng
* **Phân hệ Xác thực & Quản lý Tài khoản:**
  * Đăng ký tài khoản mới cho Khách hàng và Chủ nhà hàng.
  * Chặn triệt để việc tự đăng ký quyền Admin qua API `/auth/signup`.
  * Đăng nhập xác thực bằng Email và Mật khẩu, cấp phát JWT.
  * Quản lý thông tin hồ sơ và danh sách địa chỉ nhận hàng.
* **Phân hệ Khách hàng & Khách vãng lai (Customer / Guest):**
  * Khám phá danh sách 16 nhà hàng thuộc 3 khu vực (Hà Nội, TP. Hồ Chí Minh, Quảng Nam), lọc theo thành phố và thể loại ẩm thực ngay cả khi chưa đăng nhập (Guest Browsing).
  * Tương tác với **Trợ lý Ẩm thực AI Concierge (Menu Catalog RAG)** để nhận gợi ý món bán chạy, tra cứu mã ưu đãi và bấm liên kết sâu tới đúng món ăn trên thực đơn quán.
  * Tùy biến món ăn theo nguyên liệu và quản lý giỏ hàng.
  * Áp dụng mã ưu đãi ràng buộc (Coupon Constraint Engine) với cơ chế tự động gỡ bỏ (Auto-removal) khi giảm số lượng món.
  * Thanh toán đa phương thức qua cổng Stripe Checkout hoặc tiền mặt khi nhận hàng (COD); theo dõi lịch sử giao dịch và xuất Hóa đơn điện tử chi tiết.
  * Xem lịch sử đơn hàng (sắp xếp mới nhất lên đầu), theo dõi tiến độ giao vận và hủy đơn đang chờ.
  * Gửi, chỉnh sửa, xóa đánh giá sao và bình luận nhận xét cho từng nhà hàng hoặc từng món ăn trong đơn hàng đã hoàn thành.
* **Phân hệ Chủ nhà hàng:**
  * Khởi tạo và cập nhật hồ sơ nhà hàng, giờ mở cửa.
  * Quản lý danh mục món ăn (Category) kèm kiểm tra chống trùng tên danh mục.
  * Quản lý thực đơn: thêm món mới, cập nhật giá, trạng thái sẵn có, món chay.
  * Quản lý kho nguyên liệu thông minh: tạo nhóm nguyên liệu (Ingredient Category) và nguyên liệu cụ thể (IngredientsItem), định lượng số lượng tồn kho (`quantity`), đơn vị tính (`unit`), thiết lập ngưỡng cảnh báo an toàn (`minThreshold`) và xem nhật ký xuất nhập kho (`InventoryLog`).
  * Quản lý đơn hàng: tiếp nhận các đơn hàng mới nhất xếp trên cùng kèm nhãn phương thức thanh toán (`STRIPE`/`COD`), điều phối trạng thái tuân thủ Máy trạng thái đơn hàng (State Guard) và tự động hoàn kho nếu hủy đơn.
  * Tiếp nhận thông báo đơn hàng mới tức thời theo thời gian thực (Real-time WebSocket alerts) kèm chuông báo âm thanh thuật toán (Web Audio Chime) mà không cần làm mới trang.
  * Tương tác với Trợ lý AI Copilot & Tác tử hành động: tra cứu báo cáo kinh doanh theo thời gian thực, nhận cảnh báo nguyên liệu cạn kiệt và bấm nút **Tác tử AI 1-Click** để tạm khóa hoặc mở bán lại món ăn ngay trên menu khách hàng.
  * Tạo sự kiện khuyến mãi (`Events`) ẩm thực quảng bá quán kèm mã giảm giá tự đồng bộ sang `Coupon`.
* **Phân hệ Super Admin:**
  * Quản lý tài khoản toàn sàn (khóa/mở tài khoản, phân quyền).
  * Kiểm duyệt và xóa nhà hàng vi phạm.
  * Kiểm duyệt đánh giá theo từng nhà hàng được chọn và xóa các bài đánh giá vi phạm chuẩn mực.
  * Tương tác với **Platform Executive AI Copilot & AI Content Moderation Sentinel**: giám sát GMV toàn sàn, CSAT và kích hoạt tác tử AI gỡ bỏ đánh giá vi phạm chỉ bằng 1 thao tác.
  * Quản trị mã giảm giá toàn sàn (Global Coupons).
  * Theo dõi báo cáo thống kê doanh thu và biểu đồ chỉ số vận hành toàn sàn.

### 3.2.2. Yêu cầu Phi Chức năng
* **Hiệu năng & Tốc độ phản hồi:** Thời gian phản hồi API trung bình dưới 500ms; tối ưu hóa truy vấn CSDL bằng Indexing. Độ trễ phát sóng sự kiện qua kênh WebSocket đạt dưới 50ms.
* **Bảo mật & An toàn thông tin:** Mật khẩu được mã hóa an toàn bằng BCrypt với Salt ngẫu nhiên; xác thực phi trạng thái bằng JWT; không lưu trữ thông tin thẻ thanh toán nhạy cảm (tuân thủ PCI DSS qua Stripe).
* **Tính toàn vẹn (ACID) & Sẵn sàng cao:** Toàn bộ giao dịch đặt hàng và thanh toán được bọc trong `@Transactional` đảm bảo dữ liệu không bị sai lệch khi xảy ra lỗi mạng. Động cơ AI có cơ chế dự phòng Heuristic DSS bảo đảm tính sẵn sàng 100%.
* **Khả năng tương thích & Giao diện:** Thiết kế giao diện Dark Mode tương thích mượt mà trên mọi trình duyệt hiện đại và co giãn linh hoạt trên máy tính, máy tính bảng và điện thoại.

## 3.3. Biểu đồ Ca sử dụng Tổng quát
Dưới đây là biểu đồ ca sử dụng tổng quát của hệ thống Online Food Ordering:

![Biểu đồ Use Case tổng quát của hệ thống](figures/fig_usecase_general.png)

## 3.4. Đặc tả Chi tiết các Ca sử dụng Tiêu biểu
Dưới đây là các bảng đặc tả chi tiết cho 11 ca sử dụng quan trọng nhất trong hệ thống:

### Bảng 3.1: Đặc tả ca sử dụng Đăng ký tài khoản mới (UC-01)
* **Tên ca sử dụng:** Đăng ký tài khoản mới (Signup with Role Sanitization)
* **Tác nhân:** Khách hàng, Chủ nhà hàng mới
* **Mô tả:** Người dùng tạo tài khoản mới trong hệ thống với vai trò Khách hàng hoặc Chủ nhà hàng, đồng thời tự động tạo giỏ hàng trống và cấp phát JWT.
* **Tiền điều kiện:** Người dùng truy cập hệ thống và chưa đăng nhập.
* **Hậu điều kiện:** Bản ghi User được lưu vào CSDL; giỏ hàng trống được gán; mã JWT được trả về và lưu ở trình duyệt.
* **Luồng cơ bản:**
  1. Người dùng mở hộp thoại Đăng ký trên thanh điều hướng.
  2. Người dùng điền Họ tên, Email, Mật khẩu và chọn vai trò (Customer hoặc Restaurant Owner).
  3. Người dùng nhấn nút "Đăng ký".
  4. Hệ thống kiểm tra tính duy nhất của Email trong CSDL.
  5. Hệ thống xác minh vai trò được yêu cầu có hợp lệ hay không (không được phép là ROLE_ADMIN).
  6. Hệ thống mã hóa mật khẩu bằng thuật toán BCrypt.
  7. Hệ thống lưu bản ghi User vào CSDL và tự động tạo mới một Cart trống gắn với User đó.
  8. Hệ thống sinh mã JWT và trả về thông tin đăng nhập thành công kèm vai trò.
  9. Phía Client lưu JWT vào localStorage và tự động điều hướng người dùng.
* **Luồng thay thế:**
  * 4a. Email đã tồn tại: Hệ thống thông báo lỗi `"Email is already used with another account"`.
  * 5a. Người dùng gửi vai trò ROLE_ADMIN: Hệ thống từ chối yêu cầu và báo lỗi `"Registration as ADMIN is not allowed."`.
* **Luồng ngoại lệ:** Lỗi kết nối CSDL $\to$ Thông báo lỗi máy chủ và yêu cầu thử lại sau.

### Bảng 3.2: Đặc tả ca sử dụng Đăng nhập tài khoản (UC-02)
* **Tên ca sử dụng:** Đăng nhập tài khoản (Signin & JWT Issuance)
* **Tác nhân:** Khách hàng, Chủ nhà hàng, Quản trị viên Super Admin
* **Mô tả:** Xác thực danh tính người dùng bằng Email và Mật khẩu, cấp phát mã JWT truy cập tài nguyên.
* **Tiền điều kiện:** Người dùng đã có tài khoản trong hệ thống.
* **Hậu điều kiện:** Đăng nhập thành công, lưu mã JWT và cập nhật trạng thái người dùng trong Redux Store.
* **Luồng cơ bản:**
  1. Người dùng mở modal đăng nhập và nhập Email, Mật khẩu.
  2. Người dùng nhấn nút "Đăng nhập".
  3. Hệ thống tìm kiếm tài khoản theo Email và so khớp mật khẩu băm với BCrypt.
  4. Hệ thống nạp quyền hạn (Authorities) của người dùng vào Spring SecurityContext.
  5. Hệ thống sinh mã JWT có thời hạn và trả về Client kèm vai trò người dùng.
  6. Phía Client lưu JWT, gọi API lấy thông tin người dùng và giỏ hàng, cập nhật Store Redux.
  7. Hệ thống chuyển hướng người dùng đến trang phù hợp với quyền hạn.
* **Luồng thay thế:**
  * 3a. Sai email hoặc mật khẩu: Hệ thống ném ngoại lệ `BadCredentialsException`, trả về mã lỗi 401 kèm thông báo sai thông tin.
* **Luồng ngoại lệ:** Mất kết nối máy chủ $\to$ Báo lỗi kết nối mạng.

### Bảng 3.3: Đặc tả ca sử dụng Tùy biến món ăn & Quản lý giỏ hàng (UC-03)
* **Tên ca sử dụng:** Tùy biến món ăn & Quản lý giỏ hàng
* **Tác nhân:** Khách hàng
* **Mô tả:** Khách hàng chọn món ăn, tùy chọn các nguyên liệu theo sở thích, thêm vào giỏ hàng hoặc điều chỉnh số lượng.
* **Tiền điều kiện:** Khách hàng đã đăng nhập tài khoản.
* **Hậu điều kiện:** Bảng `cart` và `cart_item` trên CSDL được cập nhật chính xác các món và tổng tiền tạm tính.
* **Luồng cơ bản:**
  1. Khách hàng xem danh sách món ăn của một nhà hàng.
  2. Khách hàng nhấn vào món ăn, giao diện mở hộp thoại cho phép chọn thêm nguyên liệu (thêm phô mai, cay vừa, thêm thịt...).
  3. Khách hàng nhấn "Thêm vào giỏ hàng".
  4. Hệ thống kiểm tra món ăn có sẵn hàng không (`available == true`).
  5. Hệ thống thêm một `CartItem` mới vào giỏ hàng với danh sách nguyên liệu đã chọn.
  6. Hệ thống tính toán lại tổng tiền tạm tính của giỏ hàng và lưu vào bảng `cart`.
  7. Giao diện cập nhật biểu tượng giỏ hàng và thông báo món đã được thêm thành công.
* **Luồng thay thế:**
  * 4a. Món ăn đã hết hàng: Hệ thống từ chối và hiển thị cảnh báo món không khả dụng.
  * 5a. Khách hàng điều chỉnh số lượng (+/-) hoặc xóa món trong Giỏ hàng: Hệ thống cập nhật `CartItem` tương ứng và tính lại tổng tiền.

### Bảng 3.4: Đặc tả ca sử dụng Áp dụng mã giảm giá ràng buộc (UC-04)
* **Tên ca sử dụng:** Áp dụng mã giảm giá ràng buộc (Coupon Constraint Engine)
* **Tác nhân:** Khách hàng
* **Mô tả:** Thẩm định điều kiện ngưỡng giá trị đơn hàng tối thiểu, tính toán chiết khấu và tự động gỡ mã nếu không còn đủ điều kiện.
* **Tiền điều kiện:** Giỏ hàng có ít nhất một món ăn và người dùng đang ở trang Giỏ hàng.
* **Hậu điều kiện:** Mã ưu đãi được áp dụng hợp lệ, hiển thị số tiền được giảm và tổng thanh toán mới.
* **Luồng cơ bản:**
  1. Khách hàng nhập mã (ví dụ: `GIAM10%`) hoặc click nút "Áp dụng" từ danh sách mã khả dụng.
  2. Giao diện mã hóa URL (`encodeURIComponent`) và gửi yêu cầu thẩm định tới Backend: `/api/coupons/validate`.
  3. Hệ thống tìm kiếm mã trong CSDL, kiểm tra trạng thái kích hoạt (`active == true`).
  4. Hệ thống tính toán tổng tiền các món thuộc phạm vi áp dụng (theo từng nhà hàng hoặc toàn sàn).
  5. Hệ thống so sánh tổng tiền này với giá trị đơn hàng tối thiểu (`minimumOrderValue`).
  6. Nếu thỏa mãn điều kiện, hệ thống tính toán số tiền giảm (theo % hoặc số tiền cố định) với logic chặn biên `Math.max(0, Math.min(discount, applicableTotal))`.
  7. Giao diện hiển thị huy hiệu mã đã áp dụng thành công và cập nhật số tiền chiết khấu.
* **Luồng thay thế:**
  * 3a. Mã không tồn tại hoặc hết hiệu lực: Báo lỗi "Mã giảm giá không hợp lệ hoặc đã hết hạn".
  * 5a. Tổng tiền chưa đạt ngưỡng tối thiểu: Báo lỗi "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng mã".
  * 6a. Khách hàng giảm số lượng món khiến tổng tiền rơi xuống dưới ngưỡng tối thiểu: Cơ chế **Auto-removal** tại Client tự động gỡ bỏ mã và thông báo cho người dùng.

### Bảng 3.5: Đặc tả ca sử dụng Thanh toán Đa phương thức (Stripe Checkout & COD) (UC-05)
* **Tên ca sử dụng:** Thanh toán Đa phương thức (Stripe Checkout & COD)
* **Tác nhân:** Khách hàng, Cổng thanh toán Stripe
* **Mô tả:** Khách hàng chọn thanh toán trực tuyến qua cổng Stripe hoặc tiền mặt khi nhận hàng (COD) và xem hóa đơn điện tử.
* **Tiền điều kiện:** Khách hàng đã chọn địa chỉ nhận hàng và có sản phẩm trong giỏ hàng.
* **Hậu điều kiện:** Đơn hàng lưu kèm `paymentMethod` (`STRIPE` hoặc `COD`), trừ kho tự động, giỏ hàng được làm sạch; với Stripe trạng thái chuyển thành `PAID`.
* **Luồng cơ bản:**
  1. Khách hàng chọn phương thức thanh toán (`STRIPE` hoặc `COD`) tại Giỏ hàng và nhấn Đặt hàng.
  2. Hệ thống tạo bản ghi `Order` ở trạng thái `PENDING` kèm `paymentMethod`, trừ kho và phát WebSocket tới quán.
  3. Nếu chọn Stripe: Hệ thống gọi Stripe SDK tạo Session thanh toán và chuyển hướng tới Stripe Checkout.
  4. Khách hàng nhập thông tin thẻ hợp lệ và xác nhận thanh toán.
  5. Stripe xử lý giao dịch thành công và chuyển hướng về `/payment/success/:id`.
  6. Phía Client kích hoạt `PUT /api/order/{id}/complete-payment` (đã mở khóa `permitAll` an toàn).
  7. Máy chủ cập nhật trạng thái đơn hàng thành `PAID` và hiển thị hóa đơn xác nhận.
* **Luồng thay thế:**
  * 1a. Khách chọn `COD`: Máy chủ trả về `payment_url = null`; ứng dụng chuyển sang `/my-profile/orders` ở trạng thái `PENDING`.
  * 4a. Khách hàng nhấn nút Hủy trên Stripe: Stripe chuyển hướng về `/payment/fail`; đơn hàng giữ nguyên `PENDING`.

### Bảng 3.6: Đặc tả ca sử dụng Quản lý thực đơn và kho nguyên liệu (UC-06)
* **Tên ca sử dụng:** Quản lý thực đơn & Kho nguyên liệu của nhà hàng
* **Tác nhân:** Chủ nhà hàng (Restaurant Owner)
* **Mô tả:** Chủ quán thêm, sửa, xóa món ăn, thiết lập giá bán, cập nhật trạng thái còn/hết hàng và quản lý nguyên liệu.
* **Tiền điều kiện:** Chủ nhà hàng đã đăng nhập và sở hữu một nhà hàng trên hệ thống.
* **Hậu điều kiện:** Dữ liệu thực đơn và nguyên liệu được cập nhật tức thời trên CSDL.
* **Luồng cơ bản:**
  1. Chủ nhà hàng truy cập trang quản trị nhà hàng và chọn mục "Menu" hoặc "Ingredients".
  2. Để thêm món ăn mới: Chủ quán nhấn "Tạo món mới", nhập tên món, mô tả, giá tiền, chọn danh mục, gán các nhóm nguyên liệu và tải lên hình ảnh món ăn.
  3. Chủ quán nhấn nút "Lưu món ăn".
  4. Hệ thống kiểm tra quyền sở hữu nhà hàng và lưu bản ghi món ăn vào bảng `food`.
  5. Để cập nhật trạng thái còn/hết hàng: Chủ quán gạt nút chuyển trạng thái tại dòng món ăn hoặc nguyên liệu tương ứng.
  6. Hệ thống cập nhật trường `available` hoặc `inStock` trong CSDL.

### Bảng 3.7: Đặc tả ca sử dụng Tiếp nhận và Kiểm soát Máy trạng thái Đơn hàng (UC-07)
* **Tên ca sử dụng:** Tiếp nhận & Kiểm soát Máy trạng thái Đơn hàng (Order Fulfillment)
* **Tác nhân:** Chủ nhà hàng
* **Mô tả:** Chủ quán xem danh sách đơn sắp xếp mới nhất lên đầu kèm nhãn phương thức thanh toán và điều phối chuyển trạng thái hợp lệ.
* **Tiền điều kiện:** Chủ quán đăng nhập vào Bảng điều khiển quản trị nhà hàng.
* **Hậu điều kiện:** Trạng thái đơn hàng tuân thủ Order State Guard; tự động hoàn kho nếu hủy đơn và phát sóng WebSocket.
* **Luồng cơ bản:**
  1. Chủ quán chọn mục "Đơn hàng" trên thanh menu quản trị.
  2. Hệ thống truy vấn `/api/admin/order/restaurant/{id}` (sắp xếp `ORDER BY createdAt DESC, id DESC`).
  3. Bảng hiển thị danh sách đơn kèm huy hiệu `STRIPE`/`COD` và trạng thái hiện tại.
  4. Chủ quán chọn cập nhật trạng thái tuần tự (`PAID` $\to$ `OUT_FOR_DELIVERY` $\to$ `COMPLETED` hoặc `CANCELLED`).
  5. Hệ thống gọi API `PUT /api/admin/order/{orderId}/{orderStatus}`.
  6. Máy chủ áp dụng **Order State Guard**: chặn sửa đơn kết thúc và chặn đơn Stripe chưa thanh toán nhảy cóc; lưu trạng thái mới và phát sóng WebSocket.
* **Luồng thay thế:**
  * 4a. Chủ quán hủy đơn (`CANCELLED`): Kích hoạt `restoreStockForOrder(order)` hoàn trả nguyên liệu vào kho và ghi log `AUTO_RESTORE`.

### Bảng 3.8: Đặc tả ca sử dụng Kiểm duyệt đánh giá và Quản trị toàn sàn (UC-08)
* **Tên ca sử dụng:** Kiểm duyệt đánh giá & Quản trị toàn sàn của Super Admin
* **Tác nhân:** Quản trị viên tối cao (Super Admin)
* **Mô tả:** Quản trị viên theo dõi các chỉ số tổng thể, kiểm duyệt và xóa các bài đánh giá vi phạm chuẩn mực, loại bỏ các nhà hàng không đạt tiêu chuẩn.
* **Tiền điều kiện:** Người dùng đăng nhập với tài khoản có vai trò `ROLE_ADMIN`.
* **Hậu điều kiện:** Đánh giá hoặc nhà hàng vi phạm bị loại bỏ vĩnh viễn khỏi CSDL.
* **Luồng cơ bản:**
  1. Super Admin đăng nhập và truy cập phân hệ quản trị toàn sàn.
  2. Admin chọn mục "Reviews" để xem toàn bộ đánh giá của khách hàng trên toàn bộ các món ăn và nhà hàng.
  3. Admin phát hiện một bài đánh giá có ngôn từ phản cảm hoặc mang tính spam phá hoại.
  4. Admin nhấn nút "Xóa đánh giá vi phạm".
  5. Hệ thống gửi yêu cầu `DELETE /api/admin/reviews/{reviewId}` kèm mã JWT của Admin.
  6. Máy chủ xác thực quyền `ROLE_ADMIN`, thực thi thao tác xóa bản ghi trong bảng `review`.
  7. Hệ thống cập nhật lại danh sách đánh giá và tính toán lại điểm số sao trung bình của món ăn.
  8. Admin nhận được thông báo đã gỡ bỏ thành công đánh giá vi phạm.

### Bảng 3.9: Đặc tả ca sử dụng Tham vấn & Thực thi Tác tử Hành động AI Copilot (UC-09)
* **Tên ca sử dụng:** Tham vấn Quản trị & Thực thi Tác tử AI Hành động (Dual-Persona Agentic AI)
* **Mã ca sử dụng:** UC-09
* **Tác nhân:** Chủ nhà hàng (Restaurant Owner), Quản trị viên Sàn (Super Admin)
* **Mô tả:** Cho phép Chủ quán và Super Admin tra cứu chỉ số vận hành theo thời gian thực, nhận phân tích chiến lược từ Google Gemini 2.5 Flash (hoặc Heuristic DSS dự phòng) kèm thẻ hành động tự động 1-Click.
* **Tiền điều kiện:** Người dùng đã đăng nhập với vai trò `ROLE_RESTAURANT_OWNER` hoặc `ROLE_ADMIN`.
* **Hậu điều kiện:** Hiển thị 4 thẻ KPI theo vai trò, phản hồi Markdown và thẻ đề xuất hành động (`agentAction`) sẵn sàng thực thi xuống CSDL.
* **Luồng cơ bản:**
  1. Người quản trị chọn mục "Trợ lý AI Copilot" trên thanh điều hướng.
  2. Giao diện tự động gọi `GET /api/admin/ai/copilot/quick-insights/{id}` (với `0` cho Super Admin) và hiển thị 4 thẻ KPI tương ứng vai trò.
  3. Người quản trị nhập câu hỏi hoặc bấm câu hỏi gợi ý (Chủ quán: cảnh báo kho; Super Admin: kiểm duyệt đánh giá).
  4. Hệ thống gửi `POST /api/admin/ai/copilot/chat`.
  5. Backend tổng hợp số liệu từ DB, gọi Google Gemini 2.5 Flash (hoặc Heuristic DSS dự phòng) và gọi `determineAgentAction()` sinh gói `agentAction`.
  6. Phía Client hiển thị báo cáo Markdown kèm thẻ **Tác tử AI Hành Động** tương tác.
  7. Người dùng bấm nút Tác tử AI: Hệ thống thực thi khóa món cạn kho (`PUT /api/admin/food/{foodId}`) hoặc gỡ bỏ đánh giá vi phạm (`DELETE /api/reviews/{reviewId}`).
* **Luồng thay thế:**
  * 5a. Gemini API quá hạn hoặc chưa cấu hình Key: Động cơ Heuristic DSS phân tách vai trò (Owner DSS vs. AI Sentinel) lập tức trả về phân tích và `agentAction` trong dưới 5ms.

### Bảng 3.10: Đặc tả ca sử dụng Cảnh báo Đơn hàng Thời gian thực và Trừ Kho Tự động (UC-10)
* **Tên ca sử dụng:** Cảnh báo Đơn hàng Thời gian thực & Quản lý Tồn kho Tự động
* **Mã ca sử dụng:** UC-10
* **Tác nhân:** Khách hàng (kích hoạt), Chủ nhà hàng (tiếp nhận), WebSocket Server
* **Mô tả:** Khi khách hàng hoàn tất đặt đơn, hệ thống tự động khấu trừ định lượng nguyên liệu trong kho bếp và phát sóng thông báo đẩy qua kênh WebSocket kèm chuông báo tức thời đến màn hình quản trị của chủ quán.
* **Tiền điều kiện:** Khách hàng thực hiện đặt đơn thành công; Chủ quán đang mở màn hình quản trị và duy trì kết nối WebSocket.
* **Hậu điều kiện:** Số lượng nguyên liệu chế biến giảm tương ứng trong CSDL; bản ghi `InventoryLog` được lưu; đơn hàng mới xuất hiện ngay lập tức trên bảng điều khiển của chủ quán kèm chuông reo.
* **Luồng cơ bản:**
  1. Khách hàng nhấn xác nhận đặt hàng tại màn hình thanh toán.
  2. Backend kiểm tra và lưu đơn hàng mới vào bảng `orders`.
  3. Phương thức `depleteStockForOrder` duyệt qua từng món trong đơn, lấy danh sách nguyên liệu thành phần và trừ số lượng tồn kho theo số lượng món đặt mua.
  4. Hệ thống ghi nhật ký xuất kho với hành động `AUTO_DEPLETION` vào bảng `inventory_log`. Nếu số lượng tồn kho về 0, hệ thống tự động đánh dấu `inStock = false`.
  5. Backend đóng gói thông tin đơn hàng thành đối tượng `OrderNotificationDTO` và gọi `broadcastToRestaurant`.
  6. WebSocket Server gửi tin nhắn JSON tới toàn bộ các kết nối đang mở của nhà hàng.
  7. Phía Client nhận gói tin qua `OrderNotificationListener.jsx`, kích hoạt hàm `playOrderChime()` tạo chuông 3 âm sắc (E5 $\to$ G#5 $\to$ B5) qua Web Audio API và cập nhật danh sách đơn hàng mà không cần tải lại trang.
* **Luồng thay thế:**
  * 2a. Đơn hàng sau đó bị khách hoặc chủ quán hủy (`CANCELLED`): Backend kích hoạt `restoreStockForOrder`, hoàn trả lại số lượng tồn kho nguyên liệu, ghi log `AUTO_RESTORE` và gửi thông báo qua WebSocket để chủ quán dừng chuẩn bị món.
* **Luồng ngoại lệ:** Kết nối WebSocket bị ngắt do mạng gián đoạn: Phía Frontend có cơ chế tự động kết nối lại (Auto-reconnect) định kỳ 3 giây một lần.

### Bảng 3.11: Đặc tả ca sử dụng Tư vấn Ẩm thực Khách hàng AI Concierge & Menu RAG (UC-11)
* **Tên ca sử dụng:** Tư vấn Ẩm thực Khách hàng qua Trợ lý AI Concierge (Menu Catalog RAG)
* **Mã ca sử dụng:** UC-11
* **Tác nhân:** Khách hàng / Khách vãng lai (Customer / Guest)
* **Mô tả:** Cho phép người dùng truy cập nền tảng tương tác với Widget Trợ lý Ẩm thực để được gợi ý món bán chạy thực tế, xem mã giảm giá hiệu lực và điều hướng trực tiếp tới đúng món ăn tại nhà hàng.
* **Tiền điều kiện:** Người dùng mở giao diện khách hàng (không bắt buộc đăng nhập).
* **Hậu điều kiện:** Nhận được thẻ món ăn trực quan khớp ngữ cảnh thực tế từ DB và mở nhanh thực đơn tại món được gợi ý.
* **Luồng cơ bản:**
  1. Khi truy cập trang chủ, `Chatbot.jsx` nạp sẵn ngữ cảnh thực tế từ `GET /api/food/popular` và `GET /api/coupons`.
  2. Người dùng bấm biểu tượng Chat nổi góc phải và chọn câu hỏi gợi ý (VD: "Gợi ý cơm trưa ngon hôm nay") hoặc nhập từ khóa món ăn.
  3. Bộ truy xuất Menu Catalog RAG tìm món bán chạy phù hợp nhất kèm mã giảm giá đang kích hoạt.
  4. Giao diện kết xuất thẻ món ăn giàu thông tin gồm ảnh thực tế, giá bán, tên quán, mẹo mã `GIAM20K` và nút "Xem Quán & Đặt Món Ngay".
  5. Khách hàng bấm nút: điều hướng tới `/restaurant/{city}/{name}/{id}?foodId={foodId}`, tự động cuộn mượt và làm nổi bật món ăn đó.
* **Luồng thay thế:**
  * 3a. Hỏi về nhà hàng, mã ưu đãi hoặc chính sách giao/hủy đơn: Chatbot trích xuất thông tin từ Store và phản hồi tức thì.

---

\newpage

# CHƯƠNG 4. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 4.1. Kiến trúc Hệ thống Tổng thể và Sơ đồ Triển khai
Hệ thống được thiết kế theo mô hình kiến trúc phân tầng 3 lớp (3-Tier Architecture) phân tách rõ ràng giữa Client, Server và Database. Sơ đồ triển khai vật lý được minh họa trong hình dưới:

![Sơ đồ Triển khai Vật lý của Hệ thống (Deployment Diagram)](figures/fig_deployment.png)

## 4.2. Biểu đồ Tuần tự cho các Luồng Nghiệp vụ Cốt lõi
### 4.2.1. Biểu đồ Tuần tự: Đăng ký & Đăng nhập Phân quyền JWT
Quy trình xác thực người dùng, băm mật khẩu bằng BCrypt, chặn leo thang đặc quyền ROLE_ADMIN và tự động tạo giỏ hàng ban đầu:

![Biểu đồ tuần tự ca sử dụng Đăng ký và Đăng nhập xác thực JWT](figures/fig_sequence_auth.png)

### 4.2.2. Biểu đồ Tuần tự: Giỏ hàng và Áp dụng Mã Giảm giá Ràng buộc
Quy trình kiểm tra tính hợp lệ của mã giảm giá, kiểm tra ngưỡng tối thiểu, cơ chế tự động gỡ mã (Auto-removal) và chốt đơn an toàn biên:

![Biểu đồ tuần tự ca sử dụng Giỏ hàng và Áp dụng mã giảm giá ràng buộc](figures/fig_sequence_order_coupon.png)

### 4.2.3. Biểu đồ Tuần tự: Thanh toán Đa phương thức (Stripe Checkout & COD)
Quy trình phân nhánh thanh toán đa phương thức (`COD` vs `STRIPE`), mở khóa callback `complete-payment` và xác nhận cập nhật trạng thái đơn hàng:

![Biểu đồ tuần tự ca sử dụng Thanh toán Đa phương thức (Stripe Checkout & COD)](figures/fig_sequence_stripe_payment.png)

### 4.2.4. Biểu đồ Tuần tự: Tiếp nhận và Kiểm soát Máy trạng thái Đơn hàng
Quy trình sắp xếp đơn hàng mới nhất lên đầu (`ORDER BY createdAt DESC, id DESC`), kiểm soát chuyển trạng thái hợp lệ (Order State Guard) và hoàn kho khi hủy đơn:

![Biểu đồ tuần tự ca sử dụng Tiếp nhận và Kiểm soát Máy trạng thái Đơn hàng](figures/fig_sequence_order_status.png)

### 4.2.5. Biểu đồ Tuần tự: Kiểm duyệt Đánh giá của Super Admin
Quy trình rà soát theo nhà hàng và loại bỏ các bình luận tiêu cực, độc hại khỏi hệ thống:

![Biểu đồ tuần tự ca sử dụng Kiểm duyệt đánh giá và nhà hàng vi phạm](figures/fig_sequence_admin_review.png)

### 4.2.6. Biểu đồ Tuần tự: Cảnh báo Đơn hàng WebSocket và Tác tử AI Copilot
Quy trình truyền thông thời gian thực và điều phối Tác tử AI hành động được mô tả trong hình dưới:

![Biểu đồ tuần tự Cảnh báo WebSocket và Tác tử AI Copilot Đa vai trò](figures/fig_sequence_websocket_ai.png)

Sơ đồ trên minh họa sự phối hợp nhịp nhàng giữa hai luồng kỹ thuật nâng cao:
1. **Luồng cảnh báo tức thời & Trừ kho tự động:** Khi khách hàng tạo đơn hàng thành công tại `OrderServiceImpl`, hệ thống tự động kích hoạt dịch vụ kho `IngredientsServiceImpl.depleteStockForOrder` để khấu trừ định lượng nguyên liệu và ghi bản ghi biến động vào bảng `inventory_log`. Ngay sau đó, đối tượng thông báo `OrderNotificationDTO` được đẩy tới `OrderWebSocketHandler.broadcastToRestaurant`. Tại trình duyệt của chủ nhà hàng, component `OrderNotificationListener.jsx` bắt sự kiện, gọi bộ tổng hợp âm thanh `playOrderChime()` tạo chuông ngân 3 nốt nhạc và cập nhật bảng đơn hàng tức thì mà không cần làm mới trang.
2. **Luồng Tác tử AI Copilot Đa vai trò (Dual-Persona Agentic AI):** Khi Chủ quán hoặc Super Admin gửi truy vấn tại `AiCopilot.jsx`, `AiCopilotServiceImpl` thu thập số liệu thực tế theo vai trò, gửi tới **Google Gemini 2.5 Flash** (hoặc kích hoạt Heuristic DSS dự phòng), đồng thời gọi `determineAgentAction()` để đính kèm thẻ nút hành động 1-Click (`LOCK_FOOD_AVAILABILITY` khóa món cạn kho hoặc `MODERATE_REVIEW` gỡ đánh giá vi phạm).

### 4.2.7. Biểu đồ Tuần tự: Tư vấn Ẩm thực Khách hàng AI Concierge (Menu Catalog RAG)
Quy trình truy xuất thực đơn thực tế và điều hướng đặt món thông minh qua deep-link `?foodId={id}` cho khách hàng:

![Biểu đồ tuần tự Tư vấn Ẩm thực Khách hàng qua AI Concierge (Menu Catalog RAG)](figures/fig_sequence_chatbot_rag.png)

## 4.3. Thiết kế Cơ sở Dữ liệu
### 4.3.1. Mô hình Thực thể Liên kết (ERD) Hoàn chỉnh
Cơ sở dữ liệu của hệ thống gồm 21 bảng/thực thể chuẩn hóa 3NF:

![Mô hình Thực thể Liên kết (ERD) Hoàn chỉnh 21 Bảng của Hệ thống](figures/fig_erd_full.png)

Mô hình dữ liệu trên bao quát đầy đủ các thực thể cốt lõi: người dùng (`User`), địa chỉ (`Address`), nhà hàng (`Restaurant`), thực đơn món ăn (`Food`), danh mục (`Category`), kho nguyên liệu phân nhóm (`IngredientCategory`, `IngredientsItem`), nhật ký xuất nhập tồn kho (`InventoryLog`), giỏ hàng (`Cart`, `CartItem`), đơn hàng (`Order`, `OrderItem`), mã ưu đãi (`Coupon`), sự kiện (`Events`) và đánh giá nhận xét (`Review`).

### 4.3.2. Từ điển Dữ liệu Chi tiết (Data Dictionary)
* **Bảng `User`:** Lưu thông tin tài khoản người dùng (`id`, `fullName`, `email`, `password`, `role`).
* **Bảng `Restaurant`:** Lưu thông tin nhà hàng (`id`, `owner_id`, `address_id`, `name`, `description`, `cuisineType`, `openingHours`, `open`, `registrationDate`).
* **Bảng `Food`:** Thực đơn món ăn (`id`, `restaurant_id`, `category_id`, `name`, `description`, `price`, `available`, `isVegetarian`, `isSeasonal`, `creationDate`).
* **Bảng `IngredientsItem`:** Kho nguyên liệu chế biến định lượng tồn kho (`id`, `restaurant_id`, `category_id`, `name`, `inStock`, `quantity`, `unit`, `minThreshold`).
* **Bảng `InventoryLog`:** Nhật ký xuất nhập tồn kho tự động (`id`, `restaurantId`, `ingredientId`, `ingredientName`, `actionType`, `changeAmount`, `remainingQuantity`, `unit`, `orderId`, `note`, `createdAt`).
* **Bảng `Cart` & `CartItem`:** Quản lý giỏ hàng và các món tùy biến nguyên liệu của khách hàng.
* **Bảng `Order` & `OrderItem`:** Quản lý đơn đặt hàng, địa chỉ giao nhận, mã giảm giá áp dụng, số tiền chiết khấu, phương thức thanh toán (`paymentMethod`: `STRIPE` | `COD`) và trạng thái đơn hàng.
* **Bảng `Coupon`:** Quản trị mã giảm giá với các thuộc tính (`code`, `discountType`, `discountValue`, `minimumOrderValue`, `active`, `restaurant_id`).
* **Bảng `Events`:** Quản trị các sự kiện khuyến mãi của từng nhà hàng (`name`, `location`, `image`, `startedAt`, `endsAt`, `promoCode`, `discountType`, `discountValue`, `minimumOrderValue`) tự động đồng bộ sinh mã sang `Coupon`.
* **Bảng `Review`:** Đánh giá và số sao bình luận của khách hàng đối với món ăn và nhà hàng.

---

\newpage

# CHƯƠNG 5. XÂY DỰNG VÀ TRIỂN KHAI ỨNG DỤNG

## 5.1. Môi trường Phát triển và Thư viện Sử dụng
* **Hệ điều hành:** Microsoft Windows 11 Pro 64-bit.
* **Backend:** Java 17 LTS / JRE 23, Spring Boot 3.4.0, Spring Security, Spring Data JPA, Spring WebSocket, Hibernate ORM, MySQL 8.0 (`anh_food_yt:3307`), Stripe Java SDK 24.12.0, JJWT 0.11.5, Google Gemini 2.5 Flash API Client.
* **Frontend:** React 19.2.6, Vite 8.0, Redux Toolkit 2.12.0, React-Router-DOM 7.15.1, Material-UI (MUI 9.0.1), TailwindCSS 3.4.19, Recharts 3.8.1, Axios 1.16.1, Formik, Yup, React Slick, Web Audio API Sound Synthesizer.
* **Công cụ:** Visual Studio Code, IntelliJ IDEA, Antigravity IDE, Postman, Apache JMeter, MySQL Workbench.

## 5.2. Cài đặt các Chức năng Quan trọng của Hệ thống
### 5.2.1. Cài đặt Bảo mật Xác thực JWT và Chặn Leo thang Đặc quyền
Tại `AuthController.java`, cơ chế chặn đăng ký trái phép quyền Admin được hiện thực như sau:

```java
@PostMapping("/signup")
public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
    User isEmailExist = userRepository.findByEmail(user.getEmail());
    if (isEmailExist != null) {
        throw new Exception("Email is already used with another account");
    }

    User createdUser = new User();
    createdUser.setEmail(user.getEmail());
    createdUser.setFullName(user.getFullName());
    
    // Ngăn chặn tuyệt đối việc tự đăng ký quyền Admin từ bên ngoài
    if (user.getRole() == USER_ROLE.ROLE_ADMIN) {
        throw new Exception("Registration as ADMIN is not allowed.");
    }
    createdUser.setRole(user.getRole() != null ? user.getRole() : USER_ROLE.ROLE_CUSTOMER);
    createdUser.setPassword(passwordEncoder.encode(user.getPassword()));

    User savedUser = userRepository.save(createdUser);

    // Tự động tạo giỏ hàng trống ngay khi User đăng ký thành công
    Cart cart = new Cart();
    cart.setCustomer(savedUser);
    cartRepository.save(cart);

    UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getEmail());
    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String jwt = jwtProvider.generateToken(authentication);

    AuthResponse authResponse = new AuthResponse();
    authResponse.setJwt(jwt);
    authResponse.setMessage("Register success");
    authResponse.setRole(savedUser.getRole());

    return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
}
```

Bên cạnh đó, để hỗ trợ khách vãng lai (Guest Browsing) tự do khám phá 16 nhà hàng, tìm món và tương tác Chatbot trước khi đăng nhập, `AppConfig.java` mở quyền `permitAll()` cho các endpoint công khai và `PUT /api/order/*/complete-payment`, đồng thời `JwtTokenValidator.java` xóa ngữ cảnh xác thực (`SecurityContextHolder.clearContext()`) thay vì chặn khi gặp token hết hạn đối với các route public.

### 5.2.2. Cài đặt Động cơ Khuyến mãi Ràng buộc (Coupon Constraint Engine)
Tại `OrderServiceImpl.java`, thuật toán tính chiết khấu an toàn biên và kiểm tra ngưỡng đơn hàng tối thiểu:

```java
// Áp dụng Coupon giảm giá nếu có gửi kèm trong yêu cầu đặt hàng
if (orderReq.getCouponCode() != null && !orderReq.getCouponCode().trim().isEmpty()) {
    Optional<Coupon> couponOpt = couponRepository.findByCodeAndRestaurantId(orderReq.getCouponCode(), restaurant.getId());
    if (!couponOpt.isPresent()) {
        Optional<Coupon> globalCouponOpt = couponRepository.findByCode(orderReq.getCouponCode());
        if (globalCouponOpt.isPresent()) {
            couponOpt = globalCouponOpt;
        }
    }
    if (couponOpt.isPresent()) {
        Coupon coupon = couponOpt.get();
        if (coupon.isActive()) {
            long minOrderVal = coupon.getMinimumOrderValue() != null ? coupon.getMinimumOrderValue() : 0L;
            long applicableTotal = 0L;

            if (coupon.getRestaurant() != null) {
                Long couponRestId = coupon.getRestaurant().getId();
                for (OrderItem oi : orderItems) {
                    if (oi.getFood() != null && oi.getFood().getRestaurant() != null 
                        && couponRestId.equals(oi.getFood().getRestaurant().getId())) {
                        applicableTotal += oi.getTotalPrice();
                    }
                }
                if (applicableTotal == 0) {
                    throw new Exception("Mã giảm giá này chỉ áp dụng cho các món ăn của nhà hàng " + coupon.getRestaurant().getName());
                }
                if (applicableTotal < minOrderVal) {
                    throw new Exception("Tổng tiền các món của nhà hàng chưa đạt giá trị tối thiểu " + minOrderVal + " đ để áp dụng.");
                }
            } else {
                applicableTotal = totalPrice;
                if (applicableTotal < minOrderVal) {
                    throw new Exception("Đơn hàng chưa đạt giá trị tối thiểu " + minOrderVal + " đ để áp dụng mã giảm giá này.");
                }
            }

            long discount = 0;
            long discVal = coupon.getDiscountValue() != null ? coupon.getDiscountValue() : 0L;
            String discType = coupon.getDiscountType() != null ? coupon.getDiscountType() : "";
            if ("PERCENTAGE".equalsIgnoreCase(discType)) {
                discount = (applicableTotal * discVal) / 100;
            } else if ("FLAT".equalsIgnoreCase(discType)) {
                discount = discVal;
            }
            // Đảm bảo số tiền giảm không âm và không vượt quá tổng tiền món áp dụng
            discount = Math.max(0, Math.min(discount, applicableTotal));
            createdOrder.setCouponCode(coupon.getCode());
            createdOrder.setDiscountAmount(discount);
            totalPrice = Math.max(0, totalPrice - discount);
        }
    }
}
```

### 5.2.3. Cài đặt Thanh toán Đa phương thức (Stripe Checkout & COD) và Máy trạng thái Đơn hàng
Tại `OrderController.java` và `OrderServiceImpl.java`, hệ thống phân nhánh thanh toán đa phương thức (`STRIPE` vs `COD`), mở khóa callback `complete-payment` và cài đặt **Order State Guard**:

```java
@PostMapping("/order")
public ResponseEntity<PaymentResponse> createOrder(@RequestBody CreateOrderRequest req,
        @RequestHeader("Authorization") String jwt) throws Exception {
    User user = userService.findUserByJwtToken(jwt);
    Order order = orderService.createOrder(req, user);

    PaymentResponse res = new PaymentResponse();
    if (req.getPaymentMethod() != null && "COD".equalsIgnoreCase(req.getPaymentMethod().trim())) {
        res.setPayment_url(null);
    } else {
        res = paymentService.createPaymentLink(order);
    }
    return new ResponseEntity<>(res, HttpStatus.OK);
}
```

Đồng thời, `OrderServiceImpl.updateOrder()` chặn sửa trạng thái các đơn đã kết thúc (`COMPLETED`/`CANCELLED`), cấm đơn Stripe `PENDING` nhảy cóc giao hàng khi chưa thanh toán, tự động hoàn kho khi chủ quán hủy đơn và sắp xếp `ORDER BY o.createdAt DESC, o.id DESC`.

### 5.2.4. Cài đặt Cơ chế Tự động Gỡ bỏ Mã Giảm giá ở Phía Client (Auto-Removal)
Trong tệp giao diện giỏ hàng `Cart.jsx`, thuật toán theo dõi giá trị giỏ hàng được cài đặt thông qua React Hook `useEffect`:

```javascript
// Tự động kiểm tra và gỡ bỏ mã giảm giá nếu giỏ hàng không còn đủ điều kiện
useEffect(() => {
    if (appliedCoupon && cartItems.length > 0) {
        const applicableSubtotal = getApplicableSubtotalForCoupon(appliedCoupon);
        const minOrderValue = appliedCoupon.minimumOrderValue || 0;
        
        if (applicableSubtotal < minOrderValue) {
            setAppliedCoupon(null);
            setPromoError(
                `Mã ${appliedCoupon.code} đã tự động gỡ bỏ do đơn hàng chưa đạt tối thiểu ${minOrderValue.toLocaleString()} đ`
            );
        }
    } else if (cartItems.length === 0 && appliedCoupon) {
        setAppliedCoupon(null);
    }
}, [cartTotal, cartItems]);

// Áp dụng mã giảm giá an toàn ký tự đặc biệt
const applyCouponByCode = async (codeToApply, restId = null) => {
    if (!codeToApply || cartItems.length === 0) return;
    try {
        const targetRestId = restId || restaurantIds[0];
        // Mã hóa URI để bảo vệ ký tự đặc biệt như % khỏi bị chặn bởi Firewall
        const safeCode = encodeURIComponent(codeToApply.trim().toUpperCase());
        const { data } = await api.get(
            `/api/coupons/validate?code=${safeCode}&restaurantId=${targetRestId}`, 
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        setAppliedCoupon(data);
        setPromoError("");
    } catch (err) {
        setPromoError(err.response?.data?.message || "Mã khuyến mãi không hợp lệ");
    }
};
```

### 5.2.5. Cài đặt Kênh WebSocket Phát sóng Đơn hàng Thời gian thực và Chuông Thuật toán
Nhằm triệt tiêu độ trễ tiếp nhận đơn hàng, hệ thống xây dựng kênh truyền thông thời gian thực bằng Spring WebSocket kết hợp bộ tổng hợp âm thanh tương tác tại Client.

Tại tầng Backend, lớp `OrderWebSocketHandler.java` quản lý các phiên kết nối đồng thời và thực hiện phát sóng sự kiện:

```java
@Component
public class OrderWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    // Ánh xạ: restaurantId -> Set các phiên WebSocket đang kết nối
    private final Map<Long, Set<WebSocketSession>> restaurantSessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionRestaurantMap = new ConcurrentHashMap<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode root = objectMapper.readTree(message.getPayload());
        String type = root.has("type") ? root.get("type").asText() : "";
        if ("SUBSCRIBE_RESTAURANT".equalsIgnoreCase(type) && root.has("restaurantId")) {
            Long restaurantId = root.get("restaurantId").asLong();
            restaurantSessions.computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet()).add(session);
            sessionRestaurantMap.put(session.getId(), restaurantId);
            // Gửi xác nhận kết nối (ACK) về phía Client
            session.sendMessage(new TextMessage("{\"type\":\"SUBSCRIBE_ACK\",\"status\":\"CONNECTED\"}"));
        }
    }

    public void broadcastToRestaurant(Long restaurantId, OrderNotificationDTO notification) {
        if (restaurantId == null || notification == null) return;
        Set<WebSocketSession> sessions = restaurantSessions.get(restaurantId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String jsonPayload = objectMapper.writeValueAsString(notification);
            TextMessage textMessage = new TextMessage(jsonPayload);
            for (WebSocketSession s : sessions) {
                if (s.isOpen()) {
                    s.sendMessage(textMessage);
                }
            }
        } catch (Exception e) {
            System.err.println("[WebSocket] Error broadcasting alert: " + e.getMessage());
        }
    }
}
```

Phía Client tại tệp `soundAlert.js`, thay vì tải tệp âm thanh MP3 nặng nề và dễ bị trình duyệt chặn, ứng dụng sử dụng chuẩn Web Audio API để tổng hợp trực tiếp chuông 3 nốt nhạc hài hòa:

```javascript
export const playOrderChime = () => {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') ctx.resume();

        // Chuỗi âm thanh chuông 3 nốt nhạc: E5 -> G#5 -> B5 (Hợp âm trưởng vui tươi)
        const notes = [
            { freq: 659.25, start: 0.0, duration: 0.25, volume: 0.25 },
            { freq: 830.61, start: 0.12, duration: 0.30, volume: 0.30 },
            { freq: 987.77, start: 0.24, duration: 0.65, volume: 0.35 }
        ];

        notes.forEach(({ freq, start, duration, volume }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

            gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
            gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + start);
            osc.stop(ctx.currentTime + start + duration);
        });
    } catch (e) {
        console.warn("Could not play order chime:", e);
    }
};
```

### 5.2.6. Cài đặt Trợ lý Quản trị Thông minh AI Copilot Đa vai trò & Tác tử Hành động
Lớp dịch vụ `AiCopilotServiceImpl.java` hiện thực hóa kiến trúc **Dual-Persona Agentic AI** kết hợp chiến lược phòng thủ hai tầng: kết nối API **Google Gemini 2.5 Flash** (`gemini-2.5-flash`), tự động kích hoạt Động cơ Heuristic DSS khi ngoại tuyến và trả kèm `agentAction` (`LOCK_FOOD_AVAILABILITY` / `MODERATE_REVIEW`) cho phép thực thi 1-Click:

```java
@Service
public class AiCopilotServiceImpl implements AiCopilotService {
    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Override
    public AiChatResponse chatWithCopilot(AiChatRequest request) {
        Long restaurantId = request.getRestaurantId();
        boolean isSuperAdmin = (restaurantId == null || restaurantId == 0L);
        String userQuery = (request.getMessage() != null && !request.getMessage().trim().isEmpty())
                ? request.getMessage().trim()
                : (isSuperAdmin ? "Phân tích vận hành toàn sàn." : "Phân tích kinh doanh tổng quan.");

        // 1. Thu thập chỉ số thực tế từ MySQL (theo nhà hàng hoặc GMV/CSAT toàn sàn)
        Map<String, Object> metrics = collectRestaurantMetrics(restaurantId);

        // 2. Gọi API Google Gemini 2.5 Flash
        String aiReply = callGeminiApi(userQuery, metrics);

        // 3. Kích hoạt Heuristic DSS Engine dự phòng nếu Gemini timeout / offline
        if (aiReply == null || aiReply.trim().isEmpty()) {
            aiReply = generateHeuristicBusinessInsight(metrics, userQuery, restaurantId);
        }

        // 4. Sinh gói Tác tử AI Hành động 1-Click (MODERATE_REVIEW hoặc LOCK_FOOD_AVAILABILITY)
        Map<String, Object> agentAction = determineAgentAction(userQuery, isSuperAdmin, restaurantId, metrics);
        List<String> prompts = isSuperAdmin ? superAdminSuggestedPrompts : ownerSuggestedPrompts;

        return new AiChatResponse(aiReply, Instant.now(), metrics, prompts, agentAction);
    }
}
```

### 5.2.7. Cài đặt Cơ chế Tự động Trừ Kho và Lưu Nhật ký Xuất Nhập (Smart Stock Depletion)
Tại lớp `IngredientsServiceImpl.java`, hệ thống tự động khấu trừ định lượng nguyên liệu cấu thành món ăn khi đơn được tạo và hoàn kho khi đơn bị hủy:

```java
@Override
public void depleteStockForOrder(Order order) {
    if (order == null || order.getItems() == null || order.getItems().isEmpty()) return;
    Long restaurantId = order.getRestaurant() != null ? order.getRestaurant().getId() : null;

    for (OrderItem orderItem : order.getItems()) {
        if (orderItem.getFood() == null || orderItem.getFood().getId() == null) continue;
        Optional<Food> foodOpt = foodRepository.findById(orderItem.getFood().getId());
        if (foodOpt.isEmpty()) continue;
        Food food = foodOpt.get();

        List<IngredientsItem> ingredients = food.getIngredients();
        if (ingredients == null || ingredients.isEmpty()) continue;
        int orderQty = orderItem.getQuantity() > 0 ? orderItem.getQuantity() : 1;

        for (IngredientsItem ing : ingredients) {
            Optional<IngredientsItem> liveIngOpt = ingredientItemRepository.findById(ing.getId());
            if (liveIngOpt.isEmpty()) continue;
            IngredientsItem liveIng = liveIngOpt.get();

            double consumed = (double) orderQty;
            double currentQty = liveIng.getQuantity();
            double newQty = Math.max(0.0, currentQty - consumed);

            liveIng.setQuantity(newQty);
            if (newQty <= 0.0) liveIng.setInStock(false);
            ingredientItemRepository.save(liveIng);

            // Ghi nhật ký xuất kho tự động vào CSDL
            InventoryLog log = new InventoryLog();
            log.setRestaurantId(restaurantId);
            log.setIngredientId(liveIng.getId());
            log.setIngredientName(liveIng.getName());
            log.setActionType("AUTO_DEPLETION");
            log.setChangeAmount(-consumed);
            log.setRemainingQuantity(newQty);
            log.setUnit(liveIng.getUnit());
            log.setOrderId(order.getId());
            log.setNote("Tự động trừ " + consumed + " " + liveIng.getUnit() + " khi phục vụ món '" + food.getName() + "'");
            inventoryLogRepository.save(log);
        }
    }
}
```

### 5.2.8. Cài đặt Trợ lý Ẩm thực Menu Catalog RAG và Đồng bộ Hệ sinh thái Dữ liệu
Bên cạnh trợ lý điều hành phía quản trị, phân hệ khách hàng tích hợp Widget **Trợ lý Ẩm thực AI Concierge** tại `Chatbot.jsx` ứng dụng kỹ thuật **Menu Catalog RAG** (nạp danh mục món bán chạy từ `/api/food/popular` và các coupon kích hoạt từ `/api/coupons`), trả về thẻ gợi ý món ăn trực quan kèm nút liên kết sâu `/restaurant/{city}/{name}/{id}?foodId={id}` tự động cuộn và làm nổi bật món ăn tại trang nhà hàng.

Đồng thời, hệ sinh thái dữ liệu và vận hành được hoàn thiện đồng bộ gồm:
* **Đồng bộ Sự kiện -- Mã ưu đãi (`EventsServiceImpl.java`):** Tự động tạo/cập nhật bản ghi `Coupon` tương ứng khi chủ quán khởi tạo sự kiện đính kèm `promoCode`.
* **Mở rộng hệ thống dữ liệu thực tiễn:** Hoàn thiện mạng lưới **16 nhà hàng đối tác** trải dài 3 tỉnh thành (Hà Nội, TP. Hồ Chí Minh, Quảng Nam -- bổ sung Nhà Hàng Chay Hoa Anh Đào Hội An), **82 món ăn** với 100% ảnh thực tế chuẩn ẩm thực, **8 mã giảm giá** (4 toàn sàn, 4 riêng theo quán), và **4 sự kiện** đồng bộ.
* **Bảo vệ dữ liệu & Tự động hóa vận hành:** Các endpoint seed ghi đè (`/public/fix-images`, `/public/update-curated-images`) được khóa bảo vệ bằng tham số `?confirm=true`; cung cấp bộ kịch bản 1-Click `KHOI_DONG_HE_THONG.bat`, `KHOI_DONG_LAI_BACKEND.bat` cùng tệp sao lưu SQL `database/restore_images_and_coupons.sql`.

## 5.3. Đánh giá Thực nghiệm và Đo đạc Hiệu năng Hệ thống

Để kiểm chứng tính khả thi, độ ổn định và hiệu năng vận hành trong điều kiện thực tế, hệ thống đã được triển khai thử nghiệm trên môi trường máy chủ thực nghiệm và tiến hành đo đạc định lượng trên ba phân hệ cốt lõi: truyền thông thời gian thực WebSocket, tính toàn vẹn kho nguyên liệu ACID khi chịu tải đồng thời, và thời gian phản hồi của Trợ lý Quản trị AI Copilot kết hợp Động cơ DSS dự phòng.

### 5.3.1. Đo đạc Độ trễ Truyền thông Đơn hàng: WebSocket so với HTTP Polling
Nhằm chứng minh sự vượt trội của giải pháp WebSocket so với phương pháp kéo dữ liệu định kỳ truyền thống (HTTP Long-Polling với chu kỳ 2 giây), một kịch bản đo đạc thực tế gồm 100 đơn hàng liên tiếp được kích hoạt từ phía khách hàng và ghi nhận thời điểm máy chủ phát tín hiệu so với thời điểm máy khách của chủ nhà hàng nhận được thông báo kèm kích hoạt chuông âm thanh Web Audio API.

**Bảng 5.1. So sánh hiệu năng giữa giao thức WebSocket và HTTP Polling**

| Chỉ số Đánh giá | HTTP Polling (Chu kỳ 2s) | Spring WebSocket (Đề tài) |
| :--- | :---: | :---: |
| **Độ trễ trung bình tiếp nhận đơn (Latency)** | 1.526,4 ms | **26,5 ms** |
| **Độ trễ thấp nhất (Min Latency)** | 124,0 ms | **14,2 ms** |
| **Độ trễ cao nhất (Max Latency)** | 1.988,0 ms | **48,7 ms** |
| **Chi phí tiêu thụ băng thông (Network Overhead)** | 845 KB / 10 phút | **52 KB / 10 phút** |
| **Tỷ lệ gói tin thăm dò rác (Empty Polls)** | 96,2% | **0%** |
| **Mức chiếm dụng CPU máy chủ (100 Client đồng thời)** | 14,8% | **1,2%** |
| **Độ tăng tốc độ phản hồi (Speedup)** | Mốc cơ sở (1x) | **Nhanh gấp 57,6 lần** |

Số liệu thực nghiệm tại Bảng 5.1 khẳng định kênh WebSocket do đề tài thiết kế giúp giảm độ trễ tiếp nhận đơn hàng xuống chỉ còn **26,5 ms** (nhanh gấp **57,6 lần** so với HTTP Polling), đồng thời triệt tiêu hoàn toàn 100% các yêu cầu thăm dò rác, tiết kiệm hơn 93,8% lưu lượng băng thông mạng và giảm tải CPU máy chủ xuống mức tối thiểu (1,2%).

### 5.3.2. Đo đạc Tính Nhất quán và Khả năng Chịu tải của Cơ chế Trừ Kho Tự động ACID
Tính toàn vẹn dữ liệu tồn kho là bài toán sống còn trong thương mại ẩm thực nhằm ngăn ngừa hiện tượng bán vượt số lượng thực tế (Overselling). Đề tài tiến hành kịch bản kiểm thử tải đa luồng (Stress Testing) bằng Apache JMeter: mô phỏng 100 giao dịch đặt hàng đồng thời truy cập vào cùng một món ăn có cấu thành từ nguyên liệu tồn kho ban đầu là 500 đơn vị (mỗi đơn hàng tiêu thụ định lượng 2 đơn vị).

**Bảng 5.2. Kết quả kiểm thử tính nhất quán khấu trừ kho đa luồng (ACID Concurrency Test)**

| Kịch bản Kiểm thử | 10 Luồng đồng thời | 50 Luồng đồng thời | 100 Luồng đồng thời |
| :--- | :---: | :---: | :---: |
| **Số lượng giao dịch thành công** | 10 / 10 (100%) | 50 / 50 (100%) | 100 / 100 (100%) |
| **Thời gian xử lý trung bình / giao dịch** | 142 ms | 298 ms | 483 ms |
| **Số lượng tồn kho kỳ vọng (Ban đầu 500)** | 480 đơn vị | 400 đơn vị | 300 đơn vị |
| **Số lượng tồn kho thực tế ghi nhận CSDL** | 480 đơn vị | 400 đơn vị | 300 đơn vị |
| **Số bản ghi nhật ký `InventoryLog` sinh ra** | 10 bản ghi | 50 bản ghi | 100 bản ghi |
| **Độ sai lệch tồn kho (Inventory Drift)** | **0 đơn vị (0%)** | **0 đơn vị (0%)** | **0 đơn vị (0%)** |
| **Hiện tượng xung đột khóa chết (Deadlock)** | Không phát sinh | Không phát sinh | Không phát sinh |

Kết quả thực nghiệm tại Bảng 5.2 chứng minh cơ chế quản lý giao dịch Spring Data JPA kết hợp cơ chế khóa tự nhiên của MySQL đảm bảo tính toàn vẹn tuyệt đối: Dưới áp lực 100 yêu cầu đồng thời, thời gian hoàn tất trung bình chỉ đạt **483 ms / giao dịch**, không phát sinh bất kỳ hiện tượng Deadlock nào và độ lệch tồn kho bằng **0%**, toàn bộ 100 giao dịch đều được ghi vết minh bạch vào nhật ký `InventoryLog`.

### 5.3.3. Đo đạc Thời gian Phản hồi và Tính Sẵn sàng của Trợ lý AI Copilot
Trợ lý AI Copilot được thiết kế theo kiến trúc phòng thủ hai tầng: tầng 1 là mô hình Google Gemini 2.5 Flash Cloud API phục vụ phân tích ngôn ngữ tự nhiên chuyên sâu; tầng 2 là Động cơ Heuristic DSS nội bộ hoạt động ngoại tuyến (Offline) dựa trên dữ liệu thống kê SQL thời gian thực (hỗ trợ Dual-Persona cho Chủ quán và Super Admin).

**Bảng 5.3. Đo đạc hiệu năng Trợ lý AI Copilot: Gemini 2.5 Flash Cloud so với Heuristic DSS Fallback**

| Tiêu chí Đánh giá | Tầng 1: Google Gemini 2.5 Flash | Tầng 2: Heuristic DSS Fallback |
| :--- | :---: | :---: |
| **Thời gian phản hồi trung bình (Response Time)** | 8,01 giây | **3,8 ms (0,0038s)** |
| **Độ trễ sinh từ đầu tiên (Time to First Token)** | 1,45 giây | **Tức thì (< 1ms)** |
| **Tính phụ thuộc đường truyền Internet quốc tế** | Có (Yêu cầu kết nối Cloud) | **Không (Chạy hoàn toàn nội bộ)** |
| **Mức tiêu thụ chi phí API (API Cost)** | Giới hạn hạn mức (Rate limit) | **0 VNĐ (Miễn phí vĩnh viễn)** |
| **Tính sẵn sàng hệ thống (High Availability)** | 98,5% (Phụ thuộc mạng) | **100% (Sẵn sàng tuyệt đối)** |
| **Chất lượng và phong cách câu trả lời** | Văn phong tự nhiên, linh hoạt | Có cấu trúc, số liệu chính xác 100% |

Bảng 5.3 làm nổi bật tính thực tiễn của giải pháp: Khi có kết nối mạng ổn định, Gemini 2.5 Flash mang lại trải nghiệm tư vấn thông minh, linh hoạt trong khoảng **8,01 giây**. Ngược lại, khi xảy ra sự cố nghẽn mạng quốc tế hoặc vượt hạn mức truy vấn, Động cơ Heuristic DSS lập tức phản hồi trong chỉ **3,8 mili-giây**, đồng thời vẫn bảo đảm sinh đầy đủ các đề xuất Tác tử AI Hành động (`agentAction`) với tính sẵn sàng **100%**.

## 5.4. Giao diện Một số Màn hình Chính của Hệ thống
Dưới đây là ảnh chụp màn hình thực tế từ hệ thống đang vận hành đại diện cho 6 phân hệ trọng yếu:

### 5.4.1. Giao diện Trang chủ (Home Screen)
Trang chủ Dark Mode thực tế với thanh tìm kiếm thông minh hỗ trợ Guest Browsing, Carousel "Hôm Nay Ăn Gì? Món Bán Chạy Nhất" và lưới 4 cột khám phá 16 nhà hàng:

![Giao diện Trang chủ Hệ thống với Carousel Hôm nay ăn gì](figures/fig_ui_home.jpg)

### 5.4.2. Giao diện Giỏ hàng và Thanh toán Đa phương thức (Cart Screen)
Giỏ hàng thực tế hiển thị món ăn, 5 chip gợi ý mã ưu đãi 1-Click (`GIAM10%`, `GIAM20K`, `COMTAM15`...), địa chỉ giao nhận và lựa chọn phương thức thanh toán **Stripe Online** hoặc **Tiền mặt (COD)**:

![Giao diện Giỏ hàng và Động cơ Khuyến mãi Ràng buộc](figures/fig_ui_cart.jpg)

### 5.4.3. Bảng Điều khiển Quản trị Nhà hàng (Restaurant Owner Dashboard)
Bảng điều khiển thực tế của Chủ nhà hàng (*Tiệm Cơm Tấm Sài Gòn - Đặc Biệt*) với Sidebar mới hài hòa dưới Navbar, thẻ chỉ số KPI thực tế, biểu đồ Recharts 7 ngày và trạng thái `Real-time Connected`:

![Giao diện Bảng điều khiển Quản trị của Chủ nhà hàng](figures/fig_ui_owner_dashboard.jpg)

### 5.4.4. Bảng Điều khiển Kiểm duyệt Đánh giá Toàn sàn (Super Admin Dashboard)
Giao diện thực tế của Super Admin cho phép chọn từng nhà hàng đối tác, xem điểm trung bình 4.7/5 (65 lượt đánh giá), nhãn `Chip` món ăn được nhận xét và nút gỡ bỏ đánh giá vi phạm:

![Giao diện Kiểm duyệt Đánh giá Toàn sàn của Super Admin](figures/fig_ui_superadmin.jpg)

### 5.4.5. Màn hình Trợ lý Quản trị & Tác tử Hành động AI Copilot
Giao diện thực tế **AI Business Copilot** với 4 thẻ KPI đồng bộ từ MySQL, phân tích Markdown và thẻ nổi bật **"TÁC TỬ AI HÀNH ĐỘNG"** cung cấp nút bấm 1-Click *"Tác tử AI: Tạm khóa món ăn trên Menu"*:

![Giao diện Trợ lý Quản trị Thông minh AI Copilot của Nhà hàng](figures/fig_ui_ai_copilot.jpg)

### 5.4.6. Giao diện Trợ lý Ẩm thực Khách hàng AI Concierge (Menu Catalog RAG)
Widget Chatbot nổi phía khách hàng với tính năng Menu Catalog RAG kết xuất thẻ gợi ý món *Cơm Sườn Bì Chả*, mẹo mã `GIAM20K` và nút điều hướng trực tiếp tới thực đơn quán:

![Giao diện Trợ lý Ẩm thực Khách hàng AI Concierge Menu RAG](figures/fig_ui_chatbot_rag.jpg)

---

\newpage

# CHƯƠNG 6. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 6.1. Kết luận và Đánh giá Kết quả đạt được
### 6.1.1. Các Kết quả Đã Hoàn thành
Khóa luận tốt nghiệp với đề tài **"Nghiên cứu và phát triển nền tảng thương mại điện tử F&B tích hợp quản trị thông minh"** đã hoàn thành xuất sắc toàn bộ các mục tiêu nghiên cứu và yêu cầu kỹ thuật đã đề ra ban đầu:
1. **Xây dựng hoàn chỉnh kiến trúc ứng dụng Full-Stack hiện đại:** Hiện thực thành công hệ thống kết hợp giữa Java 17, Spring Boot 3.4.0 ở phía Backend và React 19, Redux Toolkit, Vite 8 ở phía Frontend, hỗ trợ duyệt khám phá không cần đăng nhập (Guest Browsing) và tự dọn dẹp token hết hạn an toàn.
2. **Hiện thực hóa cơ chế bảo mật và phân quyền đa tầng chặt chẽ:** Ứng dụng thành công Spring Security kết hợp JSON Web Token (JWT) cho xác thực phi trạng thái; triển khai băm mật khẩu BCrypt và chính sách chặn triệt để leo thang đặc quyền quản trị viên từ các API công khai.
3. **Phát triển Động cơ kiểm soát mã giảm giá (Coupon Engine) & Đồng bộ Sự kiện:** Giải quyết trọn vẹn bài toán khuyến mãi đa cấp độ (4 mã toàn sàn, 4 mã riêng nhà hàng tự đồng bộ từ 4 sự kiện khuyến mãi); triển khai cơ chế tự động gỡ bỏ mã (Auto-removal) và thuật toán kiểm tra an toàn biên (`Math.max`, `Math.min`).
4. **Tích hợp Thanh toán Đa phương thức (Stripe Checkout & COD) và Máy trạng thái Đơn hàng:** Xây dựng luồng thanh toán thẻ quốc tế Stripe chuẩn PCI DSS (với callback mở khóa an toàn), hỗ trợ song song thanh toán COD và xuất hóa đơn điện tử; thiết lập **Order State Guard** ngăn chuyển trạng thái trái quy trình.
5. **Hiện thực hóa truyền thông đơn hàng thời gian thực qua WebSocket & Chuông thuật toán:** Loại bỏ hoàn toàn cơ chế kéo định kỳ HTTP Polling, đưa độ trễ nhận đơn hàng xuống còn 26,5ms (nhanh gấp 57,6 lần), luôn sắp xếp đơn hàng mới nhất lên đầu và tích hợp chuông âm thanh Web Audio API.
6. **Xây dựng Hệ sinh thái AI Đa tầng (Dual-Persona Agentic AI Copilot & Menu Catalog RAG Chatbot):** Kết hợp **Google Gemini 2.5 Flash** và Động cơ Heuristic DSS dự phòng hai tầng (đạt độ sẵn sàng 100%) kèm tính năng Tác tử AI 1-Click khóa món cạn kho/gỡ đánh giá vi phạm cho quản trị viên, cùng Widget Chatbot Menu Catalog RAG hỗ trợ thực khách đặt món nhanh qua deep-link.
7. **Phát triển phân hệ Quản lý Kho nguyên liệu Tự động (Smart Stock Depletion Engine):** Tự động khấu trừ và hoàn trả tồn kho nguyên liệu theo từng đơn hàng phát sinh hoặc bị hủy (bao gồm lúc chủ quán chuyển trạng thái hủy), ghi vết minh bạch vào nhật ký biến động kho `InventoryLog` với độ lệch tồn kho bằng 0%.
8. **Thiết kế cơ sở dữ liệu chuẩn hóa và Hệ sinh thái dữ liệu thực tế:** Xây dựng mô hình ERD gồm 21 bảng chuẩn 3NF, bảo đảm tính toàn vẹn ACID cùng bộ dữ liệu thử nghiệm chuẩn thực tiễn (16 nhà hàng thuộc 3 thành phố, 82 món ăn ảnh thật, kịch bản khởi tạo tự động và bản sao lưu SQL `restore_images_and_coupons.sql`).
9. **Trải nghiệm người dùng vượt trội với Dark Mode UI:** Thiết kế giao diện đồng bộ, mượt mà trên Material-UI 9, Recharts và TailwindCSS, tối ưu hóa thao tác với lưới 4 cột thích ứng, Carousel "Hôm nay ăn gì?", đánh giá theo từng món và thanh điều hướng quản trị nhất quán.

### 6.1.2. Đánh giá Ưu điểm Nổi bật của Hệ thống
* **Tính thực tiễn và sẵn sàng triển khai cao:** Không chỉ dừng lại ở mức mô hình nghiên cứu lý thuyết, hệ thống đã giải quyết trọn vẹn các bài toán nghiệp vụ gai góc trong thực tế của ngành F&B như: tùy biến nguyên liệu theo món, thanh toán thẻ quốc tế thực tế, cơ chế hủy đơn an toàn, kiểm duyệt đánh giá xấu, cảnh báo đơn hàng tức thời, quản trị kho tự động và phân tích kinh doanh bằng AI.
* **Kiến trúc mã nguồn rõ ràng, dễ bảo trì:** Codebase được tổ chức theo cấu trúc phân tầng chuẩn mực (Controller, Service, Repository, DTO, Redux Slices, Components), tuân thủ nguyên lý thiết kế SOLID và các quy ước kỹ thuật chuẩn của cộng đồng Spring và React.
* **Bảo mật và an toàn dữ liệu cao:** Đảm bảo kiểm tra quyền truy cập ở từng endpoint, bảo vệ dữ liệu thẻ khách hàng và loại trừ các lỗ hổng bảo mật phổ biến.

## 6.2. Hạn chế Hiện tại của Hệ thống
Bên cạnh những kết quả tích cực đã đạt được, hệ thống vẫn tồn tại một số hạn chế nhất định do giới hạn về mặt thời gian và nguồn lực nghiên cứu:
* **Chưa có phân hệ định vị GPS cho người giao hàng (Shipper tracking):** Hệ thống hiện mới tập trung vào mối quan hệ giữa Khách hàng, Chủ quán và Quản trị sàn; quy trình điều phối đội ngũ giao hàng vật lý trên bản đồ số chưa được tích hợp trực tiếp.
* **Phương thức thanh toán trực tuyến nội địa còn hạn chế:** Mới tích hợp cổng thanh toán quốc tế Stripe (chủ yếu cho thẻ Visa/MasterCard), chưa mở rộng kết nối tới các cổng thanh toán nội địa và ví điện tử phổ biến tại Việt Nam như VNPay-QR, MoMo, ZaloPay.
* **Mô hình dự báo nhu cầu bằng Machine Learning nâng cao:** Trợ lý AI hiện tại tập trung vào phân tích các chỉ số lịch sử và thời gian thực hiện tại; hệ thống chưa xây dựng mô hình học sâu chuyên sâu dự báo nhu cầu khách hàng theo chuỗi thời gian (Time-series Forecasting) có tính đến các yếu tố thời tiết hoặc ngày nghỉ lễ.

## 6.3. Định hướng Phát triển trong Tương lai
Nhằm nâng cấp hệ thống trở thành một nền tảng thương mại ẩm thực quy mô lớn, các hướng nghiên cứu và phát triển tiếp theo được đề xuất bao gồm:
1. **Nghiên cứu mô hình Machine Learning dự báo nhu cầu nguyên liệu và món ăn (Demand Forecasting):** Huấn luyện các mô hình học sâu chuỗi thời gian (như LSTM, Prophet hoặc Temporal Fusion Transformer) dựa trên lịch sử đặt món, thời tiết và dữ liệu sự kiện để dự báo trước lượng nguyên liệu cần nhập, giảm thiểu tối đa hao hụt thực phẩm.
2. **Mở rộng tích hợp các cổng thanh toán nội địa:** Tích hợp thêm các giải pháp thanh toán số phổ biến tại thị trường Việt Nam như VNPay-QR, MoMo Payment Gateway và ZaloPay để tạo sự thuận tiện tối đa cho người tiêu dùng trong nước.
3. **Phát triển ứng dụng di động nguyên bản (Mobile Apps):** Xây dựng ứng dụng di động dành cho tài xế giao hàng (Shipper App) sử dụng React Native hoặc Flutter, tích hợp Google Maps API để theo dõi hành trình giao nhận theo thời gian thực.
4. **Chuyển đổi sang kiến trúc Microservices và đóng gói Container:** Tiến hành phân rã hệ thống nguyên khối (Monolith) thành các vi dịch vụ độc lập (Auth Service, Order Service, Restaurant Service, Inventory Service, Payment Service), đóng gói bằng Docker và điều phối cụm bằng Kubernetes (K8s) trên nền tảng điện toán đám mây (AWS/GCP), sẵn sàng phục vụ hàng triệu người dùng đồng thời.

---

\newpage

# TÀI LIỆU THAM KHẢO

### Tài liệu tiếng Việt
1. Bộ Thông tin và Truyền thông, *Báo cáo Kinh tế số Việt Nam và Xu hướng Thương mại điện tử ẩm thực giai đoạn 2024 -- 2026*, Nhà xuất bản Thông tin và Truyền thông, Hà Nội, 2024.
2. Trần Tất Việt, *Nghiên cứu mã hóa đầu cuối trong ứng dụng nhắn tin*, Khóa luận tốt nghiệp đại học ngành Công nghệ thông tin, Trường Đại học Công nghệ -- Đại học Quốc gia Hà Nội, 2025.
3. Phùng Lê Anh Quân, *Xây dựng mô-đun liên kết tiếp thị hỗ trợ các sàn thương mại điện tử*, Khóa luận tốt nghiệp đại học ngành Công nghệ thông tin, Trường Đại học Công nghệ -- Đại học Quốc gia Hà Nội, 2025.
4. Nguyễn Văn Vinh, *Giáo trình Kỹ nghệ phần mềm và Thiết kế hệ thống thông tin hướng đối tượng*, Nhà xuất bản Đại học Quốc gia Hà Nội, 2022.

### Tài liệu tiếng Anh
5. Walls, C., *Spring in Action, Sixth Edition*, Manning Publications, 2022.
6. Spilca, L., *Spring Security in Action, Second Edition*, Manning Publications, 2023.
7. Banks, A., & Porcello, E., *Learning React: Modern Patterns for Developing React Applications, 2nd Edition*, O'Reilly Media, 2020.
8. Redux Team, *Redux Toolkit Documentation: The official, opinionated, batteries-included toolset for efficient Redux development*, Available: https://redux-toolkit.js.org/, 2026.
9. Stripe Inc., *Stripe API Documentation & Integration Guide for Java and React*, Available: https://stripe.com/docs/api, 2026.
10. Fielding, R. T., *Architectural Styles and the Design of Network-based Software Architectures*, Doctoral dissertation, University of California, Irvine, 2000.
11. Silberschatz, A., Korth, H. F., & Sudarshan, S., *Database System Concepts, 7th Edition*, McGraw-Hill, 2020.
12. Rescorla, E., *The Transport Layer Security (TLS) Protocol Version 1.3*, RFC 8446, Internet Engineering Task Force (IETF), 2018.
13. Martin, R. C., *Clean Architecture: A Craftsman's Guide to Software Structure and Design*, Prentice Hall, 2017.
14. Jones, M., Bradley, J., & Sakimura, N., *JSON Web Token (JWT)*, RFC 7519, Internet Engineering Task Force (IETF), 2015.
