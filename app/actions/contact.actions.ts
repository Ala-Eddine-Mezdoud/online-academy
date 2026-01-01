'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';
import type { Database } from '@/app/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

export const createContactMessage = async (payload: Database['public']['Tables']['contact_messages']['Insert']) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('contact_messages').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const deleteContactMessage = async (id: number) => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('contact_messages').update({ deleted_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  
  revalidatePath('/dashboard/admin/messages');
  return data;
};
