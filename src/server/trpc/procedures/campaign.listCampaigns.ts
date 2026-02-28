import { publicProcedure } from "@/server/trpc/init";
import { listCampaigns } from "@/server/data/repositories/campaign.repository";

export const listCampaignsProcedure = publicProcedure.query(async ({ ctx }) => {
  return listCampaigns(ctx.supabaseAdmin);
});
