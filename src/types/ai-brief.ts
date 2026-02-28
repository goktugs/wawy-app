export type AiBrief = {
  outreachMessage: string;
  contentIdeas: string[];
  hookSuggestions: string[];
};

export type AiBriefCacheRow = {
  campaign_id: string;
  creator_id: string;
  payload: AiBrief;
  model: string;
  created_at: string;
  updated_at: string;
};
