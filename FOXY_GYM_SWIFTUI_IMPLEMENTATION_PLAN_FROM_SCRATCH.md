# Foxy Gym SwiftUI Implementation Plan From Scratch

Ngày tạo gốc: 2026-04-27  
Cập nhật lớn: 2026-04-28

Tài liệu này không còn chỉ là “plan from scratch”. Đây là bản mô tả đầy đủ app Foxy Gym SwiftUI ở trạng thái hiện tại:

- App đang có những feature nào.
- Mỗi feature đang được triển khai bằng file nào, logic nào.
- Những phần mới chỉ là local/mock flow.
- Những phần nào còn backlog thật sự.

Tài liệu này nên được đọc cùng [Foxy Brain.md](../../Foxy%20Brain.md).  
`Foxy Brain` là kanban và backlog theo phase.  
Tài liệu này là implementation guide ở mức kiến trúc, feature map và cách nối logic.

---

## 1. Tóm tắt sản phẩm

Foxy Gym là app iOS SwiftUI cho tập luyện cá nhân với mascot cáo làm voice coach. Trải nghiệm chính:

- Vào app, xem landing/home.
- Tạo nhanh buổi tập theo type, duration, intensity, warmup, core.
- Chỉnh bài tập trước khi bắt đầu.
- Chạy buổi tập theo set, rest timer, voice cue.
- Xem completion report và lưu buổi tập.
- Đặt lịch với PT theo timeline.
- Xem module My Gym: vé tập QR, phòng tập, lớp tập.
- Quản lý profile cá nhân.

Visual direction:

- Dark UI.
- Accent cam / amber.
- Card-based layout.
- Typography rounded, vui nhưng không trẻ con quá.
- Mascot cáo xuất hiện có kiểm soát.

---

## 2. Kiến trúc app hiện tại

App hiện tại là SwiftUI app lifecycle, state chủ yếu theo `ObservableObject` và `UserDefaults` JSON.

### 2.1 Entry points

- `foxy gym/FoxyGymApp.swift`
  - `@main`.
  - Setup `AVAudioSession`.
  - Request notification authorization.
  - Giữ `WorkoutSession` và `PersistenceStore` ở app level.
  - Theo dõi `scenePhase` để sync timer/resume.

- `foxy gym/Views/MainTabView.swift`
  - Tab shell chính.
  - Các tab:
    - `Home`
    - `Tập Ngay`
    - `Saved`

### 2.2 Shared state / services

- `foxy gym/ViewModels/WorkoutSession.swift`
  - State machine của buổi tập.
  - Theo dõi current exercise, set, phase, timer, rest log, total elapsed.

- `foxy gym/Core/PersistenceStore.swift`
  - Singleton persistence.
  - Lưu:
    - `UserProfile`
    - `savedWorkouts`
    - `ptBookings`
    - `favoritePTIds`
    - `joinedGymClassIds`
    - `homeGymId`

- `foxy gym/Core/VoiceCoachManager.swift`
  - TTS bằng `AVSpeechSynthesizer`.
  - Script pool và cue logic.

- `foxy gym/Core/WorkoutGenerator.swift`
  - Sinh workout từ mock catalog.
  - Có deterministic path qua seeded RNG cho test.

- `foxy gym/Core/RestNotificationManager.swift`
  - Quản lý local notification cho rest overtime ở background.

- `foxy gym/Core/InsightEmitter.swift`
  - Analytics stub.
  - Hiện mới print/log, chưa nối backend.

### 2.3 Design system / helper

- `foxy gym/Core/Theme.swift`
  - Color tokens, surface, accent, text.

- `foxy gym/Core/CalorieEngine.swift`
  - Estimate calories từ duration/category/profile weight.

---

## 3. Data model hiện tại

### 3.1 Workout / exercise

- `foxy gym/Models/Exercise.swift`
  - Bài tập chỉnh được:
    - `weight`
    - `sets`
    - `reps`
    - `rest`
    - `swapOptions`
    - `instructions`
    - `templateId`

- `foxy gym/Models/SavedWorkout.swift`
  - Bản snapshot buổi tập đã lưu.

### 3.2 User / profile

- `foxy gym/Models/UserProfile.swift`
  - Bao gồm:
    - tên
    - pronoun
    - tuổi
    - cân nặng
    - goal
    - experience
    - default duration
    - workouts per week
    - core
    - warmup
    - stretching

### 3.3 PT / My Gym

- `foxy gym/Models/PTProfile.swift`
  - `PTProfile`
  - `PTBooking`

- `foxy gym/Models/GymPass.swift`
  - Pass model cơ bản.
  - UI My Gym hiện dùng mostly mock/local state hơn là model pass đầy đủ.

---

## 4. Feature map toàn app

## 4.1 Home

### Mục tiêu

Cho user thấy điểm vào chính của app, giữ tinh thần sản phẩm và dẫn hướng sang workout / PT / My Gym.

### File chính

- `foxy gym/Views/HomeLandingView.swift`
- `foxy gym/Views/HomeOverviewView.swift`

### Đã có

- Hero landing dark theme.
- Dùng asset mascot / background.
- Entry CTA sang các phần chính.
- Home overview dùng data thật từ profile và saved workouts.

### Cách triển khai

- SwiftUI card layout + background image treatment.
- `PersistenceStore` cấp dữ liệu profile.
- Saved workout stats được tính từ dữ liệu đã lưu, không hardcode.

---

## 4.2 Quick Workout

### Mục tiêu

Cho user tạo nhanh buổi tập có thể tập ngay, có preview rõ, chỉnh nhanh trước khi start.

### File chính

- `foxy gym/Views/QuickWorkoutView.swift`
- `foxy gym/Views/ExerciseRow.swift`
- `foxy gym/Views/ChangeWorkoutView.swift`
- `foxy gym/Core/WorkoutGenerator.swift`

### Đã có

- Chọn workout type.
- Chọn intensity.
- Chọn duration.
- Toggle core / warmup / stretching.
- Preview bài tập.
- Expand list để xem/chỉnh bài.
- Inline chỉnh:
  - sets
  - reps
  - weight
- Change workout flow riêng.
- Load saved workout vào quick workout ở mức v1.

### Cách triển khai

- Workout được generate qua `WorkoutGenerator`.
- `ExerciseRow` là reusable row cho chỉnh bài.
- `ChangeWorkoutView` là flow thay bài / đổi hướng buổi tập / load saved workout.
- `PersistenceStore.requestedWorkoutTypeId` dùng cho một số flow điều hướng nội bộ.

### Ghi chú hiện trạng

- `goalId -> suggest workout type` vẫn chưa được wire thật.
- Saved workout load-back đã có v1 nhưng vẫn còn backlog polish.

---

## 4.3 Workout Generator

### Mục tiêu

Sinh buổi tập từ catalog mock theo loại buổi, cường độ và time budget.

### File chính

- `foxy gym/Core/WorkoutGenerator.swift`

### Đã có

- Catalog workout types.
- Catalog intensity levels.
- Exercise library.
- Core / warmup / cooldown pools.
- Time-budgeted generation.
- Apply intensity modifiers:
  - sets
  - reps
  - rest
  - weight
- Seeded deterministic generation path cho test.

### Cách triển khai

`generateWorkout(...)` hiện có 2 đường:

1. Runtime path:
   - dùng `SystemRandomNumberGenerator`
   - assign UUID rendering IDs

2. Test / deterministic path:
   - nhận `inout RandomNumberGenerator`
   - có thể tắt assign rendering IDs

### Ghi chú hiện trạng

- Đây là mock generator local, chưa dùng lịch sử tập thật hay equipment availability thật.

---

## 4.4 Active Workout Session

### Mục tiêu

Dẫn user qua từng set, từng bài, giữ timer đúng, hỗ trợ rest flow và voice coach.

### File chính

- `foxy gym/ViewModels/WorkoutSession.swift`
- `foxy gym/Views/ActiveWorkoutView.swift`
- `foxy gym/Views/ExerciseGuidanceView.swift`

### Đã có

- State machine:
  - `active`
  - `resting`
  - `complete`
- Theo dõi:
  - current exercise index
  - current set number
  - total elapsed
  - set elapsed
  - time remaining
  - rest duration
- Rest flow theo HTML:
  - không auto vào set khi rest = 0
  - overtime prompt
  - nag mỗi 10 giây
- Resume sync bằng `ScenePhase`.
- Background notification khi rest overtime.

### Cách triển khai

- Timer tính theo `Date`, không dựa vào tick count.
- `WorkoutSession` có:
  - `workoutStartTime`
  - `setStartTime`
  - `restStartTime`
  - `restTargetTime`
- Khi app resume:
  - recalc toàn bộ elapsed/timeRemaining từ `Date`.
- Khi app background lúc đang rest:
  - schedule local notification qua `RestNotificationManager`.

---

## 4.5 Voice Coach

### Mục tiêu

Tạo cảm giác có coach thật: nhắc set start, set done, rest countdown, rest overtime, exercise change, completion summary.

### File chính

- `foxy gym/Core/VoiceCoachManager.swift`

### Đã có

- TTS tiếng Việt bằng `AVSpeechSynthesizer`.
- Workout start.
- Set start.
- Set done + rest duration.
- Countdown:
  - 10
  - 3
  - 2
  - 1
  - 0
- Exercise change.
- Rest overtime reminder.
- Completion summary v1.
- Exercise-specific cue library.

### Cách triển khai

- `getCoachingCue(for:name:)` chọn cue từ:
  1. exercise-specific cues
  2. category cues
  3. generic cues

- `WorkoutSession` gọi cue sau vài giây đầu của set active.

### Ghi chú hiện trạng

- Đây vẫn là “voice coach v1.5”.
- Chưa đạt mức script pool phong phú / varied như backlog mong muốn.

---

## 4.6 Completion

### Mục tiêu

Cho user thấy kết quả cuối buổi đủ thật để đáng lưu và quay lại.

### File chính

- `foxy gym/Views/CompletionView.swift`
- `foxy gym/ViewModels/WorkoutSession.swift`
- `foxy gym/Core/CalorieEngine.swift`

### Đã có

- Time.
- Calories.
- Số bài / số set.
- Total lifted weight.
- Planned rest vs actual rest.
- Verdict cơ bản.
- Save workout.
- Voice summary cuối buổi.

### Cách triển khai

- `WorkoutSession.restLogs` là nguồn cho rest report.
- `WorkoutSession.totalLiftedWeight` cộng từ exercises hiện tại.
- Save workout đi qua `PersistenceStore`.

### Ghi chú hiện trạng

- Completion report đã truthful hơn HTML cũ, nhưng vẫn có thể mở rộng copy và insight.

---

## 4.7 Saved Workouts

### Mục tiêu

Cho user lưu buổi tập và tái sử dụng nhanh.

### File chính

- `foxy gym/Views/SavedWorkoutsView.swift`
- `foxy gym/Models/SavedWorkout.swift`
- `foxy gym/Core/PersistenceStore.swift`

### Đã có

- Hiển thị real saved data.
- Delete.
- Tập lại qua full screen flow.
- Hook v1 với quick workout / change workout.

### Cách triển khai

- JSON persistence qua `UserDefaults`.
- `SavedWorkout` lưu snapshot đủ dùng cho local replay.

### Ghi chú hiện trạng

- Flow load-back vào quick workout vẫn còn backlog polish.

---

## 4.8 Profile

### Mục tiêu

Lưu các preference cá nhân để app dùng làm default và cá nhân hoá.

### File chính

- `foxy gym/Views/ProfileView.swift`
- `foxy gym/Models/UserProfile.swift`
- `foxy gym/Core/PersistenceStore.swift`

### Đã có

- Đủ field chính từ HTML.
- Lưu / load local.
- Dùng weight thật cho calorie engine.

### Cách triển khai

- `UserProfile` được encode/decode JSON.
- `PersistenceStore.profile` là single source of truth local.

### Ghi chú hiện trạng

- Layout/copy chưa polish hoàn toàn theo HTML.
- Avatar initials live update vẫn còn backlog.
- Goal chưa được wire vào quick workout suggestion thật.

---

## 4.9 PT Booking

### Mục tiêu

Cho user đặt PT theo giờ, xem lịch riêng từng PT, nhìn rõ slot mở / slot đã book / slot khoá.

### File chính

- `foxy gym/Views/PTBookingView.swift`
- `foxy gym/Core/PTAvailabilityEngine.swift`
- `foxy gym/Models/PTProfile.swift`
- `foxy gym/Core/PersistenceStore.swift`

### Đã có

- 3 tab:
  - Booking
  - Buổi tập
  - My PTs
- `My PTs`:
  - tất cả
  - yêu thích
  - specialty filters
- `Mở Booking` từ PT card để focus lịch riêng PT.
- Booking mặc định theo giờ.
- Date chips 14 ngày.
- Timeline 06:00 → 22:00.
- Step 15 phút.
- Duration 30 → 150 phút, step 15.
- Slot states:
  - available
  - booked
  - locked
- Date states:
  - mở
  - kín
  - khóa
- Booking confirmation overlay.
- Success overlay.
- Local persistence cho booking và favorite PT.
- Resize handle v1 trên timeline:
  - kéo mép trên
  - kéo mép dưới

### Cách triển khai

- `PTAvailabilityEngine` chứa:
  - mock PT profiles
  - recurring schedules
  - availability check
  - overlap detection
  - timeline slot generation
  - slot visual status

- `PTBookingView` dùng 2 chế độ ngầm:
  - booking theo giờ cho toàn bộ PT
  - booking focused PT khi đi từ `My PTs`

- Confirm booking có local re-check trước khi save để tránh stale slot trong cùng device state.

### Ghi chú hiện trạng

- Chưa có backend sync nhiều thiết bị.
- Chưa có authoritative slot locking realtime.
- Resize kiểu Outlook mới ở mức local SwiftUI interaction.

---

## 4.10 My Gym

### Mục tiêu

Tạo một module “membership / ecosystem access” đủ dùng bằng mock data:

- Vé tập QR.
- Danh sách phòng gym.
- Danh sách lớp tập.
- Chọn gym chính.
- Giữ chỗ lớp.

### File chính

- `foxy gym/Views/MyGymView.swift`
- `foxy gym/Models/GymPass.swift`
- `foxy gym/Core/PersistenceStore.swift`

### Đã có

- 3 tab:
  - Vé tập
  - Phòng tập
  - Lớp tập
- QR vé tập.
- Daily blink seal anti-screenshot.
- Member summary.
- Gym discovery mock:
  - gần tôi
  - quận
  - 24/7
  - giá thấp
- Chọn gym chính local.
- Class discovery mock.
- Join / cancel class local.
- Seats local.
- Khu “Lớp của tôi”.
- QR payload phản ánh home gym + joined classes.

### Cách triển khai

- `PersistenceStore` lưu:
  - `homeGymId`
  - `joinedGymClassIds`

- `MyGymView` dùng mock arrays cho gym và class.
- QR render qua `CIQRCodeGenerator`.
- Anti-screenshot seal đổi theo day seed.

### Ghi chú hiện trạng

- Chưa có seat sync multi-user.
- Chưa có membership backend thật.
- Chưa có location thật.

---

## 4.11 System Quality

### Mục tiêu

Làm runtime đủ tin cậy cho app tập luyện trên mobile.

### File chính

- `foxy gym/FoxyGymApp.swift`
- `foxy gym/ViewModels/WorkoutSession.swift`
- `foxy gym/Core/RestNotificationManager.swift`
- `foxy gym/Core/WorkoutGenerator.swift`
- `foxy gymTests/WorkoutGeneratorTests.swift`

### Đã có

- `ScenePhase` resume sync timer.
- Audio session `.playback` + bỏ ducking.
- Local notification cho rest overtime.
- Deterministic generation path cho test.
- Test scaffold bằng `Testing`.

### Cách triển khai

- `FoxyGymApp` giữ shared objects và scene lifecycle.
- `WorkoutSession.handleScenePhaseChange(_:)` xử lý background/foreground.
- `RestNotificationManager` schedule/cancel notification request.
- `WorkoutGenerator` hỗ trợ seeded RNG.

### Ghi chú hiện trạng

- Test file đã có nhưng workspace hiện chưa lộ rõ test target riêng trong context.

---

## 5. Mapping file -> trách nhiệm

## 5.1 Core

- `Core/Theme.swift`
  - design token

- `Core/CalorieEngine.swift`
  - estimate calories

- `Core/InsightEmitter.swift`
  - analytics stub

- `Core/PersistenceStore.swift`
  - local persistence store

- `Core/PTAvailabilityEngine.swift`
  - PT mock data + scheduling logic

- `Core/RestNotificationManager.swift`
  - local notification

- `Core/VoiceCoachManager.swift`
  - TTS / cue / script selection

- `Core/WorkoutGenerator.swift`
  - workout generation engine

## 5.2 Models

- `Models/Exercise.swift`
  - editable exercise unit

- `Models/GymPass.swift`
  - membership pass model base

- `Models/PTProfile.swift`
  - PT profile + PT booking

- `Models/SavedWorkout.swift`
  - saved workout snapshot

- `Models/UserProfile.swift`
  - user preference model

## 5.3 ViewModels

- `ViewModels/WorkoutSession.swift`
  - session engine / VM hybrid

## 5.4 Views

- `Views/HomeLandingView.swift`
  - home hero / navigation

- `Views/HomeOverviewView.swift`
  - summary dashboard

- `Views/MainTabView.swift`
  - app shell tabs

- `Views/QuickWorkoutView.swift`
  - quick workout setup

- `Views/ExerciseRow.swift`
  - editable exercise row

- `Views/ChangeWorkoutView.swift`
  - change workout flow

- `Views/ActiveWorkoutView.swift`
  - active training UI

- `Views/ExerciseGuidanceView.swift`
  - guidance / instruction screen

- `Views/CompletionView.swift`
  - end session report

- `Views/SavedWorkoutsView.swift`
  - saved list

- `Views/ProfileView.swift`
  - profile editor

- `Views/PTBookingView.swift`
  - PT booking ecosystem

- `Views/MyGymView.swift`
  - gym ecosystem

---

## 6. Persistence hiện tại

Đều đi qua `UserDefaults` JSON hoặc primitive array/string.

### Keys đang dùng

- `userProfile`
- `savedWorkouts`
- `ptBookings`
- `favoritePTIds`
- `joinedGymClassIds`
- `homeGymId`

### Ý nghĩa

- Phù hợp cho MVP/local mock.
- Không phù hợp cho:
  - sync nhiều thiết bị
  - conflict resolution nhiều user
  - authoritative booking
  - seat inventory thật

---

## 7. Voice, audio, timer và background behavior

## 7.1 Audio

- Dùng `AVAudioSession` category `.playback`
- Có `.mixWithOthers`
- Không còn `.duckOthers`

Mục tiêu:

- chạy được khi silent mode
- không làm voice coach bị mute ngẫu nhiên

## 7.2 Timer

Không dùng logic “tick count là nguồn chân lý”.

Nguồn chân lý là:

- `workoutStartTime`
- `setStartTime`
- `restStartTime`
- `restTargetTime`

Khi app resume:

- recalc elapsed
- recalc rest remaining
- update UI ngay

## 7.3 Notifications

Khi app background lúc đang rest:

- schedule 1 local notification khi rest kết thúc
- khi user quay lại hoặc skip rest:
  - cancel pending notification

---

## 8. Testing strategy hiện tại

## 8.1 Đã có

- `WorkoutGenerator` deterministic path.
- Test scaffold:
  - `foxy gymTests/WorkoutGeneratorTests.swift`

## 8.2 Mục tiêu test lâu dài

- Generator:
  - deterministic output
  - time budget sanity
  - intensity transform sanity

- Session:
  - phase transition
  - rest overtime handling
  - resume sync

- PT:
  - overlap logic
  - slot status mapping

- My Gym:
  - joined seat math
  - home gym persistence

## 8.3 Ghi chú thực tế

Test target chưa hiện rõ trong workspace context hiện tại.  
Tức là code test đã có hướng đúng, nhưng nếu project chưa có test target thật thì cần add/wire target trong Xcode để chạy chính thức.

---

## 9. Mock data sources

Nguồn gốc dữ liệu mock hiện tại:

- `Source from html/exercises.js`
  - exercise library

- `Source from html/workout-generator.js`
  - workout types / intensity logic

- `Source from html/pt-data.js`
  - PT profiles / recurring availability

- `Source from html/index.html`
  - structure / flow / naming / module intent

- `Source from html/styles.css`
  - visual direction / spacing / card language / color usage

---

## 10. Những gì còn thiếu thật sự

Đây là phần quan trọng nhất để tránh hiểu sai rằng app đã “xong hết”.

## 10.1 Product / UX gaps

- Profile polish theo HTML chưa hoàn toàn xong.
- Goal chưa drive quick workout suggestion thật.
- Voice coach chưa đủ phong phú.
- Saved workout load-back vẫn còn chỗ cần polish.

## 10.2 Backend / platform gaps

- PT booking sync nhiều thiết bị.
- Realtime PT slot locking.
- My Gym membership backend thật.
- Class seat sync nhiều user.
- Location discovery thật.
- Analytics backend thật.

## 10.3 Testing / infra gaps

- Test target cần được wire rõ nếu chưa tồn tại.
- Chưa có broader automated coverage cho session/PT/My Gym.

---

## 11. Đề xuất đọc tài liệu này

Nếu là dev mới vào project:

1. Đọc mục 2 để hiểu kiến trúc tổng.
2. Đọc mục 4 để nắm toàn bộ feature map.
3. Đọc mục 5 để biết file nào chịu trách nhiệm gì.
4. Đọc mục 10 để biết còn backlog thật sự là gì.
5. Sau đó mở [Foxy Brain.md](../../Foxy%20Brain.md) để xem trạng thái phase/task.

---

## 12. Kết luận

Foxy Gym SwiftUI hiện không còn là bản “proof of concept” đơn giản nữa. App đã có:

- luồng workout end-to-end,
- rest/voice/session runtime khá hoàn chỉnh,
- PT booking local flow nhiều chiều,
- My Gym ecosystem local flow,
- scenePhase + notification + audio handling cơ bản đúng cho mobile,
- testability path cho generator.

Phần còn lại chủ yếu không còn là “thiếu màn hình”, mà là:

- polish parity,
- backend truth,
- realtime sync,
- test infrastructure hoàn chỉnh.
