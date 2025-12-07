import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase env vars: SUPABASE_URL and SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, key);
