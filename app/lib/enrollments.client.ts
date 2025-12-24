import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getMyEnrollments = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('enrollments').select('*').eq('student_id', userId);
  if (error) throw error;
  return data;
};

export const getEnrollmentsByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('enrollments').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};

export const enroll = async (courseId: number) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;
  // avoid duplicate
  const { data: existing } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('student_id', userId).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase.from('enrollments').insert({ course_id: courseId, student_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const unenroll = async (courseId: number) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;
  const { data, error } = await supabase.from('enrollments').delete().eq('course_id', courseId).eq('student_id', userId).select().single();
  if (error) throw error;
  return data;
};

export const getAllEnrollments = async () => {
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

export const updateEnrollmentProgress = async (id: number, progress: number) => {
  const { data, error } = await supabase.from('enrollments').update({ progress }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const getEnrollmentsWithStudentsByCourse = async (courseId: number) => {
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles:student_id (
        email,
        full_name,
        avatar_url
      )
    `)
    .eq('course_id', courseId);
    
  if (error) throw error;
  return data;
};