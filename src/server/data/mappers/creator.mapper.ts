import type { Creator, CreatorRow } from "@/types/creator";

export function mapCreatorRowToCreator(row: CreatorRow): Creator {
  return {
    id: row.id,
    username: row.username,
    country: row.country,
    niches: row.niches,
    followers: row.followers,
    engagementRate: row.engagement_rate,
    avgWatchTime: row.avg_watch_time,
    contentStyle: row.content_style,
    primaryHookType: row.primary_hook_type,
    brandSafetyFlags: row.brand_safety_flags,
    audience: {
      topCountries: row.audience_top_countries,
      genderSplit: {
        female: row.audience_gender_female,
        male: row.audience_gender_male
      },
      topAgeRange: row.audience_top_age_range
    },
    lastPosts: row.last_posts
  };
}
