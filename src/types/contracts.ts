import type { AiBrief } from "@/types/ai-brief";
import type { ScoreWeights } from "@/types/matching";

export type CampaignOption = {
  id: string;
  brand: string;
};

export type TopCreatorResult = {
  creatorId: string;
  totalScore: number;
  scoreBreakdown: ScoreWeights;
  penalties: {
    watchTimePenalty: number;
  };
  matchedSignals: string[];
};

export type MatchingResponse = {
  campaignId: string;
  generatedAt: string;
  weights: ScoreWeights;
  results: TopCreatorResult[];
  summary: {
    rejectionStats: Record<string, number>;
  };
};

export type GenerateBriefResponse = {
  campaignId: string;
  creatorId: string;
  generatedAt: string;
  cached: boolean;
  brief: AiBrief;
};

export type TrpcEnvelope<T> = {
  result?: {
    data?: {
      json?: T;
    };
  };
  error?: {
    json?: {
      message?: string;
    };
  };
};
