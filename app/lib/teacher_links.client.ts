import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getMyTeacherLinks = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('teacher_links').select('*').eq('teacher_id', userId);
  if (error) throw error;
  return data;
};

export const getLinksByTeacher = async (teacherId: string) => {
  const { data, error } = await supabase.from('teacher_links').select('*').eq('teacher_id', teacherId);
  if (error) throw error;
  return data;
};

export const createTeacherLink = async (payload: Database['public']['Tables']['teacher_links']['Insert']) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const insert = { ...payload, teacher_id: payload.teacher_id ?? authData.user.id };
  const { data, error } = await supabase.from('teacher_links').insert(insert).select().single();
  if (error) throw error;
  return data;
};

export const updateTeacherLink = async (id: number, patch: Partial<Database['public']['Tables']['teacher_links']['Update']>) => {
  const { data, error } = await supabase.from('teacher_links').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteTeacherLink = async (id: number) => {
  const { data, error } = await supabase.from('teacher_links').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};