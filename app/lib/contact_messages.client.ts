import { createBrowserSupabase } from './supabase/supabase';
import type { Database } from './supabase/database.types';

const supabase = createBrowserSupabase();

export const createContactMessage = async (payload: Database['public']['Tables']['contact_messages']['Insert']) => {
  const { data, error } = await supabase.from('contact_messages').insert(payload).select().single();
  if (error) throw error;
  return data;
};

// export const getMyContactMessages = async () => {
//   const { data: authData } = await supabase.auth.getUser();
//   if (!authData?.user) return [];
//   const userEmail = authData.user.email ?? null;
//   // If messages are tied to email, return messages created by this user (adjust as needed).
//   const { data, error } = await supabase.from('contact_messages').select('*').eq('email', userEmail);
//   if (error) throw error;
//   return data;
// };

// Admin: get all messages (RLS should allow admins, as yassine assured)
export const getAllContactMessages = async () => {
  const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};