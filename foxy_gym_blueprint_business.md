# Foxy Gym - Bản thiết kế và Chiến lược Hệ thống (Blueprint)
*Tài liệu dành cho bộ phận Phát triển (IT) và Vận hành (Non-tech)*

## 1. Tầm nhìn sản phẩm
Foxy Gym là nền tảng kết nối 3 bên:
- **Người dùng (User):** Cần công cụ tự tập, nhắc nghỉ, huấn luyện viên giọng nói (voice coach), tìm PT, mua vé gym/lớp tập.
- **Huấn luyện viên (PT):** Cần quản lý lịch, nhận đặt lịch (booking), theo dõi học viên, bán gói tập.
- **Phòng tập (Gym partner):** Cần bán vé/lớp, check-in bằng mã QR động, chống gian lận, xem thống kê khách.

Chiến lược bắt đầu từ công cụ miễn phí có giá trị cao: Tập nhanh (Quick Workout) + Hẹn giờ & Huấn luyện viên giọng nói. Khi người dùng quen thuộc, app sẽ mở rộng sang đặt lịch PT, mua vé gym, thanh toán.

**Triết lý Trải nghiệm người dùng (UX):**
- **1-click to start:** Bắt đầu buổi tập nhanh nhất có thể.
- **Tinh gọn:** Ít màn hình, hiển thị đúng thông tin ở đúng ngữ cảnh.
- **Cao cấp & Trực diện:** Giao diện tối (dark mode), màu cam điểm xuyết, có linh vật cáo hướng dẫn nhưng không làm rối mắt.

## 2. Nguyên tắc kiến trúc cốt lõi
Hệ thống ưu tiên **Tốc độ học hỏi (learning velocity)**: Thời gian từ lúc có ý tưởng đến lúc kiểm chứng được với người dùng thực tế.
Đội ngũ công nghệ (IT) xây dựng một nền tảng cho phép bộ phận vận hành và AI có thể tự tạo, cấu hình và thử nghiệm các biến thể của sản phẩm mà không cần IT can thiệp liên tục.

**Các quy tắc bắt buộc:**
1. **Cấu hình thay vì lập trình cứng (Config over code):** Hành vi có thể thay đổi thì phải nằm trong cấu hình, không được code cứng.
2. **Luôn thu thập dữ liệu (Emit events):** Mọi hành động của người dùng phải được ghi nhận để phân tích.
3. **Kiểm soát rủi ro (Blast radius control):** Mọi thử nghiệm mới phải có khả năng giới hạn đối tượng (ví dụ: chỉ thử nghiệm trên 5% người dùng).
4. **Tự chủ cho đội vận hành (Operator autonomy):** Đội vận hành có thể tự đổi nội dung, thời gian, văn phong, giao diện mà không cần chờ IT xử lý.

## 3. Kiến trúc hệ thống tổng quan
Foxy Gym được xây dựng gồm 5 lớp:
1. **Ứng dụng người dùng (Client Apps):** Ưu tiên ứng dụng iOS vì cần chạy hẹn giờ và âm thanh dưới nền (background). Tương lai mở rộng sang Android, web cho PT và Gym.
2. **Lớp trung gian số (Digital Twin Layer):** Quyết định trải nghiệm nào sẽ hiển thị cho người dùng nào dựa trên hồ sơ, ngữ cảnh và thử nghiệm đang chạy.
3. **Các phân hệ chức năng (Domain Modules):** Chứa các chức năng nghiệp vụ như: Tập luyện, Voice Coach, Đặt lịch PT, Vé Gym, Thông báo, v.v.
4. **Hệ thống Phân tích (Insight Pipeline):** Thu thập dữ liệu sự kiện, phân tích rủi ro rời bỏ app, mô hình nghỉ ngơi quá lâu, hay ý định đặt PT.
5. **Hệ thống Thử nghiệm (Experiment Pipeline):** Đưa ý tưởng mới vào thực tế, đo lường và đánh giá kết quả một cách tự động.

## 4. Các phân hệ chức năng chính
Mỗi phân hệ (module) được thiết kế độc lập, cho phép bật/tắt, thay đổi cấu hình, thu thập dữ liệu riêng mà không ảnh hưởng tới toàn hệ thống.

- **Phân hệ Tập luyện (Workout):** Quản lý thư viện bài tập, tự động sinh bài tập, cho phép người dùng điều chỉnh thời gian, mức độ, và chỉnh sửa ngay trong buổi tập.
- **Phân hệ Hẹn giờ & Phiên tập:** Quản lý thời gian tập/nghỉ chính xác ngay cả khi ẩn ứng dụng (background), lưu trạng thái để không bị mất kết quả phiên tập.
- **Phân hệ Voice Coach:** Đọc tên bài, nhắc thời gian nghỉ, hối thúc nếu nghỉ quá lâu. Đội vận hành có thể tùy chỉnh kịch bản giọng nói dễ dàng.
- **Phân hệ Đặt lịch PT:** Xem lịch rảnh của PT theo kiểu Outlook, tìm kiếm, lọc, đặt lịch, yêu thích PT. Tránh trùng lịch bằng cơ chế giữ chỗ giao dịch.
- **Phân hệ Vé Gym & Check-in:** Hiển thị vé kỹ thuật số, sử dụng mã QR động liên tục thay đổi (chống chụp màn hình). Cung cấp danh sách phòng tập và lịch lớp học (yoga, boxing...).
- **Phân hệ Thông báo & Điểm thưởng:** Gửi nhắc nhở tập, nhắc hạn vé, tính chuỗi ngày tập (streak), trao huy hiệu. Các quy tắc có thể điều chỉnh linh hoạt.

## 5. Tích hợp Trí tuệ Nhân tạo (AI)
Trong giai đoạn đầu, AI đóng vai trò là công cụ đắc lực hỗ trợ cho đội vận hành (Operators):
- Tự động tạo ra các biến thể bài tập (Ví dụ: "Tạo 10 bài tập ngực cho người mới, thời gian 45 phút").
- Viết kịch bản giọng nói theo nhiều phong cách khác nhau (nghiêm túc, vui vẻ, thân thiện).
- Soạn thảo thông báo và đề xuất các thử nghiệm mới dựa trên dữ liệu người dùng.
- Trợ lý ảo AI giúp đội vận hành nhập lệnh bằng ngôn ngữ tự nhiên để tạo ra cấu hình.
*(Mọi cấu hình do AI tạo ra đều cần qua quy trình kiểm duyệt an toàn trước khi phát hành).*

## 6. Lộ trình triển khai (Migration & Build)
- **Giai đoạn 0 - Ổn định:** Ổn định bản mẫu (prototype) hiện tại, chuẩn hóa dữ liệu và thêm cấu hình giả lập.
- **Giai đoạn 1 - Nền tảng:** Xây dựng hệ thống máy chủ cơ bản (Đăng nhập, Dịch vụ cấu hình, Hệ thống thu thập dữ liệu).
- **Giai đoạn 2 - Ứng dụng MVP:** Ra mắt ứng dụng iOS gốc (native) với tính năng Tập nhanh, Hẹn giờ chạy nền, Voice Coach, tìm PT và Check-in vé Gym.
- **Giai đoạn 3 - Vận hành:** Hoàn thiện bảng điều khiển (Dashboard) cho đội vận hành tự quản lý cấu hình, chạy thử nghiệm (A/B testing).
- **Giai đoạn 4 - Mở rộng:** Hoàn thiện chợ dịch vụ (Marketplace) bao gồm Thanh toán, cổng thông tin cho PT và đối tác Gym, quản lý gói tập, v.v.

## 7. Nguyên tắc ra quyết định (Decision Making)
Khi có xung đột hoặc cần đánh đổi, hệ thống ưu tiên theo thứ tự:
1. Tăng tốc độ học hỏi (Tốc độ đưa ra thị trường để đo lường).
2. Giảm thiểu rủi ro lan rộng (Rủi ro khoanh vùng ở quy mô nhỏ).
3. Tăng tính tự chủ cho đội Vận hành (Giảm phụ thuộc vào Dev).
4. Ranh giới rõ ràng về chức năng các phân hệ.
5. Giữ trải nghiệm người dùng luôn đơn giản.
6. Tối ưu hiệu năng và chi phí.

> **Quy tắc Vàng:**
> - Nếu một thay đổi giúp thử nghiệm nhanh nhưng có rủi ro, không lập trình cứng (hardcode) vào app. Hãy đưa vào cấu hình, mở rộng trước cho 5-10% người dùng, đo lường an toàn rồi mới triển khai toàn bộ.
> - Nếu một hành vi không đo lường được, coi như nó chưa tồn tại.
> - Nếu một module không có sơ đồ cấu hình, nó chưa sẵn sàng cho môi trường thực tế.
