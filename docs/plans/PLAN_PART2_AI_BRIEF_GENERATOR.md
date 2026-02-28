## Part 2 Plan: AI Brief Generator (Next.js + tRPC + Supabase)

### Summary
This plan defines the **second assignment step** end-to-end:
- a tRPC procedure that generates AI briefing output per `campaignId + creatorId`
- strict JSON output only (no free text)
- schema-validated response shape
- malformed JSON handling with retry/repair
- cache-first design to avoid repeated LLM calls

Chosen decisions:
- Procedure: `campaign.generateBrief`
- Method type: `mutation` (LLM side effect + cache write)
- Cache key: `(campaign_id, creator_id)`
- Output: strict structured object

---

## Architecture Outline (Part 2 Focused)
1. `API` layer: tRPC procedure (`campaign.generateBrief`)
2. `Service` layer: orchestration (cache -> data fetch -> AI call -> validate -> cache)
3. `Domain` layer: output schema + validation + repair workflow decisions
4. `Data` layer: campaign/creator reads + AI cache reads/writes
5. `Integration` layer: LLM client adapter

---

## Public API / Interface Changes
1. New tRPC input:
   - `campaignId: string`
   - `creatorId: string`
2. New tRPC output:
   - `campaignId: string`
   - `creatorId: string`
   - `generatedAt: string`
   - `cached: boolean`
   - `brief: {
       outreachMessage: string;
       contentIdeas: string[]; // exactly 5
       hookSuggestions: string[]; // exactly 3
     }`

Output rules:
- output must be strict JSON-compatible object
- no markdown/text wrapper around JSON

---

## Data Model / Cache Strategy
1. New table: `ai_brief_cache`
   - `id` bigint generated identity primary key
   - `campaign_id` text not null
   - `creator_id` text not null
   - `payload` jsonb not null
   - `model` text not null
   - `created_at` timestamptz not null default `now()`
   - `updated_at` timestamptz not null default `now()`
2. Uniqueness:
   - unique index on `(campaign_id, creator_id)`
3. Upsert policy:
   - on cache miss -> generate + insert
   - on regenerate path -> upsert same key
4. Read policy:
   - first read cache by `(campaign_id, creator_id)`
   - if found and valid -> return cached response

---

## AI Output Contract and Validation
1. Required JSON schema:
   - `outreachMessage`: non-empty string
   - `contentIdeas`: string array length = 5
   - `hookSuggestions`: string array length = 3
2. Validation:
   - parse response into JSON
   - validate with Zod schema
   - reject any non-conforming output
3. Strictness:
   - do not accept free text responses
   - do not accept missing/extra structure outside expected object

---

## Malformed JSON Handling (Retry/Repair)
1. Attempt 1: strict JSON prompt
2. If parse fails:
   - run lightweight cleanup/extraction (strip code fences, locate first JSON object)
3. If still invalid:
   - Attempt 2: repair prompt (convert previous response into valid target schema JSON)
4. If still invalid:
   - fail with controlled application error

Retry policy:
- maximum 2 LLM attempts per request
- always validate final output with schema

---

## Cost and Reliability Controls
1. Cache-first lookup prevents repeated LLM calls for same `(campaignId, creatorId)`
2. Model choice and token limits should be fixed per environment config
3. Avoid recursive retries; bounded retry only
4. Log generation path:
   - cache hit / cache miss
   - first-pass valid / repaired / failed

---

## Error Handling
1. `campaignId` not found -> `NOT_FOUND`
2. `creatorId` not found -> `NOT_FOUND`
3. AI key/config missing -> internal config error
4. malformed/unrepairable AI output -> controlled internal error
5. cache read/write failure -> internal error with safe message

---

## Acceptance Criteria
1. Procedure returns strict JSON structure only.
2. `contentIdeas` always length 5; `hookSuggestions` always length 3.
3. malformed AI output is retried/repaired with bounded attempts.
4. repeated call with same campaign+creator returns cached result.
5. architecture remains layered (API / Service / Domain / Data / Integration).
6. no unnecessary repeated LLM calls for same key.

---

## Implementation Sequence
1. Add Part 2 contract docs
2. Add cache migration + repository
3. Add AI schema + parser/repair logic
4. Add AI integration adapter
5. Add `campaign.generateBrief` service
6. Add tRPC procedure and router wiring
7. Validate manually with cache hit/miss flows
