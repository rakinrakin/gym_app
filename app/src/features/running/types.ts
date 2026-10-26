export interface UserProfileData {
  ItemId?: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  country: string;
  city: string;
  avatarUrl?: string;
  coverUrl?: string;
  totalDistanceKm: number;
  totalRuns: number;
  totalDurationMinutes: number;
  favoriteRunningShoe?: string;
  weeklyGoalKm: number;
  CreatedDate?: string;
  LastUpdatedDate?: string;
}

export interface RunningActivityData {
  ItemId?: string;
  userId: string;
  username: string;
  userAvatar?: string;
  title: string;
  description?: string;
  distanceKm: number;
  durationMinutes: number;
  paceMinPerKm: string;
  caloriesBurned: number;
  heartRateAvg: number;
  elevationGainM: number;
  routeCity: string;
  routeCountry: string;
  latitude?: number;
  longitude?: number;
  activityDate: string;
  weather?: string;
  imageUrl?: string;
  likesCount: number;
  CreatedDate?: string;
}

export interface CommunityPostData {
  ItemId?: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar?: string;
  country: string;
  city: string;
  content: string;
  mediaUrl?: string;
  activitySummary?: string;
  likesCount: number;
  retweetsCount: number;
  tags?: string[];
  postType: "tweet" | "run_share" | "milestone";
  CreatedDate?: string;
}
