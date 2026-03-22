// =====================================================
//  PANDA GYM TRACKER — app.js (v2)
//  States: home → library → builder → plan-overview
//          → training → resting → rest-done → complete
// =====================================================

// ── DOM refs ─────────────────────────────────────────
const timeDisplay = document.getElementById('time-display');
const timerBar = document.getElementById('timer-progress-bar');
const bellIcon = document.getElementById('bell-icon');
const pandaImg = document.getElementById('panda-img');
const pandaArea = document.getElementById('panda-area');
const bubbleText = document.getElementById('bubble-text');
const speechBubble = document.getElementById('speech-bubble');
const msgEmoji = document.getElementById('msg-emoji');
const msgText = document.getElementById('msg-text');
const dockSubTimer = document.getElementById('dock-sub-timer');
const dockSetsDone = document.getElementById('dock-sets-done');

// Views
const viewHome = document.getElementById('view-home');
const viewLibrary = document.getElementById('view-library');
const viewBuilder = document.getElementById('view-builder');
const viewPlanOverview = document.getElementById('view-plan-overview');
const viewWorkout = document.getElementById('view-workout');

// Home
const profilesList = document.getElementById('profiles-list');

// Library
const catTabsEl = document.getElementById('cat-tabs');
const exerciseListEl = document.getElementById('exercise-list');

// Builder
const builderCount = document.getElementById('builder-count');
const builderListEl = document.getElementById('builder-list');

// Plan overview
const planTotalSets = document.getElementById('plan-total-sets');
const planTotalTime = document.getElementById('plan-total-time');
const planTotalWeight = document.getElementById('plan-total-weight');
const planBreakdown = document.getElementById('plan-breakdown');
const planExList = document.getElementById('plan-exercise-list');
const progressFill = document.getElementById('progress-fill');
const progressLbl = document.getElementById('progress-label-text');
const progressPct = document.getElementById('progress-pct');

// Workout
const phaseBadge = document.getElementById('phase-badge');
const woExName = document.getElementById('wo-exercise-name');
const wiExercise = document.getElementById('wi-exercise');
const wiSet = document.getElementById('wi-set');
const wiWeight = document.getElementById('wi-weight');
const wiReps = document.getElementById('wi-reps');
const progressFill2 = document.getElementById('progress-fill-2');
const progressLbl2 = document.getElementById('progress-label-text-2');
const progressPct2 = document.getElementById('progress-pct-2');

// Control rows
const ctrlHome = document.getElementById('ctrl-home');
const ctrlLibrary = document.getElementById('ctrl-library');
const ctrlBuilder = document.getElementById('ctrl-builder');
const ctrlPlan = document.getElementById('ctrl-plan');
const ctrlTraining = document.getElementById('ctrl-training');
const ctrlResting = document.getElementById('ctrl-resting');
const ctrlRestDone = document.getElementById('ctrl-rest-done');
const ctrlComplete = document.getElementById('ctrl-complete');

// Buttons
const btnNewWorkout = document.getElementById('btn-new-workout');
const btnLibBack = document.getElementById('btn-lib-back');
const btnLibDone = document.getElementById('btn-lib-done');
const libSelCount = document.getElementById('lib-sel-count');
const btnBuilderBack = document.getElementById('btn-builder-back');
const btnBuilderDone = document.getElementById('btn-builder-done');
const btnPlanEdit = document.getElementById('btn-plan-edit');
const btnPlanSave = document.getElementById('btn-plan-save');
const btnPlanBegin = document.getElementById('btn-plan-begin');
const btnDoneSet = document.getElementById('btn-done-set');
const btnSkipRest = document.getElementById('btn-skip-rest');
const btnBackToTrack = document.getElementById('btn-back-to-track');
const btnReset = document.getElementById('btn-reset');

// Modal
const saveModal = document.getElementById('save-modal');
const profileNameIn = document.getElementById('profile-name-input');
const modalCancel = document.getElementById('modal-cancel');
const modalSave = document.getElementById('modal-save');

// ── State ────────────────────────────────────────────
let selectedIds = new Set();   // exercise ids selected in library
let workoutPlan = [];          // [{...exercise, weight, sets, reps, rest}]
let currentExIdx = 0;
let currentSetNum = 1;
let completedSets = 0;
let totalSets = 0;
let setElapsed = 0;
let restRemaining = 0;
let ticker = null;
let nagTimer = null;
let activeCat = 'Back';
const SEC_PER_REP = 3;
const PROFILE_KEY = 'panda_gym_profiles';

// ── Rest tracking ────────────────────────────────────
let sessionLog = [];       // [{exName, setNum, plannedRest, actualRest}]
let restStartTime = null;  // Date.now() when rest started
let overtimeElapsed = 0;   // seconds past rest end
let workoutStartTime = null; // for total time tracking

// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
function fmtMin(sec) {
  if (sec < 60) return `~${sec}s`;
  return `~${Math.round(sec / 60)}m`;
}
function fmtWeight(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons 🔥`;
  return `${kg.toLocaleString()} kg`;
}

function setMsg(emoji, html) { msgEmoji.textContent = emoji; msgText.innerHTML = html; }
function setBubble(text, theme) {
  bubbleText.textContent = text;
  speechBubble.classList.remove('rest', 'done');
  if (theme) speechBubble.classList.add(theme);
}
function setPill(fraction, drain) {
  timerBar.classList.toggle('drain', !!drain);
  timerBar.style.transform = `scaleX(${Math.max(0, Math.min(1, fraction))})`;
}
function pandaCompact(on) { pandaArea.classList.toggle('compact', on); }

function stopAll() {
  clearInterval(ticker); clearInterval(nagTimer);
  ticker = null; nagTimer = null;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  bellIcon.classList.remove('ring');
  pandaImg.classList.remove('angry');
  timeDisplay.classList.remove('pulsing');
}

function unlockSpeech() {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(''); u.volume = 0;
  window.speechSynthesis.speak(u);
}
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  setTimeout(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1; u.volume = 1;
    window.speechSynthesis.speak(u);
  }, 100);
}

// ── View / ctrl switcher ────────────────────────────
const ALL_VIEWS = [viewHome, viewLibrary, viewBuilder, viewPlanOverview, viewWorkout];
const ALL_CTRLS = [ctrlHome, ctrlLibrary, ctrlBuilder, ctrlPlan, ctrlTraining, ctrlResting, ctrlRestDone, ctrlComplete];
const VIEW_MAP = {
  home: [viewHome, ctrlHome],
  library: [viewLibrary, ctrlLibrary],
  builder: [viewBuilder, ctrlBuilder],
  plan: [viewPlanOverview, ctrlPlan],
  training: [viewWorkout, ctrlTraining],
  resting: [viewWorkout, ctrlResting],
  'rest-done': [viewWorkout, ctrlRestDone],
  complete: [viewWorkout, ctrlComplete],
};

function showView(name) {
  ALL_VIEWS.forEach(v => v.classList.add('hidden'));
  ALL_CTRLS.forEach(c => c.classList.add('hidden'));
  const [v, c] = VIEW_MAP[name];
  v.classList.remove('hidden');
  c.classList.remove('hidden');
}

// ── Progress ────────────────────────────────────────
function updateProgress() {
  const pct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  const str = `${pct}%`;
  const lbl = `${completedSets} / ${totalSets} sets`;
  [progressFill, progressFill2].forEach(f => f.style.width = str);
  [progressLbl, progressLbl2].forEach(l => l.textContent = lbl);
  [progressPct, progressPct2].forEach(p => p.textContent = str);
  dockSetsDone.textContent = completedSets;
}

// ══════════════════════════════════════════════════════
//  PROFILES (localStorage)
// ══════════════════════════════════════════════════════
function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || []; }
  catch { return []; }
}
function saveProfiles(arr) { localStorage.setItem(PROFILE_KEY, JSON.stringify(arr)); }

function renderProfiles() {
  const profiles = loadProfiles();
  if (profiles.length === 0) {
    profilesList.innerHTML = '<div class="no-profiles">No saved profiles yet.<br>Create your first workout!</div>';
    return;
  }
  profilesList.innerHTML = profiles.map((p, i) => {
    const totalSets = p.exercises.reduce((s, e) => s + e.sets, 0);
    const totalKg = p.exercises.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);
    return `
      <div class="profile-card" data-idx="${i}">
        <div class="profile-info">
          <div class="profile-name">${esc(p.name)}</div>
          <div class="profile-meta">${p.exercises.length} exercises · ${totalSets} sets · ${fmtWeight(totalKg)}</div>
        </div>
        <div class="profile-actions">
          <button class="profile-del-btn" data-delidx="${i}" title="Delete">🗑️</button>
        </div>
      </div>`;
  }).join('');

  // Click to load
  profilesList.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.profile-del-btn')) return;
      const idx = parseInt(card.dataset.idx);
      applyProfile(loadProfiles()[idx]);
    });
  });
  // Delete
  profilesList.querySelectorAll('.profile-del-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.delidx);
      const profs = loadProfiles();
      profs.splice(idx, 1);
      saveProfiles(profs);
      renderProfiles();
      setMsg('🗑️', 'Profile deleted.');
    });
  });
}

function applyProfile(profile) {
  workoutPlan = profile.exercises.map(e => ({ ...e }));
  enterBuilder();
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ══════════════════════════════════════════════════════
//  STATE: HOME
// ══════════════════════════════════════════════════════
function enterHome() {
  stopAll();
  showView('home');
  pandaCompact(false);
  setPill(1, false);
  timeDisplay.textContent = '0:00';
  setBubble('LAZY? 🥊');
  setMsg('🐼', 'Welcome to Panda Gym!<br>Build your workout below.');
  dockSubTimer.textContent = '0:00';
  selectedIds.clear();
  workoutPlan = [];
  renderProfiles();
}

// ══════════════════════════════════════════════════════
//  STATE: LIBRARY
// ══════════════════════════════════════════════════════
function enterLibrary() {
  stopAll();
  showView('library');
  pandaCompact(true);
  setBubble('PICK! 💪');
  setMsg('📋', 'Tap exercises to select them.<br>Switch categories with tabs.');
  renderCatTabs();
  renderExercises();
  updateLibCount();
}

function renderCatTabs() {
  catTabsEl.innerHTML = CATEGORIES.map(c =>
    `<button class="cat-tab${c === activeCat ? ' active' : ''}" data-cat="${c}">${c}</button>`
  ).join('');
  catTabsEl.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeCat = tab.dataset.cat;
      renderCatTabs();
      renderExercises();
    });
  });
}

function renderExercises() {
  const filtered = EXERCISE_LIBRARY.filter(e => e.category === activeCat);
  exerciseListEl.innerHTML = filtered.map(e => `
    <div class="ex-card${selectedIds.has(e.id) ? ' selected' : ''}" data-id="${e.id}">
      <span class="ex-emoji">${e.emoji}</span>
      <div class="ex-info">
        <div class="ex-name">${e.name}</div>
        <div class="ex-defaults">${e.weight}kg · ${e.sets}×${e.reps} · rest ${e.rest}s</div>
      </div>
      <div class="ex-check">${selectedIds.has(e.id) ? '✓' : ''}</div>
    </div>
  `).join('');
  exerciseListEl.querySelectorAll('.ex-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (selectedIds.has(id)) selectedIds.delete(id);
      else selectedIds.add(id);
      renderExercises();
      updateLibCount();
    });
  });
}

function updateLibCount() {
  libSelCount.textContent = `(${selectedIds.size})`;
}

// ══════════════════════════════════════════════════════
//  STATE: BUILDER
// ══════════════════════════════════════════════════════
function enterBuilder() {
  stopAll();
  showView('builder');
  pandaCompact(true);
  setBubble('EDIT ✏️');
  setMsg('🔧', 'Adjust weight, sets, reps & rest.<br>Swipe to delete exercises.');

  // Build workoutPlan from selectedIds if coming from library
  if (workoutPlan.length === 0 && selectedIds.size > 0) {
    workoutPlan = [];
    // Maintain order from library
    EXERCISE_LIBRARY.forEach(e => {
      if (selectedIds.has(e.id)) {
        workoutPlan.push({ ...e });
      }
    });
  }

  renderBuilder();
}

function renderBuilder() {
  builderCount.textContent = workoutPlan.length;
  if (workoutPlan.length === 0) {
    builderListEl.innerHTML = '<div class="no-profiles">No exercises selected.</div>';
    return;
  }
  builderListEl.innerHTML = workoutPlan.map((ex, i) => `
    <div class="builder-row" data-bidx="${i}">
      <div class="builder-row-top">
        <span class="builder-ex-name">${ex.emoji} ${ex.name}</span>
        <button class="builder-del" data-delidx="${i}" title="Remove">✕</button>
      </div>
      <div class="builder-fields">
        <div class="builder-field">
          <span class="bf-label">Weight</span>
          <div class="bf-stepper">
            <button class="bf-btn" data-bidx="${i}" data-field="weight" data-delta="-2.5">−</button>
            <span class="bf-val" id="bf-weight-${i}">${ex.weight}</span>
            <button class="bf-btn" data-bidx="${i}" data-field="weight" data-delta="2.5">+</button>
          </div>
        </div>
        <div class="builder-field">
          <span class="bf-label">Sets</span>
          <div class="bf-stepper">
            <button class="bf-btn" data-bidx="${i}" data-field="sets" data-delta="-1">−</button>
            <span class="bf-val" id="bf-sets-${i}">${ex.sets}</span>
            <button class="bf-btn" data-bidx="${i}" data-field="sets" data-delta="1">+</button>
          </div>
        </div>
        <div class="builder-field">
          <span class="bf-label">Reps</span>
          <div class="bf-stepper">
            <button class="bf-btn" data-bidx="${i}" data-field="reps" data-delta="-1">−</button>
            <span class="bf-val" id="bf-reps-${i}">${ex.reps}</span>
            <button class="bf-btn" data-bidx="${i}" data-field="reps" data-delta="1">+</button>
          </div>
        </div>
        <div class="builder-field">
          <span class="bf-label">Rest</span>
          <div class="bf-stepper">
            <button class="bf-btn" data-bidx="${i}" data-field="rest" data-delta="-5">−</button>
            <span class="bf-val" id="bf-rest-${i}">${ex.rest}</span>
            <button class="bf-btn" data-bidx="${i}" data-field="rest" data-delta="5">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Stepper clicks
  builderListEl.querySelectorAll('.bf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.bidx);
      const field = btn.dataset.field;
      const delta = parseFloat(btn.dataset.delta);
      const ex = workoutPlan[idx];

      const limits = { weight: [0, 500], sets: [1, 10], reps: [1, 50], rest: [5, 300] };
      let val = ex[field] + delta;
      val = Math.max(limits[field][0], Math.min(limits[field][1], val));
      ex[field] = val;

      const el = document.getElementById(`bf-${field}-${idx}`);
      if (el) el.textContent = val;
    });
  });

  // Delete
  builderListEl.querySelectorAll('.builder-del').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.delidx);
      const removed = workoutPlan.splice(idx, 1)[0];
      selectedIds.delete(removed.id);
      renderBuilder();
    });
  });
}

// ══════════════════════════════════════════════════════
//  STATE: PLAN OVERVIEW
// ══════════════════════════════════════════════════════
function enterPlanOverview() {
  stopAll();
  showView('plan');
  pandaCompact(true);
  setBubble('READY? 💪', 'done');

  // Compute stats
  totalSets = workoutPlan.reduce((s, e) => s + e.sets, 0);
  completedSets = 0;

  const trainSec = workoutPlan.reduce((s, e) => s + e.sets * e.reps * SEC_PER_REP, 0);
  const restSec = workoutPlan.reduce((s, e) => s + (e.sets - 1) * e.rest, 0);
  const totalSec = trainSec + restSec;
  const totalKg = workoutPlan.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);

  planTotalSets.textContent = totalSets;
  planTotalTime.textContent = fmtMin(totalSec);
  planTotalWeight.textContent = fmtWeight(Math.round(totalKg));
  planBreakdown.textContent = `Training: ${fmtMin(trainSec)} · Rest: ${fmtMin(restSec)}`;

  setMsg('😤', `${workoutPlan.length} exercises · ${totalSets} sets · ${fmtWeight(Math.round(totalKg))}<br>Let's crush it, panda!`);

  // Exercise list
  planExList.innerHTML = workoutPlan.map((e, i) => `
    <div class="plan-ex-row">
      <span class="plan-ex-num">${i + 1}</span>
      <span class="plan-ex-name">${e.name}</span>
      <span class="plan-ex-detail">${e.weight}kg · ${e.sets}×${e.reps}</span>
    </div>
  `).join('');

  updateProgress();
  setPill(1, false);
  timeDisplay.textContent = '0:00';
}

// ══════════════════════════════════════════════════════
//  STATE: TRAINING (count UP)
// ══════════════════════════════════════════════════════
function enterTraining() {
  stopAll();
  showView('training');
  pandaCompact(true);
  setElapsed = 0;

  const ex = workoutPlan[currentExIdx];
  phaseBadge.textContent = 'TRAINING 💪';
  phaseBadge.classList.remove('resting', 'done');
  woExName.textContent = ex.name;
  wiExercise.textContent = `${currentExIdx + 1}/${workoutPlan.length}`;
  wiSet.textContent = `${currentSetNum}/${ex.sets}`;
  wiWeight.textContent = `${ex.weight}kg`;
  wiReps.textContent = ex.reps;

  setBubble('GO! 🔥');
  setMsg('🔥', `${ex.name}<br>Set ${currentSetNum}/${ex.sets} — Do ${ex.reps} reps @ ${ex.weight}kg!`);
  setPill(1, false);
  dockSubTimer.textContent = '0:00';

  unlockSpeech();
  updateProgress();

  ticker = setInterval(() => {
    setElapsed++;
    const d = fmt(setElapsed);
    timeDisplay.textContent = d;
    dockSubTimer.textContent = d;
    const prog = Math.min(1, setElapsed / (ex.reps * SEC_PER_REP));
    setPill(prog, false);
  }, 1000);
}

// ══════════════════════════════════════════════════════
//  STATE: RESTING (count DOWN)
// ══════════════════════════════════════════════════════
function enterResting() {
  stopAll();
  showView('resting');
  pandaCompact(true);

  const ex = workoutPlan[currentExIdx];
  restRemaining = ex.rest;
  restStartTime = Date.now();  // record when rest started

  phaseBadge.textContent = 'RESTING 💤';
  phaseBadge.classList.add('resting');
  phaseBadge.classList.remove('done');
  woExName.textContent = ex.name;
  wiExercise.textContent = `${currentExIdx + 1}/${workoutPlan.length}`;
  wiSet.textContent = `${currentSetNum}/${ex.sets}`;
  wiWeight.textContent = `${ex.weight}kg`;
  wiReps.textContent = ex.reps;

  setBubble('REST 💤', 'rest');
  setMsg('😴', `Good set! Rest ${ex.rest}s.`);

  timeDisplay.textContent = fmt(restRemaining);
  dockSubTimer.textContent = fmt(restRemaining);
  setPill(1, true);

  speak(`Rest for ${ex.rest} seconds`);

  ticker = setInterval(() => {
    restRemaining--;
    const d = fmt(Math.max(0, restRemaining));
    timeDisplay.textContent = d;
    dockSubTimer.textContent = d;
    setPill(Math.max(0, restRemaining / ex.rest), true);
    if (restRemaining <= 0) enterRestDone();
  }, 1000);
}

// ══════════════════════════════════════════════════════
//  STATE: REST DONE — nag + keep counting overtime
// ══════════════════════════════════════════════════════
function enterRestDone() {
  stopAll();
  showView('rest-done');
  pandaCompact(true);
  overtimeElapsed = 0;

  phaseBadge.textContent = 'TIME\'S UP! ⚡';
  phaseBadge.classList.remove('resting');
  phaseBadge.classList.add('done');
  setPill(0, true);
  setBubble('DONE! ⚡', 'done');
  setMsg('😤', 'Timer finished. Muscles waiting.<br>You... not moving.');

  bellIcon.classList.add('ring');
  timeDisplay.textContent = '+0:00';

  speak('Get back to track');

  // Keep counting up — show overtime
  ticker = setInterval(() => {
    overtimeElapsed++;
    timeDisplay.textContent = `+${fmt(overtimeElapsed)}`;
    dockSubTimer.textContent = `+${fmt(overtimeElapsed)}`;
  }, 1000);

  nagTimer = setInterval(() => {
    speak('Why so slow?');
    const extra = Math.round((Date.now() - restStartTime) / 1000);
    const planned = workoutPlan[currentExIdx].rest;
    const overPct = Math.round(((extra - planned) / planned) * 100);
    setMsg('😤', `+${fmt(extra - planned)} overtime!<br>${overPct}% more than needed!`);
  }, 10000);
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
  updateProgress();

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
//  STATE: COMPLETE — with session report
// ══════════════════════════════════════════════════════
function enterComplete() {
  stopAll();
  showView('complete');
  pandaCompact(false);

  const totalKg = workoutPlan.reduce((s, e) => s + e.weight * e.reps * e.sets, 0);
  const totalElapsed = workoutStartTime ? Math.round((Date.now() - workoutStartTime) / 1000) : 0;

  // ── Rest report ──
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

  phaseBadge.textContent = 'COMPLETE! 🏆';
  phaseBadge.classList.remove('resting');
  phaseBadge.classList.add('done');
  woExName.textContent = 'Workout Finished!';
  wiExercise.textContent = `${workoutPlan.length}`;
  wiSet.textContent = `${totalSets}`;
  wiWeight.textContent = fmtWeight(Math.round(totalKg));
  wiReps.textContent = '✓';

  progressFill.style.width = '100%';
  progressFill2.style.width = '100%';
  progressLbl.textContent = `${totalSets} / ${totalSets} sets`;
  progressLbl2.textContent = `${totalSets} / ${totalSets} sets`;
  progressPct.textContent = '100%';
  progressPct2.textContent = '100%';

  setPill(1, false);
  setBubble('DONE! 🏆', 'done');
  timeDisplay.textContent = '🏆';
  dockSubTimer.textContent = fmt(totalElapsed);

  // ── Build report message ──
  let report = `<strong>🏆 Workout Complete!</strong><br>`;
  report += `🏋️ Lifted: <strong>${fmtWeight(Math.round(totalKg))}</strong><br>`;
  report += `⏱️ Total time: <strong>${fmt(totalElapsed)}</strong><br>`;
  report += `<br>`;
  report += `<strong>📊 Rest Report</strong><br>`;
  report += `Planned rest: ${fmt(totalPlannedRest)}<br>`;
  report += `Actual rest: ${fmt(totalActualRest)} (${restSign}${fmt(Math.abs(restDiff))}, ${restSign}${restPct}%)<br>`;
  report += `${restVerdict}<br>`;

  // Per-exercise summary if there are logs
  if (sessionLog.length > 0) {
    report += `<br><strong>Per set:</strong><br>`;
    sessionLog.forEach(l => {
      const diff = l.actualRest - l.plannedRest;
      const sign = diff >= 0 ? '+' : '';
      const emoji = diff <= 0 ? '✅' : diff <= 10 ? '👍' : '⚠️';
      report += `${emoji} E${l.exerciseIdx} S${l.setNum}: ${l.actualRest}s / ${l.plannedRest}s (${sign}${diff}s)<br>`;
    });
  }

  setMsg('📊', report);

  speak(`Workout complete! You rested ${fmt(totalActualRest)} total. That is ${Math.abs(restPct)} percent ${restDiff >= 0 ? 'more' : 'less'} than planned.`);
  bellIcon.classList.add('ring');
}

// ══════════════════════════════════════════════════════
//  SAVE MODAL
// ══════════════════════════════════════════════════════
function openSaveModal() {
  profileNameIn.value = '';
  saveModal.classList.remove('hidden');
  profileNameIn.focus();
}
function closeSaveModal() { saveModal.classList.add('hidden'); }

function doSaveProfile() {
  const name = profileNameIn.value.trim();
  if (!name) { profileNameIn.focus(); return; }
  const profs = loadProfiles();
  profs.push({ name, exercises: workoutPlan.map(e => ({ ...e })), savedAt: new Date().toISOString() });
  saveProfiles(profs);
  closeSaveModal();
  setMsg('💾', `Profile "${name}" saved!`);
}

// ══════════════════════════════════════════════════════
//  BUTTON WIRING
// ══════════════════════════════════════════════════════
btnNewWorkout.addEventListener('click', () => { selectedIds.clear(); workoutPlan = []; enterLibrary(); });
btnLibBack.addEventListener('click', enterHome);
btnLibDone.addEventListener('click', () => {
  if (selectedIds.size === 0) { setMsg('🐼', 'Select at least one exercise!'); return; }
  workoutPlan = [];
  enterBuilder();
});
btnBuilderBack.addEventListener('click', enterLibrary);
btnBuilderDone.addEventListener('click', () => {
  if (workoutPlan.length === 0) { setMsg('🐼', 'Add at least one exercise!'); return; }
  enterPlanOverview();
});
btnPlanEdit.addEventListener('click', enterBuilder);
btnPlanSave.addEventListener('click', openSaveModal);
btnPlanBegin.addEventListener('click', () => {
  currentExIdx = 0; currentSetNum = 1; completedSets = 0;
  totalSets = workoutPlan.reduce((s, e) => s + e.sets, 0);
  sessionLog = [];               // reset session log
  restStartTime = null;
  workoutStartTime = Date.now(); // start total elapsed timer
  updateProgress();
  enterTraining();
});
btnDoneSet.addEventListener('click', enterResting);
btnSkipRest.addEventListener('click', advanceToNext);
btnBackToTrack.addEventListener('click', advanceToNext);
btnReset.addEventListener('click', enterHome);
modalCancel.addEventListener('click', closeSaveModal);
modalSave.addEventListener('click', doSaveProfile);
profileNameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSaveProfile(); });

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
enterHome();
