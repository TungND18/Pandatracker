# Foxy Gym SwiftUI Implementation Plan From Scratch

Ngày tạo: 2026-04-27  
Nguồn phân tích: toàn bộ thư mục prototype HTML hiện tại, gồm `index.html`, `styles.css`, `app.js`, `exercises.js`, `workout-generator.js`, `pt-data.js`, asset PNG và các blueprint cũ.

Trạng thái: single source of truth cho kế hoạch SwiftUI/iOS và hướng mở rộng platform. Các implementation plan, PRD, blueprint và migration guide cũ đã được hợp nhất vào tài liệu này.

## 1. Mục tiêu tài liệu

Tài liệu này là bản đặc tả triển khai lại Foxy Gym từ đầu bằng SwiftUI/iOS native, dựa trên bản prototype HTML/CSS/JS hiện tại. Team SwiftUI có thể dùng tài liệu này để hiểu:

- Chiến lược sản phẩm và phạm vi MVP.
- Luồng chức năng hiện có trong web app.
- Model dữ liệu, state machine, thuật toán sinh workout, timer, voice coach và PT booking.
- Yêu cầu giao diện để truyền tải lại gần như y chang bản HTML.
- Các rủi ro kỹ thuật cần xử lý khi chuyển sang native iOS.
- Kế hoạch triển khai theo phase.

Mục tiêu không phải là port từng dòng JavaScript sang Swift, mà là tái tạo cùng trải nghiệm người dùng bằng kiến trúc iOS đúng chuẩn hơn.

## 2. Tóm tắt sản phẩm

Foxy Gym là app huấn luyện tập gym cá nhân có nhân vật cáo làm coach. App cho phép người dùng:

- Vào app và bắt đầu tập nhanh ngay.
- Tự sinh một bài tập dựa trên nhóm cơ, thời lượng, cường độ, warmup và core.Sau này cần tích hợp từ dữ liệu các buổi tập trước, lịch sử của người tập và điều kiện của phòng gym (cân nhắc đây là chức năng premium có trả tiền) 
- Chỉnh từng bài tập: kg, reps, sets, thời gian nghỉ, thứ tự, thay bài, thêm bài, xóa bài, trước và trong khi tập. 
- Chạy buổi tập theo từng set với màn hình active workout và rest timer.
- Nghe voice coach nhắc kỹ thuật một lần vào lúc trong set tập, khoảng 2-3s sau khi bắt đầu, nhắc hết giờ nghỉ trước 10s, confirm hết giờ nghỉ, nhắc quay lại tập khi nghỉ quá lâu mỗi 10s, ngôn ngữ linh hoạt sáng tạo, annoying, strict, mocking but lovable. khi chuyển bài tập, nhắc người tập chuẩn bị bài tiếp theo, tìm đúng máy tập, mức tạ nếu cần. 
- Xem báo cáo cuối buổi, lưu workout để dùng lại.
- Đặt lịch tập với PT theo ngày, timeline giờ và danh sách PT khả dụng.
- Quản lý profile cá nhân và vé phòng gym.

Tính cách sản phẩm: vui, thân thiện, hơi "coach cá tính", có động lực, dùng màu tối sang, accent cam, mascot cáo nổi bật. Trải nghiệm ưu tiên mobile-first giống iPhone app.

## 3. Inventory file hiện tại

### 3.1 File giao diện và logic chính

- `index.html`: chứa toàn bộ DOM của app web. Các màn hình chính:
  - `screen-home`
  - `screen-quick-workout`
  - `screen-profile`
  - `screen-change-workout`
  - `screen-setup`
  - `screen-active`
  - `screen-rest`
  - `screen-complete`
  - `screen-pt-booking`
  - `screen-my-gym`
  - modal: duration, intensity, guidance, swap, picker, save, PT confirm, workout edit panel.
- `styles.css`: toàn bộ design system, layout mobile, màu, spacing, animation, card, bottom nav, quick workout, PT booking, profile, my gym.
- `app.js`: state, event wiring, screen switching, timer, TTS, profile persistence, drag and drop, quick workout editing, PT booking UI, My Gym.
- `workout-generator.js`: định nghĩa workout types, intensity levels, thuật toán generate workout theo duration/intensity/add-ons.
- `exercises.js`: thư viện bài tập, category, default weight/sets/reps/rest/tag.
- `pt-data.js`: mock data PT, lịch recurring, helper tính availability.
- `serve.js`: static server đơn giản.

### 3.2 Asset

- `fox(2).png`: mascot chính đang dùng ở Home, coaching bubble, completion, My Gym QR overlay.
- `pt1.png` đến `pt5.png`: avatar PT.
- Các file UUID `.png`: asset hình lớn chưa được wire rõ trong HTML hiện tại, cần xem lại bằng designer trước khi đưa vào native.

### 3.3 Tài liệu đã hợp nhất

Các implementation plan, PRD, blueprint business/developer và SwiftUI migration guide cũ đã được rà soát, hợp nhất vào tài liệu này và xóa khỏi workspace để tránh lệch nguồn thông tin. Tài liệu này là nguồn chuẩn duy nhất cho kế hoạch SwiftUI/iOS và roadmap platform.

## 4. Chiến lược chuyển đổi sang SwiftUI

### 4.1 Lý do cần native

Bản web đang dùng `setInterval`, Web Speech API và FPT.AI TTS qua fetch. Trên iOS, web app khó đảm bảo:

- Timer tiếp tục chính xác khi lock screen hoặc app vào background.
- Voice coach phát khi màn hình khóa.
- Audio session ổn định qua tai nghe, silent mode và interruption.
- UX native như haptic, background audio, notification, Live Activity trong tương lai.

SwiftUI native giải quyết tốt hơn qua:

- `AVAudioSession`
- `AVSpeechSynthesizer` hoặc audio stream từ backend TTS
- timestamp-based timer dùng `Date`
- local notifications cho nhắc nghỉ quá lâu
- `ScenePhase` để sync trạng thái khi resume
- `UserDefaults`, SwiftData hoặc CoreData cho persistence

### 4.2 Nguyên tắc port

- Không port DOM hoặc CSS 1:1. Port lại thành SwiftUI views, view models và services.
- Giữ nguyên mental model của người dùng: Home -> Quick Workout -> Start -> Active Set -> Rest -> Complete.
- Giữ nguyên visual signature: dark phone canvas, cam gradient/accent, glass cards, typography tròn vui, mascot cáo, bottom nav.
- Tách rõ domain logic khỏi UI để sau này có backend thật.
- Không hardcode API key trong client app.
- Dùng timestamp để tính timer, không phụ thuộc vào tick count.

### 4.3 Nguyên tắc simplicity cho UI

Tham chiếu tinh thần từ `The Laws of Simplicity`: giảm bớt, tổ chức rõ, tiết kiệm thời gian, học nhanh, giữ khác biệt vừa đủ, tôn trọng ngữ cảnh, thêm cảm xúc có kiểm soát, tạo niềm tin, chấp nhận một vài giới hạn, và luôn quay về một việc chính.

Áp dụng cho Foxy Gym:

- Reduce: mỗi màn chỉ có một hành động chính nổi bật. Quick Workout ưu tiên Start và preview bài tập; hero không được chiếm quá nhiều chiều cao.
- Organize: gom lựa chọn thành cụm rõ ràng: workout card, mục tiêu buổi tập, tùy chọn thêm, xem trước bài tập.
- Time: người dùng phải hiểu buổi tập trong vài giây. Hiển thị tên bài + set x rep x kg + thời gian nghỉ ngay trong list.
- Learn: control phải quen thuộc: card có thể tap, toggle dạng switch, nút thêm bài rõ ràng.
- Differences: mascot và màu cam tạo cá tính, nhưng kích thước phải vừa đủ để hỗ trợ nội dung.
- Context: dùng phone-first. Trên iPhone nhỏ, typography và mascot giảm theo breakpoint, không scale theo viewport một cách cực đoan.
- Emotion: mascot tạo cảm giác coach vui, không biến thành illustration khổng lồ che workflow.
- Trust: text tiếng Việt phải có dấu đầy đủ, số liệu bài tập nhất quán với state thật.
- Failure: nếu list dài, dùng nút "+n bài tập khác" để mở rộng tại chỗ, không điều hướng bất ngờ.
- The One: màn Tập ngay phải trả lời một câu hỏi duy nhất: "Hôm nay tôi sẽ tập gì và bắt đầu ra sao?"

### 4.4 Nguyên tắc platform và experimentation

Foxy Gym không chỉ là app timer. Nó là nền tảng 3 bên: User, PT và Gym partner. Kiến trúc phải giúp team học nhanh trên người dùng thật mà không cần phát hành app mới cho mọi thay đổi nhỏ.

Quy tắc bắt buộc:

- Config over code: hành vi có thể thử nghiệm như copy, tone voice, thứ tự module, CTA, mascot placement, notification timing phải nằm trong config.
- Schema-first: mỗi module có schema rõ cho config, event và API trước khi production.
- Emit events: mọi hành động chính của user phải emit structured event từ đầu.
- Blast radius control: rollout có targeting, percentage, allowlist, segment và rollback nhanh.
- Operator autonomy: vận hành có thể đổi copy, voice script, timing, variant và targeting qua console, không cần dev sửa app.
- Learning velocity first: ưu tiên đưa hypothesis ra thị trường nhanh, đo được, rollback được.

Lớp hệ thống dài hạn:

- Client apps: iOS User App trước; sau đó Android, PT App, Gym scanner app, Gym/PT web portals.
- Digital Twin Layer: resolve trải nghiệm theo user context, remote config, experiment và feature flag.
- Domain modules: Workout, Timer/Session, Voice Coach, PT Booking, Gym Pass/QR, Notifications, Rewards, Profile, Payments/Packages.
- Insight Pipeline: thu thập events, sessionize journey, phát hiện churn risk, rest overtime, PT intent, QR usage.
- Experiment Pipeline: tạo config variant, validate schema, rollout, đo metric, promote/rollback.

## 5. Target platform và tech stack

### 5.1 Platform

- iOS 17 trở lên, ưu tiên iPhone.
- Swift 5.10 hoặc mới hơn.
- SwiftUI app lifecycle.
- Portrait orientation là ưu tiên MVP. Landscape có thể hỗ trợ sau.

### 5.2 Framework Apple

- SwiftUI: UI.
- Combine hoặc Observation: state update.
- AVFoundation: audio session, speech synthesis.
- UserNotifications: nhắc giờ nghỉ khi app background.
- SwiftData hoặc UserDefaults JSON: lưu profile, workout đã lưu, favorites.
- UIKit bridge nếu cần advanced haptic hoặc AV player.

### 5.3 Kiến trúc đề xuất

MVVM nhẹ, chia module:

```text
FoxyGym/
  App/
    FoxyGymApp.swift
    AppCoordinator.swift
  DesignSystem/
    FoxyColors.swift
    FoxyTypography.swift
    FoxyButton.swift
    FoxyCard.swift
    FoxyBottomNav.swift
  Models/
    Exercise.swift
    WorkoutType.swift
    WorkoutPlan.swift
    WorkoutSession.swift
    UserProfile.swift
    PersonalTrainer.swift
    PTBooking.swift
    GymPass.swift
  Data/
    ExerciseCatalog.swift
    WorkoutTypeCatalog.swift
    PTCatalog.swift
    MockGymCatalog.swift
  Services/
    ConfigResolver.swift
    AnalyticsEmitter.swift
    ExperimentAllocator.swift
    WorkoutGenerator.swift
    WorkoutSessionEngine.swift
    VoiceCoachManager.swift
    PTAvailabilityService.swift
    PersistenceStore.swift
  Features/
    Home/
    QuickWorkout/
    WorkoutSession/
    Profile/
    PTBooking/
    MyGym/
    Notifications/
    Rewards/
  Core/
    Config/
    Analytics/
    Experiments/
    Networking/
  Assets.xcassets/
```

## 6. Data model cần triển khai

### 6.1 Exercise

```swift
struct Exercise: Identifiable, Codable, Equatable {
    let id: String
    var name: String
    var category: ExerciseCategory
    var emoji: String
    var weight: Double
    var sets: Int
    var reps: Int
    var restSeconds: Int
    var note: String?
    var tags: [String]
}
```

Category theo web:

- Back
- Biceps
- Chest
- Shoulders
- Triceps
- Legs
- Core
- Warmup
- Cooldown

Giới hạn chỉnh:

- Weight: 0 đến 500 kg, step 2 kg ở setup và quick workout.
- Sets: 1 đến 10, step 1.
- Reps: 1 đến 50, step 1.
- Rest: 5 đến 300 giây trong setup, 15 đến 300 giây ở quick inline/rest edit panel.

### 6.2 WorkoutType

Tương ứng `WORKOUT_TYPES`:

- Chest Day: Chest + Triceps, primary Chest.
- Back Day: Back + Biceps, primary Back.
- Leg Day: Legs, primary Legs.
- Upper Body: Chest + Back + Shoulders, primary Chest.
- Full Push Day: Chest + Shoulders + Triceps, primary Chest.
- Cardio Day: Chest + Back + Legs + Shoulders, primary Legs.

Mỗi type có:

```swift
struct WorkoutType: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let emoji: String
    let subtitle: String
    let categories: [ExerciseCategory]
    let primaryCategory: ExerciseCategory
}
```

### 6.3 IntensityLevel

Tương ứng `INTENSITY_LEVELS`:

| ID | Name | Sets | Reps | Rest | Weight |
| --- | --- | ---: | ---: | ---: | ---: |
| beginner | Beginner | 0.7 | 0.8 | 1.4 | 0.7 |
| intermediate | Intermediate | 1.0 | 1.0 | 1.0 | 1.0 |
| hardcore | Hardcore | 1.3 | 1.2 | 0.7 | 1.1 |
| advanced | Advanced | 1.2 | 1.1 | 0.75 | 1.05 |
| cardio | Cardio Day | 1.0 | 1.6 | 0.5 | 0.5 |
| deload | De-load | 0.6 | 0.7 | 1.6 | 0.6 |

### 6.4 UserProfile

Từ `FOXY_USER_PREFS`:

```swift
struct UserProfile: Codable, Equatable {
    var name: String
    var pronoun: String
    var age: Int?
    var weightKg: Double?
    var goal: String
    var experience: String
    var preferredDurationMinutes: Int
    var workoutsPerWeek: Int?
    var includeCore: Bool
    var includeWarmup: Bool
    var includeStretching: Bool
}
```

Default nên là:

- name empty.
- pronoun "Bạn".
- experience "intermediate".
- duration 60.
- includeCore false hoặc theo giá trị seed hiện tại sau khi team xác nhận.
- includeWarmup false hoặc theo giá trị seed hiện tại sau khi team xác nhận.

### 6.5 WorkoutSession

```swift
enum WorkoutPhase: Codable, Equatable {
    case idle
    case training
    case resting
    case complete
}

struct RestLog: Codable, Equatable {
    var exerciseIndex: Int
    var setNumber: Int
    var exerciseName: String
    var plannedRestSeconds: Int
    var actualRestSeconds: Int
}

final class WorkoutSessionViewModel: ObservableObject {
    @Published var phase: WorkoutPhase
    @Published var plan: [Exercise]
    @Published var currentExerciseIndex: Int
    @Published var currentSetNumber: Int
    @Published var completedSets: Int
    @Published var totalSets: Int
    @Published var totalElapsedSeconds: Int
    @Published var restLogs: [RestLog]
}
```

Timer phải dựa trên `Date`:

- `trainingStartDate`
- `restStartDate`
- `elapsedBaseBeforeCurrentPhase`
- Khi tick UI, luôn tính `Date().timeIntervalSince(startDate)`.
- Khi app resume, gọi recalc ngay.

## 7. Thuật toán generate workout

Port từ `workout-generator.js`.

Input:

- `typeId`
- `durationMinutes`, range 15 đến 180, step 15.
- `intensityId`
- `addCore`
- `addWarmup`

Constants:

- `secondsPerRep = 3`
- `coreTimeBudget = 5 * 60`
- `warmupTimeBudget = 4 * 60`
- `cooldownTimeBudget = 4 * 60`

Algorithm:

1. Lấy workout type theo id, fallback Chest Day.
2. Lấy intensity theo id, fallback Intermediate.
3. Tính total budget = duration * 60.
4. Trừ budget cho core nếu bật.
5. Trừ budget cho warmup + cooldown nếu bật warmup.
6. Main budget tối thiểu 5 phút.
7. Tạo exercise pool:
   - Lấy tất cả bài trong primary category.
   - Với secondary category, shuffle rồi lấy tối đa 3 bài mỗi category.
8. Shuffle pool bằng Fisher-Yates.
9. Với từng bài:
   - Apply intensity:
     - sets = max(1, round(baseSets * setsMod))
     - reps = max(1, round(baseReps * repsMod))
     - rest = max(15, roundToNearest5(baseRest * restMod))
     - weight = roundToNearest0.5(baseWeight * weightMod)
   - Estimate time = sets * reps * 3 + (sets - 1) * rest.
   - Nếu còn budget, thêm vào.
   - Dừng khi usedTime >= 80% main budget.
10. Nếu usedTime < 60% budget và có bài:
   - Tăng sets round-robin, max 8 sets/bài.
   - Dừng khi usedTime >= 75% budget hoặc quá safety loop.
11. Nếu warmup bật, prepend 3 bài warmup random.
12. Add main exercises.
13. Nếu core bật, append 3 bài core random.
14. Nếu warmup bật, append 3 bài cooldown random.
15. Return `GeneratedWorkout`.

Swift service:

```swift
struct WorkoutGenerator {
    func generate(
        typeId: String,
        durationMinutes: Int,
        intensityId: String,
        includeCore: Bool,
        includeWarmup: Bool
    ) -> GeneratedWorkout
}
```

Yêu cầu parity:

- Estimated time trên Quick Workout phải dùng cùng công thức.
- Random có thể khác web, nhưng logic phải giống.
- Nên inject `RandomNumberGenerator` để viết unit test deterministic.

## 8. App navigation và flow

### 8.1 Root flow

Root là một `NavigationStack` hoặc coordinator state enum:

```swift
enum AppScreen {
    case home
    case quickWorkout
    case changeWorkout
    case setup
    case activeWorkout
    case rest
    case complete
    case ptBooking
    case profile
    case myGym
}
```

Prototype web dùng show/hide screen. Native nên dùng coordinator để giữ control:

- Home -> Quick Workout
- Home -> PT Booking
- Home -> My Gym
- Avatar global -> Profile
- Quick Workout bottom nav -> Home, Quick Workout, Saved
- Quick Workout -> Change Workout
- Quick Workout -> Start -> Active Workout
- Active Workout -> Finish Set -> Rest
- Rest -> Skip Rest/Continue -> Active hoặc Complete
- Complete -> Save Workout modal hoặc Home

### 8.2 Global avatar

Nút avatar cố định top-right trên nhiều screen.

Yêu cầu:

- Hiển thị initials lấy từ tên profile.
- Nếu chưa có tên, hiển thị `?`.
- Tap mở Profile.
- Không che CTA hay status bar. Dùng safe area padding.

## 9. Màn hình Home

Nguồn: `screen-home`.

Mục tiêu UI:

- Full-screen mobile canvas, nền tối.
- Mascot cáo lớn ở vùng trên bên trái toàn mặt.
- Speech bubble: "Cần cù trời bù!!".
- 3 nút lớn ở dưới:
  - Tập Ngay
  - Tập với PT
  - Phòng Gym của tôi
- Version text nhỏ: `app version v1.5.0` hoặc lấy từ app version thật.

Yêu cầu visual:

- Mascot dùng `fox(2).png`. có thể tùy biến để phù hợp toàn màn hình
- CTA chính dùng cam gradient.
- Tập với PT và My Gym có style riêng nhưng vẫn trong dark/glass system.
- Home phải cảm giác playful, ít chữ, tập trung hành động.

Acceptance:

- Tap Tập Ngay sinh quick workout và chuyển màn.
- Tap Tập với PT mở PT Booking tab Booking.
- Tap Phòng Gym của tôi mở My Gym, tab Vé tập.
- Tap avatar mở Profile.

## 10. Quick Workout screen

Nguồn: `screen-quick-workout`, `ensureQuickWorkoutSimpleLayout`, `renderQuickWorkoutPreview`, `renderQuickExerciseList`.

### 10.1 Vai trò

Đây là màn hình trọng tâm. Người dùng xem bài được sinh tự động, chỉnh nhanh, thay nhóm cơ/thời lượng/cường độ/add-on, rồi bắt đầu tập.

### 10.2 Layout

Quick Workout dùng layout đã đơn giản hóa, không port lại horizontal pill layout cũ.

Từ trên xuống:

1. Top bar:
   - Nút back dạng square 52 x 52.
   - Nút saved/settings dạng square 52 x 52.
2. Hero ngắn:
   - Copy: `Sẵn sàng / bắt đầu!`.
   - Subtitle: `Tùy chỉnh nhanh buổi tập của bạn nhé.`
   - Mascot cáo đứng bên phải, là điểm nhấn phụ.
   - Tỉ lệ desktop/mobile prototype: hero cao khoảng 134-152 px; mascot khoảng 126-156 px; title khoảng 30-34 pt. Không dùng title 40+ pt hoặc mascot 200+ px trên Quick Workout vì làm mất nhịp thao tác.
3. Workout card:
   - Icon/emoji trong ô cam.
   - Name: Push Day, Chest Day...
   - Subtitle: nhóm cơ.
   - Nút `Đổi bài tập`.
4. Mục tiêu buổi tập:
   - 2 card: Thời lượng, Cường độ.
   - Card dùng icon vuông nhỏ, label, value.
5. Tùy chọn thêm:
   - Card gồm 2 row: Bài core, Khởi động.
   - Toggle dạng switch ở cuối row.
6. Xem trước buổi tập:
   - Header `Xem trước buổi tập` + estimated time.
   - Mặc định show 3 bài đầu để tiết kiệm chiều cao.
   - Nếu còn bài, show `+n bài tập khác`; tap mở rộng ngay tại chỗ, không điều hướng sang Change Workout.
7. CTA Start: `Bắt đầu buổi tập`.
8. Bottom nav:
   - Home
   - Tập ngay
   - Đã lưu

Nguyên tắc tỉ lệ:

- Hero không được cao hơn workout card + một khoảng thở; nội dung thao tác phải xuất hiện sớm trong viewport đầu.
- Mascot không được lớn hơn vùng text hero. Mascot hỗ trợ cảm xúc, không cạnh tranh với workout card.
- Heading hero chỉ dùng 2 dòng ngắn, không thêm mô tả dài.
- Trên màn nhỏ, giảm title và mascot trước khi giảm nội dung chức năng.

### 10.3 Exercise item

Quick Workout preview item cần đơn giản hơn setup/editor item:

- Số thứ tự trong vòng tròn cam.
- Thumbnail mascot nhỏ, crop ổn định.
- Tên bài.
- Meta line theo format: `3 set x 10 rep x 40 kg (1 phút 20 giây nghỉ)`.
- Chevron ở cuối để mở hướng dẫn bài tập.

Không đặt inline stepper, drag handle, swap/delete vào preview mặc định. Những thao tác chỉnh sâu có thể nằm trong setup/editor hoặc panel riêng để list preview không bị nặng.

SwiftUI mapping:

- Dùng `ScrollView` + `LazyVStack` hoặc custom rows để giữ visual giống prototype.
- Preview row có chiều cao ổn định khoảng 76-82 pt.
- Text meta cho phép wrap 2 dòng nếu cần, nhưng không làm row nhảy quá mạnh.
- Nút `+n bài tập khác` chỉ thay đổi state expanded của list.

### 10.4 State behavior

- Lần đầu vào Quick Workout, nếu chưa có `qwWorkoutTypeId`, chọn random workout type.
- Mỗi thay đổi duration/intensity/core/warmup thì regenerate nếu không phải saved profile.
- Nếu đang dùng saved workout, không regenerate cho đến khi user đổi workout type hoặc option.
- Delete/swap/stepper cập nhật `workoutPlan`.
- Estimated time phải recalc sau mọi edit.

### 10.5 Start behavior

Tap Start:

- Validate plan không rỗng.
- Reset session:
  - current exercise index = 0.
  - current set number = 1.
  - completed sets = 0.
  - total sets = sum sets.
  - rest logs empty.
  - elapsed base = 0.
- Chuyển Active Workout.

## 11. Change Workout screen

Nguồn: `screen-change-workout`, `renderWorkoutTypeGrid`, `renderCwSavedList`.

Layout:

- Header back, title "Thay đổi bài tập".
- Section "Nhóm cơ":
  - Grid/list button cho 8 workout types.
  - Selected type có border/accent.
- Divider.
- Section "Bài tập đã lưu":
  - Nếu empty: "Chưa có bài tập đã lưu".
  - Nếu có: card gồm name, số bài, tổng sets.
- Divider.
- Button "Tạo bài tập mới".

Behavior:

- Chọn workout type: set `qwWorkoutTypeId`, set saved false, regenerate, quay về Quick Workout.
- Chọn saved workout: load exercises vào plan, đặt `qwFromSavedProfile = true`, quay về Quick Workout.
- Tạo bài mới: nên mở Setup hoặc Exercise Picker để tạo plan thủ công.

## 12. Duration modal

Nguồn: `duration-modal`.

UI:

- Bottom/modal card hoặc sheet.
- Title "Thời gian tập".
- Display lớn: 15 phút, 1 giờ, 1h15...
- Slider range 15 đến 180, step 15.
- Labels 15p và 3h.
- Buttons Hủy, OK.

Behavior:

- Khi mở: slider = current duration.
- Khi kéo: update display live.
- OK: set duration, regenerate workout, dismiss.
- Hủy: dismiss không đổi.

SwiftUI:

- `.sheet` hoặc custom bottom sheet.
- Slider với binding Int qua Double bridge.

## 13. Intensity modal

Nguồn: `intensity-modal`.

UI:

- Modal card.
- Title "Cường độ tập".
- List options, mỗi option:
  - emoji.
  - name.
  - subtitle.
  - checkmark nếu selected.

Behavior:

- Tap option: set intensity, dismiss, regenerate.

## 14. Workout Setup screen

Nguồn: `screen-setup`. Đây là màn hình cũ nhưng vẫn nên giữ cho tạo/chỉnh workout thủ công.

Layout:

- Header:
  - Back.
  - Title "Workout Setup".
  - Add.
- List bài tập dạng card.
- Mỗi card:
  - Drag handle.
  - Emoji + name.
  - Delete.
  - Fields:
    - Weight stepper.
    - Sets stepper.
    - Reps stepper.
    - Rest stepper.
- Stats footer:
  - exercises.
  - sets.
  - estimated.
- CTA Begin Workout.

Behavior:

- Nếu plan rỗng, show empty state và disable Begin.
- Add mở Exercise Picker.
- Stepper update plan và stats.
- Drag reorder.
- Delete remove exercise.
- Begin reset session và chuyển Active.

## 15. Exercise Picker modal

Nguồn: `picker-modal`.

UI:

- Top:
  - Close.
  - Title "Thêm bài tập".
  - Count selected.
- Horizontal category tabs:
  - Back, Biceps, Chest, Shoulders, Triceps, Legs, Core, Warmup, Cooldown.
- List bài theo category:
  - Emoji.
  - Name.
  - Defaults: weight, sets × reps, rest.
  - Checkmark nếu selected.
- Footer button "Xong".

Behavior:

- Mở picker với `selectedIds` từ current plan.
- Tap item toggle selected.
- Xong:
  - Add bài mới selected mà chưa có.
  - Remove bài unselected.
  - Dismiss.
  - Refresh Quick Workout hoặc Setup tùy nơi mở.

## 16. Swap Exercise modal

Nguồn: `swap-modal`, `openSwapModal`.

Behavior:

- Mở từ một bài cụ thể.
- Hiển thị alternatives cùng category, khác id hiện tại, chưa trùng với bài khác trong plan.
- Giới hạn hiện tại: tối đa 6 bài.
- Tap alternative thay thế bài ở index đó.
- Refresh Quick Workout và Workout Edit Panel nếu đang mở.

UI:

- Header: "Đổi bài tập".
- Subtitle: "Thay thế cho: [exercise] ([category])".
- List alternatives:
  - emoji, name, defaults.

## 17. Guidance modal

Nguồn: `guidance-modal`, `EXERCISE_GUIDANCE`.

Behavior:

- Mở từ Quick Workout item, Active Workout guidance button, Rest next guidance.
- Nếu có guidance map theo exercise id, show text và YouTube video.
- Nếu không có, show generic instruction.

Native implementation options:

- MVP: show text only để tránh embed YouTube phức tạp.
- Better: dùng `SFSafariViewController` hoặc `WKWebView` YouTube embed.
- Best: lưu video/external link trong model, mở full screen video/web.

Exercise IDs có guidance hiện tại:

- barbell-bench
- incline-barbell
- db-bench
- machine-fly
- lat-pulldown-std
- seated-cable-row
- barbell-squat
- leg-press
- barbell-curl
- cable-pushdown

## 18. Active Workout screen

Nguồn: `screen-active`, `enterTraining`, `tickTraining`.

### 18.1 Layout

- Top bar:
  - elapsed total bên trái.
  - progress bar và percent.
- Center:
  - set timer lớn đếm lên từ 0.
  - exercise name.
  - badge: `Set 1/4`.
  - detail chips: reps, weight.
- Coaching area:
  - fox image.
  - speech bubble cue.
- Bottom:
  - CTA `Finish Set`.
- Floating guidance button nên có, từ `addGuidanceBtnToActive`.

### 18.2 Timer behavior

Khi vào training:

- `phase = training`.
- `trainingStartDate = Date()`.
- Hiển thị current exercise.
- `activeTimer = 0:00`.
- Total elapsed = base + set elapsed.
- Progress = completed sets / total sets.
- Không nói voice ngay khi vào set.
- Ở mốc >= 5 giây, nói đúng 1 cue cho set đó.
- Cue không lặp lại cue trước nếu có thể.

Finish Set:

- Cộng elapsed set vào base.
- Nếu còn rest trước set tiếp theo: chuyển Rest.
- Logic web chuyển Finish Set -> enterResting, rồi Skip Rest/advance mới tăng completed set. Team nên thống nhất:
  - Option A giữ parity web: completed set tăng khi bắt đầu set kế tiếp.
  - Option B trực giác hơn: completed set tăng ngay khi Finish Set, rest log lưu sau. Khuyến nghị Option B nhưng phải đảm bảo progress không lệch.

Để sát web: giữ logic hiện tại, progress tăng ở `advanceToNext()` sau rest.

## 19. Rest screen

Nguồn: `screen-rest`, `enterResting`, `tickResting`.

### 19.1 Layout

- Top bar giống Active:
  - elapsed.
  - progress.
- Center:
  - label REST.
  - countdown timer lớn.
  - circular progress ring.
  - motivational text.
  - next info: `Next: Set 2/4` hoặc `Next: [exercise]` hoặc `Last set incoming!`.
- Bottom:
  - button Skip Rest.
- Floating:
  - Edit workout button mở Workout Edit Panel.
  - Guidance next exercise button nếu next exercise khác.

### 19.2 Rest timer behavior

Khi vào rest:

- `phase = resting`.
- `restStartDate = Date()`.
- planned rest = current exercise rest.
- ring full.
- motivational random từ `REST_MSGS`.
- next info computed:
  - Nếu set tiếp theo cùng bài: `Next: Set X/Y`.
  - Nếu chuyển bài: `Next: [next exercise]`.
  - Nếu set cuối: `Last set incoming!`.

Tick:

- `elapsedRest = now - restStartDate`.
- `remaining = plannedRest - elapsedRest`.
- Nếu remaining >= 0:
  - show countdown.
  - ring offset theo fraction remaining/planned.
- Nếu remaining < 0:
  - show `+mm:ss`.
  - timer/ring đổi màu đỏ.
  - Nói 1 lần khi vừa overtime: "Hết giờ nghỉ rồi anh ơi... quay lại tập thôi!!".
  - Mỗi 10 giây overtime, nói nag message, không lặp trong cùng bucket.

Skip Rest/Continue:

- Ghi rest log:
  - planned rest.
  - actual rest = elapsed rest.
  - exercise index và set number.
- Add actual rest vào elapsed base.
- Reset rest state.
- completedSets++.
- Nếu completedSets >= totalSets: Complete.
- Else tăng current set hoặc current exercise rồi vào Active.

## 20. Workout Edit Panel during rest

Nguồn: `wep-panel`, `openWEP`.

Vai trò: cho chỉnh bài trong lúc nghỉ, timer vẫn chạy.

UI:

- Overlay tối.
- Bottom panel.
- Header "Chỉnh bài tập" và close.
- Note: "Timer vẫn chạy bình thường".
- Button thêm bài.
- List plan:
  - Current exercise có accent border và label "Hiện tại".
  - Drag handle.
  - Emoji/name.
  - Swap.
  - Steppers weight, reps, rest.

Behavior:

- Mở panel không pause rest timer.
- Add exercise đóng panel rồi mở Exercise Picker.
- Stepper cập nhật plan trực tiếp.
- Swap mở Swap Modal.
- Drag reorder. Cần cẩn thận nếu reorder current exercise:
  - Khuyến nghị MVP: cho reorder các bài sau current index, khóa bài đã hoàn thành và current.
  - Nếu cho reorder toàn bộ, phải update currentExerciseIndex theo identity id để không nhảy sai bài.

## 21. Complete screen

Nguồn: `screen-complete`, `enterComplete`.

### 21.1 Layout

- Celebration area:
  - confetti animation.
  - fox mascot.
  - title "You crushed it!".
  - subtitle summary.
- Stats:
  - Total Sets.
  - Total Weight.
  - Total Time.
- Rest report card.
- Actions:
  - Save workout.
  - Home.

### 21.2 Stats logic

- Total sets = sum sets or completed total.
- Total weight = sum(weight * reps * sets) across plan.
- Total time = total elapsed.
- Rest report:
  - planned rest total.
  - actual rest total.
  - diff and percentage.
  - verdict:
    - diff <= 0: Perfect discipline.
    - restPct <= 10: Mostly on track.
    - restPct <= 25: A bit lazy.
    - else: Way too much rest.
  - Per set line: actual/planned/diff.

### 21.3 Voice

On completion, speak summary. Native Vietnamese copy should be cleaned:

> Tập xong rồi anh ơi! Tổng thời gian nghỉ là [time], [nhiều hơn/ít hơn] kế hoạch [percent] phần trăm.

Pronoun should use profile pronoun, not hardcoded "anh".

## 22. Save workout modal

Nguồn: `save-modal`, `doSaveProfile`.

Behavior:

- Open with empty text.
- Max 40 chars.
- Save to persistence:
  - name.
  - exercises snapshot.
  - createdAt.
  - optional source type/duration/intensity.
- Dismiss.

Persistence key web: `panda_gym_profiles`. Native should rename cleanly:

- `saved_workouts_v1`.

## 23. Profile screen

Nguồn: `screen-profile`.

Layout:

- Header title "My Profile".
- Scroll fields:
  - Name text field.
  - Pronoun chips: Anh, Chị, Em, Bạn, Cậu, Cô, Bác, Chú.
  - Age number.
  - Weight kg number.
  - Goal chips:
    - Build Muscle
    - Get Lean
    - Get Stronger
    - Weight Loss
    - Improve Fitness
    - Power Lifting
  - Experience chips:
    - Beginner
    - Intermediate
    - Advanced
  - Preferred duration slider 15 đến 180, step 15.
  - Workouts per week chips 1 đến 7.
  - Toggle Core Workout.
  - Toggle Warm up.
  - Toggle Stretching/Cool down.
- Save Profile.
- Back.

Behavior:

- Load từ persistence vào UI.
- Save cập nhật `UserProfile`.
- Save sync default Quick Workout:
  - duration = profile duration.
  - intensity = profile experience.
  - includeCore = profile core.
  - includeWarmup = profile warmup.
- Avatar initials cập nhật.
- Show feedback "Đã lưu!" trong 2 giây.

Design note:

- Web CSS có bug selector `.profile-chip.selected` nhưng JS dùng class `active`. Native không bị vấn đề này, nhưng visual selected phải có accent.

## 24. PT Booking feature

Nguồn: `screen-pt-booking`, new 3-tab implementation trong `app.js`, `pt-data.js`.

### 24.1 Tabs

PT screen có 3 tab nội bộ:

- Booking.
- Buổi tập.
- My PTs.

Không nhầm với app root navigation. Đây là segmented/tab bar trong PT feature.

### 24.2 Booking tab layout

1. Header:
   - Back.
   - Title "Tập cùng PT".
2. Tab bar.
3. Section "Chọn ngày & giờ".
4. Date chips 14 ngày tới:
   - DOW short: CN, T2, T3...
   - day number.
   - locked nếu không có PT nào available ngày đó.
5. Timeline:
   - Hours 05:00 đến 21:00.
   - Mỗi giờ chia 2 slot 30 phút.
   - Slot available/locked.
   - Selection block draggable/resizable.
   - Height mapping web: 60 px/hour, 1 px/minute.
   - Duration snap 15 phút.
   - Min duration 15 phút.
   - Max duration 180 phút.
   - Bounds 05:00 đến 22:00.
6. Selection info:
   - Chosen time range.
   - Button Tìm PT.
7. Results:
   - Label số PT có sẵn.
   - Horizontal/vertical cards tùy viewport native.

### 24.3 PT availability logic

From `pt-data.js`:

- PT has profile and schedule.
- Schedule:
  - recurring by day of week.
  - overrides by date.
  - booked slots future.
- `getPTSlotsForDate(ptId, date)`:
  - check override first.
  - null override = blocked.
  - array override = special hours.
  - else recurring day.
  - currently booked slot subtraction is TODO.
- `isPTAvailable(ptId, date, start, end)`:
  - requested end must be after start.
  - requested range must fit inside at least one available slot.
- `getAvailablePTs(date, start, end)` returns PT profiles matching.

Native service:

```swift
struct PTAvailabilityService {
    func slots(for trainerID: String, date: Date) -> [TimeRange]
    func isAvailable(trainerID: String, date: Date, start: TimeOfDay, end: TimeOfDay) -> Bool
    func availableTrainers(date: Date, start: TimeOfDay, end: TimeOfDay) -> [PersonalTrainer]
}
```

### 24.4 PT card

Card content:

- Avatar image.
- Name.
- Specialty.
- Rating stars and numeric rating.
- Experience.
- Price total = pricePerHour * durationHours.
- Favorite heart.
- Bio.
- CTA: "Đặt lịch với [first name]".

Behavior:

- Favorite stored locally key web: `foxy_pt_favs`, native `favorite_trainers_v1`.
- Tap Book opens confirm modal.

### 24.5 Confirm booking modal

Content:

- Icon.
- Title "Xác nhận đặt lịch".
- Details:
  - PT name.
  - Date.
  - Start/end time.
  - Duration.
  - Price.
- Buttons Hủy and Xác nhận.

After confirm:

- MVP mock: show success state and add to local bookings.
- Backend phase: call booking API then update availability.

### 24.6 Buổi tập tab

Currently mock `MOCK_BOOKINGS`:

- Day.
- Time.
- Gym.
- PT.
- Content.

Native should show upcoming sessions list. MVP can use mock data, phase 2 uses real bookings.

### 24.7 My PTs tab

Layout:

- Subtabs:
  - Tất cả.
  - Yêu thích.
- Filter chips:
  - Tất cả.
  - Strength.
  - Yoga.
  - HIIT.
  - Powerlifting.
  - Calisthenics.
- List PT cards.

Behavior:

- Favorite filters by stored favorite IDs.
- Specialty filter currently uses string contains. Native should map specialty tags explicitly if possible.
- Book button switches to Booking tab.

### 24.8 Double Check-in cho buổi PT

Vai trò:

- Double Check-in xác nhận User và PT thật sự gặp nhau tại buổi tập.
- Đây là cơ chế trust layer cho marketplace PT tự do, giảm gian lận từ cả hai phía.
- Không phụ thuộc vào việc một bên tự nhấn "Bắt đầu" vì thao tác đó dễ bị fake.

Luồng đề xuất:

1. Đến giờ hẹn, User mở booking detail hoặc tab Buổi tập.
2. App User hiển thị Dynamic QR cho phiên booking đó.
3. PT mở PT App và quét QR.
4. Backend kiểm tra token QR:
   - token còn hạn.
   - booking đúng User/PT.
   - đang trong check-in window hợp lệ, ví dụ trước giờ hẹn 15 phút đến sau giờ hẹn 15 phút.
   - booking chưa bị check-in trước đó.
5. Real-time engine gửi event về cả hai app.
6. Khi scan hợp lệ, session chuyển sang `checkedIn` và đồng hồ buổi PT bắt đầu chạy.

Dynamic QR:

- Payload không được là member ID hoặc booking ID thô.
- Payload nên là signed rotating token ngắn hạn.
- Token rotate mỗi 20-60 giây để giảm screenshot/replay.
- Nên reuse hạ tầng QR của My Gym, nhưng production phải dùng token bảo mật thay vì QR trang trí.

Real-time:

- Có thể dùng Firebase Realtime Database/Firestore listener, Supabase Realtime, WebSocket, hoặc backend event stream.
- User app và PT App cùng subscribe theo `bookingID`.
- Event quan trọng:
  - `checkin_qr_generated`
  - `pt_scan_started`
  - `double_checkin_confirmed`
  - `pt_session_started`
  - `pt_session_checked_out`
  - `pt_session_disputed`

Check-out:

- MVP có thể kết thúc theo duration booking.
- Better: thêm Double Check-out bằng QR hoặc xác nhận hai phía.
- Nếu chỉ một bên checkout, session vào trạng thái review/dispute thay vì auto release tiền.

### 24.9 Escrow, package và CRM integration

Double Check-in là trigger bắt buộc cho payment escrow:

- Khi User đặt lịch, payment gateway giữ tiền hoặc giữ session credit.
- Khi `double_checkin_confirmed`, hệ thống ghi nhận buổi tập diễn ra hợp lệ.
- Khi session hoàn tất và không có dispute, escrow release tiền cho PT.
- Nếu không có check-in hợp lệ, không tự động trừ buổi tập của User.

Package sync:

- Với User:
  - cập nhật số buổi còn lại trong package.
  - lưu session duration thực tế.
  - gắn session vào lịch sử tập.
- Với PT:
  - đổ session vào CRM học viên.
  - cập nhật attendance, package status, note sau buổi.
  - giảm ghi chép thủ công.

Product states:

- `booked`
- `awaitingCheckin`
- `checkedIn`
- `inSession`
- `awaitingCheckout`
- `completed`
- `noShowUser`
- `noShowTrainer`
- `disputed`
- `cancelled`

Voice/personality moment:

- Khi check-in thành công, Voice Coach có thể nói:
  - "Ting ting! Cáo đã xác nhận bắt được tín hiệu của PT và User. Đồng hồ bắt đầu chạy, tập cho đàng hoàng nhé, cấm buôn dưa lê nha!"

Implementation priority:

- Phase 5 MVP: mô phỏng trạng thái check-in trong local/mock booking detail nếu chưa có backend.
- Backend/payment phase: triển khai Dynamic QR thật, real-time confirmation, escrow trigger, package ledger và CRM sync.

## 25. My Gym feature

Nguồn: `screen-my-gym`, `enterMyGym`, `drawQRCanvas`.

### 25.1 Internal bottom nav

Tabs:

- Phòng tập.
- Lớp tập.
- Vé tập.

Default tab: Vé tập.

### 25.2 Vé tập tab

Layout:

- Label "Vé tập của bạn".
- QR card:
  - White QR-like canvas.
  - Fox image overlay/blink anti-screenshot.
- Member info:
  - Name from profile or "Foxy Member".
  - ID: `FXY-2025-0001`.
  - Expiry: `31/12/2025`.

Native QR:

- MVP: generate QR-like decorative pattern same as web.
- Better: use CoreImage `CIQRCodeGenerator` with payload membership ID.
- For security, actual production pass should use rotating token from backend.

### 25.3 Phòng tập tab

Mock gyms:

- California Fitness Quận 1, 1.2km, 550,000đ/tháng, badge Đang mở.
- Fit24 Quận 7, 3.5km, 350,000đ/tháng, badge Gần bạn.
- Elite Gym Bình Thạnh, 4.8km, 480,000đ/tháng, badge 24/7.

Filter chips:

- Gần tôi.
- Quận 1.
- Quận 7.
- Giá thấp.

### 25.4 Lớp tập tab

Mock classes:

- Spinning, T2/T4/T6 07:00, Phòng B, 45 phút, Còn 3 chỗ.
- Dance Cardio, T3/T7 18:30, Phòng C, 60 phút, Phổ biến.
- Yoga Flow, T2/T4 19:00, Phòng D, 60 phút, Còn 5 chỗ.
- Boxing Fitness, T5/CN 08:00, Phòng A, 50 phút, Hot.

Filter chips:

- Tất cả.
- Spinning.
- Dance.
- Yoga.
- Boxing.

## 26. Notifications, rewards và marketplace portals

### 26.1 Notification module

Vai trò:

- Nhắc tập.
- Nhắc quay lại nếu bỏ dở session.
- Nhắc PT booking sắp tới.
- Nhắc vé/lớp/gói tập sắp hết hạn.

Production rules:

- Copy, timing, segment, frequency cap và channel phải là config.
- Có local notification fallback cho các nhắc rest/background quan trọng.
- Push notification cần backend token registry và opt-in rõ ràng.
- Không spam. Mỗi campaign phải có guardrail metric như opt-out rate, uninstall rate, notification dismiss rate.

Core events:

- `notification_scheduled`
- `notification_sent`
- `notification_opened`
- `notification_dismissed`
- `notification_converted`

### 26.2 Rewards và gamification

Vai trò:

- Streak tập luyện.
- Badge hoàn thành workout.
- Reward khi hoàn thành workout hoặc check-in gym.
- Celebration cuối buổi.

Rules:

- Gamification phải experiment cẩn thận, không hardcode rule.
- Reward không được làm app rối hoặc đẩy người dùng tập quá sức.
- Operator có thể cấu hình badge/reward theo segment.

### 26.3 PT App/Portal

Tương lai cần PT App hoặc PT web portal:

- Quản lý lịch rảnh, block date, recurring schedule.
- Accept/reschedule/cancel booking.
- Xem học viên, package, attendance, note sau buổi.
- Giao workout plan cho User.
- Xem doanh thu, payout và dispute.
- Quét Dynamic QR của User cho Double Check-in.

### 26.4 Gym Partner Portal

Tương lai cần Gym scanner app hoặc Gym web portal:

- Verify Dynamic QR/token của vé tập.
- Bán/đăng vẽ ngày, vé tháng, class pass.
- Quản lý lớp tập: lịch, instructor, slot limit, waitlist.
- Dashboard lượt check-in theo khung giờ.
- Quản lý gym profile, địa điểm, giá, tiện ích.

## 27. Voice coach và audio

### 27.1 Current web behavior

Web có 2 TTS paths:

- Browser `speechSynthesis`, mostly fallback.
- FPT.AI TTS endpoint with API key hardcoded.

Important issue:

- API key đang nằm trong client code. Native app không được ship API key kiểu này.

### 27.2 Native strategy

MVP:

- Dùng `AVSpeechSynthesizer`.
- Voice language: `vi-VN`.
- Configure audio:

```swift
try AVAudioSession.sharedInstance().setCategory(.playback, options: [.mixWithOthers])
try AVAudioSession.sharedInstance().setActive(true)
```

If using external TTS:

- Không gọi FPT trực tiếp từ app với API key hardcoded.
- App gọi backend của mình, backend gọi FPT.
- Backend trả audio URL/token ngắn hạn.

### 27.3 Voice events

Training:

- At 5s after set start, speak one cue.
- Avoid repeating previous cue if possible.

Rest:

- When rest goes overtime first time:
  - "Hết giờ nghỉ rồi [pronoun] ơi... quay lại tập thôi!"
- Every 10s overtime:
  - Random nag message.

Complete:

- Speak session rest summary.

Profile-aware copy:

- Replace hardcoded "anh" with profile pronoun:
  - Anh/Chị/Em/Bạn/Cậu/Cô/Bác/Chú.

### 27.4 Foxy persona và generative audio

Voice Coach không chỉ đọc tên bài hoặc đếm thời gian. Nó là nhân vật cáo coach: vui, ranh mãnh, hơi cà khịa, strict but lovable, đánh trúng tâm lý người tập đang nghỉ quá lâu hoặc lướt mạng giữa set.

Persona rules:

- Ngắn, có nhịp, nói như coach đang đứng cạnh.
- Vui và chọc nhẹ, không body-shaming, không xúc phạm cá nhân.
- Có thể nhắc các thói quen phổ biến như lướt mạng, buôn chuyện, uống trà sữa, nhưng dùng như punchline nhẹ.
- Luôn quay về hành động: tập tiếp, giữ form, uống nước, chuẩn bị bài kế.
- Dùng pronoun theo profile, tránh hardcode "anh".

Example lines:

- Rest overtime: "Nghỉ vậy đủ rồi nha, trà sữa không tự đốt calo đâu. Quay lại set tiếp!"
- Rest overtime: "Cáo thấy tay bạn lướt điện thoại hơi mượt rồi đó. Cất máy, nâng tạ!"
- Before next exercise: "Bài tiếp theo tới rồi. Tìm đúng máy, chỉnh tạ cho chuẩn, đừng đi lạc nha."
- Double Check-in success: "Ting ting! Cáo đã xác nhận PT và User có mặt. Đồng hồ bắt đầu chạy, tập cho đàng hoàng nhé!"

Generative audio roadmap:

- Phase 3 native: dùng `AVSpeechSynthesizer` cho MVP, kết hợp copy deck có sẵn.
- Backend/audio phase: thêm TTS cache service.
  - Input: text + voice + speed + persona version.
  - Key: hash của input.
  - Nếu audio đã có, trả cached file.
  - Nếu chưa có, backend gọi TTS provider, lưu audio, rồi trả URL/audio data.
- Production AI phase: dùng generative audio để tạo biến thể lời thoại theo:
  - bài tập hiện tại.
  - thời gian nghỉ thực tế.
  - lịch sử người dùng.
  - mức thân mật/persona preference.
  - PT session context.

Guardrails:

- Không để API key TTS trong app.
- Có allowlist hoặc moderation cho câu generative trước khi phát.
- Cho user tắt voice, giảm độ "cà khịa", hoặc chọn tone nhẹ hơn.
- Cache các câu phổ biến để tiết kiệm quota và giảm latency.

### 27.5 Background behavior

Need test:

- Screen locked during rest.
- App background during active set.
- Resume after 2 minutes.
- Audio ducking/interruption by phone call/music.

Implementation:

- Use timestamps for exact timer.
- For long background rest reminders, schedule local notifications as backup.
- If app is allowed to keep audio playback, AVSpeech can speak while locked, but team must test App Review implications and user expectation.

## 28. Design system

Nguồn chính: `styles.css`.

### 28.1 Colors

Map CSS variables:

- Background primary: `#1A1A1E`.
- Card: rgba(35, 33, 38, 0.85).
- Card hover/elevated: rgba(45, 43, 48, 0.95).
- Glass: rgba(25, 23, 28, 0.95).
- Text primary: `#F0ECE4`.
- Text secondary: rgba(240, 236, 228, 0.65).
- Text muted: rgba(240, 236, 228, 0.35).
- Accent: `#F5960A`.
- Accent dark: `#D07A00`.
- Accent light: `#FFB84D`.
- Green: `#4CAF50`.
- Blue: `#42A5F5`.
- Red: `#FF5252`.
- Gold: `#FFD54F`.
- Purple: `#CE82FF`.
- Border subtle: rgba white 0.04.
- Border card: rgba white 0.08.

SwiftUI:

```swift
enum FoxyColor {
    static let background = Color(hex: "1A1A1E")
    static let textPrimary = Color(hex: "F0ECE4")
    static let accent = Color(hex: "F5960A")
}
```

Accent gradient:

- 135 degrees equivalent: `#D07A00 -> #F5960A -> #FFB84D`.

### 28.2 Typography

Web uses:

- Heading: Nunito 600/700/800/900.
- Body: Inter 400/500/600/700.

Native options:

- Use bundled Nunito and Inter fonts if licensing/file available.
- Or use iOS system rounded:
  - Heading: `.system(.title, design: .rounded).weight(.black)`
  - Body: `.system(.body, design: .default)`

To match HTML better, bundle fonts.

### 28.3 Shape and spacing

CSS radii:

- small 14.
- medium 18.
- large 24.
- xl 36.

Cards:

- Dark translucent background.
- Border 1 px white 0.08.
- Soft shadow.

Buttons:

- Primary: accent gradient, large rounded, bold heading font.
- Secondary: dark glass, border, text primary.
- Big button: height about 58, full width.

Quick Workout hero scale:

- Hero title: 34 pt on regular iPhone width, 30 pt on narrow width.
- Hero subtitle: 15 pt regular, 14 pt narrow.
- Hero mascot: 156 pt regular, 126 pt narrow.
- Hero height: 152 pt regular, 134 pt narrow.
- Avoid using viewport-proportional font scaling. Use named size tokens and device breakpoints.

### 28.4 Mobile frame

Web `.app-container` is max 430px, min-height 100vh, centered on desktop.

Native:

- Full iPhone screen.
- Respect safe areas.
- On iPad, consider max width 430 centered to preserve design.

## 29. Persistence

Web localStorage keys:

- `panda_gym_profiles`: saved workout profiles.
- `foxy_user_prefs`: user profile/preferences.
- `foxy_pt_favs`: favorite PT ids.

Native keys:

- `user_profile_v1`.
- `saved_workouts_v1`.
- `favorite_trainers_v1`.
- `workout_session_draft_v1` optional for recovery.
- `bookings_v1` optional for mock PT bookings.

Recommendation:

- MVP use `UserDefaults` with JSON encoded structs.
- If app grows, migrate to SwiftData.

## 30. Backend readiness

Mock data should be wrapped behind protocols:

```swift
protocol ExerciseRepository {
    func allExercises() async throws -> [Exercise]
}

protocol TrainerRepository {
    func trainers() async throws -> [PersonalTrainer]
    func availability(trainerID: String, date: Date) async throws -> [TimeRange]
    func createBooking(_ request: BookingRequest) async throws -> PTBooking
}

protocol PTSessionRepository {
    func qrToken(for bookingID: String) async throws -> RotatingQRToken
    func confirmTrainerScan(token: String, trainerID: String) async throws -> PTSession
    func observeSession(bookingID: String) -> AsyncStream<PTSessionEvent>
    func checkout(bookingID: String, actor: PTSessionActor) async throws -> PTSession
}

protocol TTSRepository {
    func audio(for text: String, voice: String, speed: String, personaVersion: String) async throws -> TTSAudio
}
```

MVP implementations can return local constants. This makes future API replacement easy.

Backend services needed after MVP:

- Auth & Identity: user, PT, gym_operator, admin, operator roles; anonymous upgrade path; device identity for QR/push.
- Config Service: module configs, schema validation, targeting, rollout percentage, rollback.
- Experiment Service: allocation, guardrails, metric evaluation.
- Event Collector: batch ingest, schema validation, audit trail.
- Workout Service: exercise library, generated workout variants, performance history.
- PT Booking Service: availability, booking holds, transaction-safe booking, reschedule/cancel.
- Gym Service: gym profiles, passes, classes, QR issue/verify.
- Payment Service: escrow for PT booking, package credits, revenue split, invoice/receipt.
- Notification Service: push/local campaign config, frequency cap.
- Secure rotating QR/token service for My Gym and PT Double Check-in.
- Real-time session engine for booking/check-in/check-out events.
- Payment escrow ledger with release/dispute states.
- Package/session ledger for User packages.
- PT CRM sync for attendance, notes and package status.
- TTS cache service so repeated Foxy persona lines do not regenerate every time.

### 30.1 Event model

Every important action emits a structured event:

```json
{
  "event_id": "evt_123",
  "event_name": "workout_started",
  "occurred_at": "2026-04-24T12:00:00Z",
  "user_id": "u_123",
  "anonymous_id": "anon_456",
  "session_id": "sess_789",
  "platform": "ios",
  "app_version": "1.0.0",
  "module": "workout",
  "module_version": "1.0.0",
  "config_version": "cfg_20260424_001",
  "experiment_id": "exp_qw_001",
  "variant_id": "simple_fox",
  "properties": {}
}
```

Rules:

- No unnecessary PII in analytics events.
- Health/training data needs encryption and retention policy.
- Events must include module/config/variant so experiments can be evaluated.
- Events should reconstruct journeys: workout session, booking journey, gym check-in journey.

Key metrics:

- `quick_workout_start_rate`
- `workout_completion_rate`
- `time_to_first_start`
- `rest_overtime_rate`
- `voice_enabled_completion_lift`
- `pt_search_to_booking_rate`
- `qr_open_to_checkin_rate`
- `notification_opt_out_rate`

### 30.2 Minimal API contracts

```http
POST /v1/config/resolve
POST /v1/events/batch
POST /v1/workouts/generate
POST /v1/pt/search-availability
POST /v1/bookings
POST /v1/bookings/{booking_id}/qr-token
POST /v1/pt-sessions/scan
POST /v1/gym-passes/{pass_id}/qr-token
POST /v1/gym/checkins/verify
POST /v1/tts
```

### 30.3 Data stores

PostgreSQL tables:

- users, user_profiles
- exercises, workout_templates, workout_sessions, workout_session_events
- pt_profiles, pt_schedules, bookings, pt_sessions
- gyms, gym_passes, gym_classes, checkins
- packages, payments, payouts, disputes
- module_configs, config_versions, experiments, experiment_allocations, event_schemas

Redis:

- QR token cache.
- Feature/config cache.
- Short-lived booking holds.
- Rate limits.

Object storage:

- PT avatars.
- Mascot/assets.
- Generated TTS audio cache.
- Exported reports.

Warehouse:

- Raw events.
- Sessionized events.
- Experiment metrics.
- Cohorts.

### 30.4 Operator console

Future operator console should include:

- Config editor with schema validation.
- Experiment dashboard with allocation, metrics and guardrails.
- Insight dashboard: retention, workout start, completion, PT intent, QR usage.
- Voice script/persona editor.
- Notification campaign editor.
- AI assistant panel for generating config/copy/workout variants.
- Approval queue and rollback center.

## 31. Known issues and cleanup from web prototype

1. Encoding/copy issue:
   - Terminal shows mojibake for Vietnamese strings. Before native build, create clean Vietnamese copy deck in UTF-8.
2. Hardcoded FPT API key:
   - Must be removed before production.
3. Duplicated/overridden JS logic:
   - `enterPTBooking` is overridden by new implementation.
   - `enterQuickWorkout` is overridden later for simplified layout.
   - Native should implement final intended behavior directly.
4. Profile selected CSS mismatch:
   - JS toggles `active`, CSS has `.selected` in one area.
5. Current workout reorder during rest:
   - Needs explicit product decision to avoid index bugs.
6. PT booked slot subtraction is TODO:
   - Native should implement if bookings become real.
7. My Gym QR is decorative:
   - Production needs secure rotating QR/token.
8. Hardcoded dates in mock bookings/member expiry:
   - Replace with real data or clearly mock.

## 32. Acceptance criteria by feature

### Home

- User sees fox mascot, speech bubble, 3 CTAs and avatar.
- All CTAs navigate correctly.

### Quick Workout

- A valid workout appears on first open.
- Duration/intensity/core/warmup update preview.
- Exercises can be reordered, deleted, swapped, edited and added.
- Estimated time updates correctly.
- Start launches session.
- Vietnamese copy has full accents.
- Hero title and mascot keep the simplified ratio: title about 30-34 pt, mascot about 126-156 pt, hero about 134-152 pt depending on device width.
- Tapping `+n bài tập khác` expands the preview list in place and never opens Change Workout.
- Each preview row shows exercise name plus `set x rep x kg (phút/giây nghỉ)`.

### Active/Rest

- Timer remains accurate after background/resume.
- Voice cue triggers once at 5s per set.
- Rest countdown/ring works.
- Overtime state turns red and nags every 10s.
- Finish flow reaches Complete with correct stats.
- Voice copy follows Foxy persona: playful, strict, light teasing, action-oriented and never insulting.
- User can reduce/disable voice intensity.

### Save/Saved Workouts

- Completed or custom workout can be saved.
- Saved workout appears in Change Workout.
- Loading saved workout does not auto-regenerate.

### Profile

- User profile persists.
- Avatar initials update.
- Profile defaults sync to Quick Workout.

### PT Booking

- Date chips show next 14 days.
- Locked dates cannot be selected.
- Timeline selection can move and resize.
- Find PT returns correct availability based on schedules.
- Favorite PT persists.
- Booking confirmation works in mock.
- Future Double Check-in flow uses Dynamic QR, validates both User and PT, and starts PT session timer only after confirmation.
- Double Check-in can become escrow/package/CRM trigger in backend phase.

### My Gym

- QR/pass tab renders.
- Member name reflects profile.
- Gym and class lists render with filter chips visual.

### Platform readiness

- Major actions emit events with module/config/variant metadata.
- No production experiment relies on hardcoded app behavior if config can safely control it.
- Config has schema validation and rollback path.
- Backend APIs have validation and audit log.
- QR/check-in tokens are short-lived and server-verified before real payments or package deduction.
- Operator can eventually change voice copy, notification copy and module variants without app release.

## 33. Implementation phases

### Phase 0: Project setup

- Create Xcode SwiftUI app.
- Add assets: fox, PT avatars.
- Add design system colors/fonts/components.
- Add persistence wrapper.
- Add local config resolver and analytics event envelope.
- Add unit test target.

### Phase 1: Domain data and generator

- Port ExerciseCatalog.
- Port WorkoutTypeCatalog.
- Port IntensityLevel.
- Port WorkoutGenerator.
- Define schema-first configs for Workout, Voice Coach and PT Booking.
- Add unit tests for:
  - intensity modifiers.
  - estimated time.
  - duration budget.
  - warmup/core/cooldown composition.

### Phase 2: Home and Quick Workout

- Build Home.
- Build QuickWorkoutView.
- Build duration sheet and intensity sheet.
- Build exercise row/editor.
- Build change workout screen.
- Build picker and swap modal.

### Phase 3: Workout session engine

- Build ActiveWorkoutView.
- Build RestView.
- Build CompleteView.
- Build session state machine.
- Build VoiceCoachManager.
- Add Foxy persona copy deck and voice intensity setting.
- Add background/resume timer handling.
- Add rest report.

### Phase 4: Profile and saved workouts

- Build ProfileView.
- Persist profile.
- Persist saved workouts.
- Wire avatar initials.

### Phase 5: PT Booking

- Port PT profiles and schedules.
- Build PT tabs.
- Build date chips.
- Build timeline selection.
- Build available PT results and confirm flow.
- Persist favorites and mock bookings.
- Add booking detail/session state model for future Double Check-in.
- Optional MVP mock: show User Dynamic QR placeholder and simulate PT scan success.

### Phase 6: My Gym

- Build My Gym internal tabs.
- Build pass/QR.
- Build gym/class mock lists.

### Phase 6.5: Trust, payment and PT session infrastructure

- Implement secure rotating QR token service.
- Implement Double Check-in with PT App scan flow.
- Add real-time booking/session event stream.
- Add Double Check-out or completion confirmation.
- Connect valid PT session to escrow release rules.
- Sync completed PT sessions to User package ledger and PT CRM.
- Add TTS cache backend for Foxy persona/generative audio.

### Phase 7: Polish and QA

- Haptics on major actions.
- Accessibility labels.
- Dynamic type sanity.
- VoiceOver basic.
- Lock screen/background timer QA.
- iPhone SE, standard iPhone, Pro Max layout QA.

### Phase 8: Operator and experimentation foundation

- Build minimal config viewer/editor for internal use.
- Add event batch endpoint/client when backend exists.
- Add experiment allocation model.
- Track first metrics: `quick_workout_start_rate`, `workout_completion_rate`, `pt_search_to_booking_rate`.
- Add rollback switch for remote-configured modules.

### Business delivery estimate

If building full V1.0 with User App, PT/Gym portals, backend, payment and analytics, rough planning assumption from older PRD:

- Core User & PT App MVP: about 2.5-3 months.
- Gym Portal & payment/escrow: about 2 months.
- Real-time, scale, chat/push and generative audio: about 1.5 months.
- Total V1.0 marketplace: about 6-7 months for a small team.

## 34. Suggested SwiftUI component map

- `FoxyButton`: primary/secondary/pt/gym variants.
- `FoxyGradientButton`: CTA.
- `FoxyChip`: selected/unselected.
- `FoxyStepper`: compact minus/value/plus.
- `FoxyCard`: glass card.
- `FoxyBottomNav`: item with icon/title/active.
- `MascotSpeechBubble`: image + bubble.
- `ExerciseRow`: quick workout/setup row.
- `WorkoutProgressBar`: top progress.
- `RestRing`: circular rest progress.
- `PTTimelineView`: timeline with selection binding.
- `PTCardView`: trainer profile card.
- `GymPassQRView`: QR/pass card.
- `DynamicQRView`: rotating QR token with expiry indicator.
- `NotificationPermissionView`: opt-in prompt.
- `RewardBadgeView`: badge/streak display.
- `ConfigDebugPanel`: internal config/variant inspection.
- `AnalyticsEmitter`: shared event emission helper.

## 35. Copy deck cần chuẩn hóa

Do file HTML hiện tại có dấu tiếng Việt bị lỗi khi đọc ở terminal, team nên tạo file copy riêng:

- Home:
  - "Let's train!!"
  - "Tập Ngay"
  - "Tập với PT"
  - "Phòng Gym của tôi"
- Quick Workout:
  - "Thay đổi"
  - "Bài tập"
  - "Bắt đầu tập"
  - "Đã lưu"
- Workout:
  - "Finish Set" hoặc "Xong set"
  - "Skip Rest" hoặc "Bỏ qua nghỉ"
  - "REST" hoặc "NGHỈ"
- PT:
  - "Tập cùng PT"
  - "Booking"
  - "Buổi tập"
  - "My PTs"
  - "Tìm PT"
  - "Xác nhận đặt lịch"
- My Gym:
  - "Phòng Gym của tôi"
  - "Vé tập"
  - "Phòng tập"
  - "Lớp tập"

Product decision: dùng tiếng Việt toàn bộ hay mix Việt/Anh như prototype. Để giữ vibe hiện tại, có thể mix nhưng cần nhất quán.

## 36. Test plan

### Unit tests

- WorkoutGenerator:
  - Each intensity applies expected modifiers.
  - `estimateExerciseTime` exact.
  - Warmup/core/cooldown counts.
  - Duration minimum main budget.
- PTAvailabilityService:
  - recurring schedule.
  - override blocked.
  - override special hours.
  - invalid end <= start false.
  - range must fit fully inside slot.
- SessionEngine:
  - finish set transitions.
  - rest actual/planned log.
  - completion stats.

### UI tests

- Launch -> Home -> Quick Workout -> Start -> Finish -> Rest -> Skip -> Complete.
- Save workout -> Change Workout -> load saved.
- Profile save -> avatar initials.
- PT select date/time -> find PT -> confirm.
- My Gym pass displays member name.

### Manual QA

- Lock screen during rest.
- Background app for 2 minutes then resume.
- Silent mode and audio behavior.
- Incoming call/audio interruption.
- Dynamic type larger text.
- iPhone SE height constraints.

## 37. Definition of Done for native rewrite

The rewrite is considered equivalent to the current HTML prototype when:

- All user-visible screens listed in this document exist in SwiftUI.
- Core workout generation and session behavior match the current web logic.
- Timer and voice coach work more reliably than web, including background/resume.
- The visual language is recognizable as the same Foxy Gym app.
- Local persistence covers profile, saved workouts and favorite PTs.
- No secret API key is embedded in app binary.
- QA passes on at least iPhone SE, iPhone 15/16 standard size and Pro Max size.
