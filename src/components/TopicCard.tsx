import React from "react";
import { cn } from "@/lib/utils";

interface TopicCardProps {
  title: string;
  imageUrl: string;
  summary: string;
  slug: string;
  source: string;
  buttonLabel?: string;
  link?: string;
  fallbackImage?: string;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  imageUrl,
  summary,
  slug,
  source,
  buttonLabel = "Start Quest",
  link,
  fallbackImage = "/placeholder.svg",
}) => {
  const [imgSrc, setImgSrc] = React.useState(imageUrl);

  React.useEffect(() => {
    const isValidImageUrl =
      typeof imageUrl === "string" &&
      imageUrl.trim() !== "" &&
      (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"));

    if (isValidImageUrl) {
      setImgSrc(imageUrl);
    } else {
      // If imageUrl is invalid, construct a fallback
      const query = encodeURIComponent(title || "tech");
      setImgSrc(`https://source.unsplash.com/400x200/?${query}`);
    }
  }, [imageUrl, title]);

  const handleImageError = () => {
    // This will now only trigger if the Unsplash URL itself fails
    console.error(
      `Error loading image: ${imgSrc}. Switching to local fallback.`
    );
    setImgSrc(fallbackImage);
  };

  console.log(`Rendering TopicCard "${title}" with imgSrc: ${imgSrc}`);

  const displaySummary =
    summary && summary.length > 10 ? summary : "GPT summary not available.";

  return (
    <div
      className={cn(
        "relative group rounded-xl overflow-hidden shadow-lg bg-white flex flex-col transition hover:scale-105 duration-200 cursor-pointer",
        "h-full min-h-[360px] p-4"
      )}
      style={{ minHeight: 360 }}
    >
      {/* Image background with gradient overlay */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl">
        <img
          src={imgSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        {/* Source label badge */}
        {source && (
          <span className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded font-medium text-gray-800 z-20 shadow">
            {source}
          </span>
        )}
        {/* Title overlay */}
        <div className="absolute bottom-4 left-0 w-full z-20 px-4">
          <h3 className="text-white text-lg font-bold drop-shadow-lg line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
      {/* Summary and button below image */}
      <div className="flex flex-col flex-1 justify-between pt-4">
        <p className="text-sm text-gray-700 leading-snug mb-4 line-clamp-4">
          {displaySummary}
        </p>
        <a
          href={link || `/quest/${slug}`}
          className="block w-full mt-auto"
          tabIndex={-1}
        >
          <button
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 rounded-xl hover:opacity-90 transition-colors text-base"
            tabIndex={0}
          >
            {buttonLabel}
          </button>
        </a>
      </div>
    </div>
  );
};

export default TopicCard;
