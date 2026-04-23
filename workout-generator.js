// =====================================================
//  WORKOUT GENERATOR — workout-generator.js
//  Auto-generates workout plans based on:
//  - Workout type (muscle group focus)
//  - Target duration (15min → 3h)
//  - Intensity level
//  - Optional add-ons (core, warmup/cooldown)
// =====================================================

// ── Workout Type Definitions ─────────────────────────
const WORKOUT_TYPES = [
  {
    id: 'chest-day',
    name: 'Chest Day',
    emoji: '🏋️',
    subtitle: 'Ngực + Tay sau',
    categories: ['Chest', 'Triceps'],
    primaryCategory: 'Chest',
  },
  {
    id: 'back-day',
    name: 'Back Day',
    emoji: '🏋️',
    subtitle: 'Lưng + Tay trước',
    categories: ['Back', 'Biceps'],
    primaryCategory: 'Back',
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    emoji: '🦵',
    subtitle: 'Chân toàn diện',
    categories: ['Legs'],
    primaryCategory: 'Legs',
  },
  {
    id: 'upper-body',
    name: 'Upper Body',
    emoji: '💪',
    subtitle: 'Thân trên toàn diện',
    categories: ['Chest', 'Back', 'Shoulders'],
    primaryCategory: 'Chest',
  },
  {
    id: 'push-day',
    name: 'Push Day',
    emoji: '🫸',
    subtitle: 'Ngực + Vai + Tay sau',
    categories: ['Chest', 'Shoulders', 'Triceps'],
    primaryCategory: 'Chest',
  },
  {
    id: 'pull-day',
    name: 'Pull Day',
    emoji: '🫷',
    subtitle: 'Lưng + Tay trước',
    categories: ['Back', 'Biceps'],
    primaryCategory: 'Back',
  },
  {
    id: 'lower-body',
    name: 'Lower Body',
    emoji: '🦿',
    subtitle: 'Chân + Mông',
    categories: ['Legs'],
    primaryCategory: 'Legs',
  },
  {
    id: 'cardio-day',
    name: 'Cardio Day',
    emoji: '🏃',
    subtitle: 'Nhịp tim cao, nhẹ tạ',
    categories: ['Chest', 'Back', 'Legs', 'Shoulders'],
    primaryCategory: 'Legs',
  },
];

// ── Intensity Levels ─────────────────────────────────
const INTENSITY_LEVELS = [
  {
    id: 'beginner',
    name: 'Beginner',
    emoji: '🌱',
    subtitle: 'Nhẹ nhàng, học kỹ thuật',
    setsMod: 0.7,
    repsMod: 0.8,
    restMod: 1.4,
    weightMod: 0.7,
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    emoji: '⚡',
    subtitle: 'Chuẩn, cân bằng',
    setsMod: 1.0,
    repsMod: 1.0,
    restMod: 1.0,
    weightMod: 1.0,
  },
  {
    id: 'hardcore',
    name: 'Hardcore',
    emoji: '🔥',
    subtitle: 'Nặng, ít nghỉ',
    setsMod: 1.3,
    repsMod: 1.2,
    restMod: 0.7,
    weightMod: 1.1,
  },
  {
    id: 'advanced',
    name: 'Advanced',
    emoji: '🔥',
    subtitle: 'Nặng, cường độ cao',
    setsMod: 1.2,
    repsMod: 1.1,
    restMod: 0.75,
    weightMod: 1.05,
  },
  {
    id: 'cardio',
    name: 'Cardio Day',
    emoji: '💓',
    subtitle: 'Nhẹ tạ, nhiều rep',
    setsMod: 1.0,
    repsMod: 1.6,
    restMod: 0.5,
    weightMod: 0.5,
  },
  {
    id: 'deload',
    name: 'De-load',
    emoji: '🧘',
    subtitle: 'Nhẹ, phục hồi',
    setsMod: 0.6,
    repsMod: 0.7,
    restMod: 1.6,
    weightMod: 0.6,
  },
];

// ── Core Exercises ───────────────────────────────────
const CORE_EXERCISES = [
  { id: 'plank',          name: 'Plank',                 category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 1,  rest: 30, note: '30-60 giây' },
  { id: 'crunches',       name: 'Crunches',              category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 20, rest: 30 },
  { id: 'russian-twist',  name: 'Russian Twist',         category: 'Core', emoji: '🔄', weight: 5, sets: 3, reps: 20, rest: 30 },
  { id: 'leg-raises',     name: 'Lying Leg Raises',      category: 'Core', emoji: '🦵', weight: 0, sets: 3, reps: 15, rest: 30 },
  { id: 'mountain-climb', name: 'Mountain Climbers',     category: 'Core', emoji: '⛰️', weight: 0, sets: 3, reps: 20, rest: 30 },
  { id: 'dead-bug',       name: 'Dead Bug',              category: 'Core', emoji: '🐛', weight: 0, sets: 3, reps: 12, rest: 30 },
  { id: 'bicycle-crunch', name: 'Bicycle Crunches',      category: 'Core', emoji: '🚲', weight: 0, sets: 3, reps: 20, rest: 30 },
];

// ── Warmup / Cooldown Exercises ──────────────────────
const WARMUP_EXERCISES = [
  { id: 'jumping-jacks',  name: 'Jumping Jacks',         category: 'Warmup', emoji: '⭐', weight: 0, sets: 1, reps: 30, rest: 15 },
  { id: 'arm-circles',    name: 'Arm Circles',           category: 'Warmup', emoji: '🔄', weight: 0, sets: 1, reps: 20, rest: 15 },
  { id: 'hip-circles',    name: 'Hip Circles',           category: 'Warmup', emoji: '🔄', weight: 0, sets: 1, reps: 15, rest: 15 },
  { id: 'high-knees',     name: 'High Knees',            category: 'Warmup', emoji: '🦵', weight: 0, sets: 1, reps: 30, rest: 15 },
  { id: 'leg-swings',     name: 'Leg Swings',            category: 'Warmup', emoji: '🦵', weight: 0, sets: 1, reps: 15, rest: 15 },
];

const COOLDOWN_EXERCISES = [
  { id: 'quad-stretch',   name: 'Standing Quad Stretch',  category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây mỗi bên' },
  { id: 'hamstring-str',  name: 'Seated Hamstring Stretch',category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây' },
  { id: 'chest-stretch',  name: 'Doorway Chest Stretch',  category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây' },
  { id: 'cat-cow',        name: 'Cat-Cow Stretch',        category: 'Cooldown', emoji: '🐱', weight: 0, sets: 1, reps: 10, rest: 10 },
  { id: 'deep-breathing', name: 'Deep Breathing',         category: 'Cooldown', emoji: '🫁', weight: 0, sets: 1, reps: 10, rest: 0, note: 'Hít thở sâu' },
];

// ── Constants ────────────────────────────────────────
const GEN_SEC_PER_REP = 3; // seconds per rep for time estimation
const CORE_TIME_BUDGET = 5 * 60; // ~5 min for core
const WARMUP_TIME_BUDGET = 4 * 60; // ~4 min for warmup
const COOLDOWN_TIME_BUDGET = 4 * 60; // ~4 min for cooldown

// ══════════════════════════════════════════════════════
//  GENERATOR FUNCTION
// ══════════════════════════════════════════════════════

/**
 * Generate a full workout plan.
 * 
 * @param {string} typeId - Workout type ID (e.g., 'chest-day')
 * @param {number} durationMin - Target duration in minutes (15–180)
 * @param {string} intensityId - Intensity level ID (e.g., 'intermediate')
 * @param {boolean} addCore - Whether to append core exercises
 * @param {boolean} addWarmup - Whether to add warmup & cooldown
 * @returns {{ name: string, emoji: string, exercises: Array, estimatedTime: number }}
 */
function generateWorkout(typeId, durationMin, intensityId, addCore, addWarmup) {
  const workoutType = WORKOUT_TYPES.find(t => t.id === typeId) || WORKOUT_TYPES[0];
  const intensity = INTENSITY_LEVELS.find(i => i.id === intensityId) || INTENSITY_LEVELS[1];

  const totalBudgetSec = durationMin * 60;

  // Calculate time budgets for add-ons
  let mainBudgetSec = totalBudgetSec;
  if (addCore) mainBudgetSec -= CORE_TIME_BUDGET;
  if (addWarmup) mainBudgetSec -= (WARMUP_TIME_BUDGET + COOLDOWN_TIME_BUDGET);
  mainBudgetSec = Math.max(mainBudgetSec, 5 * 60); // at least 5 min for main workout

  // Get available exercises for this workout type
  const pool = getExercisePool(workoutType);

  // Shuffle pool
  const shuffled = shuffleArray([...pool]);

  // Pick exercises that fit within the time budget
  const mainExercises = [];
  let usedTimeSec = 0;

  for (const ex of shuffled) {
    // Apply intensity modifiers
    const modEx = applyIntensity(ex, intensity);
    const exTimeSec = estimateExerciseTime(modEx);

    if (usedTimeSec + exTimeSec <= mainBudgetSec) {
      mainExercises.push(modEx);
      usedTimeSec += exTimeSec;
    }

    // If we've filled at least 80% of the budget, stop
    if (usedTimeSec >= mainBudgetSec * 0.8) break;
  }

  // If we haven't filled enough time, increase sets on existing exercises
  if (usedTimeSec < mainBudgetSec * 0.6 && mainExercises.length > 0) {
    let idx = 0;
    while (usedTimeSec < mainBudgetSec * 0.75) {
      const ex = mainExercises[idx % mainExercises.length];
      const oldTime = estimateExerciseTime(ex);
      ex.sets = Math.min(ex.sets + 1, 8);
      const newTime = estimateExerciseTime(ex);
      usedTimeSec += (newTime - oldTime);
      idx++;
      if (idx > mainExercises.length * 3) break; // safety
    }
  }

  // Build final exercise list
  const finalExercises = [];

  // Warmup
  if (addWarmup) {
    const warmups = pickAddonExercises(WARMUP_EXERCISES, 3);
    finalExercises.push(...warmups);
  }

  // Main exercises
  finalExercises.push(...mainExercises);

  // Core
  if (addCore) {
    const cores = pickAddonExercises(CORE_EXERCISES, 3);
    finalExercises.push(...cores);
  }

  // Cooldown
  if (addWarmup) {
    const cooldowns = pickAddonExercises(COOLDOWN_EXERCISES, 3);
    finalExercises.push(...cooldowns);
  }

  // Calculate total estimated time
  const estimatedTime = finalExercises.reduce((sum, ex) => sum + estimateExerciseTime(ex), 0);

  return {
    name: workoutType.name,
    emoji: workoutType.emoji,
    subtitle: workoutType.subtitle,
    typeId: workoutType.id,
    intensityId: intensity.id,
    exercises: finalExercises,
    estimatedTimeSec: estimatedTime,
  };
}

// ══════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ══════════════════════════════════════════════════════

/**
 * Get the exercise pool from EXERCISE_LIBRARY for a workout type.
 * Distributes exercises from primary + secondary categories.
 */
function getExercisePool(workoutType) {
  const { categories, primaryCategory } = workoutType;

  // Get exercises by category
  const byCategory = {};
  categories.forEach(cat => {
    byCategory[cat] = EXERCISE_LIBRARY.filter(e => e.category === cat);
  });

  // Build pool: primary category gets more exercises
  const pool = [];
  categories.forEach(cat => {
    const exercises = byCategory[cat] || [];
    if (cat === primaryCategory) {
      // Include all from primary
      pool.push(...exercises);
    } else {
      // Include subset from secondary (2–3 exercises)
      const shuffled = shuffleArray([...exercises]);
      pool.push(...shuffled.slice(0, Math.min(3, shuffled.length)));
    }
  });

  return pool;
}

/**
 * Apply intensity modifiers to an exercise.
 * Returns a new exercise object with adjusted values.
 */
function applyIntensity(exercise, intensity) {
  return {
    ...exercise,
    sets: Math.max(1, Math.round(exercise.sets * intensity.setsMod)),
    reps: Math.max(1, Math.round(exercise.reps * intensity.repsMod)),
    rest: Math.max(15, Math.round((exercise.rest * intensity.restMod) / 5) * 5), // round to 5s
    weight: Math.round(exercise.weight * intensity.weightMod * 2) / 2, // round to 0.5kg
  };
}

/**
 * Estimate the time an exercise takes (training + rest) in seconds.
 */
function estimateExerciseTime(exercise) {
  const trainSec = exercise.sets * exercise.reps * GEN_SEC_PER_REP;
  const restSec = (exercise.sets - 1) * exercise.rest;
  return trainSec + restSec;
}

/**
 * Pick a random subset of addon exercises.
 */
function pickAddonExercises(pool, count) {
  const shuffled = shuffleArray([...pool]);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(e => ({ ...e }));
}

/**
 * Fisher-Yates shuffle.
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get a random workout type ID.
 */
function getRandomWorkoutType() {
  return WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)].id;
}

/**
 * Format seconds to human-readable Vietnamese duration.
 */
function formatDurationViet(sec) {
  const mins = Math.round(sec / 60);
  if (mins < 60) return `${mins} phút`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} giờ`;
  return `${h}h${m < 10 ? '0' : ''}${m}`;
}
