'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';

export const getAllCourses = async () => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw error;
  return data;
};

export async function getCoursesPageData() {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      image,
      overview,
      description,
      num_weeks,
      price,
      categories:category_id (
        name
      ),
      teacher:teacher_id (
        name      
      )
    `)

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }

  return data || [];
}

export const getCoursesByTeacher = async (teacherId: string) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      image,
      overview,
      description,
      num_weeks,
      price,
      categories:category_id (
        name
      ),
      teacher:teacher_id (
        name      
      )
    `)
    .eq("teacher_id", teacherId);

  if (error) {
    console.error("Supabase Error:", error);
    throw error;
  }

  return data || [];
};

export const getCourseById = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('courses').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};

export const getMyCourses = async () => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase.from('courses').select('*').eq('teacher_id', userId);
  if (error) throw error;
  return data;
};

export const getMyEnrolledCourses = async () => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return [];
  const userId = authData.user.id;
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      courses (
        id,
        title,
        image,
        overview,
        description,
        num_weeks,
        price,
        categories:category_id (
          name
        ),
        teacher:teacher_id (
          name
        )
      )
    `)
    .eq('student_id', userId)
    .is('deleted_at', null);

  if (error) throw error;
  const courses = (data || []).map((row: any) => row.courses).filter(Boolean);
  return courses;
};
