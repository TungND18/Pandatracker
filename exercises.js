// =====================================================
//  EXERCISE LIBRARY — exercises.js
//  24 exercises organised by category
// =====================================================

const EXERCISE_LIBRARY = [

    // ─── BACK / PULL ───────────────────────────────────
    { id: 'lat-pulldown-chin', name: 'Lat Pulldown (Chin-Up Grip)', category: 'Back', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 90, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'lat-pulldown-std', name: 'Lat Pulldown (Standard)', category: 'Back', emoji: '🏋️', weight: 45, sets: 4, reps: 8, rest: 90, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'lat-pulldown-vbar', name: 'V-Bar Lat Pulldown', category: 'Back', emoji: '🏋️', weight: 50, sets: 3, reps: 8, rest: 90, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'seated-cable-row', name: 'Seated Cable Row (Wide)', category: 'Back', emoji: '🚣', weight: 41, sets: 3, reps: 8, rest: 90, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'barbell-bent-row', name: 'Barbell Bent-Over Row', category: 'Back', emoji: '🏋️', weight: 40, sets: 3, reps: 8, rest: 120, tags: ['back-day', 'upper-body', 'pull-day'] },

    // ─── BICEPS ────────────────────────────────────────
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'Biceps', emoji: '💪', weight: 20, sets: 3, reps: 8, rest: 65, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'seated-db-curl', name: 'Seated Dumbbell Curl', category: 'Biceps', emoji: '💪', weight: 11, sets: 3, reps: 8, rest: 60, tags: ['back-day', 'upper-body', 'pull-day'] },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'Biceps', emoji: '🔨', weight: 8, sets: 3, reps: 20, rest: 45, tags: ['back-day', 'upper-body', 'pull-day'] },

    // ─── CHEST ─────────────────────────────────────────
    { id: 'barbell-bench', name: 'Barbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 120, tags: ['chest-day', 'upper-body', 'push-day', 'cardio-day'] },
    { id: 'db-bench', name: 'Dumbbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 26, sets: 4, reps: 8, rest: 90, tags: ['chest-day', 'upper-body', 'push-day', 'cardio-day'] },
    { id: 'incline-barbell', name: 'Incline Barbell Bench Press', category: 'Chest', emoji: '📐', weight: 50, sets: 3, reps: 7, rest: 120, tags: ['chest-day', 'upper-body', 'push-day', 'cardio-day'] },
    { id: 'incline-db', name: 'Incline Dumbbell Bench Press', category: 'Chest', emoji: '📐', weight: 24, sets: 4, reps: 8, rest: 90, tags: ['chest-day', 'upper-body', 'push-day', 'cardio-day'] },
    { id: 'machine-fly', name: 'Machine Chest Fly', category: 'Chest', emoji: '🦋', weight: 47, sets: 3, reps: 11, rest: 60, tags: ['chest-day', 'upper-body', 'push-day', 'cardio-day'] },

    // ─── SHOULDERS ─────────────────────────────────────
    { id: 'db-ohp', name: 'Dumbbell Overhead Press', category: 'Shoulders', emoji: '🙌', weight: 20, sets: 3, reps: 8, rest: 90, tags: ['upper-body', 'push-day', 'cardio-day'] },
    { id: 'machine-shoulder', name: 'Machine Shoulder Press', category: 'Shoulders', emoji: '🙌', weight: 45, sets: 3, reps: 8, rest: 90, tags: ['upper-body', 'push-day', 'cardio-day'] },
    { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', emoji: '🕊️', weight: 8, sets: 3, reps: 15, rest: 45, tags: ['upper-body', 'push-day', 'cardio-day'] },

    // ─── TRICEPS ───────────────────────────────────────
    { id: 'cable-pushdown', name: 'Cable Triceps Pushdown', category: 'Triceps', emoji: '⬇️', weight: 54.5, sets: 3, reps: 8, rest: 60, tags: ['chest-day', 'upper-body', 'push-day'] },
    { id: 'rope-pushdown', name: 'Rope Triceps Pushdown', category: 'Triceps', emoji: '🪢', weight: 45, sets: 3, reps: 10, rest: 60, tags: ['chest-day', 'upper-body', 'push-day'] },
    { id: 'cable-overhead-ext', name: 'Cable Overhead Triceps Ext.', category: 'Triceps', emoji: '⬆️', weight: 25, sets: 3, reps: 8, rest: 60, tags: ['chest-day', 'upper-body', 'push-day'] },

    // ─── LEGS ──────────────────────────────────────────
    { id: 'barbell-squat', name: 'Barbell Back Squat', category: 'Legs', emoji: '🦵', weight: 90, sets: 4, reps: 6, rest: 150, tags: ['leg-day', 'lower-body', 'cardio-day'] },
    { id: 'leg-press', name: 'Leg Press', category: 'Legs', emoji: '🦵', weight: 107, sets: 3, reps: 8, rest: 120, tags: ['leg-day', 'lower-body', 'cardio-day'] },
    { id: 'leg-extension', name: 'Leg Extension', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60, tags: ['leg-day', 'lower-body', 'cardio-day'] },
    { id: 'lying-leg-curl', name: 'Lying Leg Curl', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60, tags: ['leg-day', 'lower-body', 'cardio-day'] },
    { id: 'rdl-dumbbell', name: 'Romanian Deadlift (Dumbbell)', category: 'Legs', emoji: '🏋️', weight: 24, sets: 3, reps: 8, rest: 120, tags: ['leg-day', 'lower-body', 'cardio-day'] },

    // ─── CORE ──────────────────────────────────────────
    { id: 'plank', name: 'Plank', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 1, rest: 30, note: '30-60 giây', tags: [] },
    { id: 'crunches', name: 'Crunches', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 20, rest: 30, tags: [] },
    { id: 'russian-twist', name: 'Russian Twist', category: 'Core', emoji: '🔄', weight: 5, sets: 3, reps: 20, rest: 30, tags: [] },
    { id: 'leg-raises', name: 'Lying Leg Raises', category: 'Core', emoji: '🦵', weight: 0, sets: 3, reps: 15, rest: 30, tags: [] },
    { id: 'mountain-climb', name: 'Mountain Climbers', category: 'Core', emoji: '⛰️', weight: 0, sets: 3, reps: 20, rest: 30, tags: [] },
    { id: 'dead-bug', name: 'Dead Bug', category: 'Core', emoji: '🐛', weight: 0, sets: 3, reps: 12, rest: 30, tags: [] },
    { id: 'bicycle-crunch', name: 'Bicycle Crunches', category: 'Core', emoji: '🚲', weight: 0, sets: 3, reps: 20, rest: 30, tags: [] },

    // ─── WARMUP ────────────────────────────────────────
    { id: 'jumping-jacks', name: 'Jumping Jacks', category: 'Warmup', emoji: '⭐', weight: 0, sets: 1, reps: 30, rest: 15, tags: [] },
    { id: 'arm-circles', name: 'Arm Circles', category: 'Warmup', emoji: '🔄', weight: 0, sets: 1, reps: 20, rest: 15, tags: [] },
    { id: 'hip-circles', name: 'Hip Circles', category: 'Warmup', emoji: '🔄', weight: 0, sets: 1, reps: 15, rest: 15, tags: [] },
    { id: 'high-knees', name: 'High Knees', category: 'Warmup', emoji: '🦵', weight: 0, sets: 1, reps: 30, rest: 15, tags: [] },
    { id: 'leg-swings', name: 'Leg Swings', category: 'Warmup', emoji: '🦵', weight: 0, sets: 1, reps: 15, rest: 15, tags: [] },

    // ─── COOLDOWN ──────────────────────────────────────
    { id: 'quad-stretch', name: 'Standing Quad Stretch', category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây mỗi bên', tags: [] },
    { id: 'hamstring-str', name: 'Seated Hamstring Stretch', category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây', tags: [] },
    { id: 'chest-stretch', name: 'Doorway Chest Stretch', category: 'Cooldown', emoji: '🧘', weight: 0, sets: 1, reps: 1, rest: 10, note: '30 giây', tags: [] },
    { id: 'cat-cow', name: 'Cat-Cow Stretch', category: 'Cooldown', emoji: '🐱', weight: 0, sets: 1, reps: 10, rest: 10, tags: [] },
    { id: 'deep-breathing', name: 'Deep Breathing', category: 'Cooldown', emoji: '🫁', weight: 0, sets: 1, reps: 10, rest: 0, note: 'Hít thở sâu', tags: [] },
];

// All available categories in display order
const CATEGORIES = ['Back', 'Biceps', 'Chest', 'Shoulders', 'Triceps', 'Legs', 'Core', 'Warmup', 'Cooldown'];

// Progression rules (for future use / display)
const PROGRESSION_RULES = {
    allRepsHit: { action: 'increase', amount: 2.5, unit: 'kg', desc: 'All reps hit → +2.5 kg next time' },
    belowMinReps: { action: 'decrease', amount: 2.5, unit: 'kg', desc: '<6 reps? → −2.5 kg' },
    almostThere: { action: 'keep', amount: 0, unit: 'kg', desc: '6-7 reps → keep same weight' },
};
