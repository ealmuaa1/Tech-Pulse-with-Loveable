// Reliable image service with static fallbacks
export const getReliableImageUrl = async (query: string): Promise<string> => {
  // Static fallback images for common tech topics
  const staticImages = {
    ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
    "machine learning":
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&auto=format&q=80",
    blockchain:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop&auto=format&q=80",
    cybersecurity:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format&q=80",
    "web development":
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&auto=format&q=80",
    "data science":
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    cloud:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&auto=format&q=80",
    default:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
  };

  // Check if we have a static image for this query
  const queryLower = query.toLowerCase();
  for (const [key, url] of Object.entries(staticImages)) {
    if (queryLower.includes(key)) {
      return url;
    }
  }

  // Return default static image
  return staticImages.default;
};

// Safe image component with error handling
export const getSafeImageUrl = (
  imageUrl: string | undefined,
  fallback: string = "/placeholder.svg"
): string => {
  if (!imageUrl) return fallback;

  // If it's already a relative path, return as is
  if (imageUrl.startsWith("/")) return imageUrl;

  // If it's a valid external URL, return it
  if (imageUrl.startsWith("http")) return imageUrl;

  return fallback;
};

// Handle image loading errors
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = "/placeholder.svg"
) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};
