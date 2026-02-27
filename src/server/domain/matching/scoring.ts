import { clamp, max, min, round } from "lodash";

import type { Campaign } from "@/types/campaign";
import type { Creator } from "@/types/creator";
import type { ScoreWeights } from "@/types/matching";

type ScoredCreator = {
  creator: Creator;
  totalScore: number;
  scoreBreakdown: ScoreWeights;
  penalties: {
    watchTimePenalty: number;
  };
  matchedSignals: string[];
};

function getNicheScore(campaign: Campaign, creator: Creator, weight: number): number {
  const overlap = creator.niches.filter((niche) => campaign.niches.includes(niche)).length;
  if (campaign.niches.length === 0) return 0;
  return round((overlap / campaign.niches.length) * weight, 2);
}

function getAudienceCountryScore(campaign: Campaign, creator: Creator, weight: number): number {
  const idx = creator.audience.topCountries.findIndex((country) => country === campaign.targetCountry);
  if (idx < 0) return 0;

  const positionMultiplier = idx === 0 ? 1 : idx === 1 ? 0.7 : idx === 2 ? 0.4 : 0.2;
  return round(weight * positionMultiplier, 2);
}

function getHookScore(campaign: Campaign, creator: Creator, weight: number): number {
  return campaign.preferredHookTypes.includes(creator.primaryHookType) ? weight : 0;
}

function getFollowerFitScore(campaign: Campaign, creator: Creator, weight: number): number {
  const min = campaign.budgetRange.minFollowers;
  const max = campaign.budgetRange.maxFollowers;
  const center = (min + max) / 2;
  const halfRange = (max - min) / 2;

  if (halfRange <= 0) return weight;

  const closeness = clamp(1 - Math.abs(creator.followers - center) / halfRange, 0, 1);
  return round(weight * closeness, 2);
}

function getEngagementScore(
  creator: Creator,
  creators: Creator[],
  weight: number
): number {
  const rates = creators.map((item) => item.engagementRate);
  const minRate = min(rates) ?? 0;
  const maxRate = max(rates) ?? 0;

  if (maxRate === minRate) {
    return round(weight / 2, 2);
  }

  const normalized = (creator.engagementRate - minRate) / (maxRate - minRate);
  return round(normalized * weight, 2);
}

function getWatchtimePenalty(campaign: Campaign, creator: Creator, watchtimeWeight: number): number {
  const minWatch = campaign.minAvgWatchTime;
  if (minWatch <= 0 || creator.avgWatchTime >= minWatch) return 0;

  const gapRatio = clamp((minWatch - creator.avgWatchTime) / minWatch, 0, 1);
  return round(watchtimeWeight * gapRatio, 2);
}

export function scoreCreators(
  campaign: Campaign,
  creators: Creator[],
  weights: ScoreWeights
): ScoredCreator[] {
  return creators.map((creator) => {
    const nicheMatch = getNicheScore(campaign, creator, weights.nicheMatch);
    const audienceCountryMatch = getAudienceCountryScore(campaign, creator, weights.audienceCountryMatch);
    const engagementScore = getEngagementScore(creator, creators, weights.engagementScore);
    const watchTimeScore = weights.watchTimeScore;
    const followerFitScore = getFollowerFitScore(campaign, creator, weights.followerFitScore);
    const hookMatchScore = getHookScore(campaign, creator, weights.hookMatchScore);

    const watchTimePenalty = getWatchtimePenalty(campaign, creator, weights.watchTimeScore);

    const rawTotal =
      nicheMatch +
      audienceCountryMatch +
      engagementScore +
      watchTimeScore +
      followerFitScore +
      hookMatchScore;

    const totalScore = round(clamp(rawTotal - watchTimePenalty, 0, 100), 2);

    const matchedSignals: string[] = [];
    if (nicheMatch > 0) matchedSignals.push("nicheMatch");
    if (audienceCountryMatch > 0) matchedSignals.push("audienceCountryMatch");
    if (engagementScore > 0) matchedSignals.push("engagementScore");
    if (watchTimePenalty === 0) matchedSignals.push("watchTimeScore");
    if (followerFitScore > 0) matchedSignals.push("followerFitScore");
    if (hookMatchScore > 0) matchedSignals.push("hookMatchScore");

    return {
      creator,
      totalScore,
      scoreBreakdown: {
        nicheMatch,
        audienceCountryMatch,
        engagementScore,
        watchTimeScore,
        followerFitScore,
        hookMatchScore
      },
      penalties: {
        watchTimePenalty
      },
      matchedSignals
    };
  });
}
