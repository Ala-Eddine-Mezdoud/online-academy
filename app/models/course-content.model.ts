'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

// Syllabus
export const getSyllabusByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('course_syllabus')
    .select('*')
    .eq('course_id', courseId)
    .order('week_number', { ascending: true });
    
  if (error) throw error;
  return data;
};

// Reviews
export const getReviewsByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('course_reviews')
    .select(`
      *,
      student:profiles!student_id (
        name,
        profile_image
      )
    `)
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Learnings
export const getLearningsByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_learnings').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};

// FAQ
export const getFaqByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_faq').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};
