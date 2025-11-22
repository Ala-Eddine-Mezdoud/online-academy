import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getAllCourses = async () => {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data;
};

export const getCourseById = async (id: number) => {
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

export const getMyCourses = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('courses').select('*').eq('teacher_id', userId);
  if (error) throw error;
  return data;
};

export const createCourse = async (payload: Database['public']['Tables']['courses']['Insert']) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const insert = { ...payload, teacher_id: payload.teacher_id ?? authData.user.id };
  const { data, error } = await supabase.from('courses').insert(insert).select().single();
  if (error) throw error;
  return data;
};

export const updateCourse = async (id: number, patch: Partial<Database['public']['Tables']['courses']['Update']>) => {
  const { data, error } = await supabase.from('courses').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCourse = async (id: number) => {
  const { data, error } = await supabase.from('courses').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};