import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReliableImageUrl,
  getSafeImageUrl,
  handleImageError,
} from "@/lib/imageService";
import { ensureExcerpt } from "@/utils/text";

interface NewsCardProps {
  id?: string;
  title: string;
  topic: string;
  source: string;
  summary?: string;
  takeaways?: string[];
  imageUrl?: string;
  url?: string;
  publishedAt?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  topic,
  source,
  summary,
  takeaways = [],
  imageUrl,
  url,
  publishedAt,
}) => {
  const [cardImageUrl, setCardImageUrl] = useState("/placeholder.svg");
  const navigate = useNavigate();

  // Fetch image for the topic
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const searchQuery = topic || title;
        const reliableUrl = await getReliableImageUrl(searchQuery);
        setCardImageUrl(reliableUrl);
      } catch (error) {
        console.warn("Failed to fetch image for:", topic || title, error);
      }
    };
    fetchImage();
  }, [topic, title, id]);

  const handleCardClick = () => {
    if (id) {
      navigate(`/summary/${id}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const excerpt = ensureExcerpt(summary, "Quick take: details inside.");

  return (
    <article
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 compact-radius"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={getSafeImageUrl(imageUrl || cardImageUrl, "/placeholder.svg")}
          alt={title}
          onError={(e) => handleImageError(e, "/placeholder.svg")}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Source Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-md backdrop-blur-sm font-medium">
            {source}
          </span>
        </div>

        {/* Date Badge */}
        {publishedAt && (
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {formatDate(publishedAt)}
            </span>
          </div>
        )}

        {/* Enhanced Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center before:absolute before:inset-0 before:bg-gradient-to-t from-black/55 via-black/35 to-transparent before:opacity-90">
          <div className="relative z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <button
              className="rounded-full px-4 py-2 text-sm font-medium text-white
                         backdrop-blur-md bg-white/10 border border-white/20
                         shadow-[0_8px_30px_rgb(0,0,0,0.25)]
                         hover:bg-white/15 active:scale-95 transition"
            >
              Read full summary →
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 compact-pad">
        {/* Topic Tag */}
        <div className="mb-2">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
            {topic}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 compact-text">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
          {excerpt}
        </p>
      </div>
    </article>
  );
};

export default NewsCard;
