# Foxy Gym - Developer Blueprint & System Design

Tài liệu này mô tả cách team developer cần hiểu, thiết kế và xây dựng Foxy Gym từ prototype hiện tại thành một nền tảng fitness marketplace có khả năng chạy experiment liên tục. Nội dung tổng hợp từ prototype trong folder `iphone-timer`, PRD hiện có, SwiftUI migration guide, implementation plans, tài liệu `Foxy_Gym_Blueprint.pdf` được đính kèm, và nguyên tắc kiến trúc "learning velocity first".

## 1. Tầm nhìn sản phẩm

Foxy Gym là nền tảng 3 bên kết nối:

- User: người tập cần công cụ tự tập, nhắc nghỉ, voice coach, tìm PT, mua vé gym/lớp tập.
- PT: huấn luyện viên tự do cần quản lý lịch, nhận booking, theo dõi học viên, bán gói tập.
- Gym partner: phòng tập cần bán vé/lớp, check-in bằng QR động, chống gian lận, xem thống kê khách.

Chiến lược sản phẩm bắt đầu bằng một công cụ miễn phí có giá trị cao: Quick Workout + Voice Coach Timer. Khi user đã có thói quen sử dụng, app mở rộng sang booking PT, vé gym, lớp tập, package, thanh toán, CRM và marketplace.

Triết lý UX:

- 1-click to start: user phải bắt đầu buổi tập nhanh nhất có thể.
- Ít màn hình, nhiều ngữ cảnh đúng lúc: thông tin quan trọng phải nằm trong 1-2 màn hình.
- Premium but direct: dark mode, orange accent, micro-interaction, glassmorphism, nhưng không trang trí dư.
- Simplicity: giảm lựa chọn dư, gom hành động theo nhóm, dùng linh vật cáo như tín hiệu hướng dẫn và nhận diện, không biến linh vật thành nhiễu.

## 2. Nguyên tắc kiến trúc cốt lõi

Metric duy nhất để đo chất lượng kiến trúc là learning velocity: thời gian từ lúc có hypothesis đến lúc có kết quả đo được trên production users.

Điều này có nghĩa là dev team không chỉ build app. Dev team build platform và primitives để non-tech operators và AI có thể tự tạo, cấu hình, deploy biến thể sản phẩm mà không cần dev intervention.

Các luật thiết kế bắt buộc:

1. Config over code: hành vi có thể thay đổi thì phải nằm trong config, không hardcode.
2. Schema-first: mỗi module phải có config schema trước khi implement.
3. Emit, don't assume: mọi user-facing action phải emit structured event ngay từ đầu.
4. Blast radius control: mọi config rollout phải có targeting rules, percentage, allowlist hoặc segment.
5. Operator autonomy: nếu operator cần dev để đổi nội dung, timing, tone, layout variant hoặc targeting, cần xem lại thiết kế.

## 3. Kiến trúc hệ thống tổng quan

Foxy Gym nên được xây như một config-driven runtime gồm 5 lớp:

1. Client Apps
   - iOS SwiftUI app là hướng production ưu tiên vì cần background timer và background audio.
   - Web prototype hiện tại dùng để validate flow, copy, UI, và experiment nhanh.
   - Future: Android app, PT app, Gym check-in app, Gym web portal.

2. Digital Twin Layer
   - Lớp runtime nằm giữa UI và business logic.
   - Resolve module variant theo user context, experiment config, feature flags, remote config.
   - Mỗi user có thể nhìn thấy một version khác nhau của cùng module.
   - Không để UI gọi thẳng hardcoded behavior nếu behavior đó cần thử nghiệm.

3. Domain Modules
   - Workout Library
   - Workout Generator
   - Voice Coach
   - Timer/Session Engine
   - PT Booking
   - Gym Pass/QR Check-in
   - Notifications
   - Rewards/Gamification
   - Profile/Preferences
   - Payment/Packages

4. Insight Pipeline
   - Thu thập structured events từ từng module.
   - Surface actionable signals gần realtime: churn risk, drop-off point, rest overtime pattern, PT booking intent, feature adoption.
   - Output đi vào dashboard hoặc tự động trigger experiment.

5. Experiment Pipeline
   - Nhận hypothesis từ operator, AI hoặc Insight Pipeline.
   - Tạo config, validate schema, set targeting rules, rollout percentage, đo metric, tự đánh giá kết quả.
   - Kết quả experiment quay lại Insight Pipeline tạo closed loop.

## 4. Digital Twin Layer

Digital Twin Layer là abstraction quan trọng nhất để đạt learning velocity. Mục tiêu là tách app behavior khỏi code release.

Runtime flow:

1. Client gửi `user_context` khi mở app hoặc khi vào module.
2. Config service trả về `resolved_experience`.
3. Module runtime render UI hoặc chạy logic theo config đã resolve.
4. Module tự emit events theo schema của nó.
5. Experiment evaluator đọc events và tính metric.

Ví dụ `user_context`:

```json
{
  "user_id": "u_123",
  "locale": "vi-VN",
  "platform": "ios",
  "app_version": "1.5.0",
  "fitness_goal": "build_muscle",
  "experience_level": "intermediate",
  "preferred_duration_min": 60,
  "gym_id": "gym_001",
  "segments": ["new_user", "quick_workout_active"]
}
```

Ví dụ `resolved_experience`:

```json
{
  "config_version": "2026-04-24.001",
  "modules": {
    "quick_workout": {
      "variant_id": "qw_simple_fox_v2",
      "config_ref": "cfg_qw_abc"
    },
    "voice_coach": {
      "variant_id": "voice_strict_rest_nudge",
      "config_ref": "cfg_voice_123"
    }
  },
  "experiments": [
    {
      "experiment_id": "exp_qw_start_cta_001",
      "variant_id": "cta_fox_large",
      "allocation_id": "alloc_789"
    }
  ]
}
```

Không module nào tự quyết định variant bằng if/else hardcoded. Tất cả variant phải đi qua resolver.

## 5. Hai pipeline song song

### 5.1 Insight Pipeline

Mục tiêu: biến user behavior thành tín hiệu hành động.

Input:

- Event từ app: screen view, workout started, set completed, rest skipped, rest overtime, PT searched, PT favorited, gym pass opened.
- Context: user profile, device, locale, active experiment, module config version.
- Business data: booking, payment, pass usage, retention cohort.

Processing:

- Stream ingestion: API event collector hoặc SDK.
- Event validation: reject hoặc quarantine event sai schema.
- Sessionization: gom event thành workout session, booking journey, gym pass journey.
- Signal extraction:
  - User bỏ app sau màn setup nhiều lần.
  - User nghỉ quá lâu giữa set.
  - User bấm PT nhưng không đặt lịch.
  - User mở QR nhưng không check-in.
  - User dùng voice coach nhiều hơn nhóm không voice.

Output:

- Dashboard cho operator.
- Alert cho team.
- Trigger tự động tạo experiment suggestion.
- Segment update, ví dụ `rest_overtime_high`, `pt_booking_intent`, `churn_risk_7d`.

### 5.2 Experiment Pipeline

Mục tiêu: từ hypothesis đến kết quả production nhanh nhất.

Input:

- Operator tạo experiment từ dashboard.
- AI tạo config từ natural language.
- Insight Pipeline đề xuất experiment.

Lifecycle:

1. Define hypothesis.
2. Generate config variants.
3. Validate schema và safety rules.
4. Set targeting: segment, percentage, allowlist, platform, version.
5. Deploy config, không cần app release.
6. Collect metric theo experiment.
7. Evaluate result.
8. Promote, rollback hoặc iterate.

Ví dụ hypothesis:

> User mới sẽ bắt đầu buổi tập nhiều hơn nếu Quick Workout screen chỉ hiển thị 3 bài đầu, một CTA lớn và linh vật cáo hướng dẫn.

Primary metric:

- `quick_workout_start_rate`

Guardrail metrics:

- crash-free sessions
- rage tap count
- time to first start
- workout completion rate

## 6. Modular Architecture

Mỗi module bắt buộc có 4 thành phần:

1. Config schema
   - Định nghĩa toàn bộ parameter operator/AI được phép thay đổi.
   - Là contract giữa module và Experiment Pipeline.

2. Runtime resolver
   - Nhận config + user context.
   - Trả variant đúng cho user đúng.

3. Metrics emitter
   - Module tự emit structured events.
   - Không phụ thuộc global analytics mơ hồ.

4. Independent deployability
   - Có thể rollout/rollback config hoặc module riêng.
   - Không ảnh hưởng module khác.

### 6.1 Workout Module

Chức năng:

- Quản lý exercise library.
- Generate workout theo type, duration, intensity, add-ons.
- Cho phép edit workout trước và trong buổi tập.
- Support saved workouts.

Prototype hiện tại:

- `exercises.js`: `EXERCISE_LIBRARY`, `CATEGORIES`, `PROGRESSION_RULES`.
- `workout-generator.js`: `WORKOUT_TYPES`, `INTENSITY_LEVELS`, `generateWorkout`, `applyIntensity`.
- `app.js`: Quick Workout preview, setup list, drag/drop, picker, swap modal.

Schema đề xuất:

```json
{
  "module": "workout",
  "schema_version": "1.0",
  "config": {
    "workout_types": [
      {
        "id": "chest-day",
        "name": "Chest Day",
        "subtitle": "Nguc + Tay sau",
        "categories": ["Chest", "Triceps"],
        "primary_category": "Chest"
      }
    ],
    "duration_options_min": [30, 45, 60, 90],
    "intensity_levels": [
      {
        "id": "intermediate",
        "sets_mod": 1.0,
        "reps_mod": 1.0,
        "rest_mod": 1.0,
        "weight_mod": 1.0
      }
    ],
    "addons": {
      "core": { "enabled": true, "time_budget_sec": 300 },
      "warmup": { "enabled": true, "time_budget_sec": 240 },
      "cooldown": { "enabled": false, "time_budget_sec": 240 }
    },
    "targeting": {
      "segments": ["all"],
      "percentage": 10,
      "allowlist_user_ids": []
    }
  }
}
```

Events:

- `workout_preview_viewed`
- `workout_generated`
- `workout_type_changed`
- `workout_duration_changed`
- `workout_intensity_changed`
- `workout_addon_toggled`
- `exercise_added`
- `exercise_removed`
- `exercise_swapped`
- `exercise_reordered`
- `workout_started`
- `workout_completed`
- `workout_abandoned`

### 6.2 Timer/Session Module

Chức năng:

- Quản lý phase: idle, training, resting, complete.
- Tính elapsed time bằng timestamp để survive background/resume.
- Track set, exercise index, completion, rest overtime.

Prototype hiện tại:

- `app.js`: `trainingStartTime`, `restStartTime`, `workoutElapsedBase`, `workoutStartTime`, `appPhase`.
- Active screen, rest screen, complete screen.

Production requirements:

- Native iOS dùng SwiftUI + background audio mode.
- Timer không dựa hoàn toàn vào interval. Luôn compute từ `Date`.
- Session state phải persist local để app resume không mất buổi tập.
- Không để modal guidance/edit làm pause timer.

Events:

- `training_phase_entered`
- `set_completed`
- `rest_started`
- `rest_countdown_warning`
- `rest_skipped`
- `rest_overtime_started`
- `rest_overtime_nudge_played`
- `session_resumed`
- `session_completed`

### 6.3 Voice Coach Module

Chức năng:

- Đọc tên bài.
- Nhắc nghỉ còn 10 giây.
- Nudge khi rest overtime.
- Coaching cues theo exercise.
- Tương lai: AI-generated coaching scripts, nhiều tone khác nhau.

Prototype hiện tại:

- `app.js`: `EXERCISE_CUES`, `GENERIC_CUES`, `REST_MSGS`, `speak`, FPT.AI TTS integration.

Schema đề xuất:

```json
{
  "module": "voice_coach",
  "schema_version": "1.0",
  "config": {
    "enabled": true,
    "provider": "native_ios_tts",
    "locale": "vi-VN",
    "voice_tone": "strict_but_friendly",
    "rest_warning_seconds": [10],
    "overtime_nudge_interval_sec": 10,
    "cue_strategy": "exercise_specific_then_generic",
    "scripts": {
      "start_workout": "Bat dau tap nao.",
      "rest_done": "Het gio nghi roi, quay lai tap thoi.",
      "overtime_nudge": "Dung nghi lau qua, tiep tuc nao."
    },
    "targeting": {
      "segments": ["voice_enabled"],
      "percentage": 100
    }
  }
}
```

Events:

- `voice_prompt_requested`
- `voice_prompt_started`
- `voice_prompt_completed`
- `voice_prompt_failed`
- `voice_prompt_interrupted`

### 6.4 PT Booking Module

Chức năng:

- User chọn thời gian rảnh, app tìm PT available.
- User chọn PT yêu thích, app tìm slot available.
- Timeline calendar kiểu Outlook.
- Favorite PT.
- My Training.
- My PTs.
- Confirm booking.

Prototype hiện tại:

- `pt-data.js`: `PT_PROFILES`, `PT_SCHEDULES`, `getAvailablePTs`, `bookPTSlot`.
- `app.js`: `screen-pt-booking`, timeline, tab booking/training/mypts, favorite.

Production requirements:

- Backend availability service là nguồn sự thật.
- Booking phải dùng transaction để tránh double-book.
- PT app/portal cập nhật schedule, block date, accept/reschedule.
- Pricing tính theo duration, PT tier, gym location, package.

Schema đề xuất:

```json
{
  "module": "pt_booking",
  "schema_version": "1.0",
  "config": {
    "default_duration_min": 60,
    "slot_granularity_min": 15,
    "timeline_range": { "start_hour": 5, "end_hour": 22 },
    "booking_tabs": ["booking", "my_training", "my_pts"],
    "filters": ["location", "price", "experience", "gender", "specialty", "rating"],
    "favorite_enabled": true,
    "targeting": {
      "segments": ["pt_intent"],
      "percentage": 100
    }
  }
}
```

Events:

- `pt_booking_screen_viewed`
- `pt_date_selected`
- `pt_slot_selected`
- `pt_search_submitted`
- `pt_result_viewed`
- `pt_favorited`
- `pt_booking_confirm_opened`
- `pt_booking_confirmed`
- `pt_booking_failed`

### 6.5 Gym Pass & Check-in Module

Chức năng:

- Hiển thị vé tập digital.
- QR động.
- Anti-screenshot bằng hình/animation thay đổi.
- Danh sách gym.
- Danh sách lớp: spinning, dance, yoga, boxing.
- Future: app scan QR cho gym.

Prototype hiện tại:

- `screen-my-gym` trong `index.html`.
- `enterMyGym`, `drawQRCanvas`, mock gym/class data trong `app.js`.

Production requirements:

- QR phải là token ngắn hạn, ký server-side.
- Token có TTL, nonce, membership id, gym id, device id.
- Gym scanner verify token realtime hoặc near-realtime.
- Anti-screenshot chỉ là deterrent, security thật nằm ở dynamic token + server validation.

Events:

- `gym_pass_opened`
- `qr_token_generated`
- `qr_token_refreshed`
- `gym_checked_in`
- `gym_checkin_failed`
- `gym_list_viewed`
- `class_list_viewed`
- `class_join_clicked`

### 6.6 Notification Module

Chức năng:

- Nhắc tập.
- Nhắc quay lại nếu bỏ dở.
- Nhắc PT booking.
- Nhắc vé/lớp sắp hết hạn.

Config phải cho phép operator đổi copy, timing, segment, frequency cap mà không cần deploy.

Events:

- `notification_scheduled`
- `notification_sent`
- `notification_opened`
- `notification_dismissed`
- `notification_converted`

### 6.7 Rewards/Gamification Module

Chức năng:

- Streak.
- Badge.
- Completion celebration.
- Reward khi hoàn thành workout hoặc check-in.

Lưu ý: gamification phải được experiment cẩn thận. Không hardcode rule vì mỗi segment có thể phản ứng khác nhau.

## 7. AI Integration Points

AI chưa phải feature chính cho end-user. Giai đoạn đầu, AI là tooling cho operators.

Use cases:

- Generate workout variants từ intent: "tạo 10 chest day variants cho beginner, 45 phút, ít máy".
- Generate coaching scripts theo tone: nghiêm, vui, tối giản, PT style.
- Generate notification copy theo segment.
- Analyze experiment result và suggest next experiment.
- Auto-create config objects từ natural language.

Dev team cần build:

- Config generation API.
- Schema validator.
- Safety validator.
- Preview/sandbox runner.
- Approval workflow.
- Rollback mechanism.

AI-generated config không được deploy thẳng production nếu thiếu:

- schema validation pass
- targeting rules
- rollout percentage
- metric definition
- guardrail metrics
- owner/operator approval

## 8. Data & Event Model

Mọi event phải có envelope chung:

```json
{
  "event_id": "evt_123",
  "event_name": "workout_started",
  "occurred_at": "2026-04-24T12:00:00Z",
  "user_id": "u_123",
  "anonymous_id": "anon_456",
  "session_id": "sess_789",
  "platform": "ios",
  "app_version": "1.5.0",
  "module": "workout",
  "module_version": "1.0.0",
  "config_version": "cfg_20260424_001",
  "experiment_id": "exp_qw_001",
  "variant_id": "simple_fox",
  "properties": {}
}
```

Event rules:

- Không emit free-form blob nếu có thể schema hóa.
- Event phải có `module`, `config_version`, `variant_id`.
- Event phải đủ để reconstruct journey.
- Không log PII không cần thiết.
- Health data cần encryption và data retention rõ ràng.

## 9. Backend Services cần xây

### 9.1 Auth & Identity

- Email/phone/social login.
- Anonymous user upgrade path.
- Role: user, PT, gym_operator, admin, operator.
- Device identity để bảo vệ QR và push notification.

### 9.2 Config Service

- Lưu module configs.
- Versioning.
- Schema validation.
- Targeting rules.
- Rollout percentage.
- Kill switch.
- Audit log.

### 9.3 Experiment Service

- Experiment definition.
- Variant allocation.
- Consistent bucketing.
- Metric registry.
- Evaluation result.
- Promote/rollback.

### 9.4 Event Collector

- API ingest events từ client.
- Validate event schema.
- Batch support.
- Retry-safe idempotency.
- Route vào warehouse/stream.

### 9.5 Workout Service

- Exercise library.
- Workout plans.
- Saved workouts.
- User performance history.
- Progression rules.

### 9.6 PT Booking Service

- PT profiles.
- Availability.
- Booking transaction.
- Calendar sync.
- Pricing.
- Cancellation/reschedule.
- Packages.

### 9.7 Gym Service

- Gym profiles.
- Pass products.
- QR token issue/verify.
- Class schedule.
- Class capacity.
- Check-in log.

### 9.8 Payment Service

- Stripe/Apple Pay/VNPay/MoMo tùy thị trường.
- Escrow cho PT booking.
- Revenue split PT/Gym/platform.
- Refund/cancellation.
- Invoice/receipt.

### 9.9 Notification Service

- Push token management.
- Campaign config.
- Frequency cap.
- Segment targeting.
- Conversion tracking.

## 10. Client App Flow

### 10.1 Home

Mục tiêu:

- Dẫn user đến 3 hành động chính: Tập ngay, Tập với PT, Phòng Gym của tôi.
- Hiển thị profile avatar global.
- Không làm home thành landing page dài.

Events:

- `home_viewed`
- `home_quick_workout_clicked`
- `home_pt_clicked`
- `home_gym_clicked`
- `profile_opened`

### 10.2 Quick Workout

Flow:

1. User mở Tập ngay.
2. Runtime resolver lấy config variant.
3. Generate workout theo duration/intensity/add-ons.
4. User đổi duration, intensity, core/warmup.
5. User xem preview, add/swap/reorder nếu cần.
6. User bấm bắt đầu.

Current prototype screens:

- `screen-quick-workout`
- `screen-change-workout`
- `screen-setup`
- picker modal
- swap modal
- guidance modal

Future production:

- Quick Workout phải load từ config.
- Exercise copy, order, CTA, mascot placement đều có thể experiment.
- Saved workout phải sync account, không chỉ localStorage.

### 10.3 Active Workout

Flow:

1. Enter training phase.
2. Voice coach phát cue.
3. User hoàn thành set.
4. Enter rest phase.
5. Timer cảnh báo còn 10 giây.
6. Nếu nghỉ quá lâu, nudge định kỳ.
7. User skip hoặc hết nghỉ, qua set/bài tiếp theo.
8. Complete session, xem summary.

Critical:

- Timer phải chính xác khi app background.
- Voice phải phát được khi lock screen.
- Edit panel không pause timer.

### 10.4 PT Booking

Flow A - user có giờ rảnh:

1. Chọn ngày/slot trên timeline.
2. App tìm PT available.
3. User xem giá, chuyên môn, rating.
4. Favorite hoặc booking.
5. Confirm, payment hoặc hold slot.

Flow B - user có PT yêu thích:

1. Vào My PTs.
2. Chọn PT.
3. Xem available slots.
4. Book.

### 10.5 My Gym

Flow:

1. User mở vé tập.
2. App request QR token.
3. Hiển thị QR động.
4. Gym scanner verify.
5. Check-in thành công hoặc thất bại.

## 11. Operator Console

Operator Console là sản phẩm nội bộ để tăng learning velocity.

Các màn hình cần có:

- Insight dashboard: retention, workout start rate, completion rate, PT intent, QR usage.
- Experiment dashboard: active experiments, allocation, metrics, guardrails.
- Config editor: chỉnh module config theo schema.
- AI assistant panel: nhập intent tự nhiên, generate config.
- Approval queue: review config trước rollout.
- Rollback center: disable config/experiment ngay.
- Segment builder: tạo segment từ behavior.

Operator không nên cần dev cho các việc:

- Đổi text CTA.
- Đổi voice coach script.
- Thử layout Quick Workout khác.
- Thử rest timer style khác.
- Thử notification copy.
- Thử targeting cho nhóm user mới.
- Tạo workout variants.

## 12. Database gợi ý

PostgreSQL:

- users
- user_profiles
- exercises
- workout_templates
- workout_sessions
- workout_session_events
- pt_profiles
- pt_schedules
- bookings
- gyms
- gym_passes
- gym_classes
- checkins
- payments
- module_configs
- config_versions
- experiments
- experiment_allocations
- event_schemas

Redis:

- QR token cache.
- Feature/config cache.
- Short-lived booking holds.
- Rate limits.

Object storage:

- PT avatars.
- Mascot assets.
- Generated content previews.
- Exported reports.

Warehouse:

- Raw events.
- Sessionized events.
- Experiment metrics.
- Cohorts.

## 13. API Contracts tối thiểu

Config resolution:

```http
POST /v1/config/resolve
```

Input:

```json
{
  "user_context": {},
  "requested_modules": ["quick_workout", "voice_coach", "pt_booking"]
}
```

Output:

```json
{
  "modules": {},
  "experiments": [],
  "ttl_sec": 300
}
```

Event ingest:

```http
POST /v1/events/batch
```

Workout generation:

```http
POST /v1/workouts/generate
```

PT search:

```http
POST /v1/pt/search-availability
```

Booking:

```http
POST /v1/bookings
```

QR issue:

```http
POST /v1/gym-passes/{pass_id}/qr-token
```

QR verify:

```http
POST /v1/gym/checkins/verify
```

## 14. Native iOS/SwiftUI build notes

Production iOS app cần ưu tiên native vì:

- Background timer.
- Background TTS/audio.
- Push notification.
- Better device integration.

SwiftUI structure gợi ý:

```text
FoxyGymApp/
  App/
  Core/
    Config/
    Analytics/
    Experiments/
    Networking/
    Persistence/
  Modules/
    Workout/
    TimerSession/
    VoiceCoach/
    PTBooking/
    GymPass/
    Profile/
    Notifications/
  DesignSystem/
  OperatorPreview/
```

Core classes:

- `ConfigResolver`
- `ExperimentAllocator`
- `EventEmitter`
- `WorkoutSessionStore`
- `VoiceCoachManager`
- `BackgroundTimerEngine`
- `PTBookingClient`
- `GymPassClient`

iOS requirements:

- Enable Background Modes: Audio, AirPlay, Picture in Picture.
- Configure `AVAudioSession` with playback category.
- Use timestamp-based timer, not interval-only timer.
- Persist active session state on every phase transition.
- Use remote config cache with fallback defaults.

## 15. Migration từ prototype hiện tại

Giai đoạn 0 - Stabilize prototype:

- Fix encoding tiếng Việt trong markdown/html/js.
- Tách `app.js` thành module files.
- Chuẩn hóa events trong prototype.
- Thêm config JSON local để giả lập Digital Twin Layer.

Giai đoạn 1 - Backend foundation:

- Auth.
- Config Service.
- Event Collector.
- Workout Service.
- PT Booking Service mock-to-real.
- Gym QR token service.

Giai đoạn 2 - Native app MVP:

- SwiftUI app.
- Quick Workout native.
- Background Timer + Voice Coach.
- PT booking search.
- My Gym QR.
- Event emitting đầy đủ.

Giai đoạn 3 - Operator platform:

- Config dashboard.
- Experiment dashboard.
- AI config generation.
- Segment builder.
- Approval/rollback.

Giai đoạn 4 - Marketplace:

- Payment.
- PT app/portal.
- Gym partner portal.
- Packages.
- CRM.
- Chat/push realtime.

## 16. Acceptance Criteria cho MVP

User app:

- User bắt đầu workout trong dưới 10 giây từ home.
- Timer vẫn đúng sau khi lock/unlock app.
- Voice coach phát được trong background.
- User edit được bài trước và trong buổi tập.
- User tìm được PT theo ngày/giờ.
- User xem được QR pass.
- Mỗi action chính emit event đúng schema.

Platform:

- Operator tạo được config variant không cần dev.
- Config có schema validation.
- Config có targeting và rollout percentage.
- Experiment allocation consistent.
- Dashboard có metric cơ bản cho Quick Workout.
- Rollback config trong dưới 5 phút.

Engineering:

- Module không hardcode behavior cần experiment.
- Mỗi module có config schema.
- Mỗi module có metrics emitter.
- Mỗi API có validation và audit log.
- No global rollout without targeting.

## 17. Việc cần làm ngay cho team developer

1. Chốt schema-first cho 3 module đầu: Workout, Voice Coach, PT Booking.
2. Tạo local config runtime trong prototype để thay hardcoded behavior dần.
3. Thêm event emitter chuẩn vào prototype.
4. Thiết kế Config Service và Experiment Service ở mức API contract.
5. Xây data model PostgreSQL cho users, workouts, sessions, PT schedules, bookings, configs, experiments.
6. Tạo SwiftUI project native cho Background Timer + Voice Coach proof of concept.
7. Xây operator dashboard bản rất nhỏ: xem config, bật/tắt variant, xem event count.
8. Tách mascot/assets/copy thành config để operator và AI thay đổi được.
9. Xây validation layer cho AI-generated configs.
10. Định nghĩa metric đầu tiên: `quick_workout_start_rate` và `workout_completion_rate`.

## 18. Nguyên tắc ra quyết định

Khi có trade-off, chọn theo thứ tự:

1. Tăng learning velocity.
2. Giảm blast radius.
3. Tăng operator autonomy.
4. Giữ module boundary rõ.
5. Giữ UX đơn giản cho user.
6. Tối ưu performance và cost.

Nếu một thay đổi UI/logic giúp học nhanh hơn nhưng có rủi ro cao, không hardcode vào app. Đưa nó vào config, rollout 5-10%, đo guardrails, rồi mới promote.

Nếu một hành vi không đo được, coi như chưa tồn tại trong architecture.

Nếu một module không có schema, coi như chưa sẵn sàng cho production experiments.

