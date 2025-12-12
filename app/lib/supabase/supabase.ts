import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from "./database.types";
import { createBrowserClient } from '@supabase/ssr';

export const createBrowserSupabase = () : SupabaseClient<Database> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    throw new Error('Missing public supabase env vars');
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};