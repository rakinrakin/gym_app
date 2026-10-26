import { useState, useEffect } from "react";
import { Award, Compass, Footprints, Globe2, Sparkles, Trophy, Users } from "lucide-react";
import { fetchGlobalRunners } from "./runningApi";
import { getCountryFlag } from "./components/TweetCard";
import { useT } from "../../lib/i18n/LocalizationProvider";
import type { UserProfileData } from "./types";

export function RunnersDirectoryPage() {
  const { t } = useT();
  const [runners, setRunners] = useState<UserProfileData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchGlobalRunners().then((data) => {
      if (mounted) {
        setRunners(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const countries = ["All", ...Array.from(new Set(runners.map((r) => r.country).filter(Boolean)))];

  const filteredRunners = runners.filter((runner) => {
    const matchesCountry = selectedCountry === "All" || runner.country === selectedCountry;
    const matchesSearch =
      !searchQuery.trim() ||
      runner.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runner.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      runner.favoriteRunningShoe?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="directory-container">
      {/* Hero Banner */}
      <div className="directory-hero">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-volt-500/10 border border-volt-400/20 text-volt-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Globe2 size={13} />
          <span>International Athletics Roster</span>
        </div>
        <h1 className="hero-headline">{t("runners.title", "Global Runners Directory")}</h1>
        <p className="hero-subtext">
          {t("runners.subtitle", "Discover athletes, pacers, and marathoners logging miles across the globe.")}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="feed-filter-bar mb-6">
        <div className="country-tabs-scroll">
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCountry(c)}
              className={`country-tab-btn ${selectedCountry === c ? "active" : ""}`}
            >
              {c !== "All" && <span className="mr-1">{getCountryFlag(c)}</span>}
              {c === "All" ? "🌐 All Countries" : c}
            </button>
          ))}
        </div>

        <div className="search-filter-box">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("runners.searchPlaceholder", "Search runner, city, shoes...")}
            className="feed-search-input"
          />
        </div>
      </div>

      {/* Runners Grid */}
      {isLoading ? (
        <div className="loading-state">
          <div className="pulse-spinner" />
          <p>Gathering global athlete profiles...</p>
        </div>
      ) : filteredRunners.length === 0 ? (
        <div className="empty-state-card">
          <Users size={32} className="text-zinc-500 mb-2" />
          <h4>No runners found for this filter</h4>
        </div>
      ) : (
        <div className="runners-grid">
          {filteredRunners.map((runner, index) => (
            <div key={runner.userId || index} className="runner-directory-card">
              <div className="runner-card-header">
                <div className="avatar-wrapper lg">
                  {runner.avatarUrl ? (
                    <img src={runner.avatarUrl} alt={runner.displayName} className="runner-avatar lg" />
                  ) : (
                    <div className="avatar-fallback lg">{runner.displayName?.charAt(0) || "R"}</div>
                  )}
                  <span className="country-badge-float lg" title={runner.country}>
                    {getCountryFlag(runner.country)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="runner-card-name truncate">{runner.displayName}</h3>
                    {index < 3 && (
                      <span title={`Top ${index + 1} Runner`}>
                        <Award size={15} className="text-amber-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 block">@{runner.username}</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Compass size={11} /> {runner.city}, {runner.country}
                  </span>
                </div>

                <div className="rank-tag">#{index + 1}</div>
              </div>

              {runner.bio && <p className="runner-card-bio">{runner.bio}</p>}

              {/* Stats Box */}
              <div className="runner-card-stats-grid">
                <div className="card-stat">
                  <span className="stat-sm-label">TOTAL DISTANCE</span>
                  <span className="stat-sm-val text-volt-400">
                    {runner.totalDistanceKm?.toFixed(1) || 0} <span className="text-xs">km</span>
                  </span>
                </div>
                <div className="card-stat">
                  <span className="stat-sm-label">RUNS LOGGED</span>
                  <span className="stat-sm-val text-cyan-400">{runner.totalRuns || 0}</span>
                </div>
                <div className="card-stat">
                  <span className="stat-sm-label">WEEKLY TARGET</span>
                  <span className="stat-sm-val text-orange-400">
                    {runner.weeklyGoalKm || 30} <span className="text-xs">km</span>
                  </span>
                </div>
              </div>

              {runner.favoriteRunningShoe && (
                <div className="shoe-preference-pill">
                  <Footprints size={13} className="text-zinc-400" />
                  <span className="truncate">Gear: {runner.favoriteRunningShoe}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
