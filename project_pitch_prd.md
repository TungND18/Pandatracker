# Foxy Gym - Product Requirements & Pitch Document (PRD)

Tài liệu này tổng hợp toàn bộ tầm nhìn, tính năng hiện tại, định hướng phát triển và khối lượng công việc dự kiến để Team Development có thể nắm bắt và lên kế hoạch triển khai.

---

## 1. Business Story (Câu Chuyện Kinh Doanh)

Thị trường fitness hiện tại đang bị phân mảnh:
- **Người tập (Users):** Thiếu động lực khi tập một mình, cần một "trợ lý ảo" nhắc nhở chuẩn xác. Việc tìm kiếm PT cá nhân giỏi hoặc mua vé lẻ ở các phòng tập khác nhau gặp nhiều rào cản.
- **Huấn luyện viên tự do (Freelance PTs):** Khó khăn trong việc tiếp cận khách hàng mới, quản lý lịch trống lộn xộn, không có tool chuyên nghiệp để theo dõi tiến độ của học viên.
- **Phòng tập độc lập (Gym Partners):** Không có nền tảng số hóa vé tập chống gian lận (chụp màn hình vé), khó quảng bá các lớp học nhỏ (Yoga, Dance) đến đúng tệp khách hàng xung quanh.

**Giải pháp - Foxy Gym:** Một nền tảng 3 bên (3-sided Marketplace) kết nối User – PT – Gym. Bắt đầu bằng việc cung cấp công cụ tự tập (Voice Coach Timer) miễn phí cực tốt để hút User, sau đó up-sell các dịch vụ PT và vé Gym.

---

## 2. Giao diện & Trải nghiệm (UI/UX & Style)

- **Phong cách thiết kế:** Dark Mode chủ đạo, điểm nhấn màu Cam (Orange accent) mạnh mẽ, thể thao. 
- **Chất liệu UI:** Glassmorphism (lớp mờ), chuyển động mượt mà (Micro-animations).
- **Triết lý UX:** "1-click to start" - Hạn chế tối đa thao tác thừa. Mọi thông tin cần thiết đều nằm trên 1-2 màn hình thay vì phải lướt qua nhiều menu. Trải nghiệm app phải cho cảm giác "Premium".

---

## 3. Tính năng Hiện tại (Prototype V1 - User App)

Bản Prototype HTML hiện tại đã hoàn thiện luồng logic UI cốt lõi:
1. **Quick Workout & Background Timer:**
   - Tùy chỉnh bài tập bằng thao tác Kéo-Thả (Drag & Drop).
   - Vòng lặp đếm ngược chính xác, hỗ trợ tạm dừng, bỏ qua (skip).
2. **Voice Coach (Trợ lý Giọng nói):**
   - Đọc tên bài tập, đếm ngược thời gian nghỉ ("Còn 10 giây").
   - Thúc giục khi nghỉ quá thời hạn (giả định rằng giữa các set tập, người tập bị xao lãng bởi lướt social media hoặc các ứng dụng khác).
   - *Lưu ý kỹ thuật:* Cần chuyển sang Native (SwiftUI/React Native) để Voice Coach chạy ngầm hoàn hảo khi tắt màn hình.
3. **Tập cùng PT (Booking System):**
   - **Hai luồng tiếp cận linh hoạt:** 
     1. Khách có giờ rảnh -> Tìm các PT trống lịch giờ đó.
     2. Khách có PT ưa thích -> Tìm các khung giờ trống của PT đó.
   - Giao diện Timeline Calendar (kiểu Outlook) xem lịch trực quan.
   - Danh sách và Profile PT hiển thị đầy đủ, hấp dẫn, chính xác (Giá, kinh nghiệm, rating).
   - Cho phép mua buổi lẻ hoặc mua theo gói tập (Package) và có tính năng quản lý tiến độ các gói tập này.
4. **Phòng Gym Của Tôi:**
   - **Vé tập số hóa:** QR Code động + hình ảnh nhấp nháy chống chụp màn hình (Anti-screenshot).
   - **Quản lý vé:** Danh sách vé (vé đang kích hoạt, vé tháng/ngày, mục lưu trữ vé hết hạn).
   - **Khám phá:** Danh sách các lớp tập, tính năng định vị (Map) để tìm phòng gym/lớp học quanh đây, hỗ trợ bộ lọc (filter) linh hoạt theo khoảng cách, giá cả, môn học.

---

## 4. Các tính năng Tương lai (Future Expansion cho Hệ sinh thái 3 bên)

Để app hoạt động thực tế, Team Dev cần xây dựng toàn bộ hệ thống Backend và Portal cho các bên:

### 4.1. Dành cho PT (PT Portal / App)
- **Quản lý Lịch (Schedule Management):** Mở/đóng slot thời gian rảnh, đồng bộ lịch với Google Calendar/Apple Calendar.
- **Quản lý Booking:** Chấp nhận, từ chối, hoặc đề xuất đổi giờ với User. Nhận thông báo Push Notification.
- **Quản lý Học viên (CRM):** Giao giáo án tập luyện (Workout Plan) thẳng vào app của User. Ghi chú thể trạng học viên.
- **Tài chính:** Theo dõi thu nhập, yêu cầu rút tiền.

### 4.2. Dành cho Phòng Tập (Gym Partner Portal - Web/App)
- **Hệ thống Check-in:** Dùng App của Gym để quét mã QR động của User, trừ lượt hoặc xác nhận thẻ tháng.
- **Quản lý Sản phẩm:** Đăng bán vé ngày, vé tháng, hoặc các gói tập trải nghiệm.
- **Quản lý Lớp học (Classes):** Đăng lịch lớp (Spinning, Zumba, Yoga), giới hạn số slot. User đăng ký sẽ tự động cập nhật số lượng.
- **Thống kê:** Dashboard lượt khách đến tập theo khung giờ.

### 4.3. Hạ tầng & Hệ thống (Backend, Hosting & Security)
- **Payment Gateway:** Tích hợp Stripe/Apple Pay/VNPay/MoMo để giữ tiền (Escrow) cho đến khi buổi tập hoàn tất. Bảo mật thanh toán chuẩn PCI-DSS.
- **Bảo mật Dữ liệu:** Mã hóa thông tin cá nhân và dữ liệu sức khỏe của người dùng (tuân thủ GDPR/HIPAA nếu mở rộng).
- **Database & Hosting:** 
  - Database: PostgreSQL (Transactions, Bookings) + Redis (Real-time QR, Caching).
  - Server: AWS / Google Cloud có khả năng Auto-scaling vào giờ cao điểm (chiều tối người tập đông).
- **Real-time Engine:** Firebase hoặc WebSocket cho tính năng Chat giữa User-PT, thông báo push và update QR check-in ngay lập tức.

---

## 5. Ước lượng Khối lượng công việc (Workload Estimation)

*Giả định đội dự án gồm: 1 PM/PO, 1 UI/UX, 2 Mobile Dev, 2 Backend Dev, 1 QA.*

| Giai đoạn (Phase) | Nội dung công việc | Thời gian dự kiến |
| :--- | :--- | :--- |
| **Phase 1: Core User & PT App (MVP)** | Chuyển đổi toàn bộ UI/UX hiện tại sang iOS Native/React Native. Setup Backend, API Booking, Auth, Voice Coach chạy ngầm. | **~ 2.5 - 3 tháng** |
| **Phase 2: Gym Portal & Thanh toán** | Xây dựng Web Dashboard cho Gym, App quét QR, Tích hợp cổng thanh toán, Flow giữ tiền và đối soát cho PT/Gym. | **~ 2 tháng** |
| **Phase 3: Real-time & Scale** | Chat in-app, Push notifications, Tối ưu hóa Database, Tích hợp AI thật (Generative Audio) cho Voice Coach. Stress test. | **~ 1.5 tháng** |

**=> Tổng ước tính:** Khoảng **6 - 7 tháng** để ra mắt phiên bản V1.0 hoàn chỉnh với cả 3 đối tượng người dùng.
