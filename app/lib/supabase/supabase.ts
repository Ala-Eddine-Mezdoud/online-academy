import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from "./database.types";

export const createBrowserSupabase = (): SupabaseClient<Database> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    throw new Error('Missing public supabase env vars');
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};