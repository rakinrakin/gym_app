import { useState, useEffect } from "react";
import {
  Activity,
  Award,
  Check,
  Clock,
  Compass,
  Edit3,
  Flame,
  Footprints,
  Globe2,
  Mail,
  MapPin,
  Mountain,
  RefreshCw,
  Save,
  ShieldCheck,
  Timer,
  Trophy,
  UserRound,
  Zap
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { blocksConfig } from "../../lib/blocks/config";
import { useT } from "../../lib/i18n/LocalizationProvider";
import { ActionButton } from "../../shared/ui/ActionButton";
import { ChipList } from "../../shared/ui/Chip";
import { PageHeader } from "../../shared/ui/PageHeader";
import { Skeleton } from "../../shared/ui/Skeleton";
import { StatusPill } from "../../shared/ui/StatusPill";
import { useCurrentUser, userDisplayName, userInitials } from "./useCurrentUser";
import { fetchRunningActivities, fetchUserProfile, saveUserProfile } from "../running/runningApi";
import { RunCard } from "../running/components/RunCard";
import { getCountryFlag } from "../running/components/TweetCard";
import type { RunningActivityData, UserProfileData } from "../running/types";

export function ProfilePage() {
  const me = useCurrentUser();
  const { claims } = useAuth();
  const { t } = useT();
  const iamUser = me.data?.data;
  const name = userDisplayName(iamUser);
  const issuedAt = typeof claims?.iat === "number" ? new Date((claims.iat as number) * 1000) : undefined;
  const expiresAt = typeof claims?.exp === "number" ? new Date((claims.exp as number) * 1000) : undefined;

  const [runnerProfile, setRunnerProfile] = useState<UserProfileData | null>(null);
  const [myActivities, setMyActivities] = useState<RunningActivityData[]>([]);
  const [activeTab, setActiveTab] = useState<"runs" | "edit" | "iam">("runs");

  // Edit profile state
  const [editBio, setEditBio] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("Switzerland");
  const [editShoe, setEditShoe] = useState("Nike Vaporfly 3");
  const [editGoal, setEditGoal] = useState(40);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (iamUser?.itemId) {
      fetchUserProfile(iamUser.itemId).then((p) => {
        if (p) {
          setRunnerProfile(p);
          setEditBio(p.bio || "");
          setEditCity(p.city || "");
          setEditCountry(p.country || "Switzerland");
          setEditShoe(p.favoriteRunningShoe || "Nike Vaporfly 3");
          setEditGoal(p.weeklyGoalKm || 40);
        } else {
          const defaultUserId = iamUser.itemId || "runner-me";
          const defaultUsername = (iamUser.email ? iamUser.email.split("@")[0] : undefined) || "runner";
          const defaultAvatar = typeof iamUser.profileImageUrl === "string" && iamUser.profileImageUrl
            ? iamUser.profileImageUrl
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";

          // Initialize default runner profile
          const defaultProfile: UserProfileData = {
            userId: defaultUserId,
            username: defaultUsername,
            displayName: name || "Runner",
            bio: "Passionate road & trail runner tracking personal bests around the globe! 🏃✨",
            country: "Switzerland",
            city: "Zurich",
            favoriteRunningShoe: "Nike Vaporfly 3",
            weeklyGoalKm: 40,
            avatarUrl: defaultAvatar,
            totalDistanceKm: 0,
            totalRuns: 0,
            totalDurationMinutes: 0
          };
          setRunnerProfile(defaultProfile);
          setEditBio(defaultProfile.bio || "");
          setEditCity(defaultProfile.city);
          setEditCountry(defaultProfile.country);
          setEditShoe(defaultProfile.favoriteRunningShoe || "");
          setEditGoal(defaultProfile.weeklyGoalKm);
        }
      });

      fetchRunningActivities(iamUser.itemId).then((acts) => {
        setMyActivities(acts);
      });
    }
  }, [iamUser?.itemId, name, iamUser?.email, iamUser?.profileImageUrl]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iamUser?.itemId || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const fallbackUserId = iamUser.itemId;
      const fallbackUsername = (iamUser.email ? iamUser.email.split("@")[0] : undefined) || "runner";

      const updated: UserProfileData = {
        userId: runnerProfile?.userId || fallbackUserId,
        username: runnerProfile?.username || fallbackUsername,
        displayName: runnerProfile?.displayName || (name || "Runner"),
        totalDistanceKm: runnerProfile?.totalDistanceKm || 0,
        totalRuns: runnerProfile?.totalRuns || 0,
        totalDurationMinutes: runnerProfile?.totalDurationMinutes || 0,
        weeklyGoalKm: Number(editGoal) || 30,
        avatarUrl: runnerProfile?.avatarUrl,
        coverUrl: runnerProfile?.coverUrl,
        ItemId: runnerProfile?.ItemId,
        bio: editBio.trim(),
        city: editCity.trim(),
        country: editCountry,
        favoriteRunningShoe: editShoe.trim()
      };

      const res = await saveUserProfile(updated);
      setRunnerProfile(res);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save runner profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const totalKm = runnerProfile?.totalDistanceKm || 0;
  const totalRuns = runnerProfile?.totalRuns || 0;
  const weeklyGoal = runnerProfile?.weeklyGoalKm || 30;
  const progressPercent = Math.min(100, Math.round((totalKm / weeklyGoal) * 100));

  return (
    <section className="profile-page-container">
      <PageHeader
        title="Runner Profile"
        subtitle="Manage your athlete persona, running records, and account"
        actions={
          <ActionButton
            variant="icon"
            onClick={() => me.refetch()}
            title="Refresh profile"
            icon={<RefreshCw size={18} />}
          />
        }
      />

      {/* Hero Profile Banner */}
      <div className="runner-profile-hero">
        <div className="hero-cover-backdrop">
          {runnerProfile?.coverUrl && (
            <img src={runnerProfile.coverUrl} alt="Cover" className="cover-img" />
          )}
        </div>

        <div className="profile-identity-bar">
          <div className="identity-avatar-wrap">
            {runnerProfile?.avatarUrl ? (
              <img src={runnerProfile.avatarUrl} alt={name} className="profile-hero-avatar" />
            ) : (
              <span className="profile-avatar-fallback">{userInitials(iamUser)}</span>
            )}
            <span className="hero-flag-badge" title={runnerProfile?.country}>
              {getCountryFlag(runnerProfile?.country || "Switzerland")}
            </span>
          </div>

          <div className="identity-text-col flex-1">
            <div className="flex items-center gap-2">
              <h2 className="profile-name-text">{name || "Runner"}</h2>
              <StatusPill tone={me.isSuccess ? "good" : "warn"}>
                {me.isSuccess ? "Verified Athlete" : "Session Offline"}
              </StatusPill>
            </div>
            <span className="profile-handle text-zinc-400">@{runnerProfile?.username || "runner"}</span>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <MapPin size={12} /> {runnerProfile?.city || "Zurich"}, {runnerProfile?.country || "Switzerland"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Mail size={12} /> {iamUser?.email || "No email"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className="edit-profile-btn"
          >
            <Edit3 size={15} /> Edit Profile
          </button>
        </div>

        {runnerProfile?.bio && <p className="profile-bio-text">{runnerProfile.bio}</p>}

        {/* Athletic Performance Metrics Grid */}
        <div className="runner-metrics-bar">
          <div className="metric-cell">
            <span className="metric-header-title">TOTAL DISTANCE</span>
            <span className="metric-big-num font-mono text-volt-400">
              {totalKm.toFixed(1)} <span className="metric-sub">km</span>
            </span>
          </div>

          <div className="metric-cell">
            <span className="metric-header-title">RUNS LOGGED</span>
            <span className="metric-big-num font-mono text-cyan-400">{totalRuns}</span>
          </div>

          <div className="metric-cell">
            <span className="metric-header-title">WEEKLY PROGRESS</span>
            <span className="metric-big-num font-mono text-orange-400">
              {progressPercent}%
            </span>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-orange-500 h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="metric-cell">
            <span className="metric-header-title">PRIMARY SHOE</span>
            <span className="metric-shoe-name flex items-center gap-1 font-medium truncate">
              <Footprints size={14} className="text-zinc-400" />
              {runnerProfile?.favoriteRunningShoe || "None set"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs-nav">
        <button
          type="button"
          onClick={() => setActiveTab("runs")}
          className={`tab-btn ${activeTab === "runs" ? "active" : ""}`}
        >
          <Activity size={16} /> My Runs ({myActivities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
        >
          <Edit3 size={16} /> Edit Athlete Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("iam")}
          className={`tab-btn ${activeTab === "iam" ? "active" : ""}`}
        >
          <ShieldCheck size={16} /> Blocks IAM Security
        </button>
      </div>

      {/* Tab Content: My Runs */}
      {activeTab === "runs" && (
        <div className="tab-pane">
          {myActivities.length === 0 ? (
            <div className="empty-state-card">
              <Activity size={32} className="text-zinc-500 mb-2" />
              <h4>No personal runs recorded yet</h4>
              <p>Upload your first run from the Dashboard or Explore feed to see it here!</p>
            </div>
          ) : (
            <div className="activities-list">
              {myActivities.map((act, i) => (
                <RunCard key={act.ItemId || i} activity={act} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Edit Profile */}
      {activeTab === "edit" && (
        <div className="tab-pane">
          <form onSubmit={handleSaveProfile} className="edit-profile-card">
            <h3 className="section-title mb-4">Edit Athlete Information</h3>

            {saveSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <Check size={16} /> Profile updated successfully on SELISE Blocks!
              </div>
            )}

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="input-label">Home Country</label>
                <input
                  type="text"
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-group flex-1">
                <label className="input-label">Home City</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="input-label flex items-center gap-1">
                  <Footprints size={14} /> Favorite Running Shoes
                </label>
                <input
                  type="text"
                  value={editShoe}
                  onChange={(e) => setEditShoe(e.target.value)}
                  className="text-input"
                  placeholder="e.g. Nike Alphafly 3, Asics Novablast"
                />
              </div>

              <div className="form-group flex-1">
                <label className="input-label flex items-center gap-1">
                  <Trophy size={14} /> Weekly Distance Target (km)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={editGoal}
                  onChange={(e) => setEditGoal(parseInt(e.target.value, 10) || 30)}
                  className="text-input font-mono"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Runner Bio</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="text-input"
                placeholder="Share your running journey, targets, and favorite routes..."
              />
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" disabled={isSaving} className="submit-run-btn px-6 py-2.5">
                <Save size={16} />
                <span>{isSaving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content: SELISE Blocks IAM Identity */}
      {activeTab === "iam" && (
        <div className="tab-pane">
          <div className="grid">
            <DetailCard icon={<UserRound size={16} />} label="User ID" loading={me.isLoading} value={iamUser?.itemId} />
            <DetailCard icon={<ShieldCheck size={16} />} label="Tenant ID (x-blocks-key)" value={blocksConfig.xBlocksKey} />
            <DetailCard icon={<Clock size={16} />} label="Session Expires" value={expiresAt?.toLocaleString()} />
          </div>

          <div className="panel mt-4">
            <div className="panel-title">
              <ShieldCheck size={16} />
              <span>Assigned IAM Roles</span>
            </div>
            {me.isLoading ? (
              <Skeleton className="skeleton-line" />
            ) : (
              <ChipList empty="No roles assigned" items={iamUser?.roles} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function DetailCard({
  icon,
  label,
  loading,
  value
}: {
  icon: React.ReactNode;
  label: string;
  loading?: boolean;
  value?: string;
}) {
  return (
    <div className="detail-card">
      <div className="detail-label">
        {icon}
        <span>{label}</span>
      </div>
      {loading ? <Skeleton className="skeleton-line" /> : <div className="detail-value">{value || "—"}</div>}
    </div>
  );
}
