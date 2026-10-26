import { useState, useId } from "react";
import { Activity, Check, Flame, Heart, MapPin, Mountain, Sparkles, Timer, X, Zap } from "lucide-react";
import { createRunningActivity } from "../runningApi";
import { useT } from "../../../lib/i18n/LocalizationProvider";
import type { RunningActivityData, UserProfileData } from "../types";

const WORLD_HOTSPOTS = [
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Eldoret", country: "Kenya", lat: 0.5143, lng: 35.2698 },
  { city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "New York", country: "United States", lat: 40.7128, lng: -74.006 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 }
];

export function RunUploadModal({
  isOpen,
  onClose,
  currentUserProfile,
  onActivityCreated
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUserProfile?: UserProfileData | null;
  onActivityCreated: (activity: RunningActivityData) => void;
}) {
  const { t } = useT();
  const [title, setTitle] = useState("Morning River Run");
  const [description, setDescription] = useState("");
  const [distanceKm, setDistanceKm] = useState<number>(10.0);
  const [durationMinutes, setDurationMinutes] = useState<number>(48);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [heartRate, setHeartRate] = useState<number>(155);
  const [elevationGain, setElevationGain] = useState<number>(65);
  const [selectedHotspot, setSelectedHotspot] = useState(0);
  const [weather, setWeather] = useState("18°C Mild & Clear");
  const [imageUrl, setImageUrl] = useState("");
  const [shareToFeed, setShareToFeed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form input unique IDs
  const titleInputId = useId();
  const locationSelectId = useId();
  const distanceInputId = useId();
  const durationMinInputId = useId();
  const durationSecInputId = useId();
  const elevationInputId = useId();
  const heartRateInputId = useId();
  const weatherInputId = useId();
  const notesTextareaId = useId();
  const photoInputId = useId();

  if (!isOpen) return null;

  // Auto-calculated pace
  const totalMinutes = durationMinutes + durationSeconds / 60;
  const paceDec = distanceKm > 0 ? totalMinutes / distanceKm : 0;
  const paceMin = Math.floor(paceDec);
  const paceSec = Math.round((paceDec - paceMin) * 60);
  const formattedPace = `${paceMin}:${paceSec < 10 ? "0" : ""}${paceSec}`;
  const estimatedCalories = Math.round(distanceKm * 68);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (distanceKm <= 0 || totalMinutes <= 0 || isSubmitting) return;

    setIsSubmitting(true);
    const location = WORLD_HOTSPOTS[selectedHotspot] || {
      city: currentUserProfile?.city || "Global",
      country: currentUserProfile?.country || "Worldwide",
      lat: 0,
      lng: 0
    };

    try {
      const created = await createRunningActivity(
        {
          userId: currentUserProfile?.userId || "runner-guest",
          username: currentUserProfile?.username || "global_runner",
          userAvatar:
            currentUserProfile?.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          title: title.trim() || "Running Activity",
          description: description.trim(),
          distanceKm: Number(distanceKm),
          durationMinutes: Number(totalMinutes.toFixed(2)),
          paceMinPerKm: formattedPace,
          caloriesBurned: estimatedCalories,
          heartRateAvg: Number(heartRate),
          elevationGainM: Number(elevationGain),
          routeCity: location.city,
          routeCountry: location.country,
          latitude: location.lat,
          longitude: location.lng,
          activityDate: new Date().toISOString().split("T")[0] ?? "",
          weather,
          imageUrl: imageUrl.trim() || undefined,
          likesCount: 1
        },
        shareToFeed
      );

      onActivityCreated(created);
      onClose();
    } catch (err) {
      console.error("Failed to upload activity:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-volt-500/10 text-volt-400">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="modal-title">{t("modal.recordRun", "Upload Global Running Stats")}</h3>
              <p className="modal-subtitle">Log your run and broadcast to worldwide runners</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Realtime Pace Preview Banner */}
          <div className="pace-preview-banner">
            <div className="pace-col">
              <span className="pace-banner-label flex items-center gap-1">
                <Zap size={13} className="text-volt-400" /> CALCULATED PACE
              </span>
              <span className="pace-banner-value font-mono">
                {formattedPace} <span className="text-sm font-normal text-zinc-400">/km</span>
              </span>
            </div>
            <div className="pace-col">
              <span className="pace-banner-label flex items-center gap-1">
                <Flame size={13} className="text-orange-400" /> EST. ENERGY
              </span>
              <span className="pace-banner-value font-mono">
                {estimatedCalories} <span className="text-sm font-normal text-zinc-400">kcal</span>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={titleInputId} className="input-label">Run Title</label>
            <input
              id={titleInputId}
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunrise Tempo Interval, Autumn Half Marathon Prep"
              className="text-input"
            />
          </div>

          {/* Worldwide Location Selector */}
          <div className="form-group">
            <label htmlFor={locationSelectId} className="input-label flex items-center gap-1">
              <MapPin size={14} className="text-emerald-400" /> World Running Location
            </label>
            <select
              id={locationSelectId}
              value={selectedHotspot}
              onChange={(e) => setSelectedHotspot(Number(e.target.value))}
              className="text-input select"
            >
              {WORLD_HOTSPOTS.map((spot, i) => (
                <option key={spot.city} value={i}>
                  {spot.city}, {spot.country}
                </option>
              ))}
            </select>
          </div>

          {/* Distance and Duration Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={distanceInputId} className="input-label">Distance (km)</label>
              <input
                id={distanceInputId}
                type="number"
                step="0.01"
                min="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="text-input font-mono"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor={durationMinInputId} className="input-label flex items-center gap-1">
                <Timer size={14} /> Duration (min & sec)
              </label>
              <div className="flex gap-2">
                <input
                  id={durationMinInputId}
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
                  className="text-input font-mono flex-1"
                />
                <input
                  id={durationSecInputId}
                  type="number"
                  min="0"
                  max="59"
                  placeholder="Sec"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(parseInt(e.target.value, 10) || 0)}
                  className="text-input font-mono w-20"
                />
              </div>
            </div>
          </div>

          {/* Telemetry Row */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={elevationInputId} className="input-label flex items-center gap-1">
                <Mountain size={14} /> Elevation Gain (m)
              </label>
              <input
                id={elevationInputId}
                type="number"
                min="0"
                value={elevationGain}
                onChange={(e) => setElevationGain(parseInt(e.target.value, 10) || 0)}
                className="text-input font-mono"
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor={heartRateInputId} className="input-label flex items-center gap-1">
                <Heart size={14} /> Avg Heart Rate (bpm)
              </label>
              <input
                id={heartRateInputId}
                type="number"
                min="60"
                max="220"
                value={heartRate}
                onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 0)}
                className="text-input font-mono"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={weatherInputId} className="input-label">Weather Conditions</label>
            <input
              id={weatherInputId}
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              placeholder="e.g. 15°C Crisp Morning, Light Rain, Sunny"
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor={notesTextareaId} className="input-label">Notes & Feeling</label>
            <textarea
              id={notesTextareaId}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Felt strong on negative split, tested carbon shoes..."
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor={photoInputId} className="input-label">Photo / Route Map Image URL (optional)</label>
            <input
              id={photoInputId}
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="text-input"
            />
          </div>

          {/* Share to Explore toggle */}
          <div
            className="share-toggle-row"
            onClick={() => setShareToFeed((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") setShareToFeed((v) => !v);
            }}
          >
            <div className={`checkbox-custom ${shareToFeed ? "checked" : ""}`}>
              {shareToFeed && <Check size={13} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-sm font-medium text-white">
                <Sparkles size={14} className="text-volt-400" />
                <span>Broadcast to Worldwide Running Tweets Feed</span>
              </div>
              <span className="text-xs text-zinc-400">
                Share this activity automatically so runners across the globe see it
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              {t("common.cancel", "Cancel")}
            </button>
            <button type="submit" disabled={isSubmitting} className="submit-run-btn">
              {isSubmitting ? t("common.loading", "Uploading...") : t("modal.save", "Upload & Save Run")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
