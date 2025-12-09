import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Prefer NEXT_PUBLIC_* so this works in client components
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

/**
 * Lazily create a Supabase client. Throws a descriptive error if env vars are missing,
 * but only when the function is called (so importing this file won't crash the app).
 */
export function getSupabaseClient(): SupabaseClient {
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
    );
  }
  return createClient(url, key);
}
