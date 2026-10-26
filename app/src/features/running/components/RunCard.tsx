import { useState } from "react";
import { Calendar, Flame, Heart, MapPin, Mountain, Timer, Zap } from "lucide-react";
import type { RunningActivityData } from "../types";
import { getCountryFlag } from "./TweetCard";

export function RunCard({ activity }: { activity: RunningActivityData }) {
  const [likes, setLikes] = useState(activity.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((v) => v - 1);
      setIsLiked(false);
    } else {
      setLikes((v) => v + 1);
      setIsLiked(true);
    }
  };

  const getPaceCategory = (paceStr: string) => {
    const parts = paceStr.split(":");
    const min = parseInt(parts[0] ?? "5", 10);
    if (isNaN(min)) return { label: "Steady", color: "text-blue-400 border-blue-500/30" };
    if (min < 4) return { label: "⚡ Elite Pace", color: "text-volt-400 border-volt-400/30" };
    if (min < 5) return { label: "🔥 Fast Pace", color: "text-orange-400 border-orange-400/30" };
    if (min < 6) return { label: "🏃 Steady Pace", color: "text-cyan-400 border-cyan-400/30" };
    return { label: "🚶 Easy Pace", color: "text-emerald-400 border-emerald-400/30" };
  };

  const paceInfo = getPaceCategory(activity.paceMinPerKm || "5:00");

  return (
    <div className="run-card">
      <div className="run-card-header">
        <div className="flex items-center gap-3">
          <div className="avatar-wrapper">
            {activity.userAvatar ? (
              <img src={activity.userAvatar} alt={activity.username} className="runner-avatar sm" />
            ) : (
              <div className="avatar-fallback sm">{activity.username?.charAt(0) || "R"}</div>
            )}
            <span className="country-badge-float sm" title={activity.routeCountry}>
              {getCountryFlag(activity.routeCountry)}
            </span>
          </div>

          <div>
            <h4 className="run-title">{activity.title}</h4>
            <div className="run-submeta">
              <span className="text-zinc-400">@{activity.username}</span>
              <span className="dot">•</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <MapPin size={12} className="text-emerald-400" />
                {activity.routeCity}, {activity.routeCountry}
              </span>
            </div>
          </div>
        </div>

        <div className={`pace-pill ${paceInfo.color}`}>{paceInfo.label}</div>
      </div>

      {activity.description && <p className="run-desc">{activity.description}</p>}

      {/* Main Stats Grid */}
      <div className="run-metrics-grid">
        <div className="metric-box primary">
          <span className="metric-label">DISTANCE</span>
          <span className="metric-value font-mono">
            {activity.distanceKm} <span className="metric-unit">km</span>
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label flex items-center gap-1">
            <Timer size={12} /> TIME
          </span>
          <span className="metric-value font-mono">
            {Math.floor(activity.durationMinutes)}m {Math.round((activity.durationMinutes % 1) * 60)}s
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label flex items-center gap-1">
            <Zap size={12} /> AVG PACE
          </span>
          <span className="metric-value font-mono">
            {activity.paceMinPerKm} <span className="metric-unit">/km</span>
          </span>
        </div>

        <div className="metric-box">
          <span className="metric-label flex items-center gap-1">
            <Flame size={12} /> CALORIES
          </span>
          <span className="metric-value font-mono">
            {activity.caloriesBurned} <span className="metric-unit">kcal</span>
          </span>
        </div>
      </div>

      {/* Secondary Telemetry */}
      <div className="run-telemetry-row">
        {activity.elevationGainM > 0 && (
          <span className="telemetry-pill">
            <Mountain size={13} className="text-amber-400" />
            <span>+{activity.elevationGainM}m elevation</span>
          </span>
        )}

        {activity.heartRateAvg > 0 && (
          <span className="telemetry-pill">
            <Heart size={13} className="text-rose-400" />
            <span>{activity.heartRateAvg} bpm</span>
          </span>
        )}

        {activity.weather && (
          <span className="telemetry-pill">
            <span>{activity.weather}</span>
          </span>
        )}

        {activity.activityDate && (
          <span className="telemetry-pill ml-auto">
            <Calendar size={13} className="text-zinc-500" />
            <span>{activity.activityDate}</span>
          </span>
        )}
      </div>

      {activity.imageUrl && (
        <div className="run-image-box">
          <img src={activity.imageUrl} alt={activity.title} className="run-img" />
        </div>
      )}

      <div className="run-footer">
        <button
          type="button"
          onClick={handleLike}
          className={`kudos-btn ${isLiked ? "active" : ""}`}
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          <span>{likes} Kudos</span>
        </button>
      </div>
    </div>
  );
}
