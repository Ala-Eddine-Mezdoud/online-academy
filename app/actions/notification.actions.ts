'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const createNotification = async (payload: Database['public']['Tables']['notifications']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const insert = { ...payload, user_id: payload.user_id ?? authData.user.id };
  const { data, error } = await supabase.from('notifications').insert(insert).select().single();
  if (error) throw error;
  
  return data;
};

export const markNotificationRead = async (id: number, is_read = true) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('notifications').update({ is_read }).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
};

export const deleteNotification = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('notifications').delete().eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard');
  return data;
};

export const notifyCourseLiveSession = async (
  courseId: number,
  sessionTitle: string,
  sessionLink: string
) => {
  const supabase = await createServerSupabase();
  
  const { data: enrollments, error: enrErr } = await supabase
    .from('enrollments')
    .select('student_id')
    .eq('course_id', courseId)
    .is('deleted_at', null);
    
  if (enrErr) throw enrErr;
  const recipients = (enrollments || []).map((e: any) => e.student_id).filter(Boolean);
  if (recipients.length === 0) return [];

  const payloads = recipients.map((userId: string) => ({
    user_id: userId,
    title: sessionTitle || 'Live session started',
    message: `A live session has started. Join: ${sessionLink}`,
    is_read: false,
  }));

  const { data, error } = await supabase
    .from('notifications')
    .insert(payloads)
    .select();
    
  if (error) throw error;
  return data;
};
