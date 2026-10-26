import { useState, useId } from "react";
import { Compass, Footprints, Globe2, Sparkles, Trophy, User } from "lucide-react";
import { saveUserProfile } from "../runningApi";
import type { UserProfileData } from "../types";

const COUNTRIES = [
  "Kenya",
  "Japan",
  "Switzerland",
  "United States",
  "Germany",
  "United Kingdom",
  "Ethiopia",
  "France",
  "Australia",
  "Bangladesh",
  "Spain",
  "Italy",
  "Canada",
  "Norway",
  "Sweden",
  "Brazil"
];

const SHOE_RECOMMENDATIONS = [
  "Nike Vaporfly 3",
  "Nike Alphafly 3",
  "Asics Novablast 4",
  "Asics Metaspeed Sky Paris",
  "Saucony Endorphin Pro 4",
  "Hoka Clifton 9",
  "Hoka Mach 6",
  "On Cloudmonster 2",
  "Adidas Adizero Adios Pro 3",
  "Brooks Ghost 16"
];

export function OnboardingModal({
  isOpen,
  userId,
  initialEmail,
  initialName,
  onComplete
}: {
  isOpen: boolean;
  userId: string;
  initialEmail?: string;
  initialName?: string;
  onComplete: (profile: UserProfileData) => void;
}) {
  const [username, setUsername] = useState(() => (initialEmail ? initialEmail.split("@")[0] : "runner"));
  const [displayName, setDisplayName] = useState(() => initialName || "Global Runner");
  const [country, setCountry] = useState("Switzerland");
  const [city, setCity] = useState("Zurich");
  const [bio, setBio] = useState("Chasing personal records and exploring trails around the world! 🏃✨");
  const [favoriteRunningShoe, setFavoriteRunningShoe] = useState("Nike Vaporfly 3");
  const [weeklyGoalKm, setWeeklyGoalKm] = useState(40);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form input unique IDs
  const avatarInputId = useId();
  const handleInputId = useId();
  const nameInputId = useId();
  const countrySelectId = useId();
  const cityInputId = useId();
  const shoeSelectId = useId();
  const goalInputId = useId();
  const bioTextareaId = useId();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = (username || "").trim();
    const cleanDisplayName = (displayName || "").trim();
    if (!cleanUsername || !cleanDisplayName || isSaving) return;

    setIsSaving(true);
    try {
      const saved = await saveUserProfile({
        userId,
        username: cleanUsername.replace(/^@/, ""),
        displayName: cleanDisplayName,
        country,
        city: city.trim(),
        bio: bio.trim(),
        favoriteRunningShoe,
        weeklyGoalKm: Number(weeklyGoalKm) || 30,
        avatarUrl,
        totalDistanceKm: 0,
        totalRuns: 0,
        totalDurationMinutes: 0
      });

      onComplete(saved);
    } catch (err) {
      console.error("Failed to complete runner onboarding:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container onboarding-container">
        <div className="onboarding-banner">
          <div className="onboarding-badge">
            <Sparkles size={16} className="text-volt-400" />
            <span>Welcome to PulseRun</span>
          </div>
          <h2 className="onboarding-heading">Set Up Your Global Runner Profile</h2>
          <p className="onboarding-desc">
            Connect with runners across 120+ countries, broadcast your workouts, and track your global milestones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="avatar-pick-section">
            <img src={avatarUrl} alt="Preview" className="onboarding-avatar-preview" />
            <div className="flex-1">
              <label htmlFor={avatarInputId} className="input-label flex items-center gap-1">
                <User size={13} /> Avatar Photo URL
              </label>
              <input
                id={avatarInputId}
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="text-input text-xs"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={handleInputId} className="input-label">Runner Handle</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-400 text-sm">@</span>
                <input
                  id={handleInputId}
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-input pl-7"
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor={nameInputId} className="input-label">Full Display Name</label>
              <input
                id={nameInputId}
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={countrySelectId} className="input-label flex items-center gap-1">
                <Globe2 size={13} className="text-emerald-400" /> Country
              </label>
              <select
                id={countrySelectId}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="text-input select"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor={cityInputId} className="input-label flex items-center gap-1">
                <Compass size={13} className="text-cyan-400" /> City
              </label>
              <input
                id={cityInputId}
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Zurich, Tokyo, New York"
                className="text-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={shoeSelectId} className="input-label flex items-center gap-1">
                <Footprints size={13} className="text-volt-400" /> Primary Running Shoe
              </label>
              <select
                id={shoeSelectId}
                value={favoriteRunningShoe}
                onChange={(e) => setFavoriteRunningShoe(e.target.value)}
                className="text-input select"
              >
                {SHOE_RECOMMENDATIONS.map((shoe) => (
                  <option key={shoe} value={shoe}>
                    {shoe}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor={goalInputId} className="input-label flex items-center gap-1">
                <Trophy size={13} className="text-amber-400" /> Weekly Goal (km)
              </label>
              <input
                id={goalInputId}
                type="number"
                min="5"
                max="250"
                value={weeklyGoalKm}
                onChange={(e) => setWeeklyGoalKm(parseInt(e.target.value, 10) || 30)}
                className="text-input font-mono"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={bioTextareaId} className="input-label">Runner Bio</label>
            <textarea
              id={bioTextareaId}
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What drives your running? Races you are preparing for..."
              className="text-input"
            />
          </div>

          <div className="modal-actions mt-4">
            <button type="submit" disabled={isSaving} className="submit-run-btn w-full justify-center py-3">
              {isSaving ? "Setting Up Profile..." : "Start Running Now 🏃💨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
