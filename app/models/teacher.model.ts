'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

export const getMyTeacherLinks = async () => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('teacher_links').select('*').eq('teacher_id', userId);
  if (error) throw error;
  return data;
};

export const getLinksByTeacher = async (teacherId: string) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('teacher_links').select('*').eq('teacher_id', teacherId);
  if (error) throw error;
  return data;
};
