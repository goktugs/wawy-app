# Local Setup (Part 1)

## Prerequisites

- Node.js LTS
- npm
- Supabase project (local or cloud)

## Environment Variables

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Setup Steps

1. `npm install`
2. Apply database migration(s).
3. Run seed command for campaigns/creators JSON.
4. `npm run dev`
5. Verify tRPC endpoint with a sample `campaignId`.
