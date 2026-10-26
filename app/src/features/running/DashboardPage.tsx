import { useState, useEffect } from "react";
import { Activity, Flame, Globe2, Plus, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { fetchGlobalRunners, fetchRunningActivities } from "./runningApi";
import { RunCard } from "./components/RunCard";
import { RunUploadModal } from "./components/RunUploadModal";
import { getCountryFlag } from "./components/TweetCard";
import { useT } from "../../lib/i18n/LocalizationProvider";
import type { RunningActivityData, UserProfileData } from "./types";

export function DashboardPage({
  currentUserProfile,
  onNavigate,
  onActivityCreated
}: {
  currentUserProfile?: UserProfileData | null;
  onNavigate: (path: string) => void;
  onActivityCreated?: (activity: RunningActivityData) => void;
}) {
  const { t } = useT();
  const [activities, setActivities] = useState<RunningActivityData[]>([]);
  const [topRunners, setTopRunners] = useState<UserProfileData[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchRunningActivities(), fetchGlobalRunners()]).then(([acts, runners]) => {
      if (mounted) {
        setActivities(acts);
        setTopRunners(runners.slice(0, 5));
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleRunCreated = (act: RunningActivityData) => {
    setActivities((prev) => [act, ...prev]);
    if (onActivityCreated) onActivityCreated(act);
  };

  // Compute aggregate stats across activities
  const totalKm = activities.reduce((sum, a) => sum + (a.distanceKm || 0), 0);
  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const avgPace = activities.length > 0 ? "4:28" : "5:00";

  return (
    <div className="dashboard-container">
      {/* Top Welcome / Hero Banner */}
      <div className="dashboard-hero-card">
        <div className="hero-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt-500/10 border border-volt-400/20 text-volt-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Live Global Telemetry</span>
          </div>
          <h1 className="dashboard-title">
            Welcome back, {currentUserProfile?.displayName || "Runner"}!
          </h1>
          <p className="dashboard-subtitle">
            Track your miles, broadcast your pace, and explore running stories from runners across the planet.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="action-btn-primary"
            >
              <Plus size={18} />
              <span>Log Running Stats</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate("/explore")}
              className="action-btn-secondary"
            >
              <Globe2 size={18} />
              <span>Explore Worldwide Tweets</span>
            </button>
          </div>
        </div>

        {/* User Weekly Goal Card Preview */}
        {currentUserProfile && (
          <div className="user-goal-widget">
            <div className="flex items-center justify-between mb-2">
              <span className="goal-label flex items-center gap-1.5">
                <Trophy size={14} className="text-volt-400" /> Weekly Target
              </span>
              <span className="goal-percent font-mono">
                {Math.min(
                  100,
                  Math.round(
                    ((currentUserProfile.totalDistanceKm || 0) /
                      (currentUserProfile.weeklyGoalKm || 30)) *
                      100
                  )
                )}
                %
              </span>
            </div>

            <div className="goal-progress-bar">
              <div
                className="goal-progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    ((currentUserProfile.totalDistanceKm || 0) /
                      (currentUserProfile.weeklyGoalKm || 30)) *
                      100
                  )}%`
                }}
              />
            </div>

            <div className="goal-footer">
              <span className="font-mono text-white font-medium">
                {currentUserProfile.totalDistanceKm?.toFixed(1) || "0.0"} km
              </span>
              <span className="text-zinc-400">
                Goal: {currentUserProfile.weeklyGoalKm || 30} km
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Global Live Ticker Bar */}
      <div className="global-stats-row">
        <div className="stat-ticker-card">
          <div className="stat-icon-wrapper volt">
            <Activity size={20} />
          </div>
          <div>
            <span className="stat-title">{t("dashboard.totalDistance", "WORLD RUN DISTANCE")}</span>
            <div className="stat-number font-mono">
              {totalKm.toFixed(1)} <span className="text-sm font-normal text-zinc-400">km</span>
            </div>
          </div>
        </div>

        <div className="stat-ticker-card">
          <div className="stat-icon-wrapper cyan">
            <Zap size={20} />
          </div>
          <div>
            <span className="stat-title">{t("dashboard.avgPace", "GLOBAL AVG PACE")}</span>
            <div className="stat-number font-mono">
              {avgPace} <span className="text-sm font-normal text-zinc-400">/km</span>
            </div>
          </div>
        </div>

        <div className="stat-ticker-card">
          <div className="stat-icon-wrapper orange">
            <Flame size={20} />
          </div>
          <div>
            <span className="stat-title">{t("dashboard.totalRuns", "ENERGY EXPENDED")}</span>
            <div className="stat-number font-mono">
              {totalCalories.toLocaleString()} <span className="text-sm font-normal text-zinc-400">kcal</span>
            </div>
          </div>
        </div>

        <div className="stat-ticker-card">
          <div className="stat-icon-wrapper emerald">
            <Users size={20} />
          </div>
          <div>
            <span className="stat-title">{t("runners.title", "REGISTERED RUNNERS")}</span>
            <div className="stat-number font-mono">
              {topRunners.length} <span className="text-sm font-normal text-zinc-400">Athletes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Activities feed on left, Global Leaderboard on right */}
      <div className="dashboard-grid">
        <div className="activities-column">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">{t("dashboard.recentActivities", "Latest Worldwide Activities")}</h2>
              <p className="section-subtitle">Real-time runs logged across global cities</p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="quick-upload-pill"
            >
              <Plus size={14} /> {t("nav.recordRun", "Log Run")}
            </button>
          </div>

          <div className="activities-list">
            {isLoading ? (
              <div className="loading-state">
                <div className="pulse-spinner" />
                <p>{t("common.loading", "Loading activities...")}</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="empty-state-card">
                <Activity size={32} className="text-zinc-500 mb-2" />
                <h4>{t("dashboard.noRuns", "No activities logged yet")}</h4>
                <p>Log your first run to kick off your running journal!</p>
              </div>
            ) : (
              activities.map((activity, idx) => (
                <RunCard key={activity.ItemId || idx} activity={activity} />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar: Leaderboard & Hotspots */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-card">
            <div className="card-header-flex">
              <Trophy size={16} className="text-amber-400" />
              <h3>Global Distance Leaders</h3>
            </div>

            <div className="leaderboard-preview-list">
              {topRunners.map((runner, rank) => (
                <div key={runner.userId} className="leaderboard-item">
                  <span className={`rank-badge ${rank === 0 ? "first" : rank === 1 ? "second" : rank === 2 ? "third" : ""}`}>
                    #{rank + 1}
                  </span>

                  <div className="avatar-wrapper sm">
                    {runner.avatarUrl ? (
                      <img src={runner.avatarUrl} alt={runner.displayName} className="runner-avatar sm" />
                    ) : (
                      <div className="avatar-fallback sm">{runner.displayName?.charAt(0) || "R"}</div>
                    )}
                    <span className="country-badge-float sm" title={runner.country}>
                      {getCountryFlag(runner.country)}
                    </span>
                  </div>

                  <div className="runner-info flex-1 min-w-0">
                    <span className="runner-name truncate block">{runner.displayName}</span>
                    <span className="runner-shoe truncate block text-xs text-zinc-400">
                      👟 {runner.favoriteRunningShoe || "Carbon Racers"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-volt-400">
                      {runner.totalDistanceKm?.toFixed(0)} km
                    </span>
                    <span className="text-xs text-zinc-500 block">
                      {runner.totalRuns} runs
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate("/runners")}
              className="view-all-link"
            >
              View Full World Directory →
            </button>
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
