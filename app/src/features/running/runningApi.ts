import { blocksClient } from "../../lib/blocks/client";
import type { CommunityPostData, RunningActivityData, UserProfileData } from "./types";

// User Profile Collection
const userProfiles = blocksClient.data.collection<UserProfileData>("UserProfile", {
  fields: [
    "userId",
    "username",
    "displayName",
    "bio",
    "country",
    "city",
    "avatarUrl",
    "coverUrl",
    "totalDistanceKm",
    "totalRuns",
    "totalDurationMinutes",
    "favoriteRunningShoe",
    "weeklyGoalKm"
  ]
});

// Running Activity Collection
const runningActivities = blocksClient.data.collection<RunningActivityData>("RunningActivity", {
  fields: [
    "userId",
    "username",
    "userAvatar",
    "title",
    "description",
    "distanceKm",
    "durationMinutes",
    "paceMinPerKm",
    "caloriesBurned",
    "heartRateAvg",
    "elevationGainM",
    "routeCity",
    "routeCountry",
    "latitude",
    "longitude",
    "activityDate",
    "weather",
    "imageUrl",
    "likesCount"
  ]
});

// Community Post (Tweets / Explore Feed) Collection
const communityPosts = blocksClient.data.collection<CommunityPostData>("CommunityPost", {
  fields: [
    "userId",
    "username",
    "displayName",
    "userAvatar",
    "country",
    "city",
    "content",
    "mediaUrl",
    "activitySummary",
    "likesCount",
    "retweetsCount",
    "tags",
    "postType"
  ]
});

function normalizeItems<T>(response: unknown, queryName?: string): T[] {
  if (!response) return [];
  const res = response as Record<string, unknown>;
  const data = res.data as Record<string, unknown> | undefined;
  if (data && queryName && data[queryName]) {
    const qData = data[queryName] as { items?: T[] };
    if (Array.isArray(qData.items)) return qData.items;
  }
  if (data && Array.isArray(data.items)) return data.items as T[];
  if (Array.isArray(res.items)) return res.items as T[];
  if (Array.isArray(response)) return response as T[];
  return [];
}

// Global Seed Demo Data for when collection is fresh so UI is instantly alive
export const INITIAL_COMMUNITY_TWEETS: CommunityPostData[] = [
  {
    ItemId: "seed-post-1",
    userId: "runner-kenya-01",
    username: "kipchoge_fan",
    displayName: "Eliud K.",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "Kenya",
    city: "Eldoret",
    content: "Dawn track session at 2,200m altitude! Legs felt light today. Remember runners: no human is limited. Keep pushing the pace! 🇰🇪🏃‍♂️💨",
    activitySummary: "21.1 km • 1:14:30 • 3:32 /km",
    likesCount: 142,
    retweetsCount: 38,
    tags: ["HighAltitude", "MarathonTraining", "KenyaRunners"],
    postType: "run_share",
    CreatedDate: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    ItemId: "seed-post-2",
    userId: "runner-tokyo-02",
    username: "sakura_strider",
    displayName: "Yuki Tanaka",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "Japan",
    city: "Tokyo",
    content: "Imperial Palace loop at twilight. Crisp autumn breeze in Tokyo tonight. Tested out the new carbon plate shoes and shaved 12 seconds off my 5k split! 🇯🇵⚡",
    activitySummary: "10.0 km • 44:12 • 4:25 /km",
    likesCount: 89,
    retweetsCount: 19,
    tags: ["TokyoRunning", "ImperialPalaceLoop", "NightRun"],
    postType: "run_share",
    CreatedDate: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    ItemId: "seed-post-3",
    userId: "runner-swiss-03",
    username: "alps_tempo",
    displayName: "Elena Keller",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    country: "Switzerland",
    city: "Zurich",
    content: "Lake Zurich morning loop followed by cold plunge. The mountains were glowing pink at sunrise! Who else is training for the Berlin Marathon? 🏔️🇨🇭",
    activitySummary: "16.4 km • 1:18:05 • 4:45 /km",
    likesCount: 115,
    retweetsCount: 24,
    tags: ["LakeZurich", "SwissAlps", "BerlinMarathon"],
    postType: "run_share",
    CreatedDate: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    ItemId: "seed-post-4",
    userId: "runner-ny-04",
    username: "brooklyn_fleet",
    displayName: "Marcus Davis",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "United States",
    city: "New York",
    content: "Crossing Manhattan Bridge as the city wakes up will never get old. Coffee hits different after 8 miles in sub-45 tempo. 🗽☕",
    activitySummary: "12.8 km • 56:40 • 4:26 /km",
    likesCount: 67,
    retweetsCount: 12,
    tags: ["NYCrun", "BrooklynRunners", "MorningMiles"],
    postType: "tweet",
    CreatedDate: new Date(Date.now() - 1000 * 60 * 320).toISOString()
  }
];

export const INITIAL_ACTIVITIES: RunningActivityData[] = [
  {
    ItemId: "act-1",
    userId: "runner-kenya-01",
    username: "kipchoge_fan",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "High Altitude Long Run",
    description: "Chasing rhythm through the tea fields. Controlled aerobic pace.",
    distanceKm: 21.1,
    durationMinutes: 74.5,
    paceMinPerKm: "3:32",
    caloriesBurned: 1380,
    heartRateAvg: 158,
    elevationGainM: 320,
    routeCity: "Eldoret",
    routeCountry: "Kenya",
    activityDate: new Date(Date.now() - 1000 * 60 * 35).toISOString().split("T")[0] ?? "",
    weather: "20°C Mild, Dry breeze",
    imageUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format&fit=crop&q=80",
    likesCount: 142
  },
  {
    ItemId: "act-2",
    userId: "runner-tokyo-02",
    username: "sakura_strider",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Imperial Palace Speedwork",
    description: "2x 5k continuous threshold workout around Chiyoda.",
    distanceKm: 10.0,
    durationMinutes: 44.2,
    paceMinPerKm: "4:25",
    caloriesBurned: 690,
    heartRateAvg: 165,
    elevationGainM: 45,
    routeCity: "Tokyo",
    routeCountry: "Japan",
    activityDate: new Date(Date.now() - 1000 * 60 * 90).toISOString().split("T")[0] ?? "",
    weather: "16°C Clear night",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop&q=80",
    likesCount: 89
  },
  {
    ItemId: "act-3",
    userId: "runner-swiss-03",
    username: "alps_tempo",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "Lake Zurich Morning Loop",
    description: "Crisp autumn morning loop along the lakeshore.",
    distanceKm: 16.4,
    durationMinutes: 78.1,
    paceMinPerKm: "4:45",
    caloriesBurned: 1120,
    heartRateAvg: 152,
    elevationGainM: 110,
    routeCity: "Zurich",
    routeCountry: "Switzerland",
    activityDate: new Date(Date.now() - 1000 * 60 * 180).toISOString().split("T")[0] ?? "",
    weather: "12°C Crisp, Sunny",
    imageUrl: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80",
    likesCount: 115
  }
];

export const INITIAL_LEADERBOARD: UserProfileData[] = [
  {
    userId: "runner-kenya-01",
    username: "kipchoge_fan",
    displayName: "Eliud Kipkorir",
    bio: "Sub-elite marathoner training in Rift Valley. Chasing the 2:10 barrier.",
    country: "Kenya",
    city: "Eldoret",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80",
    totalDistanceKm: 842.5,
    totalRuns: 64,
    totalDurationMinutes: 3420,
    favoriteRunningShoe: "Nike Alphafly 3",
    weeklyGoalKm: 120
  },
  {
    userId: "runner-swiss-03",
    username: "alps_tempo",
    displayName: "Elena Keller",
    bio: "Trail enthusiast and marathon pacer. Swiss alpine runner.",
    country: "Switzerland",
    city: "Zurich",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
    totalDistanceKm: 618.2,
    totalRuns: 51,
    totalDurationMinutes: 2980,
    favoriteRunningShoe: "On Cloudboom Echo 3",
    weeklyGoalKm: 75
  },
  {
    userId: "runner-tokyo-02",
    username: "sakura_strider",
    displayName: "Yuki Tanaka",
    bio: "Tokyo city runner. 5k/10k road racer and night explorer.",
    country: "Japan",
    city: "Tokyo",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
    totalDistanceKm: 489.0,
    totalRuns: 45,
    totalDurationMinutes: 2200,
    favoriteRunningShoe: "Asics Metaspeed Sky Paris",
    weeklyGoalKm: 50
  },
  {
    userId: "runner-ny-04",
    username: "brooklyn_fleet",
    displayName: "Marcus Davis",
    bio: "Brooklyn bridge morning crew. NYC Marathon 2026 qualifier.",
    country: "United States",
    city: "New York",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1000&auto=format&fit=crop&q=80",
    totalDistanceKm: 432.8,
    totalRuns: 38,
    totalDurationMinutes: 1950,
    favoriteRunningShoe: "Saucony Endorphin Pro 4",
    weeklyGoalKm: 60
  }
];

// --- API METHODS ---

export async function fetchCommunityPosts(): Promise<CommunityPostData[]> {
  try {
    const res = await communityPosts.list({ pageNo: 1, pageSize: 50 });
    const items = normalizeItems<CommunityPostData>(res, "getCommunityPosts");
    if (items.length > 0) {
      // Merge with seed or return cloud items sorted by date
      const cloudIds = new Set(items.map((i) => i.ItemId || i.userId));
      const filteredSeed = INITIAL_COMMUNITY_TWEETS.filter((s) => s.ItemId ? !cloudIds.has(s.ItemId) : true);
      return [...items, ...filteredSeed];
    }
  } catch (err) {
    console.warn("Could not fetch remote community posts, falling back to cached seed:", err);
  }
  return INITIAL_COMMUNITY_TWEETS;
}

export async function createCommunityPost(post: Omit<CommunityPostData, "ItemId" | "CreatedDate">): Promise<CommunityPostData> {
  try {
    const res = await communityPosts.create(post as CommunityPostData);
    const item = (res as { data?: { insertCommunityPost?: CommunityPostData } })?.data?.insertCommunityPost || (res as CommunityPostData);
    return item;
  } catch (err) {
    console.warn("Falling back to local optimistic post creation:", err);
    return {
      ...post,
      ItemId: "local-" + Date.now(),
      CreatedDate: new Date().toISOString()
    };
  }
}

export async function fetchRunningActivities(userId?: string): Promise<RunningActivityData[]> {
  try {
    const res = await runningActivities.list({ pageNo: 1, pageSize: 50 });
    let items = normalizeItems<RunningActivityData>(res, "getRunningActivities");
    if (userId) {
      items = items.filter((a) => a.userId === userId);
    }
    if (items.length > 0) {
      const cloudIds = new Set(items.map((i) => i.ItemId));
      const filteredSeed = INITIAL_ACTIVITIES.filter((s) => !cloudIds.has(s.ItemId));
      return userId ? items : [...items, ...filteredSeed];
    }
  } catch (err) {
    console.warn("Could not fetch remote running activities, falling back to cached seed:", err);
  }
  return userId ? [] : INITIAL_ACTIVITIES;
}

export async function createRunningActivity(
  activity: Omit<RunningActivityData, "ItemId" | "CreatedDate">,
  shareToFeed: boolean = true
): Promise<RunningActivityData> {
  let createdActivity: RunningActivityData;
  try {
    const res = await runningActivities.create(activity as RunningActivityData);
    createdActivity = (res as { data?: { insertRunningActivity?: RunningActivityData } })?.data?.insertRunningActivity || (res as RunningActivityData);
  } catch (err) {
    console.warn("Creating activity optimistically:", err);
    createdActivity = {
      ...activity,
      ItemId: "local-" + Date.now(),
      CreatedDate: new Date().toISOString()
    };
  }

  // Update user profile cumulative stats
  try {
    await incrementProfileStats(activity.userId, activity.distanceKm, activity.durationMinutes);
  } catch (e) {
    console.warn("Error updating user profile cumulative totals:", e);
  }

  // If shareToFeed is true, create matching CommunityPost
  if (shareToFeed) {
    try {
      await createCommunityPost({
        userId: activity.userId,
        username: activity.username,
        displayName: activity.username,
        userAvatar: activity.userAvatar,
        country: activity.routeCountry,
        city: activity.routeCity,
        content: `Just completed "${activity.title}"! ${activity.description || "Felt great on the route today."} 🏃💨`,
        activitySummary: `${activity.distanceKm} km • ${Math.round(activity.durationMinutes)}m • ${activity.paceMinPerKm}/km`,
        likesCount: 1,
        retweetsCount: 0,
        tags: ["Running", activity.routeCity.replace(/\s+/g, ""), "Workout"],
        postType: "run_share"
      });
    } catch (e) {
      console.warn("Could not auto-post run share to community feed:", e);
    }
  }

  return createdActivity;
}

export async function fetchUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const res = await userProfiles.list({ pageNo: 1, pageSize: 20 });
    const items = normalizeItems<UserProfileData>(res, "getUserProfiles");
    const found = items.find((p) => p.userId === userId);
    if (found) return found;
  } catch (err) {
    console.warn("Could not fetch user profile from cloud:", err);
  }
  return null;
}

export async function saveUserProfile(profile: UserProfileData): Promise<UserProfileData> {
  try {
    if (profile.ItemId) {
      await userProfiles.update(profile.ItemId, profile);
      return profile;
    } else {
      const res = await userProfiles.create(profile);
      const inserted = (res as { data?: { insertUserProfile?: UserProfileData } })?.data?.insertUserProfile;
      return inserted || profile;
    }
  } catch (err) {
    console.warn("Optimistic save for user profile:", err);
    return profile;
  }
}

async function incrementProfileStats(userId: string, distanceKm: number, durationMinutes: number) {
  const profile = await fetchUserProfile(userId);
  if (profile && profile.ItemId) {
    const updated: UserProfileData = {
      ...profile,
      totalDistanceKm: Number(((profile.totalDistanceKm || 0) + distanceKm).toFixed(2)),
      totalRuns: (profile.totalRuns || 0) + 1,
      totalDurationMinutes: Math.round((profile.totalDurationMinutes || 0) + durationMinutes)
    };
    await userProfiles.update(profile.ItemId, updated);
  }
}

export async function fetchGlobalRunners(): Promise<UserProfileData[]> {
  try {
    const res = await userProfiles.list({ pageNo: 1, pageSize: 50 });
    const items = normalizeItems<UserProfileData>(res, "getUserProfiles");
    if (items.length > 0) {
      const cloudUserIds = new Set(items.map((i) => i.userId));
      const extraSeed = INITIAL_LEADERBOARD.filter((s) => !cloudUserIds.has(s.userId));
      return [...items, ...extraSeed].sort((a, b) => (b.totalDistanceKm || 0) - (a.totalDistanceKm || 0));
    }
  } catch (err) {
    console.warn("Falling back to initial leaderboard:", err);
  }
  return INITIAL_LEADERBOARD;
}
