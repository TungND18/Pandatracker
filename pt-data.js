// =====================================================
//  PT DATA LAYER — pt-data.js
//  Designed for future backend sync (PT app ↔ Client app)
//  
//  Data structure supports:
//  - Recurring weekly schedules
//  - Per-date overrides (special hours or blocked days)
//  - Easy migration to REST API
// =====================================================

// ── PT Profiles ──────────────────────────────────────
const PT_PROFILES = [
  {
    id: 'pt-001',
    name: 'Minh Trần',
    avatar: 'pt1.png',
    specialty: 'Strength & Hypertrophy',
    experience: '5 năm',
    rating: 4.9,
    pricePerHour: 300000,
    bio: 'Chuyên gia sức mạnh, compound movements. Phù hợp cho người muốn tăng cơ nhanh.',
    certifications: ['ACE-CPT', 'NASM'],
  },
  {
    id: 'pt-002',
    name: 'Linh Nguyễn',
    avatar: 'pt2.png',
    specialty: 'Weight Loss & HIIT',
    experience: '3 năm',
    rating: 4.8,
    pricePerHour: 220000,
    bio: 'Chuyên giảm cân, cardio cường độ cao. Năng lượng tích cực, luôn tạo động lực.',
    certifications: ['ISSA-CPT'],
  },
  {
    id: 'pt-003',
    name: 'Hùng Phạm',
    avatar: 'pt3.png',
    specialty: 'Powerlifting & Athletic',
    experience: '8 năm',
    rating: 4.7,
    pricePerHour: 400000,
    bio: 'Cựu VĐV powerlifting. Dành cho ai muốn nâng tạ nặng và phát triển sức mạnh tối đa.',
    certifications: ['NSCA-CSCS', 'IPF Coach'],
  },
  {
    id: 'pt-004',
    name: 'Thảo Lê',
    avatar: 'pt4.png',
    specialty: 'Yoga & Flexibility',
    experience: '4 năm',
    rating: 5.0,
    pricePerHour: 280000,
    bio: 'Kết hợp yoga với strength training. Giúp cải thiện tư thế, linh hoạt và phục hồi.',
    certifications: ['RYT-200', 'ACE-CPT'],
  },
  {
    id: 'pt-005',
    name: 'Đức Vũ',
    avatar: 'pt5.png',
    specialty: 'Calisthenics & Functional',
    experience: '3 năm',
    rating: 4.6,
    pricePerHour: 200000,
    bio: 'Tập luyện với trọng lượng cơ thể. Skills: muscle-up, handstand, planche progression.',
    certifications: ['NASM-CPT'],
  },
];

// ── PT Schedules ─────────────────────────────────────
// Structure:
//   recurring: { dayOfWeek (0=Sun..6=Sat): [{ start: 'HH:MM', end: 'HH:MM' }, ...] }
//   overrides: { 'YYYY-MM-DD': null (blocked) | [{ start, end }] (special hours) }
//   bookedSlots: { 'YYYY-MM-DD': [{ start, end, clientName }] }
//
// This structure is designed so a PT app can:
//   1. Set recurring weekly schedule
//   2. Override specific dates (block off or set special hours)
//   3. Record booked slots that reduce availability
//
const PT_SCHEDULES = {
  'pt-001': {
    recurring: {
      1: [{ start: '06:00', end: '12:00' }, { start: '14:00', end: '20:00' }], // Monday
      2: [{ start: '06:00', end: '12:00' }, { start: '14:00', end: '20:00' }], // Tuesday
      3: [{ start: '06:00', end: '12:00' }],                                   // Wednesday
      4: [{ start: '06:00', end: '12:00' }, { start: '14:00', end: '20:00' }], // Thursday
      5: [{ start: '06:00', end: '12:00' }, { start: '14:00', end: '18:00' }], // Friday
      6: [{ start: '08:00', end: '14:00' }],                                   // Saturday
    },
    overrides: {},
    bookedSlots: {},
  },
  'pt-002': {
    recurring: {
      1: [{ start: '07:00', end: '11:00' }, { start: '16:00', end: '21:00' }],
      2: [{ start: '16:00', end: '21:00' }],
      3: [{ start: '07:00', end: '11:00' }, { start: '16:00', end: '21:00' }],
      4: [{ start: '16:00', end: '21:00' }],
      5: [{ start: '07:00', end: '11:00' }, { start: '16:00', end: '21:00' }],
      6: [{ start: '09:00', end: '15:00' }],
      0: [{ start: '09:00', end: '13:00' }], // Sunday
    },
    overrides: {},
    bookedSlots: {},
  },
  'pt-003': {
    recurring: {
      1: [{ start: '05:00', end: '10:00' }, { start: '15:00', end: '19:00' }],
      3: [{ start: '05:00', end: '10:00' }, { start: '15:00', end: '19:00' }],
      5: [{ start: '05:00', end: '10:00' }, { start: '15:00', end: '19:00' }],
      6: [{ start: '07:00', end: '12:00' }],
    },
    overrides: {},
    bookedSlots: {},
  },
  'pt-004': {
    recurring: {
      2: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      4: [{ start: '08:00', end: '12:00' }, { start: '14:00', end: '18:00' }],
      6: [{ start: '08:00', end: '16:00' }],
      0: [{ start: '08:00', end: '14:00' }],
    },
    overrides: {},
    bookedSlots: {},
  },
  'pt-005': {
    recurring: {
      1: [{ start: '10:00', end: '14:00' }, { start: '17:00', end: '21:00' }],
      2: [{ start: '10:00', end: '14:00' }],
      3: [{ start: '17:00', end: '21:00' }],
      4: [{ start: '10:00', end: '14:00' }, { start: '17:00', end: '21:00' }],
      5: [{ start: '10:00', end: '14:00' }],
      0: [{ start: '10:00', end: '16:00' }],
    },
    overrides: {},
    bookedSlots: {},
  },
};

// ══════════════════════════════════════════════════════
//  HELPER FUNCTIONS (API-ready — easy to swap with fetch())
// ══════════════════════════════════════════════════════

/**
 * Format a Date as 'YYYY-MM-DD'
 */
function dateToStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Convert 'HH:MM' to minutes since midnight
 */
function timeToMin(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes since midnight to 'HH:MM'
 */
function minToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Get a PT's available time slots for a specific date.
 * Returns array of { start: 'HH:MM', end: 'HH:MM' } or empty array.
 * 
 * Logic:
 * 1. Check overrides first (null = blocked, array = special schedule)
 * 2. Fall back to recurring schedule for that day of week
 * 3. Subtract any booked slots
 */
function getPTSlotsForDate(ptId, date) {
  const sched = PT_SCHEDULES[ptId];
  if (!sched) return [];
  
  const dateStr = dateToStr(date);
  const dow = date.getDay(); // 0=Sunday
  
  // 1. Check overrides
  if (sched.overrides.hasOwnProperty(dateStr)) {
    const override = sched.overrides[dateStr];
    if (override === null) return []; // blocked
    return override.slice(); // special hours
  }
  
  // 2. Recurring schedule
  const recurring = sched.recurring[dow];
  if (!recurring || recurring.length === 0) return [];
  
  // 3. TODO: subtract booked slots (for now, return raw availability)
  // In future, this would check sched.bookedSlots[dateStr]
  return recurring.slice();
}

/**
 * Check if a PT is available for a given date+time range.
 * The requested [startTime, endTime] must fit entirely within 
 * at least one of the PT's available slots.
 */
function isPTAvailable(ptId, date, startTime, endTime) {
  const slots = getPTSlotsForDate(ptId, date);
  const reqStart = timeToMin(startTime);
  const reqEnd = timeToMin(endTime);
  
  if (reqEnd <= reqStart) return false;
  
  return slots.some(slot => {
    return reqStart >= timeToMin(slot.start) && reqEnd <= timeToMin(slot.end);
  });
}

/**
 * Check if ANY PT is available on a given date.
 * Used to highlight available days on the calendar.
 */
function isAnyPTAvailableOnDate(date) {
  return PT_PROFILES.some(pt => {
    const slots = getPTSlotsForDate(pt.id, date);
    return slots.length > 0;
  });
}

/**
 * Get all available PTs for a specific date + time range.
 * Returns array of PT profile objects.
 */
function getAvailablePTs(date, startTime, endTime) {
  return PT_PROFILES.filter(pt => isPTAvailable(pt.id, date, startTime, endTime));
}

/**
 * Get the date range for the calendar view (today → 4 weeks out).
 * Returns { start: Date, end: Date, dates: Date[] }
 */
function getCalendarRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(today);
  end.setDate(end.getDate() + 27); // 4 weeks = 28 days
  
  // Build array of all dates, starting from the Monday of the current week
  const startOfWeek = new Date(today);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday start
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  
  const dates = [];
  const cursor = new Date(startOfWeek);
  // Go until we cover 4 full weeks from today + padding to end of that week
  const endPadded = new Date(end);
  const endDow = endPadded.getDay();
  if (endDow !== 0) endPadded.setDate(endPadded.getDate() + (7 - endDow));
  
  while (cursor <= endPadded) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  
  return { start: today, end, dates };
}

/**
 * Generate time options for select dropdowns.
 * From 05:00 to 22:00 in 5-minute increments.
 */
function generateTimeOptions() {
  const options = [];
  for (let mins = 300; mins <= 1320; mins += 5) { // 05:00 to 22:00
    options.push(minToTime(mins));
  }
  return options;
}

// ── Future API hooks ─────────────────────────────────
// These functions are stubs for future backend integration.
// When a PT app is built, replace these with real API calls.

/**
 * [FUTURE] Book a slot with a PT.
 * In future: POST /api/bookings { ptId, date, startTime, endTime, clientInfo }
 */
function bookPTSlot(ptId, date, startTime, endTime) {
  const dateStr = dateToStr(date);
  const sched = PT_SCHEDULES[ptId];
  if (!sched) return { success: false, error: 'PT not found' };
  
  // Add to booked slots
  if (!sched.bookedSlots[dateStr]) sched.bookedSlots[dateStr] = [];
  sched.bookedSlots[dateStr].push({ start: startTime, end: endTime, clientName: 'Guest' });
  
  return { success: true, message: 'Đã đặt lịch thành công!' };
}

/**
 * [FUTURE] PT updates their schedule.
 * In future: PUT /api/pt/:id/schedule
 */
function updatePTSchedule(ptId, updates) {
  const sched = PT_SCHEDULES[ptId];
  if (!sched) return false;
  
  if (updates.recurring) sched.recurring = { ...sched.recurring, ...updates.recurring };
  if (updates.overrides) sched.overrides = { ...sched.overrides, ...updates.overrides };
  
  return true;
}

/**
 * [FUTURE] PT blocks a specific date.
 * In future: POST /api/pt/:id/block-date
 */
function blockPTDate(ptId, dateStr) {
  const sched = PT_SCHEDULES[ptId];
  if (!sched) return false;
  sched.overrides[dateStr] = null;
  return true;
}
