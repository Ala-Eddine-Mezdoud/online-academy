import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getMyNotifications = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createNotification = async (payload: Database['public']['Tables']['notifications']['Insert']) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const insert = { ...payload, user_id: payload.user_id ?? authData.user.id };
  const { data, error } = await supabase.from('notifications').insert(insert).select().single();
  if (error) throw error;
  return data;
};

export const markNotificationRead = async (id: number, is_read = true) => {
  const { data, error } = await supabase.from('notifications').update({ is_read }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteNotification = async (id: number) => {
  const { data, error } = await supabase.from('notifications').delete().eq('id', id).select().single();
  if (error) throw error;
  return data;
};

// Notify all students enrolled in a course about a live session start
export const notifyCourseLiveSession = async (
  courseId: number,
  sessionTitle: string,
  sessionLink: string
) => {
  // fetch enrollments for course
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