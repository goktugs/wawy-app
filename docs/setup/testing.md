# Testing (Part 1)

## Test Layers

1. Unit tests
   - scoring signals
   - hard filters
   - watchtime penalty
2. Integration tests
   - `campaign.getTopCreators` response shape
   - error mapping (`NOT_FOUND`, invalid input)
3. Determinism tests
   - same input -> same ranking order

## Minimum Acceptance

- Top 20 output works for all campaigns.
- `totalScore` equals score breakdown minus penalties.
- Hard-filter rejections are traceable in summary.
