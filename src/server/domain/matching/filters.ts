import type { Campaign } from "@/types/campaign";
import type { Creator } from "@/types/creator";

type FilterResult = {
  eligible: Creator[];
  rejectionStats: Record<string, number>;
};

const SAFETY_FLAG_RULES: Array<{ flag: string; words: string[] }> = [
  { flag: "supplement_claim", words: ["supplement", "miracle", "fat burner"] },
  { flag: "explicit_language", words: ["explicit", "dark"] }
];

function hasBrandSafetyConflict(campaign: Campaign, creator: Creator): boolean {
  const blockedFlags = new Set<string>();

  for (const rule of SAFETY_FLAG_RULES) {
    if (campaign.doNotUseWords.some((word) => rule.words.includes(word.toLowerCase()))) {
      blockedFlags.add(rule.flag);
    }
  }

  return creator.brandSafetyFlags.some((flag) => blockedFlags.has(flag));
}

function isFollowerInRange(campaign: Campaign, creator: Creator): boolean {
  return (
    creator.followers >= campaign.budgetRange.minFollowers &&
    creator.followers <= campaign.budgetRange.maxFollowers
  );
}

export function applyHardFilters(campaign: Campaign, creators: Creator[]): FilterResult {
  const rejectionStats: Record<string, number> = {
    candidatePool: creators.length,
    rejectedBrandSafety: 0,
    rejectedFollowerRange: 0
  };

  const eligible: Creator[] = [];

  for (const creator of creators) {
    if (hasBrandSafetyConflict(campaign, creator)) {
      rejectionStats.rejectedBrandSafety += 1;
      continue;
    }

    if (!isFollowerInRange(campaign, creator)) {
      rejectionStats.rejectedFollowerRange += 1;
      continue;
    }

    eligible.push(creator);
  }

  rejectionStats.eligibleCount = eligible.length;

  return { eligible, rejectionStats };
}
