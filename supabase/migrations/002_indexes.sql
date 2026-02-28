-- Part 1 read-path indexes for matching queries.

create index if not exists creators_followers_idx on creators (followers);
create index if not exists creators_primary_hook_idx on creators (primary_hook_type);
create index if not exists creators_country_idx on creators (country);
create index if not exists creators_audience_top_countries_gin on creators using gin (audience_top_countries);
