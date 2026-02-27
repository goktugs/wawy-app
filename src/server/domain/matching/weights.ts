import type { ScoreWeights } from "@/types/matching";

export const MATCHING_WEIGHTS: ScoreWeights = {
  nicheMatch: 25,
  audienceCountryMatch: 20,
  engagementScore: 15,
  watchTimeScore: 15,
  followerFitScore: 15,
  hookMatchScore: 10
};
