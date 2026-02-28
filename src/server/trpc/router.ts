import { createTRPCRouter } from "@/server/trpc/init";
import { generateBriefProcedure } from "@/server/trpc/procedures/campaign.generateBrief";
import { getTopCreatorsProcedure } from "@/server/trpc/procedures/campaign.getTopCreators";
import { listCampaignsProcedure } from "@/server/trpc/procedures/campaign.listCampaigns";

export const appRouter = createTRPCRouter({
  campaign: createTRPCRouter({
    listCampaigns: listCampaignsProcedure,
    getTopCreators: getTopCreatorsProcedure,
    generateBrief: generateBriefProcedure
  })
});

export type AppRouter = typeof appRouter;
