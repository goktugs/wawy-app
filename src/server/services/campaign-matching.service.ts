import type { SupabaseClient } from "@supabase/supabase-js";

import { getCampaignById } from "@/server/data/repositories/campaign.repository";
import { listCreators } from "@/server/data/repositories/creator.repository";
import { TOP_RESULTS_LIMIT } from "@/lib/constants";

const DEFAULT_WEIGHTS = {
  nicheMatch: 25,
  audienceCountryMatch: 20,
  engagementScore: 15,
  watchTimeScore: 15,
  followerFitScore: 15,
  hookMatchScore: 10
};

type GetTopCreatorsParams = {
  supabase: SupabaseClient;
  campaignId: string;
};

export async function getTopCreatorsForCampaign({
  supabase,
  campaignId
}: GetTopCreatorsParams): Promise<{
  campaignId: string;
  generatedAt: string;
  weights: typeof DEFAULT_WEIGHTS;
  results: Array<{
    creatorId: string;
    totalScore: number;
    scoreBreakdown: typeof DEFAULT_WEIGHTS;
    penalties: {
      watchTimePenalty: number;
    };
    reasons: string[];
    matchedSignals: string[];
  }>;
  summary: {
    rejectionStats: Record<string, number>;
  };
}> {
  const campaign = await getCampaignById(supabase, campaignId);

  if (!campaign) {
    throw new Error("CAMPAIGN_NOT_FOUND");
  }

  const creators = await listCreators(supabase);

  // Part 1: scoring/ranking implementation comes in matching domain step.
  // This service now wires real DB reads and preserves the contract shape.
  return {
    campaignId,
    generatedAt: new Date().toISOString(),
    weights: DEFAULT_WEIGHTS,
    results: [],
    summary: {
      rejectionStats: {
        candidatePool: creators.length,
        topLimit: TOP_RESULTS_LIMIT
      }
    }
  };
}
