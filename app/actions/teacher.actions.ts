'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const createTeacherLink = async (payload: Database['public']['Tables']['teacher_links']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  
  const insert = { ...payload, teacher_id: payload.teacher_id ?? authData.user.id };
  const { data, error } = await supabase.from('teacher_links').insert(insert).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/profile');
  return data;
};

export const updateTeacherLink = async (id: number, patch: Partial<Database['public']['Tables']['teacher_links']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('teacher_links').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/profile');
  return data;
};

export const deleteTeacherLink = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('teacher_links').delete().eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/profile');
  return data;
};
