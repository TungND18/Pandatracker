// =====================================================
//  PANDA GYM TRACKER — app.js (v4)
//  Screens: home → quick-workout → setup → active → rest → complete
//  + PT booking, change workout, duration/intensity pickers
// =====================================================

// ── DOM refs ─────────────────────────────────────────
// Screens
const screenHome = document.getElementById('screen-home');
const screenQuickWorkout = document.getElementById('screen-quick-workout');
const screenChangeWorkout = document.getElementById('screen-change-workout');
const screenSetup = document.getElementById('screen-setup');
const screenActive = document.getElementById('screen-active');
const screenRest = document.getElementById('screen-rest');
const screenComplete = document.getElementById('screen-complete');
const screenPtBooking = document.getElementById('screen-pt-booking');
const screenProfile = document.getElementById('screen-profile');
const screenMyGym = document.getElementById('screen-my-gym');
const ALL_SCREENS = [screenHome, screenQuickWorkout, screenChangeWorkout, screenSetup, screenActive, screenRest, screenComplete, screenPtBooking, screenProfile, screenMyGym];

// Home
const btnQuickWorkout = document.getElementById('btn-quick-workout');
const btnBookPT = document.getElementById('btn-book-pt');

// Quick Workout
const qwTitleEmoji = document.getElementById('qw-title-emoji');
const qwTitleName = document.getElementById('qw-title-name');
const qwTitleSub = document.getElementById('qw-title-sub');
const btnQwChangeWorkout = document.getElementById('btn-qw-change-workout');
const btnQwDuration = document.getElementById('btn-qw-duration');
const qwDurationValue = document.getElementById('qw-duration-value');
const btnQwGym = document.getElementById('btn-qw-gym');
const btnQwIntensity = document.getElementById('btn-qw-intensity');
const qwIntensityValue = document.getElementById('qw-intensity-value');
const btnQwCore = document.getElementById('btn-qw-core');
const qwCoreSign = document.getElementById('qw-core-sign');
const btnQwWarmup = document.getElementById('btn-qw-warmup');
const qwWarmupSign = document.getElementById('qw-warmup-sign');
const qwExerciseList = document.getElementById('qw-exercise-list');
const qwEstTime = document.getElementById('qw-est-time');
const btnQwStart = document.getElementById('btn-qw-start');

// Change Workout
const btnCwBack = document.getElementById('btn-cw-back');
const cwTypeGrid = document.getElementById('cw-type-grid');
const cwSavedList = document.getElementById('cw-saved-list');
const btnCwCreateNew = document.getElementById('btn-cw-create-new');

// Duration Modal
const durationModal = document.getElementById('duration-modal');
const durationDisplay = document.getElementById('duration-display');
const durationSlider = document.getElementById('duration-slider');
const durationCancel = document.getElementById('duration-cancel');
const durationConfirm = document.getElementById('duration-confirm');

// Intensity Modal
const intensityModal = document.getElementById('intensity-modal');
const intensityOptions = document.getElementById('intensity-options');

// Setup
const btnSetupBack = document.getElementById('btn-setup-back');
const btnAddExercise = document.getElementById('btn-add-exercise');
const setupListEl = document.getElementById('setup-list');
const btnBeginWorkout = document.getElementById('btn-begin-workout');
const statExercises = document.getElementById('stat-exercises');
const statSets = document.getElementById('stat-sets');
const statEst = document.getElementById('stat-est');

// Active Workout
const activeElapsed = document.getElementById('active-elapsed');
const activeProgressFill = document.getElementById('active-progress-fill');
const activeProgressLabel = document.getElementById('active-progress-label');
const activeTimer = document.getElementById('active-timer');
const activeExercise = document.getElementById('active-exercise');
const activeSetBadge = document.getElementById('active-set-badge');
const detailReps = document.getElementById('detail-reps');
const detailWeight = document.getElementById('detail-weight');
const coachingText = document.getElementById('coaching-text');
const btnFinishSet = document.getElementById('btn-finish-set');

// Rest
const restElapsed = document.getElementById('rest-elapsed');
const restProgressFill = document.getElementById('rest-progress-fill');
const restProgressLabel = document.getElementById('rest-progress-label');
const restTimer = document.getElementById('rest-timer');
const restRingFg = document.getElementById('rest-ring-fg');
const restMotivational = document.getElementById('rest-motivational');
const restNext = document.getElementById('rest-next');
const btnSkipRest = document.getElementById('btn-skip-rest');

// Complete
const cstatSets = document.getElementById('cstat-sets');
const cstatWeight = document.getElementById('cstat-weight');
const cstatTime = document.getElementById('cstat-time');
const completeSub = document.getElementById('complete-sub');
const completeRestReport = document.getElementById('complete-rest-report');
const confettiBurst = document.getElementById('confetti-burst');
const btnSaveWorkout = document.getElementById('btn-save-workout');
const btnGoHome = document.getElementById('btn-go-home');

// Exercise Picker Modal
const pickerModal = document.getElementById('picker-modal');
const pickerClose = document.getElementById('picker-close');
const pickerTabs = document.getElementById('picker-tabs');
const pickerListEl = document.getElementById('picker-list');
const pickerDone = document.getElementById('picker-done');
const pickerCount = document.getElementById('picker-count');

// Save Modal
const saveModal = document.getElementById('save-modal');
const saveNameInput = document.getElementById('save-name-input');
const saveCancel = document.getElementById('save-cancel');
const saveConfirm = document.getElementById('save-confirm');

// PT Booking
const btnPtBack = document.getElementById('btn-pt-back');
const ptCalGrid = document.getElementById('pt-cal-grid');
const ptTimeSection = document.getElementById('pt-time-section');
const ptTimeStart = document.getElementById('pt-time-start');
const ptTimeEnd = document.getElementById('pt-time-end');
const btnFindPT = document.getElementById('btn-find-pt');
const ptResultsSection = document.getElementById('pt-results-section');
const ptResultsLabel = document.getElementById('pt-results-label');
const ptResultsScroll = document.getElementById('pt-results-scroll');
const ptConfirmOverlay = document.getElementById('pt-confirm-overlay');
const ptConfirmIcon = document.getElementById('pt-confirm-icon');
const ptConfirmTitle = document.getElementById('pt-confirm-title');
const ptConfirmDetails = document.getElementById('pt-confirm-details');
const ptConfirmBtns = document.getElementById('pt-confirm-btns');
// Note: ptConfirmCancel and ptConfirmOk are re-created dynamically via innerHTML in openBookingConfirm()
const ptConfirmCancel = null; // placeholder — wired dynamically
const ptConfirmOk = null;     // placeholder — wired dynamically

// Bottom Nav
const bottomNavItems = document.querySelectorAll('.bottom-nav-item');

// Profile Screen
const profileDurationSlider = document.getElementById('profile-duration');
const profileDurationVal = document.getElementById('profile-duration-val');
const profileCoreBtn = document.getElementById('profile-core-btn');
const profileCoreToggle = document.getElementById('profile-core-toggle');
const profileWarmupBtn = document.getElementById('profile-warmup-btn');
const profileWarmupToggle = document.getElementById('profile-warmup-toggle');
const profileStretchingBtn = document.getElementById('profile-stretching-btn');
const profileStretchingToggle = document.getElementById('profile-stretching-toggle');
const btnProfileSave = document.getElementById('btn-profile-save');

// ── State ────────────────────────────────────
let workoutPlan = [];          // [{...exercise, weight, sets, reps, rest}]
let selectedIds = new Set();   // picker selections
let currentExIdx = 0;
let currentSetNum = 1;
let completedSets = 0;
let totalSets = 0;
let ticker = null;             // single 1Hz interval for all timing
let totalElapsedSec = 0;
let activeCat = 'Back';
let speakTimeout = null;
const SEC_PER_REP = 3;
const PROFILE_KEY = 'panda_gym_profiles';
const USER_PREFS_KEY = 'foxy_user_prefs';

// User Profile Preferences
let userPrefs = {
  name: '',
  pronoun: 'Bạn',
  age: '',
  weight: '',
  goal: '',
  experience: 'Intermediate',
  duration: 60,
  wpw: '',
  core: false,
  warmup: false,
  stretching: false
};

// Timestamp-based timing (survives iOS background)
let trainingStartTime = null;  // Date.now() when training screen entered
let restStartTime = null;      // Date.now() when rest screen entered
let workoutElapsedBase = 0;    // total seconds before current phase started
let workoutStartTime = null;

// Nag deduplication: track last second a nag was spoken
let lastNagSetSec = -1;        // for coaching nags during training (every 5s)
let lastOvertimeNagSec = -1;   // for overtime nags during rest (every 10s)
let overtimeAnnouncedOnce = false; // "rest over" one-shot

// One coaching cue per set, no repeats between consecutive sets
let setCueSpoken = false;      // true after cue is spoken this set
let lastCueIdx = -1;           // index of last cue used (prevent repeats)

// Current app phase: 'idle' | 'training' | 'resting'
let appPhase = 'idle';

// Quick Workout state
let qwDurationMin = 60;
let qwIntensityId = 'intermediate';
let qwWorkoutTypeId = null;
let qwAddCore = false;
let qwAddWarmup = false;
let qwGeneratedWorkout = null;
let qwFromSavedProfile = false; // true if loaded from saved profile

// Navigation memory
let setupBackTarget = 'home'; // 'home' | 'quick-workout'

// Rest tracking
let sessionLog = [];

// PT Booking state
let ptSelectedDate = null;       // Date object
let ptSelectedStart = null;      // 'HH:MM' string
let ptSelectedEnd = null;        // 'HH:MM' string
let ptPendingBooking = null;     // { ptId, ptName, date, start, end }

// Exercise-specific coaching cues (keyed by exercise id)
const EXERCISE_CUES = {
  // ─── CHEST ──────────────────────────────────────────
  'barbell-bench':    ["Anh ơi... thẳng tay lên... lưng đặt sát ghế... cùi chỏ hướng ra ngoài anh nhé!!","Hít vào lúc hạ tạ... thở ra lúc đẩy lên... kiểm soát từng nhịp anh nhé!!","Đừng nảy tạ lên ngực... hạ chậm lại... cảm nhận cơ ngực kéo dãn ra!!","Vai ép xuống ghế... không nhún vai lên... giữ ngực luôn căng anh nhé!!","Tay đẩy thẳng lên... khóa khuỷu nhẹ ở đỉnh... tốt lắm, tiếp đi!!"],
  'barbell-bench-s':  ["Anh ơi... single nặng đấy... tập trung... siết core... đẩy bùng nổ lên!!","Hít một hơi thật sâu... giữ hơi... rồi đẩy!! mạnh lên anh!!","Kiểm soát lúc hạ... đừng để tạ rơi tự do... nguy hiểm lắm!!","Vai ép sát ghế... chân đạp mạnh xuống sàn... đẩy hết sức!!","Một rep thôi... làm cho ra hồn... tập trung tối đa anh nhé!!"],
  'incline-barbell':  ["Ngực trên là mục tiêu... cùi chỏ mở rộng... cảm nhận phần trên ngực căng ra!!","Hạ tạ chậm xuống ngực trên... không để tạ trượt xuống bụng!!","Đẩy lên theo đường thẳng... đừng đẩy ra trước mặt anh nhé!!","Lưng trên dán sát ghế... không ưỡn quá... giữ tư thế chuẩn!!","Cố thêm rep nữa... ngực trên cần nhiều kích thích hơn đó anh!!"],
  'db-bench':         ["Hạ tạ xuống hai bên ngực... cảm nhận cơ ngực kéo dãn... rồi đẩy lên!!","Hai tay đẩy đều nhau... đừng để một bên yếu hơn anh nhé!!","Cùi chỏ mở rộng 45 độ... không quá rộng... không quá hẹp!!","Siết cơ ngực ở đỉnh... ép hai tạ lại gần nhau... tốt lắm!!","Kiểm soát đường đi của tạ... chậm lúc hạ... bùng nổ lúc đẩy!!"],
  'incline-db':       ["Ngực trên phải cháy lên... hạ tạ từ từ hai bên... cảm nhận sức căng!!","Đẩy tạ lên... xoay nhẹ để hai tạ gần chạm nhau ở đỉnh!!","Vai không được nhún lên... ép vai xuống ghế... chỉ dùng ngực thôi!!","Hít vào lúc hạ... thở ra mạnh lúc đẩy... nhịp thở rất quan trọng!!","Cố gắng thêm... ngực trên đang được kích thích tối đa đấy!!"],
  'machine-fly':      ["Siết chặt ở giữa... ép hai tay lại... như ôm một cái cây lớn!!","Mở rộng từ từ... cảm nhận cơ ngực kéo dãn ra... đừng vội!!","Chỉ dùng cơ ngực thôi... tay chỉ là móc treo... cảm nhận ngực co lại!!","Giữ ở giữa 1 giây... siết mạnh... rồi mở ra chậm rãi!!","Đừng dùng tay kéo... dùng ngực ép vào... đó mới là đúng kỹ thuật!!"],
  // ─── SHOULDERS ──────────────────────────────────────
  'machine-shoulder': ["Core siết chặt vào... đừng lỏng người anh ơi!!","Đừng quăng tạ lên... kiểm soát từng nhịp!!","Khóa tay ở đỉnh... ép vai lên hết cỡ!!","Đầu đưa qua trước... đúng rồi... cứ thế!!","Đừng lấy đà... đẩy bằng vai thôi... đúng kỹ thuật!!"],
  'lateral-raise':    ["Đừng lắc người... bỏ cái tôi xuống anh ơi!!","Nâng bằng vai... không phải bằng đà!!","Tạ nhẹ thôi... nhưng kiểm soát thật chặt... chấp nhận đi!!","Giữ ở đỉnh... chịu đau 1 chút!!","Nếu cơ bả vai lên trước... là sai rồi đó!!"],
  'db-ohp':           ["Đẩy thẳng lên trời... đừng đẩy ra trước!!","Hít vào lúc hạ... thở mạnh ra lúc đẩy lên!!","Cùi chỏ hạ ngang vai... không hạ quá thấp!!","Core siết chặt... lưng thẳng... đẩy mạnh lên!!","Kiểm soát lúc hạ... đừng để tạ rơi tự do!!"],
  // ─── BICEPS ─────────────────────────────────────────
  'barbell-curl':     ["Đừng lắc người... anh đang gian lận kìa!!","Khóa cùi chỏ... chỉ cẳng tay chuyển động thôi!!","Chậm lại... đừng tập kiểu tốc độ!!","Siết mạnh ở đỉnh... cảm nhận bắp tay căng lên!!","Kiểm soát lúc hạ... đó là nửa rep quan trọng!!"],
  'seated-db-curl':   ["Duỗi hết tay ra... cảm nhận cơ kéo dãn!!","Xoay cổ tay ở đỉnh... siết mạnh vào!!","Không nhún vai... chỉ dùng bắp tay thôi!!","Chậm và đau... tốt lắm... cứ thế!!","Anh đến đây để tập tay... thì tập cho ra hồn!!"],
  'hammer-curl':      ["Không nghỉ... tiếp tục đi anh!!","Nóng rát là tốt... đừng than vãn!!","Giữ tay song song... kỹ thuật sạch!!","Mấy rep cuối... đừng bỏ cuộc!!","Đây là lúc người yếu đuối dừng lại... anh thì không!!"],
  // ─── TRICEPS ────────────────────────────────────────
  'cable-pushdown':   ["Khóa cùi chỏ sát hông... chỉ cẳng tay chuyển động!!","Siết mạnh ở dưới... đừng vội kéo lên!!","Đừng dùng vai đè xuống... chỉ dùng cơ tay sau thôi!!","Kiểm soát lúc lên... chậm rãi... cảm nhận cơ kéo dãn!!","Tốt lắm... ép mạnh xuống... khóa tay thẳng!!"],
  'rope-pushdown':    ["Xoè hai tay ra ở dưới... siết cơ tay sau!!","Đừng lắc người... đứng thẳng... core chặt!!","Cảm nhận cơ tay sau cháy lên... đó mới là đúng!!","Chậm lúc lên... nhanh lúc xuống... kiểm soát!!","Mấy rep cuối... ép thêm... đừng bỏ!!"],
  'cable-overhead-ext':["Kéo dãn cơ tay sau hết cỡ ở dưới... rồi duỗi mạnh lên!!","Khóa cùi chỏ... đừng xòe ra... giữ sát đầu!!","Siết mạnh ở đỉnh... cảm nhận cơ co lại!!","Hít vào lúc hạ... thở ra lúc duỗi lên!!","Cố thêm... cơ tay sau cần kéo dãn nhiều hơn!!"],
  // ─── BACK ───────────────────────────────────────────
  'lat-pulldown-chin':["Kéo bằng lưng... đừng kéo bằng tay!!","Ngả người nhẹ ra sau... siết xương bả vai lại!!","Hạ thanh xuống ngực... không phải xuống bụng!!","Kiểm soát lúc thả lên... đừng để tạ kéo anh!!","Siết lưng mạnh ở dưới... giữ 1 giây... rồi thả!!"],
  'lat-pulldown-std': ["Tay rộng hơn vai... kéo xuống ngực!!","Ép xương bả vai lại... cảm nhận lưng co!!","Đừng lắc người... ngồi thẳng... kéo bằng lưng!!","Thả chậm lên trên... kiểm soát từng nhịp!!","Tốt lắm... siết mạnh ở dưới... giữ chặt!!"],
  'lat-pulldown-vbar':["Kéo sát vào ngực... siết lưng giữa!!","Cùi chỏ hướng xuống... không xòe ra!!","Ngả nhẹ ra sau... cảm nhận cơ lưng kéo!!","Kiểm soát đường lên... đừng thả rơi!!","Mấy rep cuối... ép thêm... đừng buông!!"],
  'seated-cable-row': ["Kéo về phía bụng... ép xương bả vai lại!!","Ngồi thẳng... đừng ngả ra sau quá nhiều!!","Siết lưng giữa ở cuối... giữ 1 giây!!","Thả ra chậm... cảm nhận cơ lưng kéo dãn!!","Tay chỉ là móc treo... lưng mới là chính!!"],
  'barbell-bent-row': ["Lưng thẳng... đừng gù... giữ core chặt!!","Kéo tạ về phía bụng... cùi chỏ đi sát hông!!","Siết xương bả vai lại ở đỉnh... giữ chặt!!","Hạ tạ chậm xuống... kiểm soát từng nhịp!!","Đầu gối hơi khuỵu... hông đẩy ra sau... tư thế chuẩn!!"],
  // ─── LEGS ───────────────────────────────────────────
  'barbell-squat':    ["Lưng thẳng... core siết chặt... hít hơi vào!!","Hạ người xuống... đùi song song sàn... đừng nông quá!!","Đầu gối đẩy ra ngoài... không kẹp vào trong!!","Đẩy mạnh lên... chân ép xuống sàn... bùng nổ!!","Hít hơi sâu... giữ hơi... rồi squat xuống!!"],
  'leg-press':        ["Đừng khóa đầu gối ở đỉnh... giữ hơi cong!!","Hạ từ từ xuống... đầu gối mở rộng ra!!","Đẩy bằng gót chân... không phải mũi chân!!","Lưng dán sát ghế... đừng nhấc mông lên!!","Kiểm soát lúc hạ... chậm rãi... rồi đẩy mạnh!!"],
  'leg-extension':    ["Siết cơ đùi trước ở đỉnh... giữ 1 giây!!","Hạ chậm xuống... kiểm soát từng nhịp!!","Đừng lấy đà... nâng bằng cơ đùi thôi!!","Mũi chân hướng lên trên... siết đùi mạnh!!","Mấy rep cuối... ép thêm... đùi phải cháy lên!!"],
  'lying-leg-curl':   ["Siết cơ đùi sau lại... kéo gót chân về mông!!","Đừng nhấc hông lên... giữ hông dán sát ghế!!","Hạ chậm xuống... cảm nhận đùi sau kéo dãn!!","Siết mạnh ở đỉnh... giữ 1 giây!!","Kiểm soát đường về... đừng thả rơi!!"],
  'rdl-dumbbell':     ["Lưng thẳng... đẩy hông ra sau... đừng gù lưng!!","Cảm nhận đùi sau kéo dãn... hạ tạ từ từ!!","Đầu gối hơi khuỵu... không khóa thẳng!!","Siết mông ở đỉnh... đứng thẳng lên!!","Kiểm soát đường xuống... chậm rãi... cảm nhận từng centimet!!"]
};

// Generic fallback cues
const GENERIC_CUES = [
  "Kiểm soát chuyển động... chậm rãi anh nhé!!",
  "Biên độ đầy đủ... đừng cắt rep!!",
  "Hít vào... thở ra lúc gắng sức!!",
  "Siết cơ ở đỉnh... cảm nhận thật rõ!!",
  "Tập trung vào anh... đừng phân tâm!!"
];

// Get a coaching cue for the current exercise (exercise-specific only)
function getCoachingCue(exerciseId) {
  return randomFrom(EXERCISE_CUES[exerciseId] || GENERIC_CUES);
}

// Get a cue that is guaranteed different from the last one
function getCueNoRepeat(exerciseId) {
  const cues = EXERCISE_CUES[exerciseId] || GENERIC_CUES;
  if (cues.length <= 1) return cues[0] || '';
  let idx;
  do {
    idx = Math.floor(Math.random() * cues.length);
  } while (idx === lastCueIdx);
  lastCueIdx = idx;
  return cues[idx];
}

const REST_MSGS = [
  "Set tốt lắm!! nghỉ ngơi đi anh 💤",
  "Rũ tay ra... uống nước đi anh 💧",
  "Hít thở sâu... reset tinh thần 🧘",
  "Anh xứng đáng nghỉ!! ☕",
  "Cơ đang phát triển rồi đó 📈",
  "Giữ người linh hoạt... sẵn sàng set tiếp 🔄"
];

// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function fmt(sec) {
  const m = Math.floor(Math.abs(sec) / 60);
  const s = Math.abs(sec) % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtMin(sec) {
  if (sec < 60) return `~${sec}s`;
  return `~${Math.round(sec / 60)}m`;
}
function fmtWeight(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
  return `${kg.toLocaleString()} kg`;
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function stopAll() {
  clearInterval(ticker);
  clearTimeout(speakTimeout);
  ticker = null;
  speakTimeout = null;
  appPhase = 'idle';
  lastNagSetSec = -1;
  lastOvertimeNagSec = -1;
  overtimeAnnouncedOnce = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  // Stop FPT audio if playing
  if (fptAudio) { fptAudio.pause(); fptAudio = null; }
}

function unlockSpeech() {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(''); u.volume = 0;
  window.speechSynthesis.speak(u);
}
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  clearTimeout(speakTimeout);
  speakTimeout = setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1; u.volume = 1;
    window.speechSynthesis.speak(u);
  }, 100);
}

// ── FPT.AI Vietnamese TTS ────────────────────────────
const FPT_TTS_URL = 'https://api.fpt.ai/hmi/tts/v5';
const FPT_API_KEY = 'fpXaWur2pE7bHIW6MYZ3A2rk9M6pfaRY';
const FPT_VOICE   = 'leminh';
const FPT_SPEED   = '1';

let fptAudio = null; // current FPT audio element

/**
 * Speak Vietnamese text via FPT.AI TTS.
 * Calls the API, waits briefly for the MP3 to render, then plays it.
 */
function speakFPT(text) {
  // Stop any previous FPT audio
  if (fptAudio) { fptAudio.pause(); fptAudio = null; }
  // Also stop browser speech to avoid overlap
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  fetch(FPT_TTS_URL, {
    method: 'POST',
    headers: {
      'api-key': FPT_API_KEY,
      'speed': FPT_SPEED,
      'voice': FPT_VOICE
    },
    body: text
  })
  .then(res => res.json())
  .then(data => {
    if (data.error !== 0 || !data.async) {
      console.warn('FPT TTS error:', data);
      // Fallback to browser speech
      speak(text);
      return;
    }
    // Wait 1.5s for the MP3 to be ready, then play
    setTimeout(() => {
      if (appPhase === 'idle') return; // user left the screen
      fptAudio = new Audio(data.async);
      fptAudio.volume = 1;
      fptAudio.play().catch(err => {
        console.warn('FPT audio play failed:', err);
      });
    }, 1500);
  })
  .catch(err => {
    console.warn('FPT TTS fetch failed:', err);
    speak(text); // fallback
  });
}

// ── Screen switcher ──────────────────────────────────
function showScreen(screen) {
  ALL_SCREENS.forEach(s => s.classList.add('hidden'));
  screen.classList.remove('hidden');
}

// ══════════════════════════════════════════════════════
//  PROFILES (localStorage)
// ══════════════════════════════════════════════════════
function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || []; }
  catch { return []; }
}
function saveProfiles(arr) { localStorage.setItem(PROFILE_KEY, JSON.stringify(arr)); }

function loadUserPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(USER_PREFS_KEY));
    if (p) {
      userPrefs = { ...userPrefs, ...p };
      // Sync Quick Workout defaults from loaded profile
      qwDurationMin = userPrefs.duration;
      qwIntensityId = userPrefs.experience.toLowerCase();
      qwAddCore = userPrefs.core;
      qwAddWarmup = userPrefs.warmup;
    }
  } catch (e) {
    console.warn("Failed to load user prefs", e);
  }
}
function saveUserPrefs() {
  localStorage.setItem(USER_PREFS_KEY, JSON.stringify(userPrefs));
}

// Ensure prefs are loaded on startup
loadUserPrefs();

// ══════════════════════════════════════════════════════
//  SCREEN 1: HOME
// ══════════════════════════════════════════════════════
function enterHome() {
  stopAll();
  showScreen(screenHome);
  renderProfileAvatar();
  workoutPlan = [];
  selectedIds.clear();
  qwFromSavedProfile = false;
}

// ══════════════════════════════════════════════════════
//  QUICK WORKOUT SCREEN
// ══════════════════════════════════════════════════════
function enterQuickWorkout() {
  stopAll();
  showScreen(screenQuickWorkout);
  renderProfileAvatar();

  // Pick a random workout type if not already set
  if (!qwWorkoutTypeId) {
    qwWorkoutTypeId = getRandomWorkoutType();
  }

  regenerateQuickWorkout();
}

function regenerateQuickWorkout() {
  if (qwFromSavedProfile) {
    // Using a saved profile, don't regenerate
    renderQuickWorkoutPreview();
    return;
  }

  qwGeneratedWorkout = generateWorkout(
    qwWorkoutTypeId,
    qwDurationMin,
    qwIntensityId,
    qwAddCore,
    qwAddWarmup
  );

  workoutPlan = qwGeneratedWorkout.exercises.map(e => ({ ...e }));
  renderQuickWorkoutPreview();
}

function renderQuickWorkoutPreview() {
  const workout = qwGeneratedWorkout;

  // Title area
  if (qwFromSavedProfile) {
    qwTitleEmoji.textContent = '📁';
    qwTitleName.textContent = workout ? workout.name : 'Saved Workout';
    qwTitleSub.textContent = 'Bài tập đã lưu';
  } else {
    qwTitleEmoji.textContent = workout.emoji;
    qwTitleName.textContent = workout.name;
    qwTitleSub.textContent = workout.subtitle;
  }

  // Duration display
  updateDurationDisplay();

  // Intensity display
  const intensity = INTENSITY_LEVELS.find(i => i.id === qwIntensityId);
  qwIntensityValue.textContent = intensity ? intensity.name : 'Intermediate';

  // Toggles
  btnQwCore.classList.toggle('active', qwAddCore);
  qwCoreSign.textContent = qwAddCore ? '−' : '+';
  btnQwWarmup.classList.toggle('active', qwAddWarmup);
  qwWarmupSign.textContent = qwAddWarmup ? '−' : '+';

  // Estimated time
  const estSec = workoutPlan.reduce((sum, ex) => {
    const trainSec = ex.sets * ex.reps * SEC_PER_REP;
    const restSec = (ex.sets - 1) * ex.rest;
    return sum + trainSec + restSec;
  }, 0);
  qwEstTime.textContent = `~${formatDurationViet(estSec)}`;

  // Exercise list
  renderQuickExerciseList();
}

function renderQuickExerciseList() {
  if (workoutPlan.length === 0) {
    qwExerciseList.innerHTML = '<div class="no-saved" style="padding:20px 0;">Không có bài tập nào</div>';
    return;
  }

  let html = '';
  let lastCategory = '';

  workoutPlan.forEach((ex, i) => {
    if (ex.category !== lastCategory) {
      if (ex.category === 'Warmup') html += '<div class="qw-ex-section-label">🔥 Khởi động</div>';
      else if (ex.category === 'Core') html += '<div class="qw-ex-section-label">🧱 Core</div>';
      else if (ex.category === 'Cooldown') html += '<div class="qw-ex-section-label">🧘 Giãn cơ</div>';
      else if (lastCategory === 'Warmup') html += '<div class="qw-ex-section-label">💪 Bài chính</div>';
      lastCategory = ex.category;
    }
    const weightStr = ex.weight > 0 ? `${ex.weight}kg` : 'BW';
    html += `
      <div class="qw-ex-item" data-idx="${i}">
        <span class="qw-ex-drag" data-qw-drag="${i}">☰</span>
        <span class="qw-ex-emoji">${ex.emoji}</span>
        <div class="qw-ex-info">
          <div class="qw-ex-name">${ex.name}</div>
          <div class="qw-inline-controls">
            <div class="qw-inline-stepper">
              <span>kg</span>
              <button data-qw-step="${i}" data-field="weight" data-delta="-2.5">-</button>
              <strong>${ex.weight}</strong>
              <button data-qw-step="${i}" data-field="weight" data-delta="2.5">+</button>
            </div>
            <div class="qw-inline-stepper">
              <span>rep</span>
              <button data-qw-step="${i}" data-field="reps" data-delta="-1">-</button>
              <strong>${ex.reps}</strong>
              <button data-qw-step="${i}" data-field="reps" data-delta="1">+</button>
            </div>
            <div class="qw-inline-stepper">
              <span>rest</span>
              <button data-qw-step="${i}" data-field="rest" data-delta="-15">-</button>
              <strong>${ex.rest}s</strong>
              <button data-qw-step="${i}" data-field="rest" data-delta="15">+</button>
            </div>
          </div>
          <div class="qw-ex-meta">${weightStr} · ${ex.sets}×${ex.reps} · rest ${ex.rest}s</div>
        </div>
        <div class="qw-ex-actions">
          <button class="qw-ex-btn" data-guidance="${i}" title="Hướng dẫn">❓</button>
          <button class="qw-ex-btn" data-swap="${i}" title="Đổi bài">🔄</button>
          <button class="qw-ex-btn" data-del="${i}" title="Xóa">✕</button>
        </div>
      </div>`;
  });

  html += `<button class="qw-ex-add-btn" id="qw-ex-add">➕ Thêm bài tập</button>`;
  qwExerciseList.innerHTML = html;

  // Delete
  qwExerciseList.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.del);
      workoutPlan.splice(idx, 1);
      renderQuickExerciseList();
      renderQuickWorkoutPreview();
    });
  });

  // Swap
  qwExerciseList.querySelectorAll('[data-swap]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openSwapModal(parseInt(btn.dataset.swap));
    });
  });

  // Guidance (? button)
  qwExerciseList.querySelectorAll('[data-guidance]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openGuidanceModal(workoutPlan[parseInt(btn.dataset.guidance)]);
    });
  });

  // Inline weight/reps/rest steppers in Quick Workout preview
  qwExerciseList.querySelectorAll('[data-qw-step]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.qwStep);
      const field = btn.dataset.field;
      const delta = parseFloat(btn.dataset.delta);
      const limits = { weight: [0, 500], reps: [1, 50], rest: [15, 300] };
      if (!workoutPlan[idx] || !limits[field]) return;
      workoutPlan[idx][field] = Math.max(
        limits[field][0],
        Math.min(limits[field][1], workoutPlan[idx][field] + delta)
      );
      renderQuickExerciseList();
      renderQuickWorkoutPreview();
    });
  });

  // Add exercise
  const addBtn = document.getElementById('qw-ex-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      selectedIds = new Set(workoutPlan.map(e => e.id));
      openPicker();
    });
  }

  // Drag & drop for QW list
  initQWDragAndDrop();
}

function updateDurationDisplay() {
  const min = qwDurationMin;
  if (min < 60) {
    qwDurationValue.textContent = `${min}p`;
  } else if (min === 60) {
    qwDurationValue.textContent = '1h';
  } else if (min % 60 === 0) {
    qwDurationValue.textContent = `${min / 60}h`;
  } else {
    const h = Math.floor(min / 60);
    const m = min % 60;
    qwDurationValue.textContent = `${h}h${m < 10 ? '0' : ''}${m}`;
  }
}

function formatDurationForModal(min) {
  if (min < 60) return `${min} phút`;
  if (min === 60) return '1 giờ';
  if (min % 60 === 0) return `${min / 60} giờ`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m < 10 ? '0' : ''}${m}`;
}

// ══════════════════════════════════════════════════════
//  CHANGE WORKOUT SCREEN
// ══════════════════════════════════════════════════════
function enterChangeWorkout() {
  showScreen(screenChangeWorkout);
  renderWorkoutTypeGrid();
  renderCwSavedList();
}

function renderWorkoutTypeGrid() {
  cwTypeGrid.innerHTML = WORKOUT_TYPES.map(wt => `
    <button class="cw-type-btn${wt.id === qwWorkoutTypeId ? ' selected' : ''}" data-type-id="${wt.id}">
      <span class="cw-type-emoji">${wt.emoji}</span>
      <div class="cw-type-info">
        <div class="cw-type-name">${wt.name}</div>
        <div class="cw-type-sub">${wt.subtitle}</div>
      </div>
    </button>
  `).join('');

  cwTypeGrid.querySelectorAll('.cw-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qwWorkoutTypeId = btn.dataset.typeId;
      qwFromSavedProfile = false;
      regenerateQuickWorkout();
      showScreen(screenQuickWorkout);
    });
  });
}

function renderCwSavedList() {
  const profiles = loadProfiles();
  if (profiles.length === 0) {
    cwSavedList.innerHTML = '<div class="cw-no-saved">Chưa có bài tập đã lưu</div>';
    return;
  }

  cwSavedList.innerHTML = profiles.map((p, i) => {
    const ts = p.exercises.reduce((s, e) => s + e.sets, 0);
    return `
      <div class="cw-saved-card" data-idx="${i}">
        <span class="cw-saved-icon">📋</span>
        <div class="cw-saved-info">
          <div class="cw-saved-name">${esc(p.name)}</div>
          <div class="cw-saved-meta">${p.exercises.length} bài · ${ts} sets</div>
        </div>
        <span class="cw-saved-arrow">→</span>
      </div>`;
  }).join('');

  cwSavedList.querySelectorAll('.cw-saved-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx);
      const profile = loadProfiles()[idx];
      if (!profile) return;

      // Load saved workout into quick workout
      workoutPlan = profile.exercises.map(e => ({ ...e }));
      qwFromSavedProfile = true;
      qwGeneratedWorkout = {
        name: profile.name,
        emoji: '📁',
        subtitle: 'Bài tập đã lưu',
        exercises: workoutPlan,
      };
      showScreen(screenQuickWorkout);
      renderQuickWorkoutPreview();
    });
  });
}

// ══════════════════════════════════════════════════════
//  DURATION PICKER MODAL
// ══════════════════════════════════════════════════════
function openDurationModal() {
  durationSlider.value = qwDurationMin;
  durationDisplay.textContent = formatDurationForModal(qwDurationMin);
  durationModal.classList.remove('hidden');
}

function closeDurationModal() {
  durationModal.classList.add('hidden');
}

// ══════════════════════════════════════════════════════
//  INTENSITY PICKER MODAL
// ══════════════════════════════════════════════════════
function openIntensityModal() {
  intensityOptions.innerHTML = INTENSITY_LEVELS.map(il => `
    <div class="intensity-option${il.id === qwIntensityId ? ' selected' : ''}" data-id="${il.id}">
      <span class="intensity-option-emoji">${il.emoji}</span>
      <div class="intensity-option-info">
        <div class="intensity-option-name">${il.name}</div>
        <div class="intensity-option-sub">${il.subtitle}</div>
      </div>
      <div class="intensity-option-check">${il.id === qwIntensityId ? '✓' : ''}</div>
    </div>
  `).join('');

  intensityOptions.querySelectorAll('.intensity-option').forEach(opt => {
    opt.addEventListener('click', () => {
      qwIntensityId = opt.dataset.id;
      qwFromSavedProfile = false;
      intensityModal.classList.add('hidden');
      regenerateQuickWorkout();
    });
  });

  intensityModal.classList.remove('hidden');
}

// ══════════════════════════════════════════════════════
//  SCREEN 2: WORKOUT SETUP
// ══════════════════════════════════════════════════════
function enterSetup() {
  stopAll();
  showScreen(screenSetup);
  renderSetupList();
  updateSetupStats();
}

function renderSetupList() {
  if (workoutPlan.length === 0) {
    setupListEl.innerHTML = '<div class="no-saved" style="padding:40px 0;">No exercises added yet.<br>Tap "+ Add" to get started!</div>';
    btnBeginWorkout.disabled = true;
    return;
  }
  btnBeginWorkout.disabled = false;
  setupListEl.innerHTML = workoutPlan.map((ex, i) => `
    <div class="setup-card" data-idx="${i}">
      <div class="setup-card-top">
        <span class="drag-handle" data-idx="${i}">☰</span>
        <div class="setup-card-name">
          <span class="emoji">${ex.emoji}</span>
          ${ex.name}
        </div>
        <button class="setup-card-del" data-delidx="${i}">✕</button>
      </div>
      <div class="setup-card-fields">
        <div class="setup-field">
          <span class="setup-field-label">Weight</span>
          <div class="stepper">
            <button class="stepper-btn" data-idx="${i}" data-field="weight" data-delta="-2.5">−</button>
            <span class="stepper-val" id="sv-weight-${i}">${ex.weight}</span>
            <button class="stepper-btn" data-idx="${i}" data-field="weight" data-delta="2.5">+</button>
          </div>
        </div>
        <div class="setup-field">
          <span class="setup-field-label">Sets</span>
          <div class="stepper">
            <button class="stepper-btn" data-idx="${i}" data-field="sets" data-delta="-1">−</button>
            <span class="stepper-val" id="sv-sets-${i}">${ex.sets}</span>
            <button class="stepper-btn" data-idx="${i}" data-field="sets" data-delta="1">+</button>
          </div>
        </div>
        <div class="setup-field">
          <span class="setup-field-label">Reps</span>
          <div class="stepper">
            <button class="stepper-btn" data-idx="${i}" data-field="reps" data-delta="-1">−</button>
            <span class="stepper-val" id="sv-reps-${i}">${ex.reps}</span>
            <button class="stepper-btn" data-idx="${i}" data-field="reps" data-delta="1">+</button>
          </div>
        </div>
        <div class="setup-field">
          <span class="setup-field-label">Rest</span>
          <div class="stepper">
            <button class="stepper-btn" data-idx="${i}" data-field="rest" data-delta="-5">−</button>
            <span class="stepper-val" id="sv-rest-${i}">${ex.rest}</span>
            <button class="stepper-btn" data-idx="${i}" data-field="rest" data-delta="5">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Stepper clicks
  setupListEl.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const field = btn.dataset.field;
      const delta = parseFloat(btn.dataset.delta);
      const limits = { weight: [0, 500], sets: [1, 10], reps: [1, 50], rest: [5, 300] };
      let val = workoutPlan[idx][field] + delta;
      val = Math.max(limits[field][0], Math.min(limits[field][1], val));
      workoutPlan[idx][field] = val;
      const el = document.getElementById(`sv-${field}-${idx}`);
      if (el) el.textContent = val;
      updateSetupStats();
    });
  });

  // Delete
  setupListEl.querySelectorAll('.setup-card-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.delidx);
      const removed = workoutPlan.splice(idx, 1)[0];
      selectedIds.delete(removed.id);
      renderSetupList();
      updateSetupStats();
    });
  });

  // Wire up drag handles
  initDragAndDrop();
}

// ══════════════════════════════════════════════════════
//  TOUCH-FRIENDLY DRAG & DROP REORDERING
// ══════════════════════════════════════════════════════
let dragState = null; // { dragIdx, ghostEl, placeholder, startY, currentY, scrollInterval }

function initDragAndDrop() {
  setupListEl.querySelectorAll('.drag-handle').forEach(handle => {
    // Touch
    handle.addEventListener('touchstart', onDragStart, { passive: false });
    // Mouse
    handle.addEventListener('mousedown', onDragStart);
  });
}

function onDragStart(e) {
  e.preventDefault();
  e.stopPropagation();

  const handle = e.currentTarget;
  const dragIdx = parseInt(handle.dataset.idx);
  const card = handle.closest('.setup-card');
  const rect = card.getBoundingClientRect();
  const listRect = setupListEl.getBoundingClientRect();

  // Get start Y from touch or mouse
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  // Create ghost (floating copy of the card)
  const ghost = card.cloneNode(true);
  ghost.classList.add('drag-ghost');
  ghost.style.width = `${rect.width}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);

  // Create placeholder in original position
  const placeholder = document.createElement('div');
  placeholder.className = 'drag-placeholder';
  placeholder.style.height = `${rect.height}px`;
  card.parentNode.insertBefore(placeholder, card);

  // Hide original card
  card.classList.add('drag-hidden');

  dragState = {
    dragIdx,
    ghostEl: ghost,
    placeholder,
    originalCard: card,
    startY: clientY,
    offsetY: clientY - rect.top,
    listRect,
    scrollInterval: null,
  };

  // Bind move/end to document
  if (e.touches) {
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);
  } else {
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }
}

function onDragMove(e) {
  if (!dragState) return;
  e.preventDefault();

  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  dragState.currentY = clientY;

  // Move ghost
  dragState.ghostEl.style.top = `${clientY - dragState.offsetY}px`;

  // Auto-scroll the setup list when dragging near edges
  const listRect = setupListEl.getBoundingClientRect();
  const scrollZone = 50;
  clearInterval(dragState.scrollInterval);
  dragState.scrollInterval = null;

  if (clientY < listRect.top + scrollZone) {
    dragState.scrollInterval = setInterval(() => { setupListEl.scrollTop -= 8; }, 16);
  } else if (clientY > listRect.bottom - scrollZone) {
    dragState.scrollInterval = setInterval(() => { setupListEl.scrollTop += 8; }, 16);
  }

  // Determine which card we're hovering over
  const cards = Array.from(setupListEl.querySelectorAll('.setup-card:not(.drag-hidden)'));
  let inserted = false;
  for (const c of cards) {
    const cRect = c.getBoundingClientRect();
    const cMid = cRect.top + cRect.height / 2;
    if (clientY < cMid) {
      setupListEl.insertBefore(dragState.placeholder, c);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    // After all cards
    setupListEl.appendChild(dragState.placeholder);
  }
}

function onDragEnd(e) {
  if (!dragState) return;

  // Cleanup listeners
  document.removeEventListener('touchmove', onDragMove);
  document.removeEventListener('touchend', onDragEnd);
  document.removeEventListener('touchcancel', onDragEnd);
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragEnd);
  clearInterval(dragState.scrollInterval);

  // Determine drop index from placeholder position
  const allChildren = Array.from(setupListEl.children);
  let dropIdx = allChildren.indexOf(dragState.placeholder);
  // Adjust: if placeholder is after the hidden card, we need to account for it
  const hiddenIdx = allChildren.indexOf(dragState.originalCard);
  if (hiddenIdx >= 0 && hiddenIdx < dropIdx) {
    dropIdx--; // because the hidden card will be removed
  }

  // Remove ghost and placeholder
  dragState.ghostEl.remove();
  dragState.placeholder.remove();
  dragState.originalCard.classList.remove('drag-hidden');

  // Reorder workoutPlan
  const fromIdx = dragState.dragIdx;
  if (fromIdx !== dropIdx && dropIdx >= 0 && dropIdx < workoutPlan.length) {
    const [moved] = workoutPlan.splice(fromIdx, 1);
    workoutPlan.splice(dropIdx, 0, moved);
  }

  dragState = null;

  // Re-render to reflect new order
  renderSetupList();
}

function updateSetupStats() {
  const exCount = workoutPlan.length;
  const setsCount = workoutPlan.reduce((s, e) => s + e.sets, 0);
  const trainSec = workoutPlan.reduce((s, e) => s + e.sets * e.reps * SEC_PER_REP, 0);
  const restSec = workoutPlan.reduce((s, e) => s + (e.sets - 1) * e.rest, 0);
  statExercises.textContent = exCount;
  statSets.textContent = setsCount;
  statEst.textContent = fmtMin(trainSec + restSec);
}

// ══════════════════════════════════════════════════════
//  EXERCISE PICKER
// ══════════════════════════════════════════════════════
function openPicker() {
  pickerModal.classList.remove('hidden');
  renderPickerTabs();
  renderPickerList();
  updatePickerCount();
}

function closePicker() {
  pickerModal.classList.add('hidden');
}

function renderPickerTabs() {
  pickerTabs.innerHTML = CATEGORIES.map(c =>
    `<button class="picker-tab${c === activeCat ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
  pickerTabs.querySelectorAll('.picker-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCat = tab.dataset.cat;
      renderPickerTabs();
      renderPickerList();
    });
  });
}

function renderPickerList() {
  const filtered = EXERCISE_LIBRARY.filter(e => e.category === activeCat);
  pickerListEl.innerHTML = filtered.map(e => `
    <div class="picker-item${selectedIds.has(e.id) ? ' selected' : ''}" data-id="${e.id}">
      <span class="picker-item-emoji">${e.emoji}</span>
      <div class="picker-item-info">
        <div class="picker-item-name">${e.name}</div>
        <div class="picker-item-defaults">${e.weight}kg · ${e.sets}×${e.reps} · rest ${e.rest}s</div>
      </div>
      <div class="picker-item-check">${selectedIds.has(e.id) ? '✓' : ''}</div>
    </div>
  `).join('');
  pickerListEl.querySelectorAll('.picker-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.id;
      if (selectedIds.has(id)) selectedIds.delete(id);
      else selectedIds.add(id);
      renderPickerList();
      updatePickerCount();
    });
  });
}

function updatePickerCount() {
  pickerCount.textContent = `(${selectedIds.size})`;
}

function finishPicking() {
  // Add newly selected exercises that aren't already in the plan
  const existingIds = new Set(workoutPlan.map(e => e.id));
  EXERCISE_LIBRARY.forEach(e => {
    if (selectedIds.has(e.id) && !existingIds.has(e.id)) {
      workoutPlan.push({ ...e });
    }
  });
  // Remove unselected
  workoutPlan = workoutPlan.filter(e => selectedIds.has(e.id));
  closePicker();
  renderSetupList();
  updateSetupStats();
}

// ══════════════════════════════════════════════════════
//  SCREEN 3: ACTIVE WORKOUT (TRAINING)
// ══════════════════════════════════════════════════════
function enterTraining() {
  stopAll();
  showScreen(screenActive);
  appPhase = 'training';
  trainingStartTime = Date.now();

  const ex = workoutPlan[currentExIdx];
  activeExercise.textContent = ex.name;
  activeSetBadge.textContent = `Set ${currentSetNum}/${ex.sets}`;
  detailReps.textContent = ex.reps;
  detailWeight.textContent = `${ex.weight}kg`;
  const firstCue = getCoachingCue(ex.id);
  coachingText.textContent = firstCue;
  // Don't speak on entry — wait for 5s mark (one cue per set)
  setCueSpoken = false;

  activeTimer.textContent = '0:00';
  updateWorkoutProgress();

  unlockSpeech();

  // Single ticker recalculates everything from timestamps
  ticker = setInterval(() => tickTraining(), 1000);
}



function tickTraining() {
  if (appPhase !== 'training' || !trainingStartTime) return;

  const setElapsed = Math.floor((Date.now() - trainingStartTime) / 1000);
  activeTimer.textContent = fmt(setElapsed);

  totalElapsedSec = workoutElapsedBase + setElapsed;
  activeElapsed.textContent = fmt(totalElapsedSec);

  // Coaching: speak exactly ONCE per set at 5s mark, no repeat from previous set
  if (setElapsed >= 5 && !setCueSpoken) {
    setCueSpoken = true;
    const ex = workoutPlan[currentExIdx];
    const cue = getCueNoRepeat(ex.id);
    coachingText.textContent = cue;
    speakFPT(cue);
  }
}

function updateWorkoutProgress() {
  const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  activeProgressFill.style.width = `${pct}%`;
  activeProgressLabel.textContent = `${pct}%`;
  // Also update rest screen progress
  restProgressFill.style.width = `${pct}%`;
  restProgressLabel.textContent = `${pct}%`;
}

// ══════════════════════════════════════════════════════
//  SCREEN 4: REST
// ══════════════════════════════════════════════════════
function enterResting() {
  stopAll();
  showScreen(screenRest);
  appPhase = 'resting';
  restStartTime = Date.now();

  const ex = workoutPlan[currentExIdx];

  restTimer.textContent = fmt(ex.rest);
  restTimer.classList.remove('overtime');
  restRingFg.classList.remove('overtime');
  restMotivational.textContent = randomFrom(REST_MSGS);

  // Compute next set info
  let nextSetNum = currentSetNum + 1;
  let nextExIdx = currentExIdx;
  if (nextSetNum > ex.sets) {
    nextSetNum = 1;
    nextExIdx = currentExIdx + 1;
  }
  if (completedSets + 1 >= totalSets) {
    restNext.textContent = 'Last set incoming! 🏁';
  } else if (nextExIdx !== currentExIdx && nextExIdx < workoutPlan.length) {
    restNext.textContent = `Next: ${workoutPlan[nextExIdx].name}`;
  } else {
    restNext.textContent = `Next: Set ${nextSetNum}/${ex.sets}`;
  }

  restElapsed.textContent = fmt(totalElapsedSec);
  updateWorkoutProgress();

  const circumference = 2 * Math.PI * 70; // r=70
  restRingFg.style.strokeDasharray = circumference;
  restRingFg.style.strokeDashoffset = '0';

  // Single ticker recalculates everything from timestamps
  ticker = setInterval(() => tickResting(), 1000);
}

function tickResting() {
  if (appPhase !== 'resting' || !restStartTime) return;

  const ex = workoutPlan[currentExIdx];
  const elapsedRestSec = Math.floor((Date.now() - restStartTime) / 1000);
  const restRemaining = ex.rest - elapsedRestSec;
  const circumference = 2 * Math.PI * 70;

  // Update total elapsed
  totalElapsedSec = workoutElapsedBase + elapsedRestSec;
  restElapsed.textContent = fmt(totalElapsedSec);

  if (restRemaining >= 0) {
    // Normal countdown
    restTimer.textContent = fmt(restRemaining);
    const fraction = restRemaining / ex.rest;
    restRingFg.style.strokeDashoffset = `${circumference * (1 - fraction)}`;
    restTimer.classList.remove('overtime');
    restRingFg.classList.remove('overtime');
  } else {
    // Overtime
    const overtimeElapsed = Math.abs(restRemaining);
    restTimer.textContent = `+${fmt(overtimeElapsed)}`;
    restTimer.classList.add('overtime');
    restRingFg.classList.add('overtime');
    restRingFg.style.strokeDashoffset = `${circumference}`;

    // One-shot "rest over" announcement
    if (!overtimeAnnouncedOnce) {
      overtimeAnnouncedOnce = true;
      speakFPT('Hết giờ nghỉ rồi anh ơi... quay lại tập thôi!!');
      restMotivational.textContent = 'Hết giờ nghỉ rồi!! Quay lại tập thôi ⚡';
    }

    // Nag every 10s of overtime (deduplicated)
    const nagBucket = Math.floor(overtimeElapsed / 10) * 10;
    if (nagBucket > 0 && nagBucket !== lastOvertimeNagSec) {
      lastOvertimeNagSec = nagBucket;
      const nagMsg = Math.random() < 0.5
        ? 'Sao chậm thế anh ơi... nhanh lên!!'
        : 'Quay lại tập đi anh... đừng nghỉ nữa!!';
      speakFPT(nagMsg);
      restMotivational.textContent = Math.random() < 0.5
        ? 'Ếch đang mất kiên nhẫn rồi... 😤'
        : 'Hết giờ nghỉ!! Đi tập ngay!! ⚡';
    }
  }
}

// ══════════════════════════════════════════════════════
//  Advance to next set / exercise
// ══════════════════════════════════════════════════════
function advanceToNext() {
  // Record actual rest time
  if (restStartTime) {
    const actualRest = Math.round((Date.now() - restStartTime) / 1000);
    const ex = workoutPlan[currentExIdx];
    sessionLog.push({
      exName: ex.name,
      exerciseIdx: currentExIdx + 1,
      setNum: currentSetNum,
      plannedRest: ex.rest,
      actualRest: actualRest
    });
    // Save accumulated elapsed time before switching phase
    workoutElapsedBase = workoutElapsedBase + actualRest;
    restStartTime = null;
  }

  completedSets++;
  updateWorkoutProgress();

  if (completedSets >= totalSets) { enterComplete(); return; }

  const ex = workoutPlan[currentExIdx];
  currentSetNum++;
  if (currentSetNum > ex.sets) {
    currentSetNum = 1;
    currentExIdx++;
  }
  enterTraining();
}

// ══════════════════════════════════════════════════════
//  SCREEN 5: COMPLETION
// ══════════════════════════════════════════════════════
function enterComplete() {
  stopAll();
  showScreen(screenComplete);

  const totalKg = workoutPlan.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);

  cstatSets.textContent = totalSets;
  cstatWeight.textContent = fmtWeight(Math.round(totalKg));
  cstatTime.textContent = fmt(totalElapsedSec);

  // Rest report
  const totalPlannedRest = sessionLog.reduce((s, l) => s + l.plannedRest, 0);
  const totalActualRest = sessionLog.reduce((s, l) => s + l.actualRest, 0);
  const restDiff = totalActualRest - totalPlannedRest;
  const restPct = totalPlannedRest > 0 ? Math.round((restDiff / totalPlannedRest) * 100) : 0;
  const restSign = restDiff >= 0 ? '+' : '';

  const restVerdict = restDiff <= 0
    ? '🎯 Perfect discipline!'
    : restPct <= 10
      ? '👍 Mostly on track!'
      : restPct <= 25
        ? '😒 A bit lazy...'
        : '🐼 Way too much rest, panda!';

  let report = `<strong>📊 Rest Report</strong><br>`;
  report += `Planned: ${fmt(totalPlannedRest)} · Actual: ${fmt(totalActualRest)} (${restSign}${fmt(Math.abs(restDiff))}, ${restSign}${restPct}%)<br>`;
  report += `${restVerdict}<br>`;

  if (sessionLog.length > 0) {
    report += `<br><strong>Per set:</strong><br>`;
    sessionLog.forEach(l => {
      const diff = l.actualRest - l.plannedRest;
      const sign = diff >= 0 ? '+' : '';
      const emoji = diff <= 0 ? '✅' : diff <= 10 ? '👍' : '⚠️';
      report += `${emoji} E${l.exerciseIdx} S${l.setNum}: ${l.actualRest}s / ${l.plannedRest}s (${sign}${diff}s)<br>`;
    });
  }

  completeRestReport.innerHTML = report;
  completeSub.textContent = `${workoutPlan.length} exercises · ${totalSets} sets · ${fmt(totalElapsedSec)}`;

  // Confetti!
  spawnConfetti();

  speakFPT(`Tập xong rồi anh ơi!! Tổng thời gian nghỉ là ${fmt(totalActualRest)}... ${restDiff >= 0 ? 'nhiều hơn' : 'ít hơn'} kế hoạch ${Math.abs(restPct)} phần trăm.`);
}

function spawnConfetti() {
  confettiBurst.innerHTML = '';
  const colors = ['#58CC02', '#89e219', '#1CB0F6', '#FFC800', '#CE82FF', '#FF4B4B'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}%`;
    c.style.top = `${Math.random() * -20}px`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = `${Math.random() * 0.8}s`;
    c.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    c.style.width = `${5 + Math.random() * 8}px`;
    c.style.height = `${5 + Math.random() * 8}px`;
    confettiBurst.appendChild(c);
  }
}

// ══════════════════════════════════════════════════════
//  SAVE MODAL
// ══════════════════════════════════════════════════════
function openSaveModal() {
  saveNameInput.value = '';
  saveModal.classList.remove('hidden');
  saveNameInput.focus();
}
function closeSaveModal() { saveModal.classList.add('hidden'); }

function doSaveProfile() {
  const name = saveNameInput.value.trim();
  if (!name) { saveNameInput.focus(); return; }
  const profs = loadProfiles();
  profs.push({ name, exercises: workoutPlan.map(e => ({ ...e })), savedAt: new Date().toISOString() });
  saveProfiles(profs);
  closeSaveModal();
}

// ══════════════════════════════════════════════════════
//  PT BOOKING FLOW
// ══════════════════════════════════════════════════════

const VIET_DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
const VIET_MONTHS = ['Th.01','Th.02','Th.03','Th.04','Th.05','Th.06','Th.07','Th.08','Th.09','Th.10','Th.11','Th.12'];

function enterPTBooking() {
  stopAll();
  showScreen(screenPtBooking);
  ptSelectedDate = null;
  ptSelectedStart = null;
  ptSelectedEnd = null;
  ptPendingBooking = null;
  ptTimeSection.classList.add('hidden');
  ptResultsSection.classList.add('hidden');
  ptConfirmOverlay.classList.add('hidden');
  renderPTCalendar();
}

// ── Calendar ──────────────────────────────────────────
function renderPTCalendar() {
  const { start, end, dates } = getCalendarRange();
  const todayStr = dateToStr(start); // today's date string

  let html = '';
  let lastMonth = -1;

  dates.forEach((d, i) => {
    // Month separator
    const m = d.getMonth();
    if (m !== lastMonth) {
      // If not first month, close previous month rows, add label
      if (i > 0) {
        // Pad remaining cells if needed (already handled by grid)
      }
      html += `<div class="pt-cal-month-label" style="grid-column: 1/-1;">${VIET_MONTHS[m]} ${d.getFullYear()}</div>`;
      lastMonth = m;
    }

    const dStr = dateToStr(d);
    const isToday = dStr === todayStr;
    const isPast = d < start;
    const dayNum = d.getDate();

    if (isPast) {
      html += `<div class="pt-cal-day past">${dayNum}</div>`;
    } else {
      const hasAvail = isAnyPTAvailableOnDate(d);
      const cls = hasAvail ? 'available' : 'dimmed';
      const todayCls = isToday ? ' today' : '';
      html += `<div class="pt-cal-day ${cls}${todayCls}" data-date="${dStr}">${dayNum}</div>`;
    }
  });

  ptCalGrid.innerHTML = html;

  // Click handlers on available days
  ptCalGrid.querySelectorAll('.pt-cal-day.available').forEach(el => {
    el.addEventListener('click', () => {
      ptCalGrid.querySelectorAll('.pt-cal-day.selected').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      ptSelectedDate = new Date(el.dataset.date + 'T00:00:00');
      onDateSelected();
    });
  });
}

function onDateSelected() {
  // Show time picker
  ptTimeSection.classList.remove('hidden');
  ptResultsSection.classList.add('hidden');

  // Populate time options
  const times = generateTimeOptions();
  populateTimeSelect(ptTimeStart, times, '08:00');
  populateTimeSelect(ptTimeEnd, times, '09:00');

  // Scroll time picker into view
  setTimeout(() => {
    ptTimeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function populateTimeSelect(sel, times, defaultVal) {
  sel.innerHTML = times.map(t => {
    const selected = t === defaultVal ? ' selected' : '';
    return `<option value="${t}"${selected}>${t}</option>`;
  }).join('');
}

// ── PT Search ─────────────────────────────────────────
function searchPTs() {
  if (!ptSelectedDate) return;

  ptSelectedStart = ptTimeStart.value;
  ptSelectedEnd = ptTimeEnd.value;

  // Validate times
  const startMin = timeToMin(ptSelectedStart);
  const endMin = timeToMin(ptSelectedEnd);
  if (endMin <= startMin) {
    // Show brief error via results
    ptResultsSection.classList.remove('hidden');
    ptResultsLabel.textContent = '⚠️ Giờ không hợp lệ';
    ptResultsScroll.innerHTML = `
      <div class="pt-empty">
        <div class="pt-empty-icon">⏰</div>
        <div class="pt-empty-title">Thời gian không hợp lệ</div>
        <div class="pt-empty-sub">Giờ kết thúc phải sau giờ bắt đầu.<br>Vui lòng chọn lại.</div>
      </div>`;
    return;
  }

  const availablePTs = getAvailablePTs(ptSelectedDate, ptSelectedStart, ptSelectedEnd);

  ptResultsSection.classList.remove('hidden');

  if (availablePTs.length === 0) {
    ptResultsLabel.textContent = '😔 Kết quả';
    ptResultsScroll.innerHTML = `
      <div class="pt-empty">
        <div class="pt-empty-icon">😔</div>
        <div class="pt-empty-title">Rất tiếc!</div>
        <div class="pt-empty-sub">Không có PT nào rảnh trong khung giờ<br>${ptSelectedStart} → ${ptSelectedEnd} ngày ${formatDateViet(ptSelectedDate)}.<br><br>Hãy thử chọn khung giờ khác!</div>
      </div>`;
  } else {
    ptResultsLabel.textContent = `🎯 ${availablePTs.length} PT có sẵn`;
    ptResultsScroll.innerHTML = availablePTs.map(pt => renderPTCard(pt)).join('');

    // Wire book buttons
    ptResultsScroll.querySelectorAll('.pt-book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ptId = btn.dataset.ptid;
        const pt = PT_PROFILES.find(p => p.id === ptId);
        if (pt) openBookingConfirm(pt);
      });
    });
  }

  // Scroll results into view
  setTimeout(() => {
    ptResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

function renderPTCard(pt) {
  const stars = '★'.repeat(Math.floor(pt.rating)) + (pt.rating % 1 >= 0.5 ? '½' : '');
  const certs = pt.certifications.map(c => `<span class="pt-cert-badge">${c}</span>`).join('');

  return `
    <div class="pt-card">
      <div class="pt-card-top">
        <div class="pt-avatar-wrap">
          <img src="${pt.avatar}" alt="${pt.name}" class="pt-avatar">
        </div>
        <div class="pt-info">
          <div class="pt-name">${pt.name}</div>
          <div class="pt-specialty">${pt.specialty}</div>
          <div class="pt-meta-row">
            <div class="pt-rating">
              <span class="pt-rating-stars">${stars}</span>
              <span>${pt.rating}</span>
            </div>
            <div class="pt-experience">📅 ${pt.experience}</div>
          </div>
        </div>
      </div>
      <div class="pt-bio">${pt.bio}</div>
      <div class="pt-certs">${certs}</div>
      <button class="btn-primary pt-book-btn" data-ptid="${pt.id}">
        <span class="btn-label">Đặt lịch với ${pt.name.split(' ')[0]}</span>
      </button>
    </div>`;
}

function formatDateViet(date) {
  const day = VIET_DAYS[date.getDay()];
  const d = date.getDate();
  const m = date.getMonth() + 1;
  return `${day}, ${d}/${m}`;
}

// ── Booking Confirmation ──────────────────────────────
function openBookingConfirm(pt, bookingOverride = null) {
  const bookingDate = bookingOverride?.date || ptSelectedDate;
  const bookingStart = bookingOverride?.start || ptSelectedStart;
  const bookingEnd = bookingOverride?.end || ptSelectedEnd;
  if (!bookingDate || !bookingStart || !bookingEnd) return;

  ptPendingBooking = {
    ptId: pt.id,
    ptName: pt.name,
    date: bookingDate,
    start: bookingStart,
    end: bookingEnd
  };

  ptConfirmIcon.textContent = '📋';
  ptConfirmTitle.textContent = 'Xác nhận đặt lịch';

  ptConfirmDetails.innerHTML = `
    <div class="pt-confirm-row">
      <span class="pt-confirm-row-label">PT</span>
      <span class="pt-confirm-row-value">${pt.name}</span>
    </div>
    <div class="pt-confirm-row">
      <span class="pt-confirm-row-label">Chuyên môn</span>
      <span class="pt-confirm-row-value">${pt.specialty}</span>
    </div>
    <div class="pt-confirm-row">
      <span class="pt-confirm-row-label">Ngày</span>
      <span class="pt-confirm-row-value">${formatDateViet(bookingDate)}</span>
    </div>
    <div class="pt-confirm-row">
      <span class="pt-confirm-row-label">Giờ</span>
      <span class="pt-confirm-row-value">${bookingStart} → ${bookingEnd}</span>
    </div>`;

  // Show confirm/cancel buttons
  ptConfirmBtns.innerHTML = `
    <button class="btn-secondary" id="pt-confirm-cancel">Huỷ</button>
    <button class="btn-primary" id="pt-confirm-ok">Xác nhận ✓</button>`;

  ptConfirmOverlay.classList.remove('hidden');

  // Re-wire buttons since innerHTML replaced them
  document.getElementById('pt-confirm-cancel').addEventListener('click', closeBookingConfirm);
  document.getElementById('pt-confirm-ok').addEventListener('click', confirmBooking);
}

function closeBookingConfirm() {
  ptConfirmOverlay.classList.add('hidden');
  ptPendingBooking = null;
}

function confirmBooking() {
  if (!ptPendingBooking) return;

  const result = bookPTSlot(
    ptPendingBooking.ptId,
    ptPendingBooking.date,
    ptPendingBooking.start,
    ptPendingBooking.end
  );

  if (result.success) {
    // Show success state
    ptConfirmIcon.textContent = '✅';
    ptConfirmTitle.textContent = 'Đã đặt lịch thành công!';

    ptConfirmDetails.innerHTML = `
      <div class="pt-confirm-row">
        <span class="pt-confirm-row-label">PT</span>
        <span class="pt-confirm-row-value">${ptPendingBooking.ptName}</span>
      </div>
      <div class="pt-confirm-row">
        <span class="pt-confirm-row-label">Ngày</span>
        <span class="pt-confirm-row-value">${formatDateViet(ptPendingBooking.date)}</span>
      </div>
      <div class="pt-confirm-row">
        <span class="pt-confirm-row-label">Giờ</span>
        <span class="pt-confirm-row-value">${ptPendingBooking.start} → ${ptPendingBooking.end}</span>
      </div>`;

    ptConfirmBtns.innerHTML = `
      <button class="btn-primary" id="pt-confirm-done" style="flex:1;">OK 🎉</button>`;

    document.getElementById('pt-confirm-done').addEventListener('click', () => {
      closeBookingConfirm();
      enterHome();
    });
  } else {
    ptConfirmIcon.textContent = '❌';
    ptConfirmTitle.textContent = 'Lỗi đặt lịch';
    ptConfirmDetails.innerHTML = `<div class="pt-empty-sub">${result.error}</div>`;
  }
}

// Safe event listener — skips if element is null
function on(el, event, handler) {
  if (el) el.addEventListener(event, handler);
  else console.warn('[app] Missing element for event:', event, handler?.name || '');
}

// ══════════════════════════════════════════════════════
//  BUTTON WIRING
// ══════════════════════════════════════════════════════

// Home
btnQuickWorkout.addEventListener('click', () => {
  qwWorkoutTypeId = getRandomWorkoutType();
  qwFromSavedProfile = false;
  enterQuickWorkout();
});

// PT Booking
btnBookPT.addEventListener('click', enterPTBooking);
btnPtBack.addEventListener('click', enterHome);
btnFindPT.addEventListener('click', searchPTs);
if (ptConfirmCancel) ptConfirmCancel.addEventListener('click', closeBookingConfirm);
if (ptConfirmOk) ptConfirmOk.addEventListener('click', confirmBooking);

// Quick Workout
btnQwChangeWorkout.addEventListener('click', enterChangeWorkout);

btnQwDuration.addEventListener('click', openDurationModal);

btnQwGym.addEventListener('click', () => {
  // Coming soon — do nothing
});

btnQwIntensity.addEventListener('click', openIntensityModal);

btnQwCore.addEventListener('click', () => {
  qwAddCore = !qwAddCore;
  qwFromSavedProfile = false;
  regenerateQuickWorkout();
});

btnQwWarmup.addEventListener('click', () => {
  qwAddWarmup = !qwAddWarmup;
  qwFromSavedProfile = false;
  regenerateQuickWorkout();
});

btnQwStart.addEventListener('click', () => {
  if (workoutPlan.length === 0) return;
  currentExIdx = 0;
  currentSetNum = 1;
  completedSets = 0;
  totalSets = workoutPlan.reduce((s, e) => s + e.sets, 0);
  sessionLog = [];
  restStartTime = null;
  trainingStartTime = null;
  totalElapsedSec = 0;
  workoutElapsedBase = 0;
  workoutStartTime = Date.now();
  updateWorkoutProgress();
  enterTraining();
});

// Change Workout
btnCwBack.addEventListener('click', () => {
  showScreen(screenQuickWorkout);
});

btnCwCreateNew.addEventListener('click', () => {
  workoutPlan = [];
  selectedIds.clear();
  setupBackTarget = 'quick-workout';
  enterSetup();
});

// Duration Modal
durationSlider.addEventListener('input', () => {
  const val = parseInt(durationSlider.value);
  durationDisplay.textContent = formatDurationForModal(val);
});

durationCancel.addEventListener('click', closeDurationModal);

durationConfirm.addEventListener('click', () => {
  qwDurationMin = parseInt(durationSlider.value);
  qwFromSavedProfile = false;
  closeDurationModal();
  regenerateQuickWorkout();
});

// Intensity Modal — clicking the overlay background closes it
intensityModal.addEventListener('click', (e) => {
  if (e.target === intensityModal) {
    intensityModal.classList.add('hidden');
  }
});

// Setup
btnSetupBack.addEventListener('click', () => {
  if (setupBackTarget === 'quick-workout') {
    setupBackTarget = 'home';
    showScreen(screenQuickWorkout);
  } else {
    enterHome();
  }
});

btnAddExercise.addEventListener('click', () => {
  // Sync selectedIds with current workoutPlan
  selectedIds = new Set(workoutPlan.map(e => e.id));
  openPicker();
});

btnBeginWorkout.addEventListener('click', () => {
  if (workoutPlan.length === 0) return;
  currentExIdx = 0;
  currentSetNum = 1;
  completedSets = 0;
  totalSets = workoutPlan.reduce((s, e) => s + e.sets, 0);
  sessionLog = [];
  restStartTime = null;
  trainingStartTime = null;
  totalElapsedSec = 0;
  workoutElapsedBase = 0;
  workoutStartTime = Date.now();
  updateWorkoutProgress();
  enterTraining();
});

// Picker
pickerClose.addEventListener('click', closePicker);
pickerDone.addEventListener('click', finishPicking);

// Active
btnFinishSet.addEventListener('click', () => {
  // Save training time into elapsed base before switching to rest
  if (trainingStartTime) {
    const setElapsed = Math.floor((Date.now() - trainingStartTime) / 1000);
    workoutElapsedBase += setElapsed;
    trainingStartTime = null;
  }
  enterResting();
});

// Rest
btnSkipRest.addEventListener('click', advanceToNext);

// Complete
btnSaveWorkout.addEventListener('click', openSaveModal);
btnGoHome.addEventListener('click', enterHome);

// Save modal
saveCancel.addEventListener('click', closeSaveModal);
saveConfirm.addEventListener('click', doSaveProfile);
saveNameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSaveProfile(); });



// ══════════════════════════════════════════════════════
//  SEED DEFAULT PROFILES
// ══════════════════════════════════════════════════════
function seedDefaults() {
  const SEED_KEY = 'panda_gym_seeded_v1';
  if (localStorage.getItem(SEED_KEY)) return;

  const barbellChestDay = {
    name: 'Barbell Chest Day',
    savedAt: new Date().toISOString(),
    exercises: [
      { id: 'barbell-bench',      name: 'Barbell Bench Press',          category: 'Chest',     emoji: '🏋️', weight: 60,   sets: 6, reps: 3,  rest: 120 },
      { id: 'barbell-bench-s',    name: 'Barbell Bench Press (Singles)', category: 'Chest',     emoji: '🏋️', weight: 60,   sets: 2, reps: 1,  rest: 120 },
      { id: 'incline-barbell',    name: 'Incline Barbell Bench Press',  category: 'Chest',     emoji: '📐', weight: 55,   sets: 4, reps: 6,  rest: 105 },
      { id: 'machine-shoulder',   name: 'Machine Overhead Press',       category: 'Shoulders', emoji: '🙌', weight: 45,   sets: 3, reps: 8,  rest: 80  },
      { id: 'lateral-raise',      name: 'Dumbbell Lateral Raise',       category: 'Shoulders', emoji: '🕊️', weight: 8,    sets: 3, reps: 15, rest: 50  },
      { id: 'machine-fly',        name: 'Machine Chest Fly',            category: 'Chest',     emoji: '🦋', weight: 47.5, sets: 3, reps: 10, rest: 50  },
      { id: 'barbell-curl',       name: 'Barbell Curl',                 category: 'Biceps',    emoji: '💪', weight: 20,   sets: 3, reps: 10, rest: 50  },
      { id: 'seated-db-curl',     name: 'Seated Dumbbell Curl',         category: 'Biceps',    emoji: '💪', weight: 10,   sets: 3, reps: 8,  rest: 45  },
      { id: 'hammer-curl',        name: 'Hammer Curl',                  category: 'Biceps',    emoji: '🔨', weight: 10,   sets: 3, reps: 20, rest: 35  },
    ]
  };

  const profs = loadProfiles();
  profs.push(barbellChestDay);
  saveProfiles(profs);
  localStorage.setItem(SEED_KEY, '1');
}

// ══════════════════════════════════════════════════════
//  BOTTOM NAVIGATION & PROFILE
// ══════════════════════════════════════════════════════
function updateBottomNav(target) {
  document.querySelectorAll('.bottom-nav-item').forEach(nav => {
    nav.classList.toggle('active', nav.dataset.target === target);
  });
}

document.querySelectorAll('.bottom-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    if (target === 'home') enterHome();
    else if (target === 'workout') { qwWorkoutTypeId = qwWorkoutTypeId || getRandomWorkoutType(); enterQuickWorkout(); }
    else if (target === 'profile') enterProfile();
    else if (target === 'saved') enterSavedWorkouts();
  });
});

// Global avatar button
const globalAvatarBtn = document.getElementById('global-avatar-btn');
if (globalAvatarBtn) globalAvatarBtn.addEventListener('click', enterProfile);

// Profile back button
const btnProfileBack = document.getElementById('btn-profile-back');
if (btnProfileBack) btnProfileBack.addEventListener('click', enterHome);

// My Gym back button
const btnMygymBack = document.getElementById('btn-mygym-back');
if (btnMygymBack) btnMygymBack.addEventListener('click', enterHome);

// My Gym bottom nav
document.querySelectorAll('[data-mygym-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.mygymTab;
    document.querySelectorAll('.mygym-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`mygym-tab-${tab}`).classList.remove('hidden');
    document.querySelectorAll('[data-mygym-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Home btn-my-gym
const btnMyGymHome = document.getElementById('btn-my-gym');
if (btnMyGymHome) btnMyGymHome.addEventListener('click', enterMyGym);

function enterProfile() {
  stopAll();
  showScreen(screenProfile);
  renderProfileAvatar();
  loadProfileScreenData();
}

// ── Profile chip helpers ──────────────────────────────
function setupChipGroup(containerId, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.profile-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.profile-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (onSelect) onSelect(chip.dataset.val);
    });
  });
}

function getChipVal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return '';
  const active = container.querySelector('.profile-chip.active');
  return active ? active.dataset.val : '';
}

function setChipVal(containerId, val) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.profile-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.val === String(val));
  });
}

// Wire chip groups
setupChipGroup('profile-pronoun');
setupChipGroup('profile-goal');
setupChipGroup('profile-experience');
setupChipGroup('profile-wpw');

function loadProfileScreenData() {
  document.getElementById('profile-name').value = userPrefs.name || '';
  setChipVal('profile-pronoun', userPrefs.pronoun);
  document.getElementById('profile-age').value = userPrefs.age;
  document.getElementById('profile-weight').value = userPrefs.weight;
  setChipVal('profile-goal', userPrefs.goal);
  setChipVal('profile-experience', userPrefs.experience);
  profileDurationSlider.value = userPrefs.duration;
  profileDurationVal.textContent = userPrefs.duration + ' phút';
  setChipVal('profile-wpw', userPrefs.wpw);
  profileCoreToggle.classList.toggle('active', userPrefs.core);
  profileWarmupToggle.classList.toggle('active', userPrefs.warmup);
  profileStretchingToggle.classList.toggle('active', userPrefs.stretching);
}

// Profile Screen Listeners
profileDurationSlider.addEventListener('input', () => {
  profileDurationVal.textContent = profileDurationSlider.value + ' phút';
});
profileCoreBtn.addEventListener('click', () => profileCoreToggle.classList.toggle('active'));
profileWarmupBtn.addEventListener('click', () => profileWarmupToggle.classList.toggle('active'));
profileStretchingBtn.addEventListener('click', () => profileStretchingToggle.classList.toggle('active'));

btnProfileSave.addEventListener('click', () => {
  userPrefs = {
    name: (document.getElementById('profile-name').value || '').trim(),
    pronoun: getChipVal('profile-pronoun') || 'Bạn',
    age: document.getElementById('profile-age').value,
    weight: document.getElementById('profile-weight').value,
    goal: getChipVal('profile-goal'),
    experience: getChipVal('profile-experience') || 'intermediate',
    duration: parseInt(profileDurationSlider.value),
    wpw: getChipVal('profile-wpw'),
    core: profileCoreToggle.classList.contains('active'),
    warmup: profileWarmupToggle.classList.contains('active'),
    stretching: profileStretchingToggle.classList.contains('active'),
  };
  saveUserPrefs();
  // Sync Quick Workout defaults from profile
  qwDurationMin = userPrefs.duration;
  qwIntensityId = userPrefs.experience;
  qwAddCore = userPrefs.core;
  qwAddWarmup = userPrefs.warmup;
  renderProfileAvatar();

  // Visual feedback
  const originalHtml = btnProfileSave.innerHTML;
  btnProfileSave.innerHTML = `<span class="btn-icon">✓</span><span class="btn-label">Đã lưu!</span>`;
  setTimeout(() => { btnProfileSave.innerHTML = originalHtml; }, 2000);
});


// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
seedDefaults();
enterHome(); // Home will call updateBottomNav('home') if we modify enterHome

// ══════════════════════════════════════════════════════
//  VISIBILITY CHANGE — recover state when returning from background
// ══════════════════════════════════════════════════════
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;

  // Force an immediate tick to sync displayed times with reality
  if (appPhase === 'training') {
    tickTraining();
  } else if (appPhase === 'resting') {
    tickResting();
  }
});


// ══════════════════════════════════════════════════════
//  PROFILE AVATAR
// ══════════════════════════════════════════════════════
function renderProfileAvatar() {
  const el = document.getElementById('global-avatar-initials');
  if (!el) return;
  const name = (userPrefs.name || '').trim();
  if (!name) { el.textContent = '?'; return; }
  const parts = name.split(/\s+/);
  const initials = parts.length >= 2
    ? parts[0][0].toUpperCase() + parts[parts.length-1][0].toUpperCase()
    : name[0].toUpperCase();
  el.textContent = initials;
}

// ══════════════════════════════════════════════════════
//  SAVED WORKOUTS (quick tab)
// ══════════════════════════════════════════════════════
function enterSavedWorkouts() {
  enterChangeWorkout();
}

// ══════════════════════════════════════════════════════
//  QW DRAG & DROP
// ══════════════════════════════════════════════════════
let qwDragState = null;
function initQWDragAndDrop() {
  qwExerciseList.querySelectorAll('[data-qw-drag]').forEach(handle => {
    handle.addEventListener('touchstart', onQWDragStart, { passive: false });
    handle.addEventListener('mousedown', onQWDragStart);
  });
}
function onQWDragStart(e) {
  e.preventDefault();
  const handle = e.currentTarget;
  const dragIdx = parseInt(handle.dataset.qwDrag);
  const card = handle.closest('.qw-ex-item');
  const rect = card.getBoundingClientRect();
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const ghost = card.cloneNode(true);
  ghost.className = 'drag-ghost';
  ghost.style.width = rect.width + 'px';
  ghost.style.left = rect.left + 'px';
  ghost.style.top = rect.top + 'px';
  document.body.appendChild(ghost);
  const placeholder = document.createElement('div');
  placeholder.className = 'drag-placeholder';
  placeholder.style.height = rect.height + 'px';
  card.parentNode.insertBefore(placeholder, card);
  card.classList.add('drag-hidden');
  qwDragState = { dragIdx, ghostEl: ghost, placeholder, originalCard: card, offsetY: clientY - rect.top };
  if (e.touches) {
    document.addEventListener('touchmove', onQWDragMove, { passive: false });
    document.addEventListener('touchend', onQWDragEnd);
  } else {
    document.addEventListener('mousemove', onQWDragMove);
    document.addEventListener('mouseup', onQWDragEnd);
  }
}
function onQWDragMove(e) {
  if (!qwDragState) return;
  e.preventDefault();
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  qwDragState.ghostEl.style.top = (clientY - qwDragState.offsetY) + 'px';
  const items = Array.from(qwExerciseList.querySelectorAll('.qw-ex-item:not(.drag-hidden)'));
  let inserted = false;
  for (const c of items) {
    const mid = c.getBoundingClientRect().top + c.getBoundingClientRect().height / 2;
    if (clientY < mid) { qwExerciseList.insertBefore(qwDragState.placeholder, c); inserted = true; break; }
  }
  if (!inserted) qwExerciseList.appendChild(qwDragState.placeholder);
}
function onQWDragEnd() {
  if (!qwDragState) return;
  document.removeEventListener('touchmove', onQWDragMove);
  document.removeEventListener('touchend', onQWDragEnd);
  document.removeEventListener('mousemove', onQWDragMove);
  document.removeEventListener('mouseup', onQWDragEnd);
  const allChildren = Array.from(qwExerciseList.children);
  let dropIdx = allChildren.indexOf(qwDragState.placeholder);
  const hiddenIdx = allChildren.indexOf(qwDragState.originalCard);
  if (hiddenIdx >= 0 && hiddenIdx < dropIdx) dropIdx--;
  qwDragState.ghostEl.remove();
  qwDragState.placeholder.remove();
  qwDragState.originalCard.classList.remove('drag-hidden');
  const from = qwDragState.dragIdx;
  if (from !== dropIdx && dropIdx >= 0 && dropIdx < workoutPlan.length) {
    const [moved] = workoutPlan.splice(from, 1);
    workoutPlan.splice(dropIdx, 0, moved);
  }
  qwDragState = null;
  renderQuickExerciseList();
}

// ══════════════════════════════════════════════════════
//  EXERCISE GUIDANCE MODAL
// ══════════════════════════════════════════════════════
const EXERCISE_GUIDANCE = {
  'barbell-bench': {
    text: 'Nằm trên ghế, lưng dán sát, tay rộng hơn vai. Hạ tạ xuống ngực chậm, đẩy lên thẳng. Hít vào khi hạ, thở ra khi đẩy.',
    youtube: 'vcBig73ojpE'
  },
  'incline-barbell': { text: 'Ghế nghiêng 30-45°. Hạ xuống phần trên ngực, giữ lưng dán ghế.', youtube: 'IP4oeKh1Sd4' },
  'db-bench': { text: 'Hai tạ đẩy đều. Hạ tạ hai bên, cảm nhận ngực kéo dãn.', youtube: 'QsYre__-aro' },
  'machine-fly': { text: 'Điều chỉnh ghế để tay ngang ngực. Ép hai tay lại như ôm cây, siết cơ ngực ở giữa.', youtube: 'pChpzqjnWhk' },
  'lat-pulldown-std': { text: 'Kéo thanh xuống ngực, cùi chỏ hướng xuống. Kéo bằng lưng không phải tay.', youtube: 'CAwf7n6Luuc' },
  'seated-cable-row': { text: 'Ngồi thẳng, kéo về phía bụng. Ép xương bả vai ở cuối chuyển động.', youtube: 'GZbfZ033f74' },
  'barbell-squat': { text: 'Chân rộng ngang vai. Hạ xuống đùi song song sàn. Đầu gối đẩy ra ngoài, lưng thẳng.', youtube: 'ultWZbUMPL8' },
  'leg-press': { text: 'Chân rộng vừa phải. Đẩy bằng gót chân. Không khóa đầu gối ở đỉnh.', youtube: '9EsAJCjBEFg' },
  'barbell-curl': { text: 'Khóa cùi chỏ sát hông. Chỉ cẳng tay chuyển động. Siết ở đỉnh.', youtube: 'kwG2ipFRgfo' },
  'cable-pushdown': { text: 'Cùi chỏ sát hông, ép xuống thẳng. Chỉ dùng cơ tay sau.', youtube: 'vB5OHsJ3EMc' }
};

function openGuidanceModal(ex, isNext) {
  if (!ex) return;
  const modal = document.getElementById('guidance-modal');
  const titleEl = document.getElementById('guidance-title');
  const textEl = document.getElementById('guidance-text');
  const videoEl = document.getElementById('guidance-video-wrap');
  titleEl.textContent = (isNext ? 'Bài tiếp: ' : '') + ex.name;
  const g = EXERCISE_GUIDANCE[ex.id];
  textEl.textContent = g ? g.text : 'Thực hiện đúng kỹ thuật, kiểm soát chuyển động, hít thở đều.';
  if (g && g.youtube) {
    videoEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${g.youtube}?rel=0" allowfullscreen></iframe>`;
    videoEl.classList.remove('hidden');
  } else {
    videoEl.innerHTML = '';
    videoEl.classList.add('hidden');
  }
  modal.classList.remove('hidden');
}

document.getElementById('guidance-close').addEventListener('click', () => {
  document.getElementById('guidance-modal').classList.add('hidden');
  document.getElementById('guidance-video-wrap').innerHTML = '';
});

// Active workout guidance button
document.getElementById('screen-active').addEventListener('click', e => {
  if (e.target.closest('[data-active-guidance]')) {
    openGuidanceModal(workoutPlan[currentExIdx]);
  }
});

// ══════════════════════════════════════════════════════
//  SWAP MODAL
// ══════════════════════════════════════════════════════
let swapTargetIdx = -1;
function openSwapModal(idx) {
  swapTargetIdx = idx;
  const ex = workoutPlan[idx];
  const subtitle = document.getElementById('swap-subtitle');
  subtitle.textContent = `Thay thế cho: ${ex.name} (${ex.category})`;
  const alternatives = EXERCISE_LIBRARY.filter(e =>
    e.category === ex.category && e.id !== ex.id &&
    !workoutPlan.some((p, i) => p.id === e.id && i !== idx)
  ).slice(0, 6);
  const swapList = document.getElementById('swap-list');
  swapList.innerHTML = alternatives.map(alt => `
    <div class="swap-item" data-swap-id="${alt.id}">
      <span class="swap-item-emoji">${alt.emoji}</span>
      <div>
        <div class="swap-item-name">${alt.name}</div>
        <div class="swap-item-meta">${alt.weight}kg · ${alt.sets}×${alt.reps}</div>
      </div>
    </div>`).join('');
  swapList.querySelectorAll('.swap-item').forEach(item => {
    item.addEventListener('click', () => {
      const newEx = EXERCISE_LIBRARY.find(e => e.id === item.dataset.swapId);
      if (newEx && swapTargetIdx >= 0) {
        workoutPlan[swapTargetIdx] = { ...newEx };
        renderQuickExerciseList();
        renderQuickWorkoutPreview();
        const wepPanel = document.getElementById('wep-panel');
        if (wepPanel && !wepPanel.classList.contains('hidden')) openWEP();
      }
      document.getElementById('swap-modal').classList.add('hidden');
    });
  });
  document.getElementById('swap-modal').classList.remove('hidden');
}
document.getElementById('swap-close').addEventListener('click', () => {
  document.getElementById('swap-modal').classList.add('hidden');
});

// ══════════════════════════════════════════════════════
//  WORKOUT EDIT PANEL (during rest)
// ══════════════════════════════════════════════════════
function openWEP() {
  const panel = document.getElementById('wep-panel');
  const overlay = document.getElementById('wep-overlay');
  const list = document.getElementById('wep-list');
  list.innerHTML = `
    <button class="qw-ex-add-btn" id="wep-add-exercise">+ Thêm bài tập</button>
  ` + workoutPlan.map((ex, i) => {
    const active = i === currentExIdx ? ' style="border-color:var(--accent)"' : '';
    return `<div class="setup-card"${active}>
      <div class="setup-card-top">
        <div class="setup-card-name"><span class="qw-ex-drag" data-wep-drag="${i}">☰</span><span class="emoji">${ex.emoji}</span>${ex.name}</div>
        <button class="qw-ex-btn" data-wep-swap="${i}" title="Đổi bài">↻</button>
        ${i === currentExIdx ? '<span style="font-size:10px;color:var(--accent)">▶ Hiện tại</span>' : ''}
      </div>
      <div class="setup-card-fields">
        <div class="setup-field"><span class="setup-field-label">Weight</span>
          <div class="stepper">
            <button class="stepper-btn" data-wep-idx="${i}" data-field="weight" data-delta="-2.5">−</button>
            <span class="stepper-val" id="wep-w-${i}">${ex.weight}</span>
            <button class="stepper-btn" data-wep-idx="${i}" data-field="weight" data-delta="2.5">+</button>
          </div></div>
        <div class="setup-field"><span class="setup-field-label">Reps</span>
          <div class="stepper">
            <button class="stepper-btn" data-wep-idx="${i}" data-field="reps" data-delta="-1">−</button>
            <span class="stepper-val" id="wep-r-${i}">${ex.reps}</span>
            <button class="stepper-btn" data-wep-idx="${i}" data-field="reps" data-delta="1">+</button>
          </div></div>
        <div class="setup-field"><span class="setup-field-label">Rest</span>
          <div class="stepper">
            <button class="stepper-btn" data-wep-idx="${i}" data-field="rest" data-delta="-15">−</button>
            <span class="stepper-val" id="wep-rest-${i}">${ex.rest}</span>
            <button class="stepper-btn" data-wep-idx="${i}" data-field="rest" data-delta="15">+</button>
          </div></div>
      </div></div>`;
  }).join('');
  const addBtn = document.getElementById('wep-add-exercise');
  if (addBtn) {
    addBtn.addEventListener('click', e => {
      e.stopPropagation();
      selectedIds = new Set(workoutPlan.map(ex => ex.id));
      closeWEP();
      openPicker();
    });
  }
  list.querySelectorAll('[data-wep-swap]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openSwapModal(parseInt(btn.dataset.wepSwap));
    });
  });
  initWEPDragAndDrop();
  list.querySelectorAll('.stepper-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const i = parseInt(btn.dataset.wepIdx);
      const field = btn.dataset.field;
      const delta = parseFloat(btn.dataset.delta);
      const limits = { weight: [0,500], reps: [1,50], rest: [15,300] };
      let val = Math.max(limits[field][0], Math.min(limits[field][1], workoutPlan[i][field] + delta));
      workoutPlan[i][field] = val;
      const prefix = field === 'weight' ? 'wep-w' : field === 'reps' ? 'wep-r' : 'wep-rest';
      const el = document.getElementById(`${prefix}-${i}`);
      if (el) el.textContent = val;
    });
  });
  panel.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function closeWEP() {
  document.getElementById('wep-panel').classList.add('hidden');
  document.getElementById('wep-overlay').classList.add('hidden');
}
document.getElementById('wep-close').addEventListener('click', closeWEP);
document.getElementById('wep-overlay').addEventListener('click', closeWEP);

let wepDragState = null;
function initWEPDragAndDrop() {
  document.querySelectorAll('[data-wep-drag]').forEach(handle => {
    handle.addEventListener('touchstart', onWEPDragStart, { passive: false });
    handle.addEventListener('mousedown', onWEPDragStart);
  });
}

function onWEPDragStart(e) {
  e.preventDefault();
  const handle = e.currentTarget;
  const dragIdx = parseInt(handle.dataset.wepDrag);
  const card = handle.closest('.setup-card');
  const list = document.getElementById('wep-list');
  if (!card || !list) return;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const rect = card.getBoundingClientRect();
  const ghost = card.cloneNode(true);
  ghost.className = 'drag-ghost';
  ghost.style.width = `${rect.width}px`;
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  document.body.appendChild(ghost);
  const placeholder = document.createElement('div');
  placeholder.className = 'drag-placeholder';
  placeholder.style.height = `${rect.height}px`;
  card.classList.add('drag-hidden');
  list.insertBefore(placeholder, card.nextSibling);
  wepDragState = { dragIdx, ghostEl: ghost, placeholder, originalCard: card, offsetY: clientY - rect.top };
  document.addEventListener('touchmove', onWEPDragMove, { passive: false });
  document.addEventListener('touchend', onWEPDragEnd);
  document.addEventListener('mousemove', onWEPDragMove);
  document.addEventListener('mouseup', onWEPDragEnd);
}

function onWEPDragMove(e) {
  if (!wepDragState) return;
  e.preventDefault();
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  wepDragState.ghostEl.style.top = `${clientY - wepDragState.offsetY}px`;
  const list = document.getElementById('wep-list');
  const cards = Array.from(list.querySelectorAll('.setup-card:not(.drag-hidden)'));
  let inserted = false;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      list.insertBefore(wepDragState.placeholder, card);
      inserted = true;
      break;
    }
  }
  if (!inserted) list.appendChild(wepDragState.placeholder);
}

function onWEPDragEnd() {
  if (!wepDragState) return;
  document.removeEventListener('touchmove', onWEPDragMove);
  document.removeEventListener('touchend', onWEPDragEnd);
  document.removeEventListener('mousemove', onWEPDragMove);
  document.removeEventListener('mouseup', onWEPDragEnd);
  const list = document.getElementById('wep-list');
  const children = Array.from(list.querySelectorAll('.setup-card, .drag-placeholder'));
  let dropIdx = children.indexOf(wepDragState.placeholder);
  const hiddenIdx = children.indexOf(wepDragState.originalCard);
  if (hiddenIdx >= 0 && hiddenIdx < dropIdx) dropIdx--;
  wepDragState.ghostEl.remove();
  wepDragState.placeholder.remove();
  wepDragState.originalCard.classList.remove('drag-hidden');
  const from = wepDragState.dragIdx;
  if (from !== dropIdx && dropIdx >= 0 && dropIdx < workoutPlan.length) {
    const currentExerciseRef = workoutPlan[currentExIdx];
    const [moved] = workoutPlan.splice(from, 1);
    workoutPlan.splice(dropIdx, 0, moved);
    currentExIdx = workoutPlan.indexOf(currentExerciseRef);
  }
  wepDragState = null;
  openWEP();
}


// ══════════════════════════════════════════════════════
//  FLOATING REST MENU BUTTON
// ══════════════════════════════════════════════════════
function addFloatingRestBtn() {
  if (document.getElementById('wep-float-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'wep-float-btn';
  btn.className = 'wep-floating-btn';
  btn.innerHTML = '☰';
  btn.title = 'Chỉnh bài tập';
  btn.addEventListener('click', openWEP);
  screenRest.appendChild(btn);
}

// Add ? button to active workout
function addGuidanceBtnToActive() {
  if (document.getElementById('active-guidance-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'active-guidance-btn';
  btn.className = 'qw-ex-btn';
  btn.style.cssText = 'position:absolute;top:12px;right:12px;width:36px;height:36px;font-size:18px;z-index:5;';
  btn.innerHTML = '❓';
  btn.title = 'Hướng dẫn';
  btn.addEventListener('click', () => openGuidanceModal(workoutPlan[currentExIdx]));
  const activeCenter = document.querySelector('.active-center');
  if (activeCenter) activeCenter.style.position = 'relative', activeCenter.appendChild(btn);
}

// Add ? button to rest screen for NEXT exercise
function addGuidanceBtnToRest() {
  if (document.getElementById('rest-guidance-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'rest-guidance-btn';
  btn.className = 'qw-ex-btn';
  btn.style.cssText = 'position:absolute;top:12px;right:64px;width:36px;height:36px;font-size:18px;z-index:5;';
  btn.innerHTML = '❓';
  btn.title = 'Hướng dẫn bài tiếp';
  btn.addEventListener('click', () => {
    // Find next exercise
    let nextEx = workoutPlan[currentExIdx];
    const curEx = workoutPlan[currentExIdx];
    if (currentSetNum >= curEx.sets && currentExIdx + 1 < workoutPlan.length) {
      nextEx = workoutPlan[currentExIdx + 1];
    }
    openGuidanceModal(nextEx, nextEx !== workoutPlan[currentExIdx]);
  });
  screenRest.style.position = 'relative';
  screenRest.appendChild(btn);
}

// ══════════════════════════════════════════════════════
//  PATCH enterTraining / enterResting for new buttons
// ══════════════════════════════════════════════════════
const _origEnterTraining = enterTraining;
enterTraining = function() {
  _origEnterTraining();
  addGuidanceBtnToActive();
};
const _origEnterResting = enterResting;
enterResting = function() {
  _origEnterResting();
  addFloatingRestBtn();
  addGuidanceBtnToRest();
};

// ══════════════════════════════════════════════════════
//  MY GYM SCREEN
// ══════════════════════════════════════════════════════
const MOCK_GYMS = [
  { name: 'California Fitness Quận 1', meta: '1.2km • 550,000đ/tháng', badge: 'Đang mở' },
  { name: 'Fit24 Quận 7', meta: '3.5km • 350,000đ/tháng', badge: 'Gần bạn' },
  { name: 'Elite Gym Bình Thạnh', meta: '4.8km • 480,000đ/tháng', badge: '24/7' },
];
const MOCK_CLASSES = [
  { name: 'Spinning', time: 'T2, T4, T6 — 07:00', meta: 'Phòng B • 45 phút', badge: 'Còn 3 chỗ' },
  { name: 'Dance Cardio', time: 'T3, T7 — 18:30', meta: 'Phòng C • 60 phút', badge: 'Phổ biến' },
  { name: 'Yoga Flow', time: 'T2, T4 — 19:00', meta: 'Phòng D • 60 phút', badge: 'Còn 5 chỗ' },
  { name: 'Boxing Fitness', time: 'T5, CN — 08:00', meta: 'Phòng A • 50 phút', badge: 'Hot' },
];

function enterMyGym() {
  stopAll();
  showScreen(screenMyGym);
  renderProfileAvatar();
  // Update member name
  const nameEl = document.getElementById('mygym-member-name');
  if (nameEl) nameEl.textContent = userPrefs.name || 'Foxy Member';
  // Draw QR on canvas
  drawQRCanvas();
  // Render gym list
  const gymList = document.getElementById('mygym-gym-list');
  if (gymList) {
    gymList.innerHTML = MOCK_GYMS.map(g => `
      <div class="mygym-card">
        <div class="mygym-card-name">${g.name}</div>
        <div class="mygym-card-meta">${g.meta}</div>
        <span class="mygym-card-badge">${g.badge}</span>
      </div>`).join('');
  }
  // Render class list
  const classList = document.getElementById('mygym-class-list');
  if (classList) {
    classList.innerHTML = MOCK_CLASSES.map(c => `
      <div class="mygym-card">
        <div class="mygym-card-name">${c.name}</div>
        <div class="mygym-class-time">${c.time}</div>
        <div class="mygym-card-meta">${c.meta}</div>
        <span class="mygym-card-badge">${c.badge}</span>
      </div>`).join('');
  }
}

function drawQRCanvas() {
  const canvas = document.getElementById('mygym-qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 200;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#1a1a1e';
  // Draw simple QR-like pattern
  const cell = 8;
  const grid = 25;
  const offset = (size - grid * cell) / 2;
  // Random seed based on today
  const seed = new Date().getDate() * 31 + new Date().getMonth();
  function seededRand(i) { return ((seed * 1103515245 + i * 12345) & 0x7fffffff) % 100; }
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const isCorner = (r < 7 && c < 7) || (r < 7 && c >= grid-7) || (r >= grid-7 && c < 7);
      const filled = isCorner || seededRand(r * grid + c) > 45;
      if (filled) ctx.fillRect(offset + c*cell, offset + r*cell, cell-1, cell-1);
    }
  }
  // Corner squares
  [[0,0],[0,grid-7],[grid-7,0]].forEach(([r,c]) => {
    ctx.strokeStyle = '#1a1a1e'; ctx.lineWidth = cell;
    ctx.strokeRect(offset+c*cell+cell/2, offset+r*cell+cell/2, 6*cell-cell, 6*cell-cell);
    ctx.fillRect(offset+c*cell+2*cell, offset+r*cell+2*cell, 3*cell, 3*cell);
  });
}


// ══════════════════════════════════════════════════════
//  PT BOOKING — NEW 3-TAB IMPLEMENTATION
// ══════════════════════════════════════════════════════
const VIET_DAYS_SHORT = ['CN','T2','T3','T4','T5','T6','T7'];
let ptFavorites = JSON.parse(localStorage.getItem('foxy_pt_favs') || '[]');
let ptSelectedDateNew = null; // Date object
let ptTimelineStartMin = 0;   // selected start in minutes
let ptTimelineDurMin = 60;    // selected duration in minutes
let ptCurrentSubtab = 'all';

const MOCK_BOOKINGS = [
  { day:'Thứ Hai, 28/04', time:'08:00 → 09:00', gym:'California Fitness Q1', pt:'Minh Trần', content:'Push Day — Ngực & Vai' },
  { day:'Thứ Tư, 30/04', time:'17:30 → 18:30', gym:'Fit24 Q7', pt:'Linh Nguyễn', content:'HIIT + Cardio Circuit' },
  { day:'Thứ Bảy, 03/05', time:'09:00 → 10:00', gym:'California Fitness Q1', pt:'Thảo Lê', content:'Yoga & Flexibility' },
];

function enterPTBookingNew() {
  stopAll();
  showScreen(screenPtBooking);
  renderProfileAvatar();
  ptSelectedDateNew = null;
  ptTimelineStartMin = 0;
  ptTimelineDurMin = 60;
  // Default to booking tab
  switchPTTab('booking');
  renderPTDateChips();
  renderMyTraining();
  renderMyPTs('all');
  // Tab bar wiring
  document.querySelectorAll('.pt-tab-btn').forEach(btn => {
    btn.onclick = () => switchPTTab(btn.dataset.ptab);
  });
  // My PTs subtab wiring
  document.querySelectorAll('.pt-mypts-subtab').forEach(btn => {
    btn.onclick = () => {
      ptCurrentSubtab = btn.dataset.subtab;
      document.querySelectorAll('.pt-mypts-subtab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMyPTs(ptCurrentSubtab);
    };
  });
  // Filter chips wiring
  document.querySelectorAll('.pt-filter-chip').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.pt-filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMyPTs(ptCurrentSubtab, btn.dataset.filter);
    };
  });
}

function switchPTTab(tab) {
  document.querySelectorAll('.pt-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-ptab="${tab}"]`).classList.add('active');
  document.querySelectorAll('.pt-tab-content').forEach(c => c.classList.add('hidden'));
  document.getElementById(`pt-tab-${tab}`).classList.remove('hidden');
}

function renderPTDateChips() {
  const row = document.getElementById('pt-date-row');
  if (!row) return;
  const today = new Date(); today.setHours(0,0,0,0);
  let html = '';
  for (let i = 0; i < 14; i++) {
    const d = new Date(today); d.setDate(d.getDate() + i);
    const hasAny = isAnyPTAvailableOnDate(d);
    const cls = hasAny ? '' : ' locked';
    html += `<div class="pt-date-chip${cls}" data-date="${dateToStr(d)}">
      <span class="pt-date-dow">${VIET_DAYS_SHORT[d.getDay()]}</span>
      <span class="pt-date-num">${d.getDate()}</span>
    </div>`;
  }
  row.innerHTML = html;
  row.querySelectorAll('.pt-date-chip:not(.locked)').forEach(chip => {
    chip.addEventListener('click', () => {
      row.querySelectorAll('.pt-date-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      ptSelectedDateNew = new Date(chip.dataset.date + 'T00:00:00');
      renderTimeline(ptSelectedDateNew);
      document.getElementById('pt-results-section').classList.add('hidden');
    });
  });
  // Auto-select today if available
  const firstAvail = row.querySelector('.pt-date-chip:not(.locked)');
  if (firstAvail) firstAvail.click();
}

function renderTimeline(date) {
  const wrap = document.getElementById('pt-timeline-inner');
  if (!wrap) return;
  // Check which slots are available (any PT)
  const lockedHours = new Set();
  for (let h = 0; h < 24; h++) {
    const startStr = String(h).padStart(2,'0') + ':00';
    const endStr = String(h+1).padStart(2,'0') + ':00';
    if (!getAvailablePTs(date, startStr, endStr).length) lockedHours.add(h);
  }
  let html = '';
  for (let h = 5; h <= 21; h++) {
    const locked0 = lockedHours.has(h);
    const locked1 = lockedHours.has(h); // 30-min slot same hour
    html += `<div class="pt-timeline-hour">
      <span class="pt-timeline-hour-label">${String(h).padStart(2,'0')}:00</span>
      <div class="pt-timeline-slots">
        <div class="pt-timeline-slot ${locked0 ? 'locked' : 'available'}" data-min="${h*60}"></div>
        <div class="pt-timeline-slot ${locked1 ? 'locked' : 'available'}" data-min="${h*60+30}"></div>
      </div>
    </div>`;
  }
  wrap.innerHTML = html;
  // Selection element
  const selEl = document.createElement('div');
  selEl.className = 'pt-timeline-selection';
  selEl.id = 'pt-sel-block';
  selEl.innerHTML = `
    <div class="pt-resize-handle top" id="pt-rh-top"></div>
    <div class="pt-sel-label-inner" id="pt-sel-inner">08:00 → 09:00</div>
    <div class="pt-resize-handle bottom" id="pt-rh-bot"></div>`;
  wrap.appendChild(selEl);
  // Default: current time rounded to 30min, or 08:00
  const now = new Date();
  let defMin = Math.round((now.getHours() * 60 + now.getMinutes()) / 30) * 30;
  if (defMin < 5*60) defMin = 8*60;
  if (defMin > 21*60) defMin = 8*60;
  ptTimelineStartMin = defMin;
  ptTimelineDurMin = 60;
  updateSelectionBlock();
  // Click on slots to set start
  wrap.querySelectorAll('.pt-timeline-slot.available').forEach(slot => {
    slot.addEventListener('click', () => {
      ptTimelineStartMin = parseInt(slot.dataset.min);
      updateSelectionBlock();
      showSelectionInfo();
    });
  });
  // Drag to resize — bottom handle
  const rhBot = document.getElementById('pt-rh-bot');
  if (rhBot) {
    rhBot.addEventListener('touchstart', startResizeBot, { passive: false });
    rhBot.addEventListener('mousedown', startResizeBot);
  }
  const rhTop = document.getElementById('pt-rh-top');
  if (rhTop) {
    rhTop.addEventListener('touchstart', startResizeTop, { passive: false });
    rhTop.addEventListener('mousedown', startResizeTop);
  }
  selEl.addEventListener('touchstart', startMoveSelection, { passive: false });
  selEl.addEventListener('mousedown', startMoveSelection);
  // Scroll to current time
  const containerH = 60; // px per hour
  const scrollTo = (defMin / 60 - 5) * containerH - 60;
  setTimeout(() => {
    const tw = document.getElementById('pt-timeline-wrap');
    if (tw) tw.scrollTop = Math.max(0, scrollTo);
  }, 100);
  showSelectionInfo();
}

let resizeBotStart = null;
function startResizeBot(e) {
  e.preventDefault();
  const startY = e.touches ? e.touches[0].clientY : e.clientY;
  const startDur = ptTimelineDurMin;
  function onMove(ev) {
    const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
    const diffPx = clientY - startY;
    const diffMin = Math.round(diffPx / 15) * 15; // 15-min snapping
    ptTimelineDurMin = Math.max(15, Math.min(180, Math.min(22 * 60 - ptTimelineStartMin, startDur + diffMin)));
    updateSelectionBlock();
    showSelectionInfo();
  }
  function onEnd() {
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
  }
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

function startResizeTop(e) {
  e.preventDefault();
  e.stopPropagation();
  const startY = e.touches ? e.touches[0].clientY : e.clientY;
  const startMin = ptTimelineStartMin;
  const startDur = ptTimelineDurMin;
  function onMove(ev) {
    const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
    const diffMin = Math.round((clientY - startY) / 15) * 15;
    const newStart = Math.max(5 * 60, Math.min(startMin + diffMin, startMin + startDur - 15));
    ptTimelineDurMin = startDur + (startMin - newStart);
    ptTimelineStartMin = newStart;
    updateSelectionBlock();
    showSelectionInfo();
  }
  function onEnd() {
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
  }
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

function startMoveSelection(e) {
  if (e.target.classList.contains('pt-resize-handle')) return;
  e.preventDefault();
  const startY = e.touches ? e.touches[0].clientY : e.clientY;
  const startMin = ptTimelineStartMin;
  function onMove(ev) {
    const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
    const diffMin = Math.round((clientY - startY) / 15) * 15;
    ptTimelineStartMin = Math.max(5 * 60, Math.min(22 * 60 - ptTimelineDurMin, startMin + diffMin));
    updateSelectionBlock();
    showSelectionInfo();
  }
  function onEnd() {
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
  }
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
}

function updateSelectionBlock() {
  const selEl = document.getElementById('pt-sel-block');
  if (!selEl) return;
  const pxPerMin = 60 / 60; // 60px per hour, 1px per minute
  const offsetMin = ptTimelineStartMin - 5 * 60;
  selEl.style.top = (offsetMin * pxPerMin) + 'px';
  selEl.style.height = (ptTimelineDurMin * pxPerMin) + 'px';
  const inner = document.getElementById('pt-sel-inner');
  if (inner) inner.textContent = minToTime(ptTimelineStartMin) + ' → ' + minToTime(ptTimelineStartMin + ptTimelineDurMin);
}

function showSelectionInfo() {
  const infoEl = document.getElementById('pt-selection-info');
  const timeEl = document.getElementById('pt-sel-time');
  if (infoEl) infoEl.classList.remove('hidden');
  if (timeEl) timeEl.textContent = minToTime(ptTimelineStartMin) + ' → ' + minToTime(ptTimelineStartMin + ptTimelineDurMin);
}

document.getElementById('btn-find-pt').addEventListener('click', () => {
  if (!ptSelectedDateNew) return;
  const startStr = minToTime(ptTimelineStartMin);
  const endStr = minToTime(ptTimelineStartMin + ptTimelineDurMin);
  const avail = getAvailablePTs(ptSelectedDateNew, startStr, endStr);
  const sec = document.getElementById('pt-results-section');
  const label = document.getElementById('pt-results-label');
  const scroll = document.getElementById('pt-results-scroll');
  sec.classList.remove('hidden');
  if (!avail.length) {
    label.textContent = '😔 Không có PT nào rảnh';
    scroll.innerHTML = '<div class="pt-empty"><div class="pt-empty-title">Thử chọn khung giờ khác</div></div>';
  } else {
    label.textContent = `🎯 ${avail.length} PT có sẵn`;
    const durH = ptTimelineDurMin / 60;
    scroll.innerHTML = avail.map(pt => renderPTCardNew(pt, durH)).join('');
    scroll.querySelectorAll('.pt-book-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pt = PT_PROFILES.find(p => p.id === btn.dataset.ptid);
        if (pt) openBookingConfirm(pt, {
          date: ptSelectedDateNew,
          start: startStr,
          end: endStr
        });
      });
    });
    scroll.querySelectorAll('.pt-card-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        toggleFavPT(btn.dataset.ptid);
        btn.textContent = ptFavorites.includes(btn.dataset.ptid) ? '❤️' : '🤍';
      });
    });
  }
});

function renderPTCardNew(pt, durH) {
  const pricePerH = pt.pricePerHour || (150000 + pt.rating * 10000);
  const totalPrice = Math.round(pricePerH * durH);
  const isFav = ptFavorites.includes(pt.id);
  const stars = '★'.repeat(Math.floor(pt.rating));
  return `<div class="pt-card">
    <div class="pt-card-top">
      <div class="pt-avatar-wrap"><img src="${pt.avatar}" alt="${pt.name}" class="pt-avatar"></div>
      <div class="pt-info">
        <div class="pt-name">${pt.name}</div>
        <div class="pt-specialty">${pt.specialty}</div>
        <div class="pt-meta-row">
          <div class="pt-rating"><span class="pt-rating-stars">${stars}</span> ${pt.rating}</div>
          <div class="pt-experience">📅 ${pt.experience}</div>
        </div>
        <div style="color:var(--accent);font-weight:800;font-size:13px;margin-top:4px">${totalPrice.toLocaleString()}đ / ${durH}h</div>
      </div>
      <button class="pt-card-fav-btn" data-ptid="${pt.id}">${isFav ? '❤️' : '🤍'}</button>
    </div>
    <div class="pt-bio">${pt.bio}</div>
    <button class="btn-primary pt-book-btn" data-ptid="${pt.id}">
      <span class="btn-label">Đặt lịch với ${pt.name.split(' ')[0]}</span>
    </button>
  </div>`;
}

function toggleFavPT(ptId) {
  if (ptFavorites.includes(ptId)) ptFavorites = ptFavorites.filter(id => id !== ptId);
  else ptFavorites.push(ptId);
  localStorage.setItem('foxy_pt_favs', JSON.stringify(ptFavorites));
}

function renderMyTraining() {
  const list = document.getElementById('pt-my-training-list');
  if (!list) return;
  list.innerHTML = MOCK_BOOKINGS.map(b => `
    <div class="pt-training-card">
      <div class="pt-training-day">📅 ${b.day}</div>
      <div class="pt-training-meta">
        <span class="pt-training-field">⏰ ${b.time}</span>
        <span class="pt-training-field">📍 ${b.gym}</span>
      </div>
      <div class="pt-training-field">👤 PT: ${b.pt}</div>
      <div class="pt-training-content">💪 ${b.content}</div>
    </div>`).join('');
}

function renderMyPTs(subtab, filter) {
  const list = document.getElementById('pt-mypts-list');
  if (!list) return;
  let pts = PT_PROFILES;
  if (subtab === 'fav') pts = pts.filter(p => ptFavorites.includes(p.id));
  if (filter && filter !== 'all') {
    pts = pts.filter(p => p.specialty.includes(filter));
  }
  if (!pts.length) {
    list.innerHTML = '<div class="no-saved" style="padding:20px 0">Chưa có PT nào</div>';
    return;
  }
  list.innerHTML = pts.map(pt => renderPTCardNew(pt, 1)).join('');
  list.querySelectorAll('.pt-book-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPTTab('booking'));
  });
  list.querySelectorAll('.pt-card-fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      toggleFavPT(btn.dataset.ptid);
      btn.textContent = ptFavorites.includes(btn.dataset.ptid) ? '❤️' : '🤍';
      if (ptCurrentSubtab === 'fav') renderMyPTs('fav', filter);
    });
  });
}

// Override enterPTBooking to use new version
const _origEnterPTBooking = enterPTBooking;
enterPTBooking = enterPTBookingNew;


// ══════════════════════════════════════════════════════
//  FIX: Re-wire buttons that were wired before overrides
// ══════════════════════════════════════════════════════
// Re-wire PT booking (was wired to old enterPTBooking before override)
document.getElementById('btn-book-pt').onclick = enterPTBooking;

// Re-wire PT back button for new layout
document.getElementById('btn-pt-back').onclick = enterHome;

// ══════════════════════════════════════════════════════
//  FIX: Picker done — also refresh QW list if active
// ══════════════════════════════════════════════════════
const _origFinishPicking = finishPicking;
finishPicking = function() {
  _origFinishPicking();
  // If we opened picker from QW screen, re-render QW list too
  if (!screenQuickWorkout.classList.contains('hidden') ||
      setupBackTarget === 'quick-workout') {
    renderQuickExerciseList();
  }
  if (appPhase === 'resting' && !screenRest.classList.contains('hidden')) {
    openWEP();
  }
};

// ══════════════════════════════════════════════════════
//  INIT: render avatar on startup
// ══════════════════════════════════════════════════════
renderProfileAvatar();

// PT price field fallback (if missing from data)
PT_PROFILES.forEach(pt => {
  if (!pt.pricePerHour) pt.pricePerHour = Math.round(150000 + pt.rating * 20000);
});

// ══════════════════════════════════════════════════════
//  QUICK WORKOUT SIMPLICITY LAYOUT
// ══════════════════════════════════════════════════════
function ensureQuickWorkoutSimpleLayout() {
  if (!screenQuickWorkout || screenQuickWorkout.dataset.simpleLayout === '1') return;

  const bottomNav = screenQuickWorkout.querySelector('.qw-bottom-nav');
  const wrapper = document.createElement('div');
  wrapper.className = 'qw-simple-scroll';

  Array.from(screenQuickWorkout.children).forEach(child => {
    if (child !== bottomNav) wrapper.appendChild(child);
  });
  screenQuickWorkout.insertBefore(wrapper, bottomNav || null);

  const topbar = document.createElement('div');
  topbar.className = 'qw-simple-topbar';
  topbar.innerHTML = `
    <button class="qw-square-btn" id="btn-qw-back-home" type="button" aria-label="Back">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button class="qw-square-btn" id="btn-qw-settings" type="button" aria-label="Saved workouts">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a1 1 0 0 1 1 1v15l-7-3-7 3V5a1 1 0 0 1 1-1Z"/></svg>
    </button>`;

  const hero = document.createElement('div');
  hero.className = 'qw-hero-simple';
  hero.innerHTML = `
    <div class="qw-hero-copy">
      <h1>Sẵn sàng<br>bắt đầu!</h1>
      <p>Tùy chỉnh nhanh buổi tập của bạn nhé.</p>
    </div>
    <img src="fox.png" alt="Foxy coach" class="qw-hero-fox">`;

  wrapper.insertBefore(hero, wrapper.firstChild);
  wrapper.insertBefore(topbar, hero);

  const titleRow = wrapper.querySelector('.qw-title-row');
  if (titleRow) titleRow.classList.add('qw-workout-card');

  const changeBtn = document.getElementById('btn-qw-change-workout');
  if (changeBtn) changeBtn.innerHTML = '<span>Đổi bài tập</span>';

  const hscrollWrap = wrapper.querySelector('.qw-hscroll-wrap');
  const hscroll = document.getElementById('qw-hscroll');
  if (hscrollWrap && hscroll) {
    const goalLabel = document.createElement('div');
    goalLabel.className = 'qw-section-label';
    goalLabel.textContent = 'Mục tiêu buổi tập';

    const goalGrid = document.createElement('div');
    goalGrid.className = 'qw-goal-grid';
    const durationBtn = document.getElementById('btn-qw-duration');
    const intensityBtn = document.getElementById('btn-qw-intensity');
    if (durationBtn) {
      durationBtn.classList.add('qw-goal-card');
      durationBtn.insertAdjacentHTML('afterbegin', '<span class="qw-goal-icon">⌚</span><span class="qw-goal-label">Thời lượng</span>');
      goalGrid.appendChild(durationBtn);
    }
    if (intensityBtn) {
      intensityBtn.classList.add('qw-goal-card');
      intensityBtn.insertAdjacentHTML('afterbegin', '<span class="qw-goal-icon">▮</span><span class="qw-goal-label">Cường độ</span>');
      goalGrid.appendChild(intensityBtn);
    }

    const addonLabel = document.createElement('div');
    addonLabel.className = 'qw-section-label';
    addonLabel.textContent = 'Tùy chọn thêm';

    const addonCard = document.createElement('div');
    addonCard.className = 'qw-addon-card';
    const coreBtn = document.getElementById('btn-qw-core');
    const warmupBtn = document.getElementById('btn-qw-warmup');
    decorateQuickAddon(coreBtn, 'Bài core', 'Tăng sức mạnh vùng core');
    decorateQuickAddon(warmupBtn, 'Khởi động', '5 phút làm nóng');
    if (coreBtn) addonCard.appendChild(coreBtn);
    if (warmupBtn) addonCard.appendChild(warmupBtn);

    hscrollWrap.replaceChildren(goalLabel, goalGrid, addonLabel, addonCard);
  }

  const gymBtn = document.getElementById('btn-qw-gym');
  if (gymBtn) gymBtn.classList.add('hidden');

  const previewTitle = wrapper.querySelector('.qw-preview-title');
  if (previewTitle) previewTitle.textContent = 'Xem trước buổi tập';

  const startBtn = document.getElementById('btn-qw-start');
  if (startBtn) {
    startBtn.innerHTML = '<img src="fox.png" alt="" class="qw-start-fox"><span class="btn-label">Bắt đầu buổi tập</span><span class="qw-start-arrow">›</span>';
  }

  const backBtn = document.getElementById('btn-qw-back-home');
  if (backBtn) backBtn.addEventListener('click', enterHome);
  const settingsBtn = document.getElementById('btn-qw-settings');
  if (settingsBtn) settingsBtn.addEventListener('click', enterSavedWorkouts);

  const navLabels = screenQuickWorkout.querySelectorAll('.bottom-nav-item span');
  if (navLabels[0]) navLabels[0].textContent = 'Home';
  if (navLabels[1]) navLabels[1].textContent = 'Tập ngay';
  if (navLabels[2]) navLabels[2].textContent = 'Đã lưu';

  screenQuickWorkout.dataset.simpleLayout = '1';
}

function decorateQuickAddon(btn, title, subtitle) {
  if (!btn || btn.dataset.decorated === '1') return;
  const sign = btn.querySelector('.qw-pill-sign');
  btn.classList.add('qw-addon-row');
  btn.innerHTML = `
    <img src="fox.png" alt="" class="qw-addon-fox">
    <span class="qw-addon-copy"><strong>${title}</strong><small>${subtitle}</small></span>
    ${sign ? sign.outerHTML : '<span class="qw-pill-sign">+</span>'}`;
  btn.dataset.decorated = '1';
}

const _simplicityEnterQuickWorkout = enterQuickWorkout;
let qwShowAllExercises = false;

enterQuickWorkout = function() {
  qwShowAllExercises = false;
  _simplicityEnterQuickWorkout();
  ensureQuickWorkoutSimpleLayout();
  renderQuickExerciseList();
};

function formatQuickRest(sec) {
  const total = Math.max(0, Math.round(sec || 0));
  const min = Math.floor(total / 60);
  const restSec = total % 60;
  if (min === 0) return `${restSec} giây`;
  if (restSec === 0) return `${min} phút`;
  return `${min} phút ${restSec} giây`;
}

function formatQuickExerciseMeta(ex) {
  const weight = Number.isFinite(Number(ex.weight)) ? Number(ex.weight).toLocaleString('vi-VN') : '0';
  return `${ex.sets} set x ${ex.reps} rep x ${weight} kg (${formatQuickRest(ex.rest)} nghỉ)`;
}

const _simplicityRegenerateQuickWorkout = regenerateQuickWorkout;
regenerateQuickWorkout = function() {
  qwShowAllExercises = false;
  _simplicityRegenerateQuickWorkout();
};

renderQuickExerciseList = function() {
  if (workoutPlan.length === 0) {
    qwExerciseList.innerHTML = '<div class="no-saved" style="padding:20px 0;">Không có bài tập nào</div>';
    return;
  }

  const visible = qwShowAllExercises ? workoutPlan : workoutPlan.slice(0, 3);
  const remaining = Math.max(0, workoutPlan.length - visible.length);
  qwExerciseList.innerHTML = visible.map((ex, i) => `
    <button class="qw-simple-ex-row" data-guidance="${i}" type="button">
      <span class="qw-simple-index">${i + 1}</span>
      <img src="fox.png" alt="" class="qw-simple-ex-fox">
      <span class="qw-simple-ex-copy">
        <strong>${esc(ex.name)}</strong>
        <small>${formatQuickExerciseMeta(ex)}</small>
      </span>
      <span class="qw-chevron">›</span>
    </button>
  `).join('') + (remaining > 0 ? `
    <button class="qw-simple-more" id="qw-simple-more" type="button">+${remaining} bài tập khác <span>⌄</span></button>
  ` : '') + `
    <button class="qw-ex-add-btn" id="qw-ex-add" type="button">+ Thêm bài tập</button>
  `;

  qwExerciseList.querySelectorAll('[data-guidance]').forEach(btn => {
    btn.addEventListener('click', () => openGuidanceModal(workoutPlan[parseInt(btn.dataset.guidance)]));
  });
  const moreBtn = document.getElementById('qw-simple-more');
  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      qwShowAllExercises = true;
      renderQuickExerciseList();
    });
  }
  const addBtn = document.getElementById('qw-ex-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      selectedIds = new Set(workoutPlan.map(e => e.id));
      openPicker();
    });
  }
};

