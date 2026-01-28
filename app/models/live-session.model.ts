'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

export const getAllSessions = async () => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('live_sessions').select('*').is('deleted_at', null).order('start_time', { ascending: true });
  if (error) throw error;
  return data;
};

export const getSessionsByCourse = async (courseId: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('live_sessions').select('*').eq('course_id', courseId).is('deleted_at', null).order('start_time', { ascending: true });
  if (error) throw error;
  return data;
};

export const getActiveSessionsForStudent = async () => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  
  const now = new Date().toISOString();
  
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
