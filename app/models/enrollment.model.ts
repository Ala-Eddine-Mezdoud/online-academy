'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

export const getMyEnrollments = async () => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('enrollments').select('*').eq('student_id', userId);
  if (error) throw error;
  return data;
};

export const getEnrollmentsByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('enrollments').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};

export const getAllEnrollments = async () => {
  const supabase = await createServerSupabase();
  const { data: enrollments, error: err } = await supabase.from('enrollments').select(`
    *,
    courses (
      title,
      teacher_id
    ),
    profiles (
      role
    )
  `);
  if (err) throw err;
  return enrollments;
};

export const getEnrollmentsWithStudentsByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles:student_id (
        email,
        name,
        avatar_url
      )
    `)
    .eq('course_id', courseId);
    
  if (error) throw error;
  return data;
};
