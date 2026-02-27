# Seed Strategy (Part 1)

## Source Files

- `data/campaigns.json`
- `data/creators.json`

Note:
- For this assignment, keeping the provided datasets in-repo is recommended for reproducibility.
- Every reviewer/runner can seed the same dataset and get deterministic results.
- In a typical production setup, raw seed/bootstrap datasets are usually not stored like this in the app repo.
- For this project, seed data is intentionally kept here to clearly show the implementation order and setup flow.

## Import Plan

1. Parse JSON files with runtime validation.
2. Map fields to DB column names.
3. Upsert by primary key (`id`) to keep seed idempotent.
4. Log inserted/updated counts.

## Idempotency Rule

- Use `insert ... on conflict (id) do update`.
- Re-running seed should produce stable row counts.

## Validation Checks

Purpose:
- Validation checks confirm the seed is not only successful, but also complete and structurally correct.

1. Campaign count = 3
2. Creator count = 50
3. No nulls in required columns
4. No duplicate IDs

## Post-Seed Sanity

Purpose:
- Post-seed sanity checks catch mapping/parsing mistakes that row-count checks cannot detect.

- Run a sample query for one campaign and 5 creators.
- Verify arrays/json fields parsed correctly (`niches`, `last_posts`, `audience_top_countries`).
