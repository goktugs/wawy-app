import type { SupabaseClient } from "@supabase/supabase-js";

import { mapCreatorRowToCreator } from "@/server/data/mappers/creator.mapper";
import type { Creator, CreatorRow } from "@/types/creator";

export async function listCreators(supabase: SupabaseClient): Promise<Creator[]> {
  const { data, error } = await supabase
    .from("creators")
    .select(
      "id, username, country, niches, followers, engagement_rate, avg_watch_time, content_style, primary_hook_type, brand_safety_flags, audience_top_countries, audience_gender_female, audience_gender_male, audience_top_age_range, last_posts"
    );

  if (error) {
    throw new Error(`Failed to fetch creators: ${error.message}`);
  }

  const rows: CreatorRow[] = data ?? [];
  return rows.map(mapCreatorRowToCreator);
}
