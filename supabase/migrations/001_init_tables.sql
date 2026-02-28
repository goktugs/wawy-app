-- Part 1 schema bootstrap for campaign matching.

create table if not exists campaigns (
  id text primary key,
  brand text not null,
  objective text not null,
  target_country text not null,
  target_gender text not null,
  target_age_range text not null,
  niches text[] not null,
  preferred_hook_types text[] not null,
  min_avg_watch_time numeric not null,
  budget_min_followers integer not null,
  budget_max_followers integer not null,
  tone text not null,
  do_not_use_words text[] not null default '{}',
  created_at timestamptz not null default now(),

  constraint campaigns_budget_range_chk check (budget_min_followers >= 0 and budget_max_followers >= budget_min_followers),
  constraint campaigns_min_avg_watch_time_chk check (min_avg_watch_time >= 0)
);

create table if not exists creators (
  id text primary key,
  username text not null,
  country text not null,
  niches text[] not null,
  followers integer not null,
  engagement_rate numeric not null,
  avg_watch_time numeric not null,
  content_style text not null,
  primary_hook_type text not null,
  brand_safety_flags text[] not null default '{}',
  audience_top_countries text[] not null default '{}',
  audience_gender_female numeric,
  audience_gender_male numeric,
  audience_top_age_range text,
  last_posts jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),

  constraint creators_followers_chk check (followers >= 0),
  constraint creators_engagement_rate_chk check (engagement_rate >= 0 and engagement_rate <= 1),
  constraint creators_avg_watch_time_chk check (avg_watch_time >= 0),
  constraint creators_audience_gender_female_chk check (
    audience_gender_female is null or (audience_gender_female >= 0 and audience_gender_female <= 1)
  ),
  constraint creators_audience_gender_male_chk check (
    audience_gender_male is null or (audience_gender_male >= 0 and audience_gender_male <= 1)
  )
);
