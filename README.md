# wavy-app

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

## GitHub Actions

- CI: [ci.yml](.github/workflows/ci.yml)
  - Runs on push to `develop` and PRs targeting `develop/main/master`
- Release: [release.yml](.github/workflows/release.yml)
  - Runs on push to `main/master`
- Sync PR: [develop-to-main-pr.yml](.github/workflows/develop-to-main-pr.yml)
  - Opens/updates a PR from `develop` to `main` on every push to `develop`
