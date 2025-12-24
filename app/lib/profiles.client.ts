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

export const getProfileById = async (id: string) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
};


export const getAllProfiles = async (role?: string) => {
  let query = supabase.from('profiles').select('*');
  if (role) {
    query = query.eq('role', role);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const deleteProfile = async (id: string) => {
  const { data, error } = await supabase.from('profiles').delete().eq('id', id).select().single();
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

export const updateProfile = async (id: string, patch: Partial<Database['public']['Tables']['profiles']['Update']>) => {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const createProfile = async (profile: Database['public']['Tables']['profiles']['Insert']) => {
  // Note: This creates a profile record only, not a Supabase Auth user.
  // The ID must be provided or generated.
  const { data, error } = await supabase.from('profiles').insert(profile).select().single();
  if (error) throw error;
  return data;
};
