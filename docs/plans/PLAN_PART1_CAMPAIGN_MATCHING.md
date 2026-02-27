## Part 1 Plan: Campaign Matching Engine (Next.js + tRPC + Supabase)

### Summary
This plan locks down the **first assignment step** (Part 1) end-to-end in an implementation-ready way:
- a tRPC endpoint returning **Top 20 creators** for a given `campaignId`
- **explainable scoring** (`totalScore + scoreBreakdown + reasons`)
- hybrid scoring (why):
1. A pure hard-filter approach shrinks the candidate pool too aggressively.
2. A pure weighted approach can rank risky creators too high.
3. A hybrid model keeps business rules strict while preserving ranking flexibility.

Chosen decisions:
- Stack: `Next.js + tRPC + Supabase`
- Scope: Part 1 only
- Hard rules: `brand safety`, `follower range`
- Soft rule: `watchtime` (penalty)
- Weight profile: `Balanced explainable`
- Response: `detailed breakdown + reasons`

---

## Architecture Outline (End-to-End, Part 1 Focused)
1. `app`/API layer: tRPC router/procedure (`campaign.getTopCreators`)
2. Domain layer: scoring engine (pure functions)
3. Data layer: campaign + creator read access (initially JSON seed, target Supabase tables)
4. Observability: request timing + candidate count + filter-reason metrics

---

## Public API / Interface Changes
1. tRPC input:
   - `campaignId: string`
2. tRPC output:
   - `campaignId`
   - `generatedAt`
   - `weights`
   - `results: Array<{ creatorId, totalScore, scoreBreakdown, penalties, reasons, matchedSignals }>`
3. `scoreBreakdown` fields (0..weight):
   - `nicheMatch` (25)
   - `audienceCountryMatch` (20)
   - `engagementScore` (15)
   - `watchTimeScore` (15)
   - `followerFitScore` (15)
   - `hookMatchScore` (10)
4. `penalties`:
   - `watchTimePenalty` (soft)
   - extensible for future penalty types

---

## Scoring Rules (Decision-Complete)
1. **Hard filters**
   - Exclude if `brandSafetyFlags` conflict with campaign constraints
   - Exclude if `followers` are outside campaign `budgetRange`
2. **Soft scoring**
   - `watchtime`: full points when `avgWatchTime >= minAvgWatchTime`; otherwise linear score reduction
3. **Signal calculations**
   - niche: campaign/creator niche overlap ratio
   - audience country: whether `targetCountry` appears in creator `audience.topCountries` (position-weighted)
   - engagement: normalized percentile-based score
   - follower fit: score by closeness to range center (while inside range)
   - hook match: `primaryHookType` in `preferredHookTypes`
4. **Total score**
   - `sum(weighted subscores) - penalties`
   - clamped to `0..100`
5. **Tie-breakers**
   - `totalScore DESC`
   - then `engagementRate DESC`
   - then `followers DESC`

---

## Data Model / Supabase Preparation
1. Tables:
   - `campaigns`
   - `creators`
   - optional: `creator_audience`, `creator_posts` depending on normalization needs
2. JSON seed import strategy:
   - load assignment datasets as seed
   - keep seed dataset in-repo for reproducible assignment runs
   - in a typical production setup, raw seed/bootstrap files are usually managed separately
   - validate with type-safe parser during ingest
3. Index suggestions:
   - `creators.followers`
   - `creators.primary_hook_type`
   - `creators.country`
   - if JSONB is used, GIN index for `audience.topCountries`

---

## Error Handling
1. `campaignId` not found -> `NOT_FOUND`
2. All candidates filtered out by hard rules:
   - return `results: []` plus `summary.rejectionStats`
3. Missing required creator fields:
   - skip creator + log reason
4. Unexpected errors:
   - internal error + correlation id

---

## Test Plan (Part 1 Acceptance Validation)
1. **Unit tests (scoring functions)**
   - niche overlap edge cases (0, partial, full)
   - hook match true/false
   - follower out-of-range hard reject
   - watchtime soft penalty curve
2. **Integration tests (procedure)**
   - valid `campaignId` -> up to 20 results + valid response schema
   - unknown `campaignId` -> not found
   - deterministic ordering (same input, same ranking)
3. **Explainability tests**
   - consistency: `totalScore == breakdown - penalties`
   - correct hard-filter reason reporting
4. **Data quality tests**
   - required fields present after seed ingest
   - no duplicate creator/campaign IDs

---

## Acceptance Criteria
1. Endpoint returns Top 20 creators per campaign with explainable scoring.
2. Hard filters and soft penalties are visible in response (reasons/penalties).
3. Score range is 0-100 and deterministic.
4. README clearly explains scoring logic.
5. Documentation and API contracts are consistent with fixed Top 20 behavior.

---

## Assumptions and Defaults
1. `targetCountry` is evaluated primarily against `audience.topCountries` (not creator profile country).
2. `targetGender` and `targetAgeRange` are not included in Part 1 scoring.
3. `doNotUseWords` in Part 1 is mapped only to existing safety flags.
4. Default result limit is fixed at `20`.
