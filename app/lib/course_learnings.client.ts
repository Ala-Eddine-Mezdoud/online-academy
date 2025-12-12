import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getLearningsByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('course_learnings').select('*').eq('course_id', courseId);
  if (error) throw error;
  return data;
};

export const createLearning = async (payload: Database['public']['Tables']['course_learnings']['Insert']) => {
  const { data, error } = await supabase.from('course_learnings').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateLearning = async (id: number, patch: Partial<Database['public']['Tables']['course_learnings']['Update']>) => {
  const { data, error } = await supabase.from('course_learnings').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteLearning = async (id: number) => {
  const { data, error } = await supabase.from('course_learnings').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};