'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export const enroll = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;
  
  // avoid duplicate - only check non-deleted enrollments
  const { data: existing } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('student_id', userId).is('deleted_at', null).maybeSingle();
  if (existing) return existing;
  
  const { data, error } = await supabase.from('enrollments').insert({ course_id: courseId, student_id: userId }).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/student/courses');
  revalidatePath(`/courses/${courseId}`);
  
  return data;
};

export const unenroll = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const userId = authData.user.id;
  
  const { data, error } = await supabase.from('enrollments').delete().eq('course_id', courseId).eq('student_id', userId).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/student/courses');
  revalidatePath(`/courses/${courseId}`);
  
  return data;
};

export const updateEnrollmentProgress = async (id: number, progress: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('enrollments').update({ progress }).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/student/courses');
  revalidatePath('/dashboard/admin/enrollments');
  return data;
};

export const adminEnroll = async (courseId: number, studentId: string) => {
  const supabase = await createServerSupabase();
  
  // check for existing - only check non-deleted enrollments
  const { data: existing } = await supabase.from('enrollments').select('*').eq('course_id', courseId).eq('student_id', studentId).is('deleted_at', null).maybeSingle();
  if (existing) return existing;
  
  const { data, error } = await supabase.from('enrollments').insert({ course_id: courseId, student_id: studentId }).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/enrollments');
  return data;
};

export const adminUnenroll = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('enrollments').delete().eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/enrollments');
  return data;
};
