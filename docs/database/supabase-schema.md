# Supabase Schema (Part 1)

## Tables

## `campaigns`

- `id` text primary key
- `brand` text not null
- `objective` text not null
- `target_country` text not null
- `target_gender` text not null
- `target_age_range` text not null
- `niches` text[] not null
- `preferred_hook_types` text[] not null
- `min_avg_watch_time` numeric not null
- `budget_min_followers` integer not null
- `budget_max_followers` integer not null
- `tone` text not null
- `do_not_use_words` text[] not null default `{}`
- `created_at` timestamptz not null default `now()`

## `creators`

- `id` text primary key
- `username` text not null
- `country` text not null
- `niches` text[] not null
- `followers` integer not null
- `engagement_rate` numeric not null
- `avg_watch_time` numeric not null
- `content_style` text not null
- `primary_hook_type` text not null
- `brand_safety_flags` text[] not null default `{}`
- `audience_top_countries` text[] not null default `{}`
- `audience_gender_female` numeric
- `audience_gender_male` numeric
- `audience_top_age_range` text
- `last_posts` jsonb not null default `[]`
- `created_at` timestamptz not null default `now()`

## Indexes

- `creators_followers_idx` on `creators(followers)`
- `creators_primary_hook_idx` on `creators(primary_hook_type)`
- `creators_country_idx` on `creators(country)`
- `creators_audience_top_countries_gin` on `creators using gin(audience_top_countries)`

## `ai_brief_cache` (Part 2)

- `id` bigint generated identity primary key
- `campaign_id` text not null
- `creator_id` text not null
- `payload` jsonb not null
- `model` text not null
- `created_at` timestamptz not null default `now()`
- `updated_at` timestamptz not null default `now()`

## Additional Indexes (Part 2)

- unique `ai_brief_cache_campaign_creator_uq` on `ai_brief_cache(campaign_id, creator_id)`
