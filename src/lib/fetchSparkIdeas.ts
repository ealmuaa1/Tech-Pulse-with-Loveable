interface IdeaSpark {
  title: string;
  description: string;
  source: string;
  url: string;
  topics: string[];
  imageUrl: string;
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;
const REDDIT_API_BASE = "https://www.reddit.com/r";
const SUBREDDITS = [
  "technology",
  "programming",
  "webdev",
  "artificial",
  "MachineLearning",
];

// Function to get a valid image URL from Unsplash
export async function getValidImageUrl(query: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
  }

  // Fallback to a default image if Unsplash fails
  return "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";
}

// Fallback ideas for when API calls fail
const fallbackIdeas: IdeaSpark[] = [
  {
    title: "AI-Powered Learning Systems",
    description:
      "How artificial intelligence is transforming education and personalized learning experiences.",
    source: "Tech Pulse",
    url: "#",
    topics: ["ai", "education", "learning"],
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
  },
  {
    title: "Web3 Development Trends",
    description:
      "Latest developments in decentralized applications and blockchain technology.",
    source: "Tech Pulse",
    url: "#",
    topics: ["web3", "blockchain", "development"],
    imageUrl:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=400&fit=crop",
  },
  {
    title: "Cloud Native Architecture",
    description: "Best practices for building scalable cloud applications.",
    source: "Tech Pulse",
    url: "#",
    topics: ["cloud", "architecture", "development"],
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
  },
];

export async function fetchSparkIdeas(
  favoriteTopics: string[] = []
): Promise<IdeaSpark[]> {
  const ideas: IdeaSpark[] = [];

  // Ensure favoriteTopics is always an array
  const topicsToFilter = Array.isArray(favoriteTopics) ? favoriteTopics : [];

  try {
    // Fetch from Reddit
    const subredditPromises = SUBREDDITS.map(async (subreddit) => {
      const response = await fetch(
        `${REDDIT_API_BASE}/${subreddit}/hot.json?limit=5`
      );
      if (!response.ok) throw new Error(`Failed to fetch from r/${subreddit}`);
      return response.json();
    });

    const subredditResponses = await Promise.all(subredditPromises);

    const posts = subredditResponses.flatMap((response) =>
      response.data.children.map((post: any) => ({
        title: post.data.title,
        description: post.data.selftext || "No description available",
        source: `Reddit r/${post.data.subreddit}`,
        url: `https://reddit.com${post.data.permalink}`,
        topics: post.data.title
          .toLowerCase()
          .split(" ")
          .filter((word: string) => word.length > 3),
      }))
    );

    // Filter posts based on favorite topics if provided
    const filteredPosts =
      topicsToFilter.length > 0
        ? posts.filter((post) =>
            topicsToFilter.some(
              (favTopic) =>
                post.title.toLowerCase().includes(favTopic.toLowerCase()) ||
                post.description.toLowerCase().includes(favTopic.toLowerCase())
            )
          )
        : posts;

    // Get images for each post
    for (const post of filteredPosts) {
      const imageUrl = await getValidImageUrl(post.title);
      ideas.push({
        ...post,
        imageUrl,
      });
    }

    // If no ideas were found and user has interests, try to fetch general tech topics
    if (ideas.length === 0 && topicsToFilter.length > 0) {
      const generalTechTopics = [
        "Artificial Intelligence",
        "Web Development",
        "Cloud Computing",
        "Cybersecurity",
        "Blockchain Technology",
      ];

      for (const topic of generalTechTopics) {
        const imageUrl = await getValidImageUrl(topic);
        ideas.push({
          title: topic,
          description: `Latest trends and developments in ${topic.toLowerCase()}`,
          source: "Tech Pulse",
          url: "#",
          topics: topic.toLowerCase().split(" "),
          imageUrl,
        });
      }
    }

    // If still no ideas, use fallback
    if (ideas.length === 0) {
      return fallbackIdeas;
    }

    return ideas;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return fallbackIdeas;
  }
}
