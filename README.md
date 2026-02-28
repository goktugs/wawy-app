# wavy-app

## Bootstrap Status (Part 1)

- Monolith app skeleton is initialized with `Next.js + TypeScript + tRPC`.
- tRPC route is available at `/api/trpc`.
- `campaign.getTopCreators` exists as a placeholder contract endpoint.
- Supabase migration files for Part 1 schema are added in `supabase/migrations`.

## Run

1. `cp .env.example .env.local`
2. Fill environment variables in `.env.local`
3. `npm install`
4. `npm run dev`

## NPM Scripts

- `npm run dev` -> start local dev server
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> lint checks
- `npm run typecheck` -> TypeScript checks
- `npm run test` -> run tests
- `npm run seed` -> import `data/*.json` into Supabase with idempotent upsert
- `npm run seed:verify` -> verify row counts and sample array/json fields

## Documentation

- System Overview -> [docs/architecture/system-overview.md](docs/architecture/system-overview.md)
- Scoring Design -> [docs/architecture/scoring-design.md](docs/architecture/scoring-design.md)
- Supabase Schema -> [docs/database/supabase-schema.md](docs/database/supabase-schema.md)
- Seed Strategy -> [docs/database/seed-strategy.md](docs/database/seed-strategy.md)
- tRPC Contracts -> [docs/api/trpc-contracts.md](docs/api/trpc-contracts.md)
- Local Setup -> [docs/setup/local-setup.md](docs/setup/local-setup.md)
- Testing -> [docs/setup/testing.md](docs/setup/testing.md)

## Plans

- Part 1 Plan -> [docs/plans/PLAN_PART1_CAMPAIGN_MATCHING.md](docs/plans/PLAN_PART1_CAMPAIGN_MATCHING.md)
- Part 2 Plan -> [docs/plans/PLAN_PART2_AI_BRIEF_GENERATOR.md](docs/plans/PLAN_PART2_AI_BRIEF_GENERATOR.md)

## GitHub Actions

- CI: [ci.yml](.github/workflows/ci.yml)
  - Runs on push to `develop` and PRs targeting `develop/main/master`
- Release: [release.yml](.github/workflows/release.yml)
  - Runs on push to `main/master`
- Sync PR: [develop-to-main-pr.yml](.github/workflows/develop-to-main-pr.yml)
  - Opens/updates a PR from `develop` to `main` on every push to `develop`
