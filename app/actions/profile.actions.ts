'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const deleteProfile = async (id: string) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('profiles').delete().eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/users');
  return data;
};

export const updateMyProfile = async (patch: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const id = authData.user.id;
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/teacher/profile');
  revalidatePath('/dashboard/student/profile');
  return data;
};

export const updateProfile = async (id: string, patch: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/users');
  return data;
};

export const createProfile = async (profile: Database['public']['Tables']['profiles']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('profiles').insert(profile).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/users');
  return data;
};
