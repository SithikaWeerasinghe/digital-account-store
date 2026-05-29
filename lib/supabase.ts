import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns a live client when env vars are set, null otherwise (falls back to mock data)
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;
