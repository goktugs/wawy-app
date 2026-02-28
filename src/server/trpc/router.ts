import { createTRPCRouter } from "@/server/trpc/init";
import { generateBriefProcedure } from "@/server/trpc/procedures/campaign.generateBrief";
import { getTopCreatorsProcedure } from "@/server/trpc/procedures/campaign.getTopCreators";

export const appRouter = createTRPCRouter({
  campaign: createTRPCRouter({
    getTopCreators: getTopCreatorsProcedure,
    generateBrief: generateBriefProcedure
  })
});

export type AppRouter = typeof appRouter;
