import { createClient } from "@supabase/supabase-js";

import { env } from "@/server/config/env";

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
