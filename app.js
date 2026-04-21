// =====================================================
//  PANDA GYM TRACKER — app.js (v3)
//  5 screens: home → setup → active → rest → complete
// =====================================================

// ── DOM refs ─────────────────────────────────────────
// Screens
const screenHome = document.getElementById('screen-home');
const screenQuickPreview = document.getElementById('screen-quick-preview');
const screenChangeWorkout = document.getElementById('screen-change-workout');
const screenSetup = document.getElementById('screen-setup');
const screenActive = document.getElementById('screen-active');
const screenRest = document.getElementById('screen-rest');
const screenComplete = document.getElementById('screen-complete');
const screenPtBooking = document.getElementById('screen-pt-booking');
const ALL_SCREENS = [screenHome, screenQuickPreview, screenChangeWorkout, screenSetup, screenActive, screenRest, screenComplete, screenPtBooking];

// Home
const btnStartWorkout = document.getElementById('btn-start-workout');
const btnMyGym = document.getElementById('btn-my-gym');
const btnBookPt = document.getElementById('btn-book-pt');
const savedPanel = document.getElementById('saved-panel');
const savedClose = document.getElementById('saved-close');
const savedList = document.getElementById('saved-list');

// Quick Workout
const btnQuickBack = document.getElementById('btn-quick-back');
const quickWorkoutTitle = document.getElementById('quick-workout-title');
const quickPreviewList = document.getElementById('quick-preview-list');
const btnStartQuickWorkout = document.getElementById('btn-start-quick-workout');
const btnChangeWorkout = document.getElementById('btn-change-workout');
const btnDuration = document.getElementById('btn-duration');
const btnGym = document.getElementById('btn-gym');
const btnIntensity = document.getElementById('btn-intensity');
const btnToggleCore = document.getElementById('btn-toggle-core');
const btnToggleWarmup = document.getElementById('btn-toggle-warmup');
const screenChangeWorkoutGrid = document.getElementById('change-workout-grid');
const btnChangeWorkoutBack = document.getElementById('btn-change-workout-back');
const btnLoadSaved = document.getElementById('btn-load-saved');
const btnCreateNewWorkout = document.getElementById('btn-create-new-workout');
const durationModal = document.getElementById('duration-modal');
const durationOptions = document.getElementById('duration-options');
const intensityModal = document.getElementById('intensity-modal');
const intensityOptions = document.getElementById('intensity-options');
const btnPtBack = document.getElementById('btn-pt-back');

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



// ── State ────────────────────────────────────────────
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

let quickConfig = {
  type: randomWorkoutType(),
  durationMin: 60,
  intensity: 'Intermediate',
  addCore: false,
  addWarmup: false,
};
let quickGeneratedWorkout = null;

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



// Rest tracking
let sessionLog = [];

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

function renderSavedList() {
  const profiles = loadProfiles();
  if (profiles.length === 0) {
    savedList.innerHTML = '<div class="no-saved">No saved workouts yet.<br>Create your first one!</div>';
    return;
  }
  savedList.innerHTML = profiles.map((p, i) => {
    const ts = p.exercises.reduce((s, e) => s + e.sets, 0);
    const tk = p.exercises.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);
    return `
      <div class="saved-card" data-idx="${i}">
        <div class="saved-info">
          <div class="saved-name">${esc(p.name)}</div>
          <div class="saved-meta">${p.exercises.length} exercises · ${ts} sets · ${fmtWeight(Math.round(tk))}</div>
        </div>
        <button class="saved-del" data-delidx="${i}" title="Delete">🗑️</button>
      </div>`;
  }).join('');

  savedList.querySelectorAll('.saved-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.saved-del')) return;
      const idx = parseInt(card.dataset.idx);
      applyProfile(loadProfiles()[idx]);
    });
  });
  savedList.querySelectorAll('.saved-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.delidx);
      const profs = loadProfiles();
      profs.splice(idx, 1);
      saveProfiles(profs);
      renderSavedList();
    });
  });
}

function applyProfile(profile) {
  workoutPlan = profile.exercises.map(e => ({ ...e }));
  if (savedPanel) savedPanel.classList.add('hidden');
  enterSetup();
}

// ══════════════════════════════════════════════════════
//  SCREEN 1: HOME
// ══════════════════════════════════════════════════════
function enterHome() {
  stopAll();
  showScreen(screenHome);
  if (savedPanel) savedPanel.classList.add('hidden');
  workoutPlan = [];
  selectedIds.clear();
}


// ══════════════════════════════════════════════════════
//  QUICK WORKOUT FLOW
// ══════════════════════════════════════════════════════
function regenerateQuickWorkout() {
  quickGeneratedWorkout = generateWorkout(
    quickConfig.type,
    quickConfig.durationMin,
    quickConfig.intensity,
    quickConfig.addCore,
    quickConfig.addWarmup
  );

  quickWorkoutTitle.textContent = quickGeneratedWorkout.name;
  btnDuration.textContent = `⏱️ Thời gian: ${quickConfig.durationMin >= 60 && quickConfig.durationMin % 60 === 0 ? `${quickConfig.durationMin / 60}h` : `${quickConfig.durationMin}m`}`;
  btnIntensity.textContent = `💪 Cường độ: ${quickConfig.intensity}`;
  btnToggleCore.textContent = `🧱 + Core Workout: ${quickConfig.addCore ? 'ON' : 'OFF'}`;
  btnToggleWarmup.textContent = `🧘 + Warmup/Cool down: ${quickConfig.addWarmup ? 'ON' : 'OFF'}`;

  quickPreviewList.innerHTML = quickGeneratedWorkout.exercises.map((ex, idx) => `
    <div class="quick-preview-item">
      <div><strong>${idx + 1}. ${ex.emoji || '🏋️'} ${ex.name}</strong></div>
      <div class="picker-item-defaults">${ex.sets} sets × ${ex.reps} reps · rest ${ex.rest}s</div>
    </div>
  `).join('');
}

function enterQuickPreview() {
  stopAll();
  showScreen(screenQuickPreview);
  regenerateQuickWorkout();
}

function openDurationModal() {
  const values = [];
  for (let m = 15; m <= 180; m += 15) values.push(m);
  durationOptions.innerHTML = values.map(m => `<button class="picker-item ${m===quickConfig.durationMin?'selected':''}" data-duration="${m}">${m >= 60 && m % 60===0 ? `${m/60}h` : `${m} min`}</button>`).join('');
  durationOptions.querySelectorAll('[data-duration]').forEach(el => el.addEventListener('click', () => {
    quickConfig.durationMin = parseInt(el.dataset.duration);
    durationModal.classList.add('hidden');
    regenerateQuickWorkout();
  }));
  durationModal.classList.remove('hidden');
}

function openIntensityModal() {
  const levels = Object.keys(INTENSITY_MODIFIERS);
  intensityOptions.innerHTML = levels.map(level => `<button class="picker-item ${level===quickConfig.intensity?'selected':''}" data-intensity="${level}">${level}</button>`).join('');
  intensityOptions.querySelectorAll('[data-intensity]').forEach(el => el.addEventListener('click', () => {
    quickConfig.intensity = el.dataset.intensity;
    intensityModal.classList.add('hidden');
    regenerateQuickWorkout();
  }));
  intensityModal.classList.remove('hidden');
}

function enterChangeWorkout() {
  showScreen(screenChangeWorkout);
  screenChangeWorkoutGrid.innerHTML = Object.keys(QUICK_WORKOUT_TYPES).map(type => `
    <button class="quick-type-btn ${type===quickConfig.type?'selected':''}" data-type="${type}">${QUICK_WORKOUT_TYPES[type].emoji} ${type}</button>
  `).join('');

  screenChangeWorkoutGrid.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      quickConfig.type = btn.dataset.type;
      regenerateQuickWorkout();
      enterQuickPreview();
    });
  });
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
//  TOUCH-FRIENDLY DRAG \u0026 DROP REORDERING
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
//  BUTTON WIRING
// ══════════════════════════════════════════════════════

// Home + Quick Workout
btnStartWorkout.addEventListener('click', enterQuickPreview);
btnBookPt?.addEventListener('click', () => showScreen(screenPtBooking));
btnPtBack?.addEventListener('click', enterHome);
btnMyGym?.addEventListener('click', () => alert('Phòng Gym của tôi — Coming soon'));
savedClose?.addEventListener('click', () => {
  if (savedPanel) savedPanel.classList.add('hidden');
});

btnQuickBack?.addEventListener('click', enterHome);
btnChangeWorkout?.addEventListener('click', enterChangeWorkout);
btnChangeWorkoutBack?.addEventListener('click', enterQuickPreview);
btnDuration?.addEventListener('click', openDurationModal);
btnIntensity?.addEventListener('click', openIntensityModal);
btnGym?.addEventListener('click', () => alert('Phòng tập — Coming soon'));
btnToggleCore?.addEventListener('click', () => {
  quickConfig.addCore = !quickConfig.addCore;
  regenerateQuickWorkout();
});
btnToggleWarmup?.addEventListener('click', () => {
  quickConfig.addWarmup = !quickConfig.addWarmup;
  regenerateQuickWorkout();
});
btnStartQuickWorkout?.addEventListener('click', () => {
  workoutPlan = (quickGeneratedWorkout?.exercises || []).map(e => ({ ...e }));
  if (workoutPlan.length === 0) return;
  currentExIdx = 0;
  currentSetNum = 1;
  completedSets = 0;
  totalSets = workoutPlan.reduce((sum, e) => sum + e.sets, 0);
  sessionLog = [];
  restStartTime = null;
  trainingStartTime = null;
  totalElapsedSec = 0;
  workoutElapsedBase = 0;
  workoutStartTime = Date.now();
  updateWorkoutProgress();
  enterTraining();
});
btnLoadSaved?.addEventListener('click', () => {
  savedPanel.classList.toggle('hidden');
  if (!savedPanel.classList.contains('hidden')) renderSavedList();
});
btnCreateNewWorkout?.addEventListener('click', () => {
  selectedIds.clear();
  workoutPlan = [];
  enterSetup();
});
durationModal?.addEventListener('click', (e) => {
  if (e.target === durationModal) durationModal.classList.add('hidden');
});
intensityModal?.addEventListener('click', (e) => {
  if (e.target === intensityModal) intensityModal.classList.add('hidden');
});

// Setup
btnSetupBack.addEventListener('click', enterQuickPreview);
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
//  INIT
// ══════════════════════════════════════════════════════
seedDefaults();
enterHome();

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
