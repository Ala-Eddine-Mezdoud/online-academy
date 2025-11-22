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