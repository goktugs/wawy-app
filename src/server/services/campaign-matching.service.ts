import type { SupabaseClient } from "@supabase/supabase-js";

import { getCampaignById } from "@/server/data/repositories/campaign.repository";
import { listCreators } from "@/server/data/repositories/creator.repository";
import { applyHardFilters } from "@/server/domain/matching/filters";
import { rankCreators } from "@/server/domain/matching/ranking";
import { scoreCreators } from "@/server/domain/matching/scoring";
import { MATCHING_WEIGHTS } from "@/server/domain/matching/weights";
import { TOP_RESULTS_LIMIT } from "@/lib/constants";
import type { ScoreWeights } from "@/types/matching";

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
  weights: ScoreWeights;
  results: Array<{
    creatorId: string;
    totalScore: number;
    scoreBreakdown: ScoreWeights;
    penalties: {
      watchTimePenalty: number;
    };
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
  const { eligible, rejectionStats } = applyHardFilters(campaign, creators);
  const scored = scoreCreators(campaign, eligible, MATCHING_WEIGHTS);
  const ranked = rankCreators(scored);
  const top = ranked.slice(0, TOP_RESULTS_LIMIT);

  return {
    campaignId,
    generatedAt: new Date().toISOString(),
    weights: MATCHING_WEIGHTS,
    results: top.map((item) => ({
      creatorId: item.creator.id,
      totalScore: item.totalScore,
      scoreBreakdown: item.scoreBreakdown,
      penalties: item.penalties,
      matchedSignals: item.matchedSignals
    })),
    summary: {
      rejectionStats: {
        ...rejectionStats,
        topLimit: TOP_RESULTS_LIMIT
      }
    }
  };
}
