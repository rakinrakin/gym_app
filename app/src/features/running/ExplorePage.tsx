import { useState, useEffect } from "react";
import { Filter, Globe2, Plus, Sparkles, TrendingUp } from "lucide-react";
import { fetchCommunityPosts } from "./runningApi";
import { TweetCard, getCountryFlag } from "./components/TweetCard";
import { TweetComposer } from "./components/TweetComposer";
import { RunUploadModal } from "./components/RunUploadModal";
import { useT } from "../../lib/i18n/LocalizationProvider";
import type { CommunityPostData, RunningActivityData, UserProfileData } from "./types";

const FILTER_COUNTRIES = [
  "All",
  "Kenya",
  "Japan",
  "Switzerland",
  "United States",
  "Germany",
  "United Kingdom",
  "Bangladesh"
];

export function ExplorePage({
  currentUserProfile,
  onActivityCreated
}: {
  currentUserProfile?: UserProfileData | null;
  onActivityCreated?: (activity: RunningActivityData) => void;
}) {
  const { t } = useT();
  const [posts, setPosts] = useState<CommunityPostData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchCommunityPosts().then((data) => {
      if (mounted) {
        setPosts(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handlePostCreated = (newPost: CommunityPostData) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleRunCreated = (act: RunningActivityData) => {
    if (onActivityCreated) onActivityCreated(act);
    // Refresh posts to see auto-share
    fetchCommunityPosts().then((data) => setPosts(data));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCountry =
      selectedCountry === "All" ||
      post.country.toLowerCase() === selectedCountry.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="explore-container">
      {/* Hero Banner */}
      <div className="explore-hero">
        <div className="explore-hero-content">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-volt-500/10 border border-volt-400/20 text-volt-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkles size={13} />
            <span>{t("explore.runsOnly", "Worldwide Running Feed")}</span>
          </div>
          <h1 className="hero-headline">{t("explore.title", "Global Runners Pulse")}</h1>
          <p className="hero-subtext">
            {t("explore.subtitle", "Live updates, pace splits, and morning stories from runners pounding the pavement across 120+ countries.")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="upload-hero-btn"
        >
          <Plus size={18} />
          <span>{t("nav.recordRun", "Upload Run Stats")}</span>
        </button>
      </div>

      {/* Main Grid: Feed on left/center, Worldwide Pulse Sidebar on right */}
      <div className="explore-layout">
        <div className="explore-main-feed">
          {/* Tweet Composer */}
          <TweetComposer
            currentUserProfile={currentUserProfile}
            onPostCreated={handlePostCreated}
          />

          {/* Filter Bar */}
          <div className="feed-filter-bar">
            <div className="country-tabs-scroll">
              {FILTER_COUNTRIES.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => setSelectedCountry(country)}
                  className={`country-tab-btn ${selectedCountry === country ? "active" : ""}`}
                >
                  {country !== "All" && (
                    <span className="mr-1">{getCountryFlag(country)}</span>
                  )}
                  {country === "All" ? "🌐 Global" : country}
                </button>
              ))}
            </div>

            <div className="search-filter-box">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tweets, #hashtags..."
                className="feed-search-input"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="posts-list">
            {isLoading ? (
              <div className="loading-state">
                <div className="pulse-spinner" />
                <p>{t("common.loading", "Connecting to Global Running Network...")}</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="empty-state-card">
                <Globe2 size={32} className="text-zinc-500 mb-2" />
                <h4>{t("explore.noPosts", "No running tweets found for this filter")}</h4>
                <p>Be the first runner from {selectedCountry} to share your story!</p>
              </div>
            ) : (
              filteredPosts.map((post, idx) => (
                <TweetCard key={post.ItemId || idx} post={post} />
              ))
            )}
          </div>
        </div>

        {/* Global Sidebar */}
        <aside className="explore-sidebar">
          {/* Trending Running Topics */}
          <div className="sidebar-card">
            <div className="card-header-flex">
              <TrendingUp size={16} className="text-volt-400" />
              <h3>Trending in Running</h3>
            </div>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-meta">Global Marathon Season • 1.2k runs</span>
                <span className="trending-tag">#BerlinMarathon</span>
              </div>
              <div className="trending-item">
                <span className="trending-meta">Track & Interval • 890 runs</span>
                <span className="trending-tag">#Sub205k</span>
              </div>
              <div className="trending-item">
                <span className="trending-meta">Alpine Running • 640 runs</span>
                <span className="trending-tag">#SwissAlps</span>
              </div>
              <div className="trending-item">
                <span className="trending-meta">Gear Talk • 2.1k tweets</span>
                <span className="trending-tag">#Alphafly3</span>
              </div>
            </div>
          </div>

          {/* Global Running Hotspots */}
          <div className="sidebar-card">
            <div className="card-header-flex">
              <Filter size={16} className="text-cyan-400" />
              <h3>Worldwide Hotspots</h3>
            </div>
            <div className="hotspot-list">
              <div className="hotspot-item" onClick={() => setSelectedCountry("Kenya")}>
                <span className="hotspot-flag">🇰🇪</span>
                <div className="hotspot-details">
                  <span className="hotspot-city">Eldoret, Kenya</span>
                  <span className="hotspot-tagline">Altitude Capital • 3:32 avg pace</span>
                </div>
              </div>
              <div className="hotspot-item" onClick={() => setSelectedCountry("Japan")}>
                <span className="hotspot-flag">🇯🇵</span>
                <div className="hotspot-details">
                  <span className="hotspot-city">Tokyo, Japan</span>
                  <span className="hotspot-tagline">Imperial Loop • 4:25 avg pace</span>
                </div>
              </div>
              <div className="hotspot-item" onClick={() => setSelectedCountry("Switzerland")}>
                <span className="hotspot-flag">🇨🇭</span>
                <div className="hotspot-details">
                  <span className="hotspot-city">Zurich, Switzerland</span>
                  <span className="hotspot-tagline">Lake & Alps • 4:45 avg pace</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <RunUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUserProfile={currentUserProfile}
        onActivityCreated={handleRunCreated}
      />
    </div>
  );
}
