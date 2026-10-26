import { useState } from "react";
import { Globe2, Hash, Send, Sparkles } from "lucide-react";
import { createCommunityPost } from "../runningApi";
import type { CommunityPostData, UserProfileData } from "../types";

export function TweetComposer({
  currentUserProfile,
  onPostCreated
}: {
  currentUserProfile?: UserProfileData | null;
  onPostCreated: (post: CommunityPostData) => void;
}) {
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const POPULAR_TAGS = [
    "MarathonTraining",
    "MorningMiles",
    "TrailRunning",
    "Speedwork",
    "HalfMarathon",
    "5kPersonalBest",
    "RecoveryRun"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const tags = selectedTag ? [selectedTag] : [];
    // Extract any #hashtags in the content text
    const matches = content.match(/#[a-zA-Z0-9_]+/g);
    if (matches) {
      matches.forEach((m) => tags.push(m.slice(1)));
    }

    try {
      const newPost = await createCommunityPost({
        userId: currentUserProfile?.userId || "guest-runner",
        username: currentUserProfile?.username || "global_runner",
        displayName: currentUserProfile?.displayName || "Global Runner",
        userAvatar:
          currentUserProfile?.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        country: currentUserProfile?.country || "Worldwide",
        city: currentUserProfile?.city || "Global",
        content: content.trim(),
        likesCount: 0,
        retweetsCount: 0,
        tags: Array.from(new Set(tags)),
        postType: "tweet"
      });

      onPostCreated(newPost);
      setContent("");
      setSelectedTag("");
    } catch (err) {
      console.error("Failed to publish tweet:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tweet-composer-card">
      <div className="composer-header">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-volt-400" />
          <span className="composer-title">Share Your Running Story</span>
        </div>
        <div className="location-pill">
          <Globe2 size={13} />
          <span>
            {currentUserProfile?.city || "Global"}, {currentUserProfile?.country || "Worldwide"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="composer-form">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How did your run go today? Share your pace, thoughts, or morning scenery with runners worldwide..."
          className="composer-textarea"
          maxLength={280}
        />

        <div className="composer-tag-row">
          <span className="tag-label">
            <Hash size={13} /> Trending:
          </span>
          <div className="tag-chips">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag((prev) => (prev === tag ? "" : tag))}
                className={`tag-chip-btn ${selectedTag === tag ? "active" : ""}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        <div className="composer-footer">
          <span className="char-counter">{280 - content.length} left</span>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="composer-submit-btn"
          >
            <Send size={15} />
            <span>{isSubmitting ? "Posting..." : "Tweet Worldwide"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
