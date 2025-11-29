import type { Database } from './supabase/database.types';

// Use the DB row types where appropriate
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type CourseRow = Database['public']['Tables']['courses']['Row'];
type EnrollmentRow = Database['public']['Tables']['enrollments']['Row'];
type LiveSessionsRow = Database['public']['Tables']['live_sessions']['Row'];

/**
 * Admin-facing shapes but compatible with DB row types:
 * - Profiles use string ids (supabase user ids)
 * - Courses use numeric ids and reference teacher_id (string)
 * - Enrollments use numeric ids and reference course_id (number) and student_id (string)
 */

export interface Teacher extends Partial<ProfileRow> {
  // include DB columns via Partial<ProfileRow> and add UI-friendly fields
  id: string; // keep as DB profile id (uuid string)
  name: string;
  email?: string | null;
  department?: string | null;
  // DB column name
  phone_number?: string | null;
  // UI convenience alias
  phone?: string | null;
  // DB location-like column
  wilaya?: string | null;
  location?: string | null;
  gender?: string | null;
  description?: string | null;
  profile_image?: string | null;
  role?: string;
  role_title?: string | null;
  created_at?: string | null;
}

export interface Student extends Partial<ProfileRow> {
  id: string; // profile id (uuid string)
  name: string;
  studentId?: string | null;
  major?: string | null;
  role?: string;
  profile_image?: string | null;
  created_at?: string | null;
}

export interface Course extends Partial<CourseRow> {
  id: number; // use numeric ids for courses
  code?: string;
  title: string;
  department?: string | null;
  teacher_id?: string | null; // reference to profiles.id
  assignedTeacher?: string | null; // UI convenience field (teacher name)
  overview?: string | null;
  created_at?: string | null;
}

export interface CourseEnrollment extends Partial<EnrollmentRow> {
  id: number;
  course_id: number;      // course id as number
  student_id: string;     // profile id of the student
  enrolled_at?: string | null;
  progress?: number | null;
  deleted_at?: string | null;
}

/** Sample teachers (profile-like, id is a string as in supabase auth user id) */
export const teachers: Teacher[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    department: 'Computer Science',
    phone: '+1 555 100 0100',
    phone_number: '+1 555 100 0100',
    location: 'Building A, Room 101',
    wilaya: 'Building A, Room 101',
    gender: 'Male',
    created_at: new Date().toISOString(),
    description: 'Dr. John Smith, Senior Lecturer',
    profile_image: null,
    role: 'teacher',
    role_title: 'Senior Lecturer',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Prof. Alice Johnson',
    email: 'alice.j@example.com',
    department: 'Mathematics',
    phone: '+1 555 200 0200',
    phone_number: '+1 555 200 0200',
    location: 'Building B, Room 210',
    wilaya: 'Building B, Room 210',
    gender: 'Female',
    created_at: new Date().toISOString(),
    description: 'Prof. Alice Johnson, Head of Mathematics',
    profile_image: null,
    role: 'teacher',
    role_title: 'Head of Mathematics',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Ms. Sarah Davis',
    email: 'sarah.d@example.com',
    department: 'Physics',
    phone: '+1 555 300 0300',
    phone_number: '+1 555 300 0300',
    location: 'Building C, Room 305',
    wilaya: 'Building C, Room 305',
    gender: 'Female',
    created_at: new Date().toISOString(),
    description: 'Ms. Sarah Davis, Lecturer',
    profile_image: null,
    role: 'teacher',
    role_title: 'Lecturer',
  },
];

/** Sample students (profile-like) */
export const students: Student[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Alex Green',
    studentId: 'STU001',
    major: 'Computer Science',
    created_at: new Date().toISOString(),
    role: 'student',
    profile_image: null,
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Emma Wilson',
    studentId: 'STU002',
    major: 'Mathematics',
    created_at: new Date().toISOString(),
    role: 'student',
    profile_image: null,
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    name: 'Ryan Clark',
    studentId: 'STU003',
    major: 'Physics',
    created_at: new Date().toISOString(),
    role: 'student',
    profile_image: null,
  },
];

/** Sample courses: numeric ids, teacher_id references a profile id (string) */
export const courses: Course[] = [
  {
    id: 1,
    code: 'CS301',
    title: 'Introduction to AI',
    department: 'Computer Science',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    assignedTeacher: 'Dr. John Smith',
    created_at: new Date().toISOString(),
    overview: 'An introduction to artificial intelligence concepts and applications.',
  },
  {
    id: 2,
    code: 'MA101',
    title: 'Calculus I',
    department: 'Mathematics',
    teacher_id: '22222222-2222-2222-2222-222222222222',
    assignedTeacher: 'Prof. Alice Johnson',
    created_at: new Date().toISOString(),
    overview: 'Fundamentals of differential and integral calculus.',
  },
  {
    id: 3,
    code: 'PH405',
    title: 'Quantum Mechanics',
    department: 'Physics',
    teacher_id: '33333333-3333-3333-3333-333333333333',
    assignedTeacher: 'Ms. Sarah Davis',
    created_at: new Date().toISOString(),
    overview: 'Advanced topics in quantum theory and applications.',
  },
];

/** Sample enrollments: numeric id, course_id numeric, student_id string */
export const studentEnrollments: CourseEnrollment[] = [
  { id: 1, course_id: 1, student_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', enrolled_at: new Date().toISOString(), progress: 0 }, // Emma enrolled in CS301
  { id: 2, course_id: 3, student_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', enrolled_at: new Date().toISOString(), progress: 0 }, // Emma enrolled in PH405
  { id: 3, course_id: 2, student_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', enrolled_at: new Date().toISOString(), progress: 0 }, // Alex enrolled in MA101
];

/** Helper mapping if you want a name => enrollments map for UI convenience (derived at runtime) */
export const studentEnrollmentsByName: Record<string, CourseEnrollment[]> = {
  'Emma Wilson': studentEnrollments.filter(e => e.student_id === 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  'Alex Green': studentEnrollments.filter(e => e.student_id === 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
};

export const teacherCourses: Record<string, number[]> = {
  // map teacher name to course ids for quick UI access
  'Dr. John Smith': [1],
  'Prof. Alice Johnson': [2],
  'Ms. Sarah Davis': [3],
};

// New-record types used by UI forms
export type NewTeacher = Omit<Teacher, 'id'>;
export type NewStudent = Omit<Student, 'id'>;

export type NewCourse = Omit<Course, 'id'>;

/** Sample notifications for mock UI */
export const notifications = [
  { id: 'n1', message: 'Your "Introduction to AI" session starts in 15 minutes.', createdAt: new Date().toISOString(), read: false },
  { id: 'n2', message: 'New message from student Emma Wilson regarding "Calculus I".', createdAt: new Date().toISOString(), read: false },
  { id: 'n3', message: 'Upcoming "Quantum Mechanics" session scheduled for Friday.', createdAt: new Date().toISOString(), read: false },
];

/** Sample live sessions used by the admin Live Management UI (mock) */
export type LiveSessionStatus = 'Live' | 'Upcoming' | 'Completed' | 'Canceled';

export interface LiveSession {
  id: string;
  date: string; // human friendly: "Nov 20, 2023"
  time: string; // "10:00 AM"
  teacher: string;
  courseTitle: string;
  status: LiveSessionStatus;
}

export const liveSessions: LiveSession[] = [
  // Make live sessions refer to existing courses/teachers where possible
  {
    id: 's1',
    date: 'Nov 20, 2023',
    time: '10:00 AM',
    teacher: 'Dr. John Smith',
    courseTitle: 'Introduction to AI',
    status: 'Live',
  },
  {
    id: 's2',
    date: 'Nov 21, 2023',
    time: '02:00 PM',
    teacher: 'Prof. Alice Johnson',
    courseTitle: 'Calculus I',
    status: 'Upcoming',
  },
  {
    id: 's3',
    date: 'Nov 19, 2023',
    time: '11:00 AM',
    teacher: 'Ms. Sarah Davis',
    courseTitle: 'Quantum Mechanics',
    status: 'Completed',
  },
  // Additional example sessions (not tied to existing courses) kept for variety
  {
    id: 's4',
    date: 'Nov 22, 2023',
    time: '09:00 AM',
    teacher: 'Dr. John Smith',
    courseTitle: 'Seminar: AI Ethics',
    status: 'Upcoming',
  },
  {
    id: 's5',
    date: 'Nov 18, 2023',
    time: '03:30 PM',
    teacher: 'Prof. Alice Johnson',
    courseTitle: 'Problem Solving Workshop',
    status: 'Canceled',
  },
];

export const liveSessionsRaw: LiveSessionsRow[] = [
  {
    id: 1,
    course_id: 1,
    teacher_id: '11111111-1111-1111-1111-111111111111',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    session_link: 'https://example.com/meeting/1',
    session_title: 'Introduction to AI - Live Session',
    deleted_at: null,
  },
  {
    id: 2,
    course_id: 2,
    teacher_id: '22222222-2222-2222-2222-222222222222',
    start_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    end_time: new Date(Date.now() + 1000 * 60 * 60 * 25).toISOString(),
    session_link: 'https://example.com/meeting/2',
    session_title: 'Calculus I - Review',
    deleted_at: null,
  },
];
