export type Creator = {
  id: string;
  username: string;
  country: string;
  niches: string[];
  followers: number;
  engagementRate: number;
  avgWatchTime: number;
  contentStyle: string;
  primaryHookType: string;
  brandSafetyFlags: string[];
  audience: {
    topCountries: string[];
    genderSplit: {
      female: number | null;
      male: number | null;
    };
    topAgeRange: string | null;
  };
  lastPosts: Array<{
    caption: string;
    views: number;
    likes: number;
  }>;
};

export type CreatorRow = {
  id: string;
  username: string;
  country: string;
  niches: string[];
  followers: number;
  engagement_rate: number;
  avg_watch_time: number;
  content_style: string;
  primary_hook_type: string;
  brand_safety_flags: string[];
  audience_top_countries: string[];
  audience_gender_female: number | null;
  audience_gender_male: number | null;
  audience_top_age_range: string | null;
  last_posts: Array<{
    caption: string;
    views: number;
    likes: number;
  }>;
};
