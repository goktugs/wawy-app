import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getTopCreatorsForCampaign } from "@/server/services/campaign-matching.service";
import { publicProcedure } from "@/server/trpc/init";

export const getTopCreatorsProcedure = publicProcedure
  .input(
    z.object({
      campaignId: z.string().min(1)
    })
  )
  .query(async ({ ctx, input }) => {
    try {
      return await getTopCreatorsForCampaign({
        supabase: ctx.supabaseAdmin,
        campaignId: input.campaignId
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CAMPAIGN_NOT_FOUND") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Campaign not found: ${input.campaignId}`
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get campaign top creators"
      });
    }
  });
