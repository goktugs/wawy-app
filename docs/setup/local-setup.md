# Local Setup (Part 1)

## Prerequisites

- Node.js 20
- npm
- Supabase project (local or cloud)

## Environment Variables

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (Part 2 AI brief generation)

## Setup Steps

1. `nvm use` (reads `.nvmrc`) or switch manually to Node.js 20
2. `npm install`
3. Apply database migration(s).
4. Run seed pipeline:
   - `npm run seed`
   - `npm run seed:verify`
5. `npm run dev`
6. Verify tRPC endpoint with a sample `campaignId`.

## Seed Scripts

- `scripts/seed.ts`: validates + maps `data/*.json` and upserts into Supabase.
- `scripts/verify-seed.ts`: verifies row counts and sample array/json fields.
- `scripts/_env.ts`: loads `.env.local` for seed scripts.
