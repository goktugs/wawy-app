import { supabaseAdmin } from "@/server/db/supabase-admin";

export function createTRPCContext() {
  return {
    supabaseAdmin
  };
}

export type TRPCContext = ReturnType<typeof createTRPCContext>;
