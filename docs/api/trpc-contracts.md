# tRPC Contracts (Part 1)

## Procedure

- `campaign.getTopCreators`

## Input

```ts
{
    campaignId: string;
}
```

Notes:

- result size is fixed to Top 20 by assignment scopes.
- clients do not control pagination/limit in Part 1

## Output

```ts
{
  campaignId: string;
  generatedAt: string;
  weights: {
    nicheMatch: number;
    audienceCountryMatch: number;
    engagementScore: number;
    watchTimeScore: number;
    followerFitScore: number;
    hookMatchScore: number;
  };
  results: Array<{
    creatorId: string;
    totalScore: number;
    scoreBreakdown: {
      nicheMatch: number;
      audienceCountryMatch: number;
      engagementScore: number;
      watchTimeScore: number;
      followerFitScore: number;
      hookMatchScore: number;
    };
    penalties: {
      watchTimePenalty: number;
    };
    reasons: string[];
    matchedSignals: string[];
  }>;
  summary?: {
    rejectionStats: Record<string, number>;
  };
}
```

## Errors

- `NOT_FOUND`: campaign does not exist
- `BAD_REQUEST`: invalid input
- `INTERNAL_SERVER_ERROR`: unexpected failure
