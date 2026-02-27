import { z } from "zod";

import { publicProcedure } from "@/server/trpc/init";

export const getTopCreatorsProcedure = publicProcedure
  .input(
    z.object({
      campaignId: z.string().min(1)
    })
  )
  .query(({ input }) => {
    return {
      campaignId: input.campaignId,
      generatedAt: new Date().toISOString(),
      weights: {
        nicheMatch: 25,
        audienceCountryMatch: 20,
        engagementScore: 15,
        watchTimeScore: 15,
        followerFitScore: 15,
        hookMatchScore: 10
      },
      results: []
    };
  });
