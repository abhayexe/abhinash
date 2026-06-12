import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://tptzndshdlzwezopbbqy.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_w6ouOzOE-iUHmSFVkzkSLQ_tFSEF9ZB";

export const supabase = createClient(supabaseUrl, supabaseKey);
