// ═══════════════════════════════════════════════════════════
// College‑specific configuration — edit these values to
// customize VibeMatch101 for your institution.
// ═══════════════════════════════════════════════════════════

export const COLLEGE_NAME = 'Newton School of Technology';
export const COLLEGE_SHORT = 'NST';
export const EMAIL_DOMAIN = '@adypu.edu.in';
export const APP_NAME = 'VibeMatch101';

// Branches / departments at ADYPU
export const BRANCHES = [
  'Computer Science & Engineering',
  'Artificial Intelligence & Data Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Aerospace Engineering',
  'Robotics & Automation',
  'Biotechnology',
  'Computer Applications',
  'Design (UI/UX)',
  'Management',
  'Liberal Arts',
  'Law',
  'Hotel Management',
];

export const DIVISIONS = ['A', 'B', 'C', 'D'];

export const YEARS = [
  { label: 'First Year', value: 'FY' },
  { label: 'Second Year', value: 'SY' },
  { label: 'Third Year', value: 'TY' },
  { label: 'Final Year', value: 'Final Year' },
];

export const HOSTEL_STATUS = [
  { label: 'Hostel', value: 'Hostel' },
  { label: 'Day Scholar', value: 'Day Scholar' },
];

// Image size limits (in bytes)
export const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB
export const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB

// Supabase storage bucket names
export const BUCKET_PROFILES = 'profile-photos';
export const BUCKET_POSTS = 'post-images';
