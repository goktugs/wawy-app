import type { SupabaseClient } from "@supabase/supabase-js";

import { mapCampaignRowToCampaign } from "@/server/data/mappers/campaign.mapper";
import type { Campaign, CampaignRow } from "@/types/campaign";

export async function getCampaignById(
  supabase: SupabaseClient,
  campaignId: string
): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      "id, brand, objective, target_country, target_gender, target_age_range, niches, preferred_hook_types, min_avg_watch_time, budget_min_followers, budget_max_followers, tone, do_not_use_words"
    )
    .eq("id", campaignId)
    .maybeSingle<CampaignRow>();

  if (error) {
    throw new Error(`Failed to fetch campaign(${campaignId}): ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapCampaignRowToCampaign(data);
}
