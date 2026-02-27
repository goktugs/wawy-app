# Scoring Design (Part 1)

## Model Choice

A hybrid scoring model is selected to enforce non-negotiable eligibility constraints while preserving ranking quality through weighted relevance signals.

Why this choice:
- a pure hard-filter model can over-constrain the candidate pool
- a pure weighted model can rank policy-misaligned creators too high
- a hybrid model balances risk control and recommendation quality

Hybrid model structure:
- hard filters protect non-negotiable constraints
- weighted scoring preserves ranking quality

## Hard Filters

1. Brand safety conflict -> reject
2. Followers outside campaign `budgetRange` -> reject

## Weighted Signals (0-100 total)

- `nicheMatch`: 25
- `audienceCountryMatch`: 20
- `engagementScore`: 15
- `watchTimeScore`: 15
- `followerFitScore`: 15
- `hookMatchScore`: 10

## Watchtime Rule

Soft penalty behavior:
- if `avgWatchTime >= minAvgWatchTime`: full watchtime score
- else: linear reduction based on gap

## Ranking

1. `totalScore DESC`
2. `engagementRate DESC`
3. `followers DESC`

Part 1 output rule:
- scoring is computed on all eligible creators
- API returns only the highest 20 results

## Explainability Output

Return:
- `totalScore`
- per-signal score breakdown
- penalties
- matched signals
