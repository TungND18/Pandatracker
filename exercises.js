// =====================================================
//  EXERCISE LIBRARY — exercises.js
//  24 exercises organised by category
// =====================================================

const EXERCISE_LIBRARY = [

    // ─── BACK / PULL ───────────────────────────────────
    { id: 'lat-pulldown-chin', name: 'Lat Pulldown (Chin-Up Grip)', category: 'Back', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 90 },
    { id: 'lat-pulldown-std', name: 'Lat Pulldown (Standard)', category: 'Back', emoji: '🏋️', weight: 45, sets: 4, reps: 8, rest: 90 },
    { id: 'lat-pulldown-vbar', name: 'V-Bar Lat Pulldown', category: 'Back', emoji: '🏋️', weight: 50, sets: 3, reps: 8, rest: 90 },
    { id: 'seated-cable-row', name: 'Seated Cable Row (Wide)', category: 'Back', emoji: '🚣', weight: 41, sets: 3, reps: 8, rest: 90 },
    { id: 'barbell-bent-row', name: 'Barbell Bent-Over Row', category: 'Back', emoji: '🏋️', weight: 40, sets: 3, reps: 8, rest: 120 },

    // ─── BICEPS ────────────────────────────────────────
    { id: 'barbell-curl', name: 'Barbell Curl', category: 'Biceps', emoji: '💪', weight: 20, sets: 3, reps: 8, rest: 65 },
    { id: 'seated-db-curl', name: 'Seated Dumbbell Curl', category: 'Biceps', emoji: '💪', weight: 11, sets: 3, reps: 8, rest: 60 },
    { id: 'hammer-curl', name: 'Hammer Curl', category: 'Biceps', emoji: '🔨', weight: 8, sets: 3, reps: 20, rest: 45 },

    // ─── CHEST ─────────────────────────────────────────
    { id: 'barbell-bench', name: 'Barbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 55, sets: 4, reps: 8, rest: 120 },
    { id: 'db-bench', name: 'Dumbbell Bench Press', category: 'Chest', emoji: '🏋️', weight: 26, sets: 4, reps: 8, rest: 90 },
    { id: 'incline-barbell', name: 'Incline Barbell Bench Press', category: 'Chest', emoji: '📐', weight: 50, sets: 3, reps: 7, rest: 120 },
    { id: 'incline-db', name: 'Incline Dumbbell Bench Press', category: 'Chest', emoji: '📐', weight: 24, sets: 4, reps: 8, rest: 90 },
    { id: 'machine-fly', name: 'Machine Chest Fly', category: 'Chest', emoji: '🦋', weight: 47, sets: 3, reps: 11, rest: 60 },

    // ─── SHOULDERS ─────────────────────────────────────
    { id: 'db-ohp', name: 'Dumbbell Overhead Press', category: 'Shoulders', emoji: '🙌', weight: 20, sets: 3, reps: 8, rest: 90 },
    { id: 'machine-shoulder', name: 'Machine Shoulder Press', category: 'Shoulders', emoji: '🙌', weight: 45, sets: 3, reps: 8, rest: 90 },
    { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', category: 'Shoulders', emoji: '🕊️', weight: 8, sets: 3, reps: 15, rest: 45 },

    // ─── TRICEPS ───────────────────────────────────────
    { id: 'cable-pushdown', name: 'Cable Triceps Pushdown', category: 'Triceps', emoji: '⬇️', weight: 54.5, sets: 3, reps: 8, rest: 60 },
    { id: 'rope-pushdown', name: 'Rope Triceps Pushdown', category: 'Triceps', emoji: '🪢', weight: 45, sets: 3, reps: 10, rest: 60 },
    { id: 'cable-overhead-ext', name: 'Cable Overhead Triceps Ext.', category: 'Triceps', emoji: '⬆️', weight: 25, sets: 3, reps: 8, rest: 60 },

    // ─── LEGS ──────────────────────────────────────────
    { id: 'barbell-squat', name: 'Barbell Back Squat', category: 'Legs', emoji: '🦵', weight: 90, sets: 4, reps: 6, rest: 150 },
    { id: 'leg-press', name: 'Leg Press', category: 'Legs', emoji: '🦵', weight: 107, sets: 3, reps: 8, rest: 120 },
    { id: 'leg-extension', name: 'Leg Extension', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60 },
    { id: 'lying-leg-curl', name: 'Lying Leg Curl', category: 'Legs', emoji: '🦿', weight: 45, sets: 3, reps: 8, rest: 60 },
    { id: 'rdl-dumbbell', name: 'Romanian Deadlift (Dumbbell)', category: 'Legs', emoji: '🏋️', weight: 24, sets: 3, reps: 8, rest: 120 },
];

// All available categories in display order
const CATEGORIES = ['Back', 'Biceps', 'Chest', 'Shoulders', 'Triceps', 'Legs'];

// Progression rules (for future use / display)
const PROGRESSION_RULES = {
    allRepsHit: { action: 'increase', amount: 2.5, unit: 'kg', desc: 'All reps hit → +2.5 kg next time' },
    belowMinReps: { action: 'decrease', amount: 2.5, unit: 'kg', desc: '<6 reps? → −2.5 kg' },
    almostThere: { action: 'keep', amount: 0, unit: 'kg', desc: '6-7 reps → keep same weight' },
};
