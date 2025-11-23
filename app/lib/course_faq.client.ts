import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getFaqByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('course_faq').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};

export const createFaq = async (payload: Database['public']['Tables']['course_faq']['Insert']) => {
  const { data, error } = await supabase.from('course_faq').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateFaq = async (id: number, patch: Partial<Database['public']['Tables']['course_faq']['Update']>) => {
  const { data, error } = await supabase.from('course_faq').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteFaq = async (id: number) => {
  const { data, error } = await supabase.from('course_faq').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};