# wavy-app

## Assignment Status

- Monolith app skeleton is initialized with `Next.js + TypeScript + tRPC`.
- tRPC route is available at `/api/trpc`.
- Part 1 endpoint `campaign.getTopCreators` is implemented with hybrid matching (hard filters + weighted scoring) and returns Top 20 creators with explainable output.
- Part 2 endpoint `campaign.generateBrief` is implemented with real LLM integration, strict JSON validation, retry/repair flow, and DB cache.
- Supabase migration files for Part 1 and Part 2 are added in `supabase/migrations`.

## Scoring Summary

- I start with hard filters: creators are rejected if they have a brand-safety conflict or if their follower count is outside the campaign range.
- I score only the remaining creators using 6 signals: niche match, audience country match, engagement, watch time, follower fit, and hook match.
- If watch time is below the campaign minimum, I apply a score penalty instead of hard-rejecting.
- Ranking order is: `totalScore`, then `engagementRate`, then `followers`.

## Trade-offs and Development Notes

- I kept matching logic in service/domain layers instead of pushing everything into SQL, so rules stay explicit and easy to change.
- I added runtime validation (`zod`) at the AI boundary to prevent malformed output from breaking downstream code.
- I implemented cache-first brief generation by `campaignId + creatorId` to reduce repeated LLM calls.
- Retry/repair is intentionally bounded to one extra attempt to control both cost and complexity.
- In this iteration, I prioritized clean separation (`data`, `domain`, `services`, `trpc`) over aggressive micro-optimizations.
- Tests are also not implemented in this iteration to focus on core functionality, but I would add unit tests for scoring logic and integration tests for tRPC routes in a real codebase.

<img width="2195" height="1412" alt="image" src="https://github.com/user-attachments/assets/1ce0f60a-9035-4da5-aa24-d755197f2ac6" />

## Run

1. `cp .env.example .env.local`
2. Fill environment variables in `.env.local`
3. Use Node.js 20 (`nvm use` if you use nvm)
4. `npm install`
5. `npm run dev`

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
- Sync Develop to Main: [develop-to-main-pr.yml](.github/workflows/develop-to-main-pr.yml)
    - Runs on push to `develop` and automatically merges `develop` into `main/master` (if target branch exists)
