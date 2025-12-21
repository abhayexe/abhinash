import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://bwwjhxpzwlgcfrsfpfzo.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_5X75v9B81nOcQKuSRBofyQ_2OV7KIL9";

export const supabase = createClient(supabaseUrl, supabaseKey);
