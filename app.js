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
const ALL_SCREENS = [screenHome, screenQuickWorkout, screenChangeWorkout, screenSetup, screenActive, screenRest, screenComplete, screenPtBooking, screenProfile];

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
  updateBottomNav('home');
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
  updateBottomNav('workout');

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
    // Section labels for warmup/core/cooldown
    if (ex.category !== lastCategory) {
      if (ex.category === 'Warmup') {
        html += '<div class="qw-ex-section-label">🔥 Khởi động</div>';
      } else if (ex.category === 'Core') {
        html += '<div class="qw-ex-section-label">🧱 Core</div>';
      } else if (ex.category === 'Cooldown') {
        html += '<div class="qw-ex-section-label">🧘 Giãn cơ</div>';
      } else if (lastCategory === 'Warmup' || lastCategory === '') {
        if (lastCategory === 'Warmup') {
          html += '<div class="qw-ex-section-label">💪 Bài chính</div>';
        }
      }
      lastCategory = ex.category;
    }

    const weightStr = ex.weight > 0 ? `${ex.weight}kg` : 'BW';
    html += `
      <div class="qw-ex-item">
        <span class="qw-ex-emoji">${ex.emoji}</span>
        <div class="qw-ex-info">
          <div class="qw-ex-name">${ex.name}</div>
          <div class="qw-ex-meta">${weightStr} · ${ex.sets}×${ex.reps} · rest ${ex.rest}s</div>
        </div>
        <span class="qw-ex-category-tag">${ex.category}</span>
      </div>`;
  });

  qwExerciseList.innerHTML = html;
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
function openBookingConfirm(pt) {
  ptPendingBooking = {
    ptId: pt.id,
    ptName: pt.name,
    date: ptSelectedDate,
    start: ptSelectedStart,
    end: ptSelectedEnd
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
      <span class="pt-confirm-row-value">${formatDateViet(ptSelectedDate)}</span>
    </div>
    <div class="pt-confirm-row">
      <span class="pt-confirm-row-label">Giờ</span>
      <span class="pt-confirm-row-value">${ptSelectedStart} → ${ptSelectedEnd}</span>
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
  bottomNavItems.forEach(nav => {
    nav.classList.toggle('active', nav.dataset.target === target);
  });
}

bottomNavItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    if (target === 'home') enterHome();
    else if (target === 'workout') { qwWorkoutTypeId = qwWorkoutTypeId || getRandomWorkoutType(); enterQuickWorkout(); }
    else if (target === 'profile') enterProfile();
  });
});

function enterProfile() {
  stopAll();
  showScreen(screenProfile);
  updateBottomNav('profile');
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

