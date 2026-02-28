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

---

# tRPC Contracts (Part 2)

## Procedure

- `campaign.generateBrief`

## Input

```ts
{
  campaignId: string;
  creatorId: string;
}
```

## Output

```ts
{
  campaignId: string;
  creatorId: string;
  generatedAt: string;
  cached: boolean;
  brief: {
    outreachMessage: string;
    contentIdeas: [string, string, string, string, string];
    hookSuggestions: [string, string, string];
  };
}
```

Output rules:

- strict JSON only (no free text wrappers)
- `contentIdeas` length is exactly `5`
- `hookSuggestions` length is exactly `3`

## Errors

- `NOT_FOUND`: campaign or creator does not exist
- `BAD_REQUEST`: invalid input
- `INTERNAL_SERVER_ERROR`: malformed/unrepairable AI output, cache failure, or config failure
