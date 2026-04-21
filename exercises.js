// =====================================================
//  EXERCISE LIBRARY
// =====================================================

const EXERCISE_LIBRARY = [

    // ─── BACK / PULL ───────────────────────────────────
    { id: 'lat-pulldown-chin', name: 'Lat Pulldown (Chin-Up Grip)', category: 'Back', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 90, tags: ['pull'] },
    { id: 'lat-pulldown-std', name: 'Lat Pulldown (Standard)', category: 'Back', emoji: '🏋️', weight: 45, sets: 4, reps: 8, rest: 90, tags: ['pull'] },
    { id: 'lat-pulldown-vbar', name: 'V-Bar Lat Pulldown', category: 'Back', emoji: '🏋️', weight: 50, sets: 3, reps: 8, rest: 90, tags: ['pull'] },
    { id: 'seated-cable-row', name: 'Seated Cable Row (Wide)', category: 'Back', emoji: '🚣', weight: 41, sets: 3, reps: 8, rest: 90, tags: ['pull'] },
    { id: 'barbell-bent-row', name: 'Barbell Bent-Over Row', category: 'Back', emoji: '🏋️', weight: 40, sets: 3, reps: 8, rest: 120, tags: ['pull'] },

    // ─── BICEPS ────────────────────────────────────────
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'Biceps', emoji: '💪', weight: 20, sets: 3, reps: 8, rest: 65, tags: ['pull'] },
    { id: 'seated-db-curl', name: 'Seated Dumbbell Curl', category: 'Biceps', emoji: '💪', weight: 11, sets: 3, reps: 8, rest: 60, tags: ['pull'] },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'Biceps', emoji: '🔨', weight: 8, sets: 3, reps: 20, rest: 45, tags: ['pull'] },

    // ─── CHEST ─────────────────────────────────────────
    { id: 'barbell-bench', name: 'Barbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 120, tags: ['push'] },
    { id: 'db-bench', name: 'Dumbbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 26, sets: 4, reps: 8, rest: 90, tags: ['push'] },
    { id: 'incline-barbell', name: 'Incline Barbell Bench Press', category: 'Chest', emoji: '📐', weight: 50, sets: 3, reps: 7, rest: 120, tags: ['push'] },
    { id: 'incline-db', name: 'Incline Dumbbell Bench Press', category: 'Chest', emoji: '📐', weight: 24, sets: 4, reps: 8, rest: 90, tags: ['push'] },
    { id: 'machine-fly', name: 'Machine Chest Fly', category: 'Chest', emoji: '🦋', weight: 47, sets: 3, reps: 11, rest: 60, tags: ['push'] },

    // ─── SHOULDERS ─────────────────────────────────────
    { id: 'db-ohp', name: 'Dumbbell Overhead Press', category: 'Shoulders', emoji: '🙌', weight: 20, sets: 3, reps: 8, rest: 90, tags: ['push'] },
    { id: 'machine-shoulder', name: 'Machine Shoulder Press', category: 'Shoulders', emoji: '🙌', weight: 45, sets: 3, reps: 8, rest: 90, tags: ['push'] },
    { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', emoji: '🕊️', weight: 8, sets: 3, reps: 15, rest: 45, tags: ['push'] },

    // ─── TRICEPS ───────────────────────────────────────
    { id: 'cable-pushdown', name: 'Cable Triceps Pushdown', category: 'Triceps', emoji: '⬇️', weight: 54.5, sets: 3, reps: 8, rest: 60, tags: ['push'] },
    { id: 'rope-pushdown', name: 'Rope Triceps Pushdown', category: 'Triceps', emoji: '🪢', weight: 45, sets: 3, reps: 10, rest: 60, tags: ['push'] },
    { id: 'cable-overhead-ext', name: 'Cable Overhead Triceps Ext.', category: 'Triceps', emoji: '⬆️', weight: 25, sets: 3, reps: 8, rest: 60, tags: ['push'] },

    // ─── LEGS ──────────────────────────────────────────
    { id: 'barbell-squat', name: 'Barbell Back Squat', category: 'Legs', emoji: '🦵', weight: 90, sets: 4, reps: 6, rest: 150, tags: ['lower'] },
    { id: 'leg-press', name: 'Leg Press', category: 'Legs', emoji: '🦵', weight: 107, sets: 3, reps: 8, rest: 120, tags: ['lower'] },
    { id: 'leg-extension', name: 'Leg Extension', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60, tags: ['lower'] },
    { id: 'lying-leg-curl', name: 'Lying Leg Curl', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60, tags: ['lower'] },
    { id: 'rdl-dumbbell', name: 'Romanian Deadlift (Dumbbell)', category: 'Legs', emoji: '🏋️', weight: 24, sets: 3, reps: 8, rest: 120, tags: ['lower'] },

    // ─── CORE ──────────────────────────────────────────
    { id: 'plank', name: 'Plank Hold', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 45, rest: 30, tags: ['core'] },
    { id: 'crunches', name: 'Crunches', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 20, rest: 30, tags: ['core'] },
    { id: 'russian-twist', name: 'Russian Twist', category: 'Core', emoji: '🧱', weight: 5, sets: 3, reps: 20, rest: 30, tags: ['core'] },
    { id: 'leg-raises', name: 'Leg Raises', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 15, rest: 30, tags: ['core'] },
    { id: 'mountain-climbers', name: 'Mountain Climbers', category: 'Core', emoji: '🧱', weight: 0, sets: 3, reps: 24, rest: 30, tags: ['core', 'cardio'] },

    // ─── CARDIO / WARMUP ───────────────────────────────
    { id: 'jumping-jacks', name: 'Jumping Jacks', category: 'Cardio', emoji: '🏃', weight: 0, sets: 2, reps: 30, rest: 20, tags: ['warmup', 'cardio'] },
    { id: 'arm-circles', name: 'Arm Circles', category: 'Cardio', emoji: '🔄', weight: 0, sets: 2, reps: 20, rest: 15, tags: ['warmup'] },
    { id: 'hip-circles', name: 'Hip Circles', category: 'Cardio', emoji: '🔄', weight: 0, sets: 2, reps: 20, rest: 15, tags: ['warmup'] },
    { id: 'light-cardio', name: 'Light Cardio Jog', category: 'Cardio', emoji: '🏃', weight: 0, sets: 2, reps: 40, rest: 20, tags: ['warmup', 'cardio'] },
    { id: 'static-stretches', name: 'Static Stretches', category: 'Cardio', emoji: '🧘', weight: 0, sets: 1, reps: 60, rest: 15, tags: ['cooldown'] },
    { id: 'deep-breathing', name: 'Deep Breathing', category: 'Cardio', emoji: '🫁', weight: 0, sets: 1, reps: 45, rest: 15, tags: ['cooldown'] },
];

// All available categories in display order
const CATEGORIES = ['Back', 'Biceps', 'Chest', 'Shoulders', 'Triceps', 'Legs', 'Core', 'Cardio'];

const PROGRESSION_RULES = {
    allRepsHit: { action: 'increase', amount: 2.5, unit: 'kg', desc: 'All reps hit → +2.5 kg next time' },
    belowMinReps: { action: 'decrease', amount: 2.5, unit: 'kg', desc: '<6 reps? → −2.5 kg' },
    almostThere: { action: 'keep', amount: 0, unit: 'kg', desc: '6-7 reps → keep same weight' },
};
