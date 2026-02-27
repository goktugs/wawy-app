import { createTRPCRouter } from "@/server/trpc/init";
import { getTopCreatorsProcedure } from "@/server/trpc/procedures/campaign.getTopCreators";

export const appRouter = createTRPCRouter({
  campaign: createTRPCRouter({
    getTopCreators: getTopCreatorsProcedure
  })
});

export type AppRouter = typeof appRouter;
