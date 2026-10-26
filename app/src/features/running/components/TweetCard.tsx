import { useState } from "react";
import { Flame, Heart, MapPin, MessageCircle, Repeat2, Share2 } from "lucide-react";
import type { CommunityPostData } from "../types";

export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    Kenya: "🇰🇪",
    Japan: "🇯🇵",
    Switzerland: "🇨🇭",
    "United States": "🇺🇸",
    USA: "🇺🇸",
    Germany: "🇩🇪",
    "United Kingdom": "🇬🇧",
    UK: "🇬🇧",
    Ethiopia: "🇪🇹",
    France: "🇫🇷",
    Australia: "🇦🇺",
    Bangladesh: "🇧🇩",
    Spain: "🇪🇸",
    Italy: "🇮🇹",
    Canada: "🇨🇦",
    Norway: "🇳🇴",
    Sweden: "🇸🇪",
    Brazil: "🇧🇷"
  };
  return flags[country] || "🌐";
}

function timeAgo(dateString?: string): string {
  if (!dateString) return "just now";
  const now = new Date().getTime();
  const past = new Date(dateString).getTime();
  const diffMinutes = Math.floor((now - past) / (1000 * 60));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function TweetCard({ post }: { post: CommunityPostData }) {
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [retweets, setRetweets] = useState(post.retweetsCount || 0);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<string[]>([]);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleRetweet = () => {
    if (isRetweeted) {
      setRetweets((prev) => prev - 1);
      setIsRetweeted(false);
    } else {
      setRetweets((prev) => prev + 1);
      setIsRetweeted(true);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplies((prev) => [...prev, replyText.trim()]);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <article className="tweet-card">
      <div className="tweet-header">
        <div className="avatar-wrapper">
          {post.userAvatar ? (
            <img src={post.userAvatar} alt={post.displayName} className="runner-avatar" />
          ) : (
            <div className="avatar-fallback">{post.displayName?.charAt(0) || "R"}</div>
          )}
          <span className="country-badge-float" title={post.country}>
            {getCountryFlag(post.country)}
          </span>
        </div>

        <div className="tweet-author-meta">
          <div className="author-name-row">
            <span className="display-name">{post.displayName}</span>
            <span className="username">@{post.username}</span>
            <span className="dot-separator">•</span>
            <span className="tweet-time">{timeAgo(post.CreatedDate)}</span>
          </div>
          <div className="location-tag">
            <MapPin size={12} className="text-emerald-400" />
            <span>
              {post.city}, {post.country}
            </span>
          </div>
        </div>
      </div>

      <div className="tweet-body">
        <p className="tweet-text">{post.content}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="tweet-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.activitySummary && (
          <div className="run-stat-badge">
            <div className="badge-icon-col">
              <Flame size={18} className="text-orange-400 animate-pulse" />
            </div>
            <div className="badge-content">
              <span className="badge-title">Verified Run Stats</span>
              <span className="badge-metrics">{post.activitySummary}</span>
            </div>
          </div>
        )}

        {post.mediaUrl && (
          <div className="tweet-media-box">
            <img src={post.mediaUrl} alt="Run media" className="tweet-media-img" />
          </div>
        )}
      </div>

      <div className="tweet-actions">
        <button
          type="button"
          onClick={() => setShowReplyBox((v) => !v)}
          className="action-btn comment-btn"
          aria-label="Reply"
        >
          <MessageCircle size={16} />
          <span>{replies.length > 0 ? replies.length : ""}</span>
        </button>

        <button
          type="button"
          onClick={handleRetweet}
          className={`action-btn retweet-btn ${isRetweeted ? "active" : ""}`}
          aria-label="Repost"
        >
          <Repeat2 size={16} />
          <span>{retweets > 0 ? retweets : ""}</span>
        </button>

        <button
          type="button"
          onClick={handleLike}
          className={`action-btn like-btn ${isLiked ? "active text-rose-500" : ""}`}
          aria-label="Kudos"
        >
          <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          <span>{likes > 0 ? likes : ""}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
          }}
          className="action-btn share-btn"
          aria-label="Share"
        >
          <Share2 size={16} />
        </button>
      </div>

      {showReplyBox && (
        <form onSubmit={handleSendReply} className="reply-form">
          <input
            type="text"
            placeholder="Send kudos or a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="reply-input"
          />
          <button type="submit" className="reply-submit-btn">
            Reply
          </button>
        </form>
      )}

      {replies.length > 0 && (
        <div className="replies-list">
          {replies.map((reply, i) => (
            <div key={i} className="reply-item">
              <span className="reply-author">You:</span> {reply}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
