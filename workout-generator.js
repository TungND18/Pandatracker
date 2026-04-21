const QUICK_WORKOUT_TYPES = {
  'Chest Day': { emoji: '🔥', categories: ['Chest', 'Triceps'] },
  'Back Day': { emoji: '🦍', categories: ['Back', 'Biceps'] },
  'Leg Day': { emoji: '🦵', categories: ['Legs'] },
  'Upper Body Day': { emoji: '💪', categories: ['Chest', 'Back', 'Shoulders'] },
  'Push Day': { emoji: '🚀', categories: ['Chest', 'Shoulders', 'Triceps'] },
  'Pull Day': { emoji: '🪝', categories: ['Back', 'Biceps'] },
  'Lower Body Day': { emoji: '🏋️', categories: ['Legs'] },
  'Cardio Day': { emoji: '❤️', categories: ['Cardio', 'Legs', 'Core'] },
};

const INTENSITY_MODIFIERS = {
  Beginner: { sets: 0.7, reps: 0.8, rest: 1.3 },
  Intermediate: { sets: 1.0, reps: 1.0, rest: 1.0 },
  Hardcore: { sets: 1.3, reps: 1.2, rest: 0.8 },
  Cardio: { sets: 1.0, reps: 1.5, rest: 0.5 },
  'De-load': { sets: 0.6, reps: 0.7, rest: 1.5 },
};

const CORE_EXERCISE_IDS = ['plank', 'crunches', 'russian-twist', 'leg-raises', 'mountain-climbers'];
const WARMUP_EXERCISE_IDS = ['jumping-jacks', 'arm-circles', 'hip-circles', 'light-cardio'];
const COOLDOWN_EXERCISE_IDS = ['static-stretches', 'deep-breathing'];

function randomWorkoutType() {
  const keys = Object.keys(QUICK_WORKOUT_TYPES);
  return keys[Math.floor(Math.random() * keys.length)];
}

function estimateExerciseSeconds(ex) {
  return (ex.sets * ex.reps * 3) + ((ex.sets - 1) * ex.rest);
}

function applyIntensity(baseExercise, intensity) {
  const mod = INTENSITY_MODIFIERS[intensity] || INTENSITY_MODIFIERS.Intermediate;
  return {
    ...baseExercise,
    sets: Math.max(1, Math.round(baseExercise.sets * mod.sets)),
    reps: Math.max(3, Math.round(baseExercise.reps * mod.reps)),
    rest: Math.max(15, Math.round(baseExercise.rest * mod.rest)),
  };
}

function byIds(ids) {
  return EXERCISE_LIBRARY.filter(e => ids.includes(e.id));
}

function generateWorkout(type, durationMin = 60, intensity = 'Intermediate', addCore = false, addWarmup = false) {
  const spec = QUICK_WORKOUT_TYPES[type] || QUICK_WORKOUT_TYPES['Upper Body Day'];
  const targetSec = durationMin * 60;

  const pool = EXERCISE_LIBRARY
    .filter(ex => spec.categories.includes(ex.category))
    .filter(ex => !(ex.tags || []).includes('warmup') && !(ex.tags || []).includes('cooldown') && !(ex.tags || []).includes('core'));

  let totalSec = 0;
  const selected = [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  while (shuffled.length && totalSec < targetSec * 0.88) {
    const ex = applyIntensity(shuffled.shift(), intensity);
    const exSec = estimateExerciseSeconds(ex);
    if (totalSec + exSec > targetSec * 1.1 && selected.length > 0) continue;
    selected.push(ex);
    totalSec += exSec;
  }

  if (selected.length === 0 && pool.length > 0) {
    selected.push(applyIntensity(pool[0], intensity));
  }

  if (addWarmup) {
    selected.unshift(...byIds(WARMUP_EXERCISE_IDS).map(ex => applyIntensity(ex, 'Beginner')));
    selected.push(...byIds(COOLDOWN_EXERCISE_IDS).map(ex => applyIntensity(ex, 'De-load')));
  }

  if (addCore) {
    selected.push(...byIds(CORE_EXERCISE_IDS).slice(0, 3).map(ex => applyIntensity(ex, intensity)));
  }

  return {
    name: `${spec.emoji} ${type}`,
    type,
    durationMin,
    intensity,
    exercises: selected.map(ex => ({ ...ex })),
  };
}
