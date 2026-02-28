-- Part 2 cache table for AI brief generation.

create table if not exists ai_brief_cache (
  id bigint generated always as identity primary key,
  campaign_id text not null references campaigns(id) on delete cascade,
  creator_id text not null references creators(id) on delete cascade,
  payload jsonb not null,
  model text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint ai_brief_cache_campaign_creator_uq unique (campaign_id, creator_id)
);
