'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

export const getAllContactMessages = async () => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('contact_messages').select('*').is('deleted_at', null).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
