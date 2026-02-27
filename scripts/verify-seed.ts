import { createClient } from "@supabase/supabase-js";

import { loadLocalEnv, requireEnv } from "./_env";

loadLocalEnv();

const supabase = createClient(requireEnv("SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"));

async function main(): Promise<void> {
  const { count: campaigns, error: campaignErr } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true });

  if (campaignErr) throw new Error(`Campaign count failed: ${campaignErr.message}`);

  const { count: creators, error: creatorErr } = await supabase
    .from("creators")
    .select("id", { count: "exact", head: true });

  if (creatorErr) throw new Error(`Creator count failed: ${creatorErr.message}`);

  const { data: sampleCampaign, error: sampleCampaignErr } = await supabase
    .from("campaigns")
    .select("id, niches, preferred_hook_types")
    .limit(1)
    .single();

  if (sampleCampaignErr) throw new Error(`Sample campaign check failed: ${sampleCampaignErr.message}`);

  const { data: sampleCreators, error: sampleCreatorsErr } = await supabase
    .from("creators")
    .select("id, niches, audience_top_countries, last_posts")
    .limit(5);

  if (sampleCreatorsErr) throw new Error(`Sample creators check failed: ${sampleCreatorsErr.message}`);

  console.log("Seed verification summary");
  console.log(`campaigns=${campaigns ?? 0}`);
  console.log(`creators=${creators ?? 0}`);
  console.log(`sampleCampaign=${sampleCampaign?.id ?? "none"}`);
  console.log(`sampleCreators=${sampleCreators?.length ?? 0}`);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : "Unknown verification error";
  console.error(message);
  process.exit(1);
});
