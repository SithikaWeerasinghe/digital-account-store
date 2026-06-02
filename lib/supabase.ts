import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Returns a live client when env vars are set, null otherwise (falls back to mock data)
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

// Admin client using service role key to bypass RLS for server-side actions
export const supabaseAdmin: SupabaseClient | null =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;
