export type Campaign = {
  id: string;
  brand: string;
  objective: string;
  targetCountry: string;
  targetGender: string;
  targetAgeRange: string;
  niches: string[];
  preferredHookTypes: string[];
  minAvgWatchTime: number;
  budgetRange: {
    minFollowers: number;
    maxFollowers: number;
  };
  tone: string;
  doNotUseWords: string[];
};

export type CampaignRow = {
  id: string;
  brand: string;
  objective: string;
  target_country: string;
  target_gender: string;
  target_age_range: string;
  niches: string[];
  preferred_hook_types: string[];
  min_avg_watch_time: number;
  budget_min_followers: number;
  budget_max_followers: number;
  tone: string;
  do_not_use_words: string[];
};
