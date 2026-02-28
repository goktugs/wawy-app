import type { SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/server/config/env";
import { getCachedBrief, upsertBriefCache } from "@/server/data/repositories/ai-brief-cache.repository";
import { getCampaignById } from "@/server/data/repositories/campaign.repository";
import { getCreatorById } from "@/server/data/repositories/creator.repository";
import { parseAiBriefFromText } from "@/server/domain/ai/brief.parse";
import type { AiBriefOutput } from "@/server/domain/ai/brief.schema";
import { createChatCompletion } from "@/server/integrations/openai-client";
import type { GenerateBriefResponse } from "@/types/contracts";

const DEFAULT_MODEL = "gpt-4.1-mini";

type GenerateBriefParams = {
  supabase: SupabaseClient;
  campaignId: string;
  creatorId: string;
};

function buildBriefPrompt(campaign: string, creator: string): string {
  return [
    "Return strict JSON only.",
    "Required keys: outreachMessage, contentIdeas, hookSuggestions.",
    "contentIdeas must have exactly 5 strings.",
    "hookSuggestions must have exactly 3 strings.",
    "No markdown, no commentary.",
    "Campaign context:",
    campaign,
    "Creator context:",
    creator
  ].join("\n");
}

function buildRepairPrompt(rawOutput: string): string {
  return [
    "Repair the following output into valid strict JSON.",
    "Target schema:",
    "{",
    '  "outreachMessage": "string",',
    '  "contentIdeas": ["string", "string", "string", "string", "string"],',
    '  "hookSuggestions": ["string", "string", "string"]',
    "}",
    "Return only the JSON object.",
    "Broken output:",
    rawOutput
  ].join("\n");
}

export async function generateBriefForCampaignCreator({
  supabase,
  campaignId,
  creatorId
}: GenerateBriefParams): Promise<GenerateBriefResponse> {
  const cached = await getCachedBrief(supabase, campaignId, creatorId);
  if (cached) {
    return {
      campaignId,
      creatorId,
      generatedAt: cached.updatedAt,
      cached: true,
      brief: cached.payload
    };
  }

  const campaign = await getCampaignById(supabase, campaignId);
  if (!campaign) {
    throw new Error("CAMPAIGN_NOT_FOUND");
  }

  const creator = await getCreatorById(supabase, creatorId);
  if (!creator) {
    throw new Error("CREATOR_NOT_FOUND");
  }

  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_KEY_MISSING");
  }

  const campaignContext = JSON.stringify(campaign);
  const creatorContext = JSON.stringify(creator);
  const systemPrompt = "You generate marketing brief JSON. Output JSON only.";

  const firstResponse = await createChatCompletion({
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
    systemPrompt,
    userPrompt: buildBriefPrompt(campaignContext, creatorContext)
  });

  let brief: AiBriefOutput;
  try {
    brief = parseAiBriefFromText(firstResponse);
  } catch {
    const repairedResponse = await createChatCompletion({
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
      systemPrompt,
      userPrompt: buildRepairPrompt(firstResponse)
    });

    try {
      brief = parseAiBriefFromText(repairedResponse);
    } catch {
      throw new Error("AI_BRIEF_INVALID_JSON");
    }
  }

  await upsertBriefCache(supabase, {
    campaignId,
    creatorId,
    payload: brief,
    model: env.OPENAI_MODEL ?? DEFAULT_MODEL
  });

  return {
    campaignId,
    creatorId,
    generatedAt: new Date().toISOString(),
    cached: false,
    brief
  };
}
