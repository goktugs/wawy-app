# System Overview (Part 1)

## Scope

Part 1 delivers a campaign matching endpoint that returns Top 20 creators with explainable scoring.

## Request Flow

1. Next.js client calls tRPC procedure: `campaign.getTopCreators`.
2. API layer validates input (`campaignId`).
3. Service loads campaign and creator data from Supabase.
4. Matching engine applies:
   - hard filters (brand safety, follower range)
   - weighted scoring (niche, audience country, engagement, watchtime, hook)
5. Results are ranked and truncated to Top 20.
6. API returns `totalScore`, `scoreBreakdown`, penalties, and reasons.

## Main Components

- `API`: tRPC router + input/output validation.
- `Service`: orchestration (fetch + score + rank).
- `Domain`: pure scoring/filtering functions.
- `Data`: Supabase queries and mappings.
