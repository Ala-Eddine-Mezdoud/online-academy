// Mock data for the admin dashboard

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  phone_number?: string;
  wilaya?: string;
  role_title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher extends Profile {
  role: 'teacher';
  links?: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

export interface Student extends Profile {
  role: 'student';
  enrollments?: number;
}

export interface Course {
  id: number;
  teacher_id: string;
  teacher_name: string;
  title: string;
  overview?: string;
  description?: string;
  category_id: number;
  category_name: string;
  num_weeks: number;
  price: number;
  created_at: string;
  enrollments_count: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export const categories: Category[] = [
  { id: 1, name: 'Programming', description: 'Software development and coding' },
  { id: 2, name: 'Design', description: 'Graphic and UI/UX design' },
  { id: 3, name: 'Business', description: 'Business and entrepreneurship' },
  { id: 4, name: 'Mathematics', description: 'Math and statistics' },
  { id: 5, name: 'Languages', description: 'Language learning' },
];

export const teachers: Teacher[] = [
  {
    id: '1',
    first_name: 'Ahmed',
    last_name: 'Benali',
    email: 'ahmed.benali@example.com',
    role: 'teacher',
    phone_number: '+213 555 123 456',
    wilaya: 'Algiers',
    role_title: 'Senior Software Engineer',
    description: 'Experienced developer with 10+ years in web development',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    links: [
      { id: 1, platform: 'LinkedIn', url: 'https://linkedin.com/in/ahmedbenali' },
      { id: 2, platform: 'GitHub', url: 'https://github.com/ahmedbenali' },
    ]
  },
  {
    id: '2',
    first_name: 'Fatima',
    last_name: 'Meziane',
    email: 'fatima.meziane@example.com',
    role: 'teacher',
    phone_number: '+213 555 234 567',
    wilaya: 'Oran',
    role_title: 'UI/UX Designer',
    description: 'Passionate about creating beautiful user experiences',
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
    links: [
      { id: 3, platform: 'Behance', url: 'https://behance.net/fatimameziane' },
    ]
  },
  {
    id: '3',
    first_name: 'Youcef',
    last_name: 'Hamdi',
    email: 'youcef.hamdi@example.com',
    role: 'teacher',
    phone_number: '+213 555 345 678',
    wilaya: 'Constantine',
    role_title: 'Business Consultant',
    description: 'Helping entrepreneurs build successful businesses',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
];

export const students: Student[] = [
  {
    id: '4',
    first_name: 'Amina',
    last_name: 'Bouaziz',
    email: 'amina.bouaziz@example.com',
    role: 'student',
    phone_number: '+213 555 456 789',
    wilaya: 'Algiers',
    created_at: '2024-04-01T10:00:00Z',
    updated_at: '2024-04-01T10:00:00Z',
    enrollments: 3,
  },
  {
    id: '5',
    first_name: 'Karim',
    last_name: 'Salah',
    email: 'karim.salah@example.com',
    role: 'student',
    phone_number: '+213 555 567 890',
    wilaya: 'Blida',
    created_at: '2024-04-05T10:00:00Z',
    updated_at: '2024-04-05T10:00:00Z',
    enrollments: 5,
  },
  {
    id: '6',
    first_name: 'Sarah',
    last_name: 'Ferhat',
    email: 'sarah.ferhat@example.com',
    role: 'student',
    phone_number: '+213 555 678 901',
    wilaya: 'Oran',
    created_at: '2024-04-10T10:00:00Z',
    updated_at: '2024-04-10T10:00:00Z',
    enrollments: 2,
  },
  {
    id: '7',
    first_name: 'Mehdi',
    last_name: 'Kaci',
    email: 'mehdi.kaci@example.com',
    role: 'student',
    phone_number: '+213 555 789 012',
    wilaya: 'Tizi Ouzou',
    created_at: '2024-04-15T10:00:00Z',
    updated_at: '2024-04-15T10:00:00Z',
    enrollments: 1,
  },
  {
    id: '8',
    first_name: 'Lina',
    last_name: 'Brahimi',
    email: 'lina.brahimi@example.com',
    role: 'student',
    phone_number: '+213 555 890 123',
    wilaya: 'Setif',
    created_at: '2024-04-20T10:00:00Z',
    updated_at: '2024-04-20T10:00:00Z',
    enrollments: 4,
  },
];

export const courses: Course[] = [
  {
    id: 1,
    teacher_id: '1',
    teacher_name: 'Ahmed Benali',
    title: 'Complete Web Development Bootcamp',
    overview: 'Learn HTML, CSS, JavaScript, React, and Node.js',
    description: 'A comprehensive course covering full-stack web development',
    category_id: 1,
    category_name: 'Programming',
    num_weeks: 12,
    price: 15000,
    created_at: '2024-05-01T10:00:00Z',
    enrollments_count: 45
  },
  {
    id: 2,
    teacher_id: '2',
    teacher_name: 'Fatima Meziane',
    title: 'UI/UX Design Masterclass',
    overview: 'Master the art of user interface and user experience design',
    description: 'Learn design principles, Figma, and create stunning interfaces',
    category_id: 2,
    category_name: 'Design',
    num_weeks: 8,
    price: 12000,
    created_at: '2024-05-10T10:00:00Z',
    enrollments_count: 32
  },
  {
    id: 3,
    teacher_id: '3',
    teacher_name: 'Youcef Hamdi',
    title: 'Digital Marketing for Startups',
    overview: 'Learn how to market your business online',
    description: 'Social media marketing, SEO, and content strategy',
    category_id: 3,
    category_name: 'Business',
    num_weeks: 6,
    price: 10000,
    created_at: '2024-05-15T10:00:00Z',
    enrollments_count: 28
  },
  {
    id: 4,
    teacher_id: '1',
    teacher_name: 'Ahmed Benali',
    title: 'Python for Data Science',
    overview: 'Data analysis and visualization with Python',
    description: 'Learn pandas, NumPy, and matplotlib',
    category_id: 1,
    category_name: 'Programming',
    num_weeks: 10,
    price: 13000,
    created_at: '2024-05-20T10:00:00Z',
    enrollments_count: 38
  },
];

export interface Enrollment {
  id: number;
  student_id: string;
  student_name: string;
  course_id: number;
  course_title: string;
  enrollment_date: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
}

export const enrollments: Enrollment[] = [
  { id: 1, student_id: '4', student_name: 'Amina Bouaziz', course_id: 1, course_title: 'Complete Web Development Bootcamp', enrollment_date: '2024-05-02T10:00:00Z', progress: 45, status: 'active' },
  { id: 2, student_id: '4', student_name: 'Amina Bouaziz', course_id: 2, course_title: 'UI/UX Design Masterclass', enrollment_date: '2024-05-11T10:00:00Z', progress: 30, status: 'active' },
  { id: 3, student_id: '4', student_name: 'Amina Bouaziz', course_id: 3, course_title: 'Digital Marketing for Startups', enrollment_date: '2024-05-16T10:00:00Z', progress: 100, status: 'completed' },
  { id: 4, student_id: '5', student_name: 'Karim Salah', course_id: 1, course_title: 'Complete Web Development Bootcamp', enrollment_date: '2024-05-03T10:00:00Z', progress: 67, status: 'active' },
  { id: 5, student_id: '5', student_name: 'Karim Salah', course_id: 4, course_title: 'Python for Data Science', enrollment_date: '2024-05-21T10:00:00Z', progress: 25, status: 'active' },
  { id: 6, student_id: '6', student_name: 'Sarah Ferhat', course_id: 2, course_title: 'UI/UX Design Masterclass', enrollment_date: '2024-05-12T10:00:00Z', progress: 80, status: 'active' },
  { id: 7, student_id: '6', student_name: 'Sarah Ferhat', course_id: 3, course_title: 'Digital Marketing for Startups', enrollment_date: '2024-05-17T10:00:00Z', progress: 50, status: 'active' },
  { id: 8, student_id: '7', student_name: 'Mehdi Kaci', course_id: 1, course_title: 'Complete Web Development Bootcamp', enrollment_date: '2024-05-04T10:00:00Z', progress: 15, status: 'active' },
  { id: 9, student_id: '8', student_name: 'Lina Brahimi', course_id: 4, course_title: 'Python for Data Science', enrollment_date: '2024-05-22T10:00:00Z', progress: 90, status: 'active' },
];

export const wilayas = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès',
  'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa',
];
