import { orderBy } from "lodash";

import type { Creator } from "@/types/creator";

type ScoredCreator = {
  creator: Creator;
  totalScore: number;
};

export function rankCreators<T extends ScoredCreator>(scored: T[]): T[] {
  return orderBy(
    scored,
    [(item) => item.totalScore, (item) => item.creator.engagementRate, (item) => item.creator.followers],
    ["desc", "desc", "desc"]
  );
}
