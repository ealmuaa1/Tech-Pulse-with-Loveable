import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Play,
  Gamepad2,
} from "lucide-react";

interface TopicCardProps {
  title: string;
  imageUrl: string;
  summary: string;
  slug: string;
  source: string;
  category?: string;
  difficulty?: string;
  lessonCount?: number;
  gameCount?: number;
  estimatedTime?: string;
  participants?: number;
  trendingScore?: number;
  fallbackImage?: string;
}

const fallbackImages: Record<string, string> = {
  cybersecurity: "/fallbacks/cybersecurity.png",
  "data science": "/fallbacks/data-science.png",
  "machine learning": "/fallbacks/machine-learning.png",
  programming: "/fallbacks/programming.png",
  blockchain: "/fallbacks/blockchain.png",
  "quantum computing": "/fallbacks/quantum.png",
  default: "/placeholder.svg",
};

function getFallbackImage(category: string | undefined) {
  if (!category) return fallbackImages.default;
  const key = category.toLowerCase();
  return fallbackImages[key] || fallbackImages.default;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  imageUrl,
  summary,
  slug,
  source,
  category = "Tech",
  difficulty = "Beginner",
  lessonCount = Math.floor(Math.random() * 8) + 5, // Auto-generated 5-12 lessons
  gameCount = Math.floor(Math.random() * 3) + 2, // Auto-generated 2-4 games
  estimatedTime = `${Math.floor(Math.random() * 20) + 10}h`, // Auto-generated 10-30h
  participants = Math.floor(Math.random() * 15000) + 5000, // Auto-generated 5k-20k
  trendingScore = Math.floor(Math.random() * 20) + 80, // Auto-generated 80-100
  fallbackImage = "/placeholder.svg",
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const isValidImageUrl =
      typeof imageUrl === "string" &&
      imageUrl.trim() !== "" &&
      (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

    if (isValidImageUrl) {
      setImgSrc(imageUrl);
    } else {
      // Generate topic-based image from Unsplash API with better reliability
      const getTopicImage = (topicTitle: string) => {
        const categoryImages = {
          AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          Blockchain:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          Cloud:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          Security:
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          "Data Science":
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          Mobile:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          "Web Development":
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          "Machine Learning":
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          Python:
            "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
          React:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
        };

        // Find matching category or use title keywords
        const category = Object.keys(categoryImages).find((key) =>
          topicTitle.toLowerCase().includes(key.toLowerCase())
        );

        return category
          ? categoryImages[category as keyof typeof categoryImages]
          : "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=640&h=480&fit=crop&crop=center&auto=format&q=75"; // Default tech image
      };

      setImgSrc(getTopicImage(title || "technology"));
    }
  }, [imageUrl, title]);

  const handleImageError = () => {
    console.error(`Error loading image: ${imgSrc}. Switching to fallback.`);
    setImgSrc(fallbackImage);
  };

  const handleStartQuest = () => {
    // Defensive check for undefined or empty slugs
    if (!slug || slug.trim() === "") {
      // Fallback: generate slug from title
      const fallbackSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();

      console.warn(
        `Empty slug detected for "${title}", using fallback: ${fallbackSlug}`
      );
      navigate(`/quest/${fallbackSlug}`);
    } else {
      navigate(`/quest/${slug}`);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      AI: "bg-purple-500 text-white",
      "Web Development": "bg-blue-500 text-white",
      Blockchain: "bg-orange-500 text-white",
      Cloud: "bg-green-500 text-white",
      Security: "bg-red-500 text-white",
      "Data Science": "bg-indigo-500 text-white",
      Mobile: "bg-pink-500 text-white",
      Tech: "bg-gray-500 text-white",
    };
    return colors[cat] || "bg-gray-500 text-white";
  };

  const getDifficultyColor = (diff: string) => {
    const colors: Record<string, string> = {
      Beginner: "bg-green-500 text-white",
      Intermediate: "bg-yellow-500 text-white",
      Advanced: "bg-red-500 text-white",
    };
    return colors[diff] || "bg-gray-500 text-white";
  };

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden",
        "border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl",
        "transition-all duration-300 cursor-pointer transform hover:scale-[1.02]",
        "flex flex-col h-full"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container - 20% smaller */}
      <div className="relative aspect-[5/3] overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Source Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-gray-800 backdrop-blur-sm shadow-md border-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {source}
          </Badge>
        </div>

        {/* Trending Score */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
            <TrendingUp className="w-3 h-3" />
            {trendingScore}
          </div>
        </div>

        {/* Category & Difficulty Badges */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
          <Badge
            className={`text-xs ${getCategoryColor(category)} backdrop-blur-sm`}
          >
            {category}
          </Badge>
          <Badge
            className={`text-xs ${getDifficultyColor(
              difficulty
            )} backdrop-blur-sm`}
          >
            {difficulty}
          </Badge>
        </div>

        {/* Hover Start Quest Button */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            onClick={handleStartQuest}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-none shadow-xl font-semibold transform scale-95 group-hover:scale-100 transition-transform duration-200"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quest
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-tight">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3 flex-1">
          {summary ||
            "Explore this trending topic with interactive lessons and hands-on projects."}
        </p>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lessonCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Gamepad2 className="w-4 h-4" />
            <span>{gameCount} games</span>
          </div>
        </div>

        {/* Participants Count */}
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <Users className="w-3 h-3 mr-1" />
          <span>{(participants / 1000).toFixed(1)}k learners</span>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
