import type { SupabaseClient } from "@supabase/supabase-js";

import { validateAiBriefOutput } from "@/server/domain/ai/brief.schema";
import type { AiBrief, AiBriefCacheRow } from "@/types/ai-brief";

type UpsertBriefCacheParams = {
  campaignId: string;
  creatorId: string;
  payload: AiBrief;
  model: string;
};

export async function getCachedBrief(
  supabase: SupabaseClient,
  campaignId: string,
  creatorId: string
): Promise<{
  payload: AiBrief;
  model: string;
  createdAt: string;
  updatedAt: string;
} | null> {
  const { data, error } = await supabase
    .from("ai_brief_cache")
    .select("campaign_id, creator_id, payload, model, created_at, updated_at")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .maybeSingle<AiBriefCacheRow>();

  if (error) {
    throw new Error(`Failed to read ai_brief_cache: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    payload: validateAiBriefOutput(data.payload),
    model: data.model,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function upsertBriefCache(
  supabase: SupabaseClient,
  params: UpsertBriefCacheParams
): Promise<void> {
  const validPayload = validateAiBriefOutput(params.payload);

  const { error } = await supabase.from("ai_brief_cache").upsert(
    {
      campaign_id: params.campaignId,
      creator_id: params.creatorId,
      payload: validPayload,
      model: params.model,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "campaign_id,creator_id"
    }
  );

  if (error) {
    throw new Error(`Failed to upsert ai_brief_cache: ${error.message}`);
  }
}
