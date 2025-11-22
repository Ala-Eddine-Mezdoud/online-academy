import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getSessionsByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('live_sessions').select('*').eq('course_id', courseId).order('start_time', { ascending: true });
  if (error) throw error;
  return data;
};

export const createSession = async (payload: Database['public']['Tables']['live_sessions']['Insert']) => {
  const { data, error } = await supabase.from('live_sessions').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateSession = async (id: number, patch: Partial<Database['public']['Tables']['live_sessions']['Update']>) => {
  const { data, error } = await supabase.from('live_sessions').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteSession = async (id: number) => {
  const { data, error } = await supabase.from('live_sessions').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};