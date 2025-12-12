import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getReviewsByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('course_reviews').select('*').eq('course_id', courseId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createReview = async (courseId: number, payload: Partial<Database['public']['Tables']['course_reviews']['Insert']>) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;

  // Verify enrollment (student-only write rule)
  const { data: enrollment, error: enrollErr } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('student_id', userId).maybeSingle();
  if (enrollErr) throw enrollErr;
  if (!enrollment) throw new Error('User not enrolled in course');

  const insert = { ...payload, course_id: courseId, student_id: userId };
  const { data, error } = await supabase.from('course_reviews').insert(insert).select().single();
  if (error) throw error;
  return data;
};

export const updateReview = async (id: number, patch: Partial<Database['public']['Tables']['course_reviews']['Update']>) => {
  const { data, error } = await supabase.from('course_reviews').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteReview = async (id: number) => {
  const { data, error } = await supabase.from('course_reviews').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};