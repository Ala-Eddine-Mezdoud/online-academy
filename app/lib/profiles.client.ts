// lib/profiles.client.ts
import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const getMyProfile = async () => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return null;
  const id = authData.user.id;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const updateMyProfile = async (patch: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error('Not authenticated');
  const id = authData.user.id;
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};
