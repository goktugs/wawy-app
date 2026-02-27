import type { Campaign, CampaignRow } from "@/types/campaign";

export function mapCampaignRowToCampaign(row: CampaignRow): Campaign {
  return {
    id: row.id,
    brand: row.brand,
    objective: row.objective,
    targetCountry: row.target_country,
    targetGender: row.target_gender,
    targetAgeRange: row.target_age_range,
    niches: row.niches,
    preferredHookTypes: row.preferred_hook_types,
    minAvgWatchTime: row.min_avg_watch_time,
    budgetRange: {
      minFollowers: row.budget_min_followers,
      maxFollowers: row.budget_max_followers
    },
    tone: row.tone,
    doNotUseWords: row.do_not_use_words
  };
}
