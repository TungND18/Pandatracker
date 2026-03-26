// =====================================================
//  PANDA GYM TRACKER — app.js (v3)
//  5 screens: home → setup → active → rest → complete
// =====================================================

// ── DOM refs ─────────────────────────────────────────
// Screens
const screenHome = document.getElementById('screen-home');
const screenSetup = document.getElementById('screen-setup');
const screenActive = document.getElementById('screen-active');
const screenRest = document.getElementById('screen-rest');
const screenComplete = document.getElementById('screen-complete');
const ALL_SCREENS = [screenHome, screenSetup, screenActive, screenRest, screenComplete];

// Home
const btnStartWorkout = document.getElementById('btn-start-workout');
const btnSavedWorkouts = document.getElementById('btn-saved-workouts');
const savedPanel = document.getElementById('saved-panel');
const savedClose = document.getElementById('saved-close');
const savedList = document.getElementById('saved-list');

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
let setElapsed = 0;
let restRemaining = 0;
let ticker = null;
let nagTimer = null;
let overtimeNagTimer = null;
let elapsedTicker = null;
let totalElapsedSec = 0;
let activeCat = 'Back';
let speakTimeout = null;
let overtimeNagStarted = false;
const SEC_PER_REP = 3;
const PROFILE_KEY = 'panda_gym_profiles';

// Rest tracking
let sessionLog = [];
let restStartTime = null;
let overtimeElapsed = 0;
let workoutStartTime = null;

// Exercise-specific coaching cues (keyed by exercise id)
const EXERCISE_CUES = {
  'barbell-bench':    ["Shoulders back. Chest up. Stop being lazy.","Control it down. Don't drop the bar, hero.","Drive through your feet. Yes, legs exist.","Bar path straight. Not a rollercoaster.","Lock in. One more rep. Don't think."],
  'barbell-bench-s':  ["Shoulders back. Chest up. Stop being lazy.","Control it down. Don't drop the bar, hero.","Drive through your feet. Yes, legs exist.","Bar path straight. Not a rollercoaster.","Lock in. One more rep. Don't think."],
  'incline-barbell':  ["Upper chest. Not shoulders. Fix it.","Slow down. You're not escaping gravity.","Elbows under control. No flaring chaos.","Stretch it. Feel it. Don't rush reps.","You call that depth? Go lower."],
  'machine-shoulder': ["Core tight. You're not a noodle.","Don't slam it. Control the weight.","Full lockout. Earn it.","Head through. Yes, like that.","Stop cheating. Press properly."],
  'lateral-raise':    ["No swinging. Ego down.","Lift with shoulders, not momentum.","Small weight. Big control. Accept it.","Pause at top. Suffer a bit.","If traps take over, you failed."],
  'machine-fly':      ["Squeeze. HARDER. Hug the damn air.","Slow return. Milk every inch.","Chest only. Arms are just hooks.","Pause. Feel it. That's the point.","Don't rush. This is where growth happens."],
  'barbell-curl':     ["No swinging. I see you cheating.","Elbows locked. Only forearms move.","Slow down. You're not speedrunning.","Squeeze at top. Make it count.","Control down. That's half the rep."],
  'seated-db-curl':   ["Full stretch. Let it open.","Twist the wrist. Finish strong.","No shoulders. Just biceps.","Slow and painful. Good.","You're here for arms, act like it."],
  'hammer-curl':      ["No rest. Keep going.","Burn is good. Stop complaining.","Neutral grip. Stay clean.","Last reps. Don't quit now.","This is where weak people stop."]
};

// Generic fallback cues (only used for exercises without specific cues)
const GENERIC_CUES = [
  "Control the movement.",
  "Full range of motion.",
  "Breathe. Exhale on effort.",
  "Squeeze at the top.",
  "Stay focused."
];

// Get a coaching cue for the current exercise (exercise-specific only)
function getCoachingCue(exerciseId) {
  return randomFrom(EXERCISE_CUES[exerciseId] || GENERIC_CUES);
}

const REST_MSGS = [
  "Great set! Let your muscles recover 💤",
  "Shake it off, hydrate up 💧",
  "Breathe deep, reset your mind 🧘",
  "You earned this break! ☕",
  "Muscles growing as we speak 📈",
  "Stay loose, stay ready 🔄"
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
  clearInterval(nagTimer);
  clearInterval(overtimeNagTimer);
  clearInterval(elapsedTicker);
  clearTimeout(speakTimeout);
  ticker = null;
  nagTimer = null;
  overtimeNagTimer = null;
  elapsedTicker = null;
  speakTimeout = null;
  overtimeNagStarted = false;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
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
  savedPanel.classList.add('hidden');
  enterSetup();
}

// ══════════════════════════════════════════════════════
//  SCREEN 1: HOME
// ══════════════════════════════════════════════════════
function enterHome() {
  stopAll();
  showScreen(screenHome);
  savedPanel.classList.add('hidden');
  workoutPlan = [];
  selectedIds.clear();
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
  setElapsed = 0;

  const ex = workoutPlan[currentExIdx];
  activeExercise.textContent = ex.name;
  activeSetBadge.textContent = `Set ${currentSetNum}/${ex.sets}`;
  detailReps.textContent = ex.reps;
  detailWeight.textContent = `${ex.weight}kg`;
  const firstCue = getCoachingCue(ex.id);
  coachingText.textContent = firstCue;

  activeTimer.textContent = '0:00';
  updateWorkoutProgress();

  unlockSpeech();

  // Count up timer for the set
  ticker = setInterval(() => {
    setElapsed++;
    activeTimer.textContent = fmt(setElapsed);
  }, 1000);

  // Total elapsed timer
  if (!elapsedTicker) {
    elapsedTicker = setInterval(() => {
      totalElapsedSec++;
      activeElapsed.textContent = fmt(totalElapsedSec);
    }, 1000);
  }

  // Voice coaching every 5s with exercise-specific cues
  nagTimer = setInterval(() => {
    const cue = getCoachingCue(ex.id);
    coachingText.textContent = cue;
    speak(cue);
  }, 5000);
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

  const ex = workoutPlan[currentExIdx];
  restRemaining = ex.rest;
  restStartTime = Date.now();
  overtimeElapsed = 0;
  overtimeNagStarted = false;

  restTimer.textContent = fmt(restRemaining);
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


  ticker = setInterval(() => {
    restRemaining--;

    if (restRemaining >= 0) {
      // Normal countdown
      restTimer.textContent = fmt(restRemaining);
      const fraction = restRemaining / ex.rest;
      restRingFg.style.strokeDashoffset = `${circumference * (1 - fraction)}`;
    } else {
      // Overtime
      overtimeElapsed = Math.abs(restRemaining);
      restTimer.textContent = `+${fmt(overtimeElapsed)}`;
      restTimer.classList.add('overtime');
      restRingFg.classList.add('overtime');
      restRingFg.style.strokeDashoffset = `${circumference}`;

      if (!overtimeNagStarted) {
        overtimeNagStarted = true;
        // Announce rest is over
        speak('Back to track. Rest over.');
        restMotivational.textContent = 'Rest over! Get back to it! ⚡';
        // Start nagging every 10s
        overtimeNagTimer = setInterval(() => {
          const nagMsg = Math.random() < 0.5 ? 'Why so slow?' : 'Back to track.';
          speak(nagMsg);
          restMotivational.textContent = nagMsg === 'Why so slow?'
            ? 'Panda is getting impatient... 😤'
            : 'Rest over! Move it! ⚡';
        }, 10000);
      }
    }
  }, 1000);

  // Elapsed timer continues
  if (!elapsedTicker) {
    elapsedTicker = setInterval(() => {
      totalElapsedSec++;
      restElapsed.textContent = fmt(totalElapsedSec);
    }, 1000);
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

  speak(`Workout complete! You rested ${fmt(totalActualRest)} total. That is ${Math.abs(restPct)} percent ${restDiff >= 0 ? 'more' : 'less'} than planned.`);
}

function spawnConfetti() {
  confettiBurst.innerHTML = '';
  const colors = ['#FF6B35', '#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'];
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

// Home
btnStartWorkout.addEventListener('click', () => {
  selectedIds.clear();
  workoutPlan = [];
  enterSetup();
});

btnSavedWorkouts.addEventListener('click', () => {
  savedPanel.classList.toggle('hidden');
  if (!savedPanel.classList.contains('hidden')) {
    renderSavedList();
  }
});

savedClose.addEventListener('click', () => {
  savedPanel.classList.add('hidden');
});

// Setup
btnSetupBack.addEventListener('click', enterHome);
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
  totalElapsedSec = 0;
  workoutStartTime = Date.now();
  updateWorkoutProgress();
  enterTraining();
});

// Picker
pickerClose.addEventListener('click', closePicker);
pickerDone.addEventListener('click', finishPicking);

// Active
btnFinishSet.addEventListener('click', enterResting);

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
