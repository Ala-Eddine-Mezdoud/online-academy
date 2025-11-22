import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getSyllabusByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('course_syllabus').select('*').eq('course_id', courseId).order('week_number', { ascending: true });
  if (error) throw error;
  return data;
};

export const createSyllabusItem = async (payload: Database['public']['Tables']['course_syllabus']['Insert']) => {
  const { data, error } = await supabase.from('course_syllabus').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateSyllabusItem = async (id: number, patch: Partial<Database['public']['Tables']['course_syllabus']['Update']>) => {
  const { data, error } = await supabase.from('course_syllabus').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteSyllabusItem = async (id: number) => {
  const { data, error } = await supabase.from('course_syllabus').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};