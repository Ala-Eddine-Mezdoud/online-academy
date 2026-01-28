import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getAllSessions = async () => {
  const { data, error } = await supabase.from('live_sessions').select('*').is('deleted_at', null).order('start_time', { ascending: true });
  if (error) throw error;
  return data;
};

export const getSessionsByCourse = async (courseId: number) => {
  const { data, error } = await supabase.from('live_sessions').select('*').eq('course_id', courseId).is('deleted_at', null).order('start_time', { ascending: true });
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

// Get active live sessions for student's enrolled courses
export const getActiveSessionsForStudent = async () => {
  const supabase = createBrowserSupabase();
  
  // Get current user
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  
  const now = new Date().toISOString();
  
  // Get active sessions for courses the student is enrolled in
  const { data, error } = await supabase
    .from('live_sessions')
    .select(`
      id,
      course_id,
      session_title,
      session_link,
      start_time,
      end_time,
      courses (
        id,
        title
      )
    `)
    .is('deleted_at', null)
    .not('session_link', 'is', null)
    .lte('start_time', now)
    .gte('end_time', now);
  
  if (error) throw error;
  
  // Filter sessions for courses the student is enrolled in
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('student_id', authData.user.id)
    .is('deleted_at', null);
  
  if (!enrollments) return [];
  
  const enrolledCourseIds = enrollments.map(e => e.course_id);
  const activeSessions = (data || []).filter(session => 
    enrolledCourseIds.includes(session.course_id)
  );
  
  return activeSessions;
};