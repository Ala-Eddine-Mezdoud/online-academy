'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const createSession = async (payload: Database['public']['Tables']['live_sessions']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('live_sessions').insert(payload).select().single();
  if (error) throw error;
  
  revalidatePath(`/dashboard/teacher/courses/${payload.course_id}/live`);
  return data;
};

export const updateSession = async (id: number, patch: Partial<Database['public']['Tables']['live_sessions']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('live_sessions').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}/live`);
  return data;
};

export const deleteSession = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('live_sessions').delete().eq('id', id).select().single();
  if (error) throw error;
  
  if (data?.course_id) revalidatePath(`/dashboard/teacher/courses/${data.course_id}/live`);
  return data;
};
