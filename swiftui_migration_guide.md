# Foxy Gym - Hướng dẫn Chuyển đổi sang Native SwiftUI (Dành cho AI Assistant trên máy Mac)

## 1. Ngữ cảnh (Context)
Dự án **Foxy Gym** đang là một web-app prototype (HTML/CSS/JS) phục vụ việc tập luyện fitness. Do yêu cầu bắt buộc: **Ứng dụng phải có khả năng chạy ngầm (Background Timer) và phát giọng nói nhắc nhở (Background Text-to-Speech) ngay cả khi khóa màn hình hoặc vuốt ra màn hình chính**, người dùng đã quyết định chuyển sang code Native bằng **SwiftUI** trên nền tảng iOS.

## 2. Nhiệm vụ của AI Assistant trên Mac
Người dùng sẽ yêu cầu bạn (AI trên máy Mac) khởi tạo một project Xcode mới và chuyển đổi toàn bộ logic/giao diện từ bản HTML hiện tại sang SwiftUI.

Hãy thực hiện các bước sau:

### Bước 1: Khởi tạo Project & Cấu hình Audio Background
- Khởi tạo project Xcode mới (App, SwiftUI, Swift).
- Cấu hình `Info.plist` và Project Capabilities để bật **Background Modes** -> **Audio, AirPlay, and Picture in Picture**. Đây là điều kiện tiên quyết để đếm ngược và đọc giọng nói ngầm.
- Thiết lập `AVAudioSession.sharedInstance().setCategory(.playback, options: .mixWithOthers)` khi app khởi động để TTS có thể phát qua loa/tai nghe kể cả khi khóa máy.

### Bước 2: Thiết kế Kiến trúc Dữ liệu (Models & State)
Tham khảo file `pt-data.js` và `exercises.js` trong thư mục HTML để xây dựng các Struct/Class trong Swift:
- `Exercise`: struct lưu id, tên, nhóm cơ, targetWeight, targetReps, targetRest.
- `WorkoutSession`: class (`ObservableObject`) quản lý trạng thái tập (Đang tập, Đang nghỉ, Hoàn thành), thời gian hiện tại, bài tập hiện tại.
- `PTBooking` & `GymPass`: struct cho dữ liệu PT và vé tập.

### Bước 3: Porting Logic Cốt lõi (Voice & Timer)
- Tạo class `VoiceCoachManager` bọc `AVSpeechSynthesizer`. Đặt ngôn ngữ `vi-VN`.
- Porting chính xác logic nhắc nhở: 
  - "Bắt đầu tập"
  - "Còn 10 giây" (khi nghỉ)
  - "Hết giờ, chuẩn bị tập bài [Tên bài]"
- Sử dụng `Timer.publish` hoặc background threads phù hợp của iOS kết hợp lưu mốc thời gian (`Date()`) để đảm bảo timer luôn chuẩn khi app bị suspend và resume.

### Bước 4: Xây dựng Giao diện (SwiftUI Views)
Dịch bộ UI từ `index.html` và `styles.css` sang SwiftUI:
1. **Màu sắc chủ đạo**: Nền đen tối (Dark mode), accent color cam (`Color.orange` hoặc mã màu `#ff6600`), hiệu ứng glassmorphism (`.ultraThinMaterial`).
2. **Main TabView**: 3 Tabs chính -> Tập Ngay (Quick Workout), Tập cùng PT, Phòng Gym của tôi.
3. **Màn hình Quick Workout**: Danh sách bài tập có thể drag & drop (`.onMove`).
4. **Màn hình Active Workout**: Vòng tròn đếm ngược lớn (Circular Progress), số to rõ ràng.
5. **Màn hình Tập cùng PT**: Layout Outlook-style calendar timeline cho booking.

## 3. Lời khuyên khi bắt đầu
Khi người dùng ra lệnh bắt đầu, hãy đọc kỹ cấu trúc của file `app.js` để hiểu flow 5 màn hình của ứng dụng web, từ đó chuyển đổi tương đương sang `NavigationStack` hoặc quản lý state bằng `Enum` trong SwiftUI.

Chúc may mắn! Bạn có toàn quyền thiết kế cấu trúc thư mục Xcode sao cho chuẩn MVC/MVVM nhất.
