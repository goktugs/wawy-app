import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { generateBriefForCampaignCreator } from "@/server/services/ai-brief.service";
import { publicProcedure } from "@/server/trpc/init";

export const generateBriefProcedure = publicProcedure
  .input(
    z.object({
      campaignId: z.string().min(1),
      creatorId: z.string().min(1)
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      return await generateBriefForCampaignCreator({
        supabase: ctx.supabaseAdmin,
        campaignId: input.campaignId,
        creatorId: input.creatorId
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CAMPAIGN_NOT_FOUND") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Campaign not found: ${input.campaignId}`
        });
      }

      if (error instanceof Error && error.message === "CREATOR_NOT_FOUND") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Creator not found: ${input.creatorId}`
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate AI brief"
      });
    }
  });
