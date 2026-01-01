'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const createCourse = async (payload: Database['public']['Tables']['courses']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  
  const insert = { ...payload, teacher_id: payload.teacher_id ?? authData.user.id };
  const { data, error } = await supabase.from('courses').insert(insert).select().single();
  
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/courses');
  revalidatePath('/courses');
  
  return data;
};

export const updateCourse = async (id: number, patch: Partial<Database['public']['Tables']['courses']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('courses').update(patch).eq('id', id).select().single();
  
  if (error) throw error;
  
  revalidatePath(`/dashboard/teacher/courses/${id}`);
  revalidatePath('/dashboard/teacher/courses');
  revalidatePath(`/courses/${id}`);
  
  return data;
};

export const deleteCourse = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('courses').delete().eq('id', id).select().single();
  
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/courses');
  revalidatePath('/courses');
  
  return data;
};
