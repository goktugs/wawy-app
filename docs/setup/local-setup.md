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
- `OPENAI_API_KEY` (Part 2 AI brief generation)

## Setup Steps

1. `npm install`
2. Apply database migration(s).
3. Run seed pipeline:
   - `npm run seed`
   - `npm run seed:verify`
4. `npm run dev`
5. Verify tRPC endpoint with a sample `campaignId`.

## Seed Scripts

- `scripts/seed.ts`: validates + maps `data/*.json` and upserts into Supabase.
- `scripts/verify-seed.ts`: verifies row counts and sample array/json fields.
- `scripts/_env.ts`: loads `.env.local` for seed scripts.
