'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

// Syllabus
export const createSyllabusItem = async (payload: Database['public']['Tables']['course_syllabus']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_syllabus').insert(payload).select().single();
  if (error) throw error;
  
  revalidatePath(`/dashboard/teacher/courses/${payload.course_id}`);
  return data;
};

export const updateSyllabusItem = async (id: number, patch: Partial<Database['public']['Tables']['course_syllabus']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_syllabus').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};

export const deleteSyllabusItem = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_syllabus').delete().eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};

// Reviews
export const createReview = async (courseId: number, payload: Partial<Database['public']['Tables']['course_reviews']['Insert']>) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;

  // Verify enrollment
  const { data: enrollment, error: enrollErr } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('student_id', userId).maybeSingle();
  if (enrollErr) throw enrollErr;
  if (!enrollment) throw new Error('User not enrolled in course');

  const insert = { ...payload, course_id: courseId, student_id: userId };
  const { data, error } = await supabase.from('course_reviews').insert(insert as any).select().single();
  if (error) throw error;
  
  revalidatePath(`/courses/${courseId}`);
  return data;
};

export const updateReview = async (id: number, patch: Partial<Database['public']['Tables']['course_reviews']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_reviews').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/courses/${data.course_id}`);
  return data;
};

export const deleteReview = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_reviews').delete().eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/courses/${data.course_id}`);
  return data;
};

// Learnings
export const createLearning = async (payload: Database['public']['Tables']['course_learnings']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_learnings').insert(payload).select().single();
  if (error) throw error;
  
  revalidatePath(`/dashboard/teacher/courses/${payload.course_id}`);
  return data;
};

export const updateLearning = async (id: number, patch: Partial<Database['public']['Tables']['course_learnings']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_learnings').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};

export const deleteLearning = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_learnings').delete().eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};

// FAQ
export const createFaq = async (payload: Database['public']['Tables']['course_faq']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_faq').insert(payload).select().single();
  if (error) throw error;
  
  revalidatePath(`/dashboard/teacher/courses/${payload.course_id}`);
  return data;
};

export const updateFaq = async (id: number, patch: Partial<Database['public']['Tables']['course_faq']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_faq').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};

export const deleteFaq = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('course_faq').delete().eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}`);
  return data;
};
