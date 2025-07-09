import { TopicCard } from "@/components/home/TodaysTopDigests";

// Different data sources configuration
const DATA_SOURCES = {
  REDDIT: {
    name: "Reddit",
    baseUrl: "https://www.reddit.com/r/technology/hot.json",
    category: "Tech News Daily",
  },
  PRODUCTHUNT: {
    name: "Product Hunt",
    baseUrl: "https://api.producthunt.com/v2/api/graphql",
    category: "Product Hunt",
  },
  HACKERNEWS: {
    name: "Hacker News",
    baseUrl: "https://hacker-news.firebaseio.com/v0",
    category: "AI Insights",
  },
};

// Unsplash access key - in production, this should be in environment variables
const UNSPLASH_ACCESS_KEY = "demo"; // Replace with actual key

/**
 * Generate relevant Unsplash image URL based on topic keywords
 */
const generateImageUrl = (title: string, tags: string[]): string => {
  const keywords = [...tags, ...title.split(" ")]
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .join(",");

  const fallbackKeywords = [
    "technology",
    "innovation",
    "digital",
    "computer",
    "tech",
  ];
  const searchTerm =
    keywords ||
    fallbackKeywords[Math.floor(Math.random() * fallbackKeywords.length)];

  return `https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=400&fit=crop&auto=format&q=80&${searchTerm}`;
};

/**
 * Extract relevant tags from title and content
 */
const extractTags = (title: string, content: string = ""): string[] => {
  const techKeywords = [
    "AI",
    "ML",
    "Blockchain",
    "Web3",
    "Cloud",
    "IoT",
    "AR",
    "VR",
    "Crypto",
    "React",
    "Node",
    "Python",
    "JavaScript",
    "API",
    "Database",
    "Security",
    "Mobile",
    "Healthcare",
    "Finance",
    "Gaming",
    "Startup",
    "SaaS",
  ];

  const text = (title + " " + content).toLowerCase();
  const foundKeywords = techKeywords.filter((keyword) =>
    text.includes(keyword.toLowerCase())
  );

  return foundKeywords.slice(0, 3);
};

/**
 * Fetch trending topics from Reddit
 */
const fetchRedditTopics = async (): Promise<TopicCard[]> => {
  try {
    // Note: In production, you'd need to handle CORS or use a backend proxy
    const response = await fetch(`${DATA_SOURCES.REDDIT.baseUrl}?limit=10`);
    const data = await response.json();

    return data.data.children
      .filter((post: any) => post.data.score > 100) // Filter high-scoring posts
      .slice(0, 3)
      .map((post: any) => {
        const postData = post.data;
        const tags = extractTags(postData.title, postData.selftext);

        return {
          id: `reddit_${postData.id}`,
          title: postData.title,
          summary: postData.selftext
            ? postData.selftext.slice(0, 120) + "..."
            : "Trending discussion on Reddit technology community.",
          category: DATA_SOURCES.REDDIT.category,
          source: "r/technology",
          readTime: Math.ceil(postData.title.length / 50) + 2,
          trending_score: Math.min(98, Math.floor(postData.score / 100)),
          image: generateImageUrl(postData.title, tags),
          url: `https://reddit.com${postData.permalink}`,
          tags,
        };
      });
  } catch (error) {
    console.error("Error fetching Reddit topics:", error);
    return [];
  }
};

/**
 * Fetch trending topics from Hacker News
 */
const fetchHackerNewsTopics = async (): Promise<TopicCard[]> => {
  try {
    // Fetch top stories
    const topStoriesResponse = await fetch(
      `${DATA_SOURCES.HACKERNEWS.baseUrl}/topstories.json`
    );
    const topStoryIds = await topStoriesResponse.json();

    // Fetch details for first 5 stories
    const storyPromises = topStoryIds.slice(0, 5).map(async (id: number) => {
      const response = await fetch(
        `${DATA_SOURCES.HACKERNEWS.baseUrl}/item/${id}.json`
      );
      return response.json();
    });

    const stories = await Promise.all(storyPromises);

    return stories
      .filter((story) => story.score > 50 && story.title) // Filter high-scoring stories
      .slice(0, 2)
      .map((story) => {
        const tags = extractTags(story.title, "");

        return {
          id: `hn_${story.id}`,
          title: story.title,
          summary: "Trending discussion on Hacker News community.",
          category: DATA_SOURCES.HACKERNEWS.category,
          source: "Hacker News",
          readTime: 3,
          trending_score: Math.min(95, Math.floor(story.score / 10)),
          image: generateImageUrl(story.title, tags),
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          tags,
        };
      });
  } catch (error) {
    console.error("Error fetching Hacker News topics:", error);
    return [];
  }
};

/**
 * Generate mock trending topics with realistic data
 */
const generateMockTopics = (): TopicCard[] => {
  const mockTopics = [
    {
      id: "ai-healthcare-2024",
      title: "AI Revolution in Healthcare",
      summary: "How GPT-4 is transforming diagnosis and treatment planning.",
      category: "AI Insights",
      source: "Tech News Daily",
      readTime: 4,
      trending_score: 98,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Healthcare", "AI", "GPT-4"],
    },
    {
      id: "quantum-computing-breakthrough",
      title: "Quantum Computing Breakthrough",
      summary: "IBM's 1000-qubit chip and its real-world implications.",
      category: "Tech News Daily",
      source: "Quantum Weekly",
      readTime: 6,
      trending_score: 95,
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Quantum", "IBM", "Computing"],
    },
    {
      id: "sustainable-tech-innovations",
      title: "Sustainable Tech Innovations",
      summary: "Exploring new eco-friendly technologies for a greener future.",
      category: "Green Tech Journal",
      source: "Sustainability Today",
      readTime: 5,
      trending_score: 89,
      image:
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Sustainability", "Green Tech", "Innovation"],
    },
    {
      id: "web3-development-trends",
      title: "The Future of Decentralized Social Media",
      summary:
        "Exploring protocols like Farcaster and Lens in decentralized platforms.",
      category: "Product Hunt",
      source: "Web3 Weekly",
      readTime: 7,
      trending_score: 92,
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Web3", "Social Media", "Decentralized"],
    },
    {
      id: "edge-ai-mobile-apps",
      title: "Edge AI in Mobile Applications",
      summary:
        "Running AI models directly on smartphones for better privacy and speed.",
      category: "Mobile Tech",
      source: "Mobile AI Weekly",
      readTime: 5,
      trending_score: 87,
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Edge AI", "Mobile", "Privacy"],
    },
    {
      id: "blockchain-gaming-metaverse",
      title: "Blockchain Gaming & Metaverse",
      summary:
        "How NFTs and blockchain are reshaping virtual worlds and gaming economies.",
      category: "Gaming Tech",
      source: "Metaverse Today",
      readTime: 8,
      trending_score: 84,
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop&auto=format&q=80",
      tags: ["Blockchain", "Gaming", "NFTs"],
    },
  ];

  return mockTopics.sort(() => Math.random() - 0.5);
};

/**
 * Main function to fetch trending topics from multiple sources
 */
export const fetchTrendingTopics = async (
  maxTopics: number = 4
): Promise<TopicCard[]> => {
  try {
    // In development, use mock data. In production, fetch from real APIs
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockTopics = generateMockTopics();
      return mockTopics.slice(0, maxTopics);
    }

    // Production: Fetch from multiple sources in parallel
    const [redditTopics, hackerNewsTopics] = await Promise.all([
      fetchRedditTopics(),
      fetchHackerNewsTopics(),
    ]);

    // Combine and sort by trending score
    const allTopics = [
      ...redditTopics,
      ...hackerNewsTopics,
      ...generateMockTopics().slice(0, 2),
    ].sort((a, b) => b.trending_score - a.trending_score);

    return allTopics.slice(0, maxTopics);
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    // Fallback to mock data
    const mockTopics = generateMockTopics();
    return mockTopics.slice(0, maxTopics);
  }
};

/**
 * Refresh topics periodically
 */
export const createTopicRefresher = (
  callback: (topics: TopicCard[]) => void,
  intervalMinutes: number = 30
) => {
  const refresh = async () => {
    const topics = await fetchTrendingTopics();
    callback(topics);
  };

  // Initial fetch
  refresh();

  // Set up interval
  const interval = setInterval(refresh, intervalMinutes * 60 * 1000);

  return () => clearInterval(interval);
};
