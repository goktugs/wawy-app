import fs from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { loadLocalEnv, requireEnv } from "./_env";

loadLocalEnv();

const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_ANON_KEY"));

const campaignSchema = z.object({
  id: z.string(),
  brand: z.string(),
  objective: z.string(),
  targetCountry: z.string(),
  targetGender: z.string(),
  targetAgeRange: z.string(),
  niches: z.array(z.string()),
  preferredHookTypes: z.array(z.string()),
  minAvgWatchTime: z.number().nonnegative(),
  budgetRange: z.object({
    minFollowers: z.number().int().nonnegative(),
    maxFollowers: z.number().int().nonnegative()
  }),
  tone: z.string(),
  doNotUseWords: z.array(z.string())
});

const creatorSchema = z.object({
  id: z.string(),
  username: z.string(),
  country: z.string(),
  niches: z.array(z.string()),
  followers: z.number().int().nonnegative(),
  engagementRate: z.number().min(0).max(1),
  avgWatchTime: z.number().nonnegative(),
  contentStyle: z.string(),
  primaryHookType: z.string(),
  brandSafetyFlags: z.array(z.string()),
  audience: z.object({
    topCountries: z.array(z.string()),
    genderSplit: z.object({
      female: z.number().min(0).max(1),
      male: z.number().min(0).max(1)
    }),
    topAgeRange: z.string()
  }),
  lastPosts: z.array(
    z.object({
      caption: z.string(),
      views: z.number().int().nonnegative(),
      likes: z.number().int().nonnegative()
    })
  )
});

const campaignsSchema = z.array(campaignSchema);
const creatorsSchema = z.array(creatorSchema);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function ensureUniqueIds(items: Array<{ id: string }>, keyName: string): void {
  const ids = items.map((item) => item.id);
  const unique = new Set(ids);
  if (ids.length !== unique.size) {
    throw new Error(`Duplicate ${keyName} ids found in source JSON.`);
  }
}

type Campaign = z.infer<typeof campaignSchema>;
type Creator = z.infer<typeof creatorSchema>;

function mapCampaign(c: Campaign) {
  return {
    id: c.id,
    brand: c.brand,
    objective: c.objective,
    target_country: c.targetCountry,
    target_gender: c.targetGender,
    target_age_range: c.targetAgeRange,
    niches: c.niches,
    preferred_hook_types: c.preferredHookTypes,
    min_avg_watch_time: c.minAvgWatchTime,
    budget_min_followers: c.budgetRange.minFollowers,
    budget_max_followers: c.budgetRange.maxFollowers,
    tone: c.tone,
    do_not_use_words: c.doNotUseWords
  };
}

function mapCreator(c: Creator) {
  return {
    id: c.id,
    username: c.username,
    country: c.country,
    niches: c.niches,
    followers: c.followers,
    engagement_rate: c.engagementRate,
    avg_watch_time: c.avgWatchTime,
    content_style: c.contentStyle,
    primary_hook_type: c.primaryHookType,
    brand_safety_flags: c.brandSafetyFlags,
    audience_top_countries: c.audience.topCountries,
    audience_gender_female: c.audience.genderSplit.female,
    audience_gender_male: c.audience.genderSplit.male,
    audience_top_age_range: c.audience.topAgeRange,
    last_posts: c.lastPosts
  };
}

async function main(): Promise<void> {
  const campaignsPath = path.resolve(process.cwd(), "data/campaigns.json");
  const creatorsPath = path.resolve(process.cwd(), "data/creators.json");

  const campaigns = campaignsSchema.parse(readJson<unknown>(campaignsPath));
  const creators = creatorsSchema.parse(readJson<unknown>(creatorsPath));

  ensureUniqueIds(campaigns, "campaign");
  ensureUniqueIds(creators, "creator");

  const campaignRows = campaigns.map(mapCampaign);
  const creatorRows = creators.map(mapCreator);

  const { error: campaignError } = await supabase
    .from("campaigns")
    .upsert(campaignRows, { onConflict: "id" });

  if (campaignError) {
    throw new Error(`Campaign upsert failed: ${campaignError.message}`);
  }

  const { error: creatorError } = await supabase
    .from("creators")
    .upsert(creatorRows, { onConflict: "id" });

  if (creatorError) {
    throw new Error(`Creator upsert failed: ${creatorError.message}`);
  }

  const { count: campaignCount, error: campaignCountError } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true });

  if (campaignCountError) {
    throw new Error(`Campaign count check failed: ${campaignCountError.message}`);
  }

  const { count: creatorCount, error: creatorCountError } = await supabase
    .from("creators")
    .select("id", { count: "exact", head: true });

  if (creatorCountError) {
    throw new Error(`Creator count check failed: ${creatorCountError.message}`);
  }

  console.log("Seed complete.");
  console.log(`campaigns source=${campaigns.length} db=${campaignCount ?? 0}`);
  console.log(`creators source=${creators.length} db=${creatorCount ?? 0}`);

  if (campaigns.length !== (campaignCount ?? 0) || creators.length !== (creatorCount ?? 0)) {
    throw new Error("Post-seed row counts do not match expected source sizes.");
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : "Unknown seed error";
  console.error(message);
  process.exit(1);
});
