'use server';

import { createServerSupabase } from '@/app/lib/supabase/server';

export const getAllCategories = async () => {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
};
