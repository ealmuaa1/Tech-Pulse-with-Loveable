import React, { useState, useEffect } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getReliableImageUrl,
  getSafeImageUrl,
  handleImageError,
} from "@/lib/imageService";

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
  isAlwaysExpanded?: boolean;
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
  isAlwaysExpanded = false,
}) => {
  const [cardImageUrl, setCardImageUrl] = useState("/placeholder.svg");
  const navigate = useNavigate();

  // Debug logging for SummaryPage
  useEffect(() => {
    if (isAlwaysExpanded) {
      console.log("NewsCard (SummaryPage) props:", {
        title,
        hasUrl: !!url,
        url,
        hasSummary: !!summary,
        hasTakeaways: takeaways.length > 0,
      });
    }
  }, [isAlwaysExpanded, title, url, summary, takeaways]);

  // Fetch image for the topic
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const reliableUrl = await getReliableImageUrl(topic || title);
        setCardImageUrl(reliableUrl);
      } catch (error) {
        console.warn("Failed to fetch image for:", topic || title, error);
      }
    };
    fetchImage();
  }, [topic, title]);

  const handleReadSummary = () => {
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

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden group">
        <img
          src={getSafeImageUrl(imageUrl || cardImageUrl, "/placeholder.svg")}
          alt={title}
          onError={(e) => handleImageError(e, "/placeholder.svg")}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        {/* Hover-only Read News Summary Button */}
        {id && (summary || takeaways.length > 0) && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleReadSummary}
              className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 border-none shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 font-medium text-sm transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4" />
              Read News Summary
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Topic Tag */}
        <div className="mb-3">
          <span className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-md">
            {topic}
          </span>
        </div>

        {/* Always Show Summary Content for SummaryPage */}
        {isAlwaysExpanded && (summary || takeaways.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Summary */}
            {summary && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Summary
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* Key Takeaways */}
            {takeaways.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Key Takeaways
                </h4>
                <ul className="space-y-1">
                  {takeaways.slice(0, 3).map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-indigo-500 dark:text-indigo-400 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Read More Link */}
            {url && (
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-800 font-semibold underline"
                >
                  🔗 Read the full article
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
