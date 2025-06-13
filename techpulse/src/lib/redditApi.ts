import axios from "axios";

// Reddit API configuration
const REDDIT_API_BASE = "https://www.reddit.com/r";
const SUBREDDITS = {
  AI: ["artificial", "MachineLearning", "AIdev"],
  Blockchain: ["blockchain", "cryptotechnology", "cryptodevs"],
  Cloud: ["cloudcomputing", "aws", "azure"],
  Cybersecurity: ["netsec", "cybersecurity", "hacking"],
  IoT: ["IoT", "homeautomation", "smarthome"],
  Web3: ["web3", "defi", "NFT"],
  VR: ["virtualreality", "OculusQuest", "VRGaming"],
  AR: ["augmentedreality", "ARdev", "MixedReality"],
  Quantum: ["quantumcomputing", "quantum", "quantumprogramming"],
};

const POST_LIMIT = 5;
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  score: number;
  author: string;
  subreddit: string;
  created_utc: number;
  num_comments: number;
  permalink: string;
  selftext?: string;
  category?: string;
}

/**
 * Fetches topic-specific posts from relevant subreddits
 * @param category Quest category
 * @returns Array of Reddit posts
 */
export async function fetchTopicPosts(category: string): Promise<RedditPost[]> {
  const cacheKey = `reddit_${category}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }

  try {
    const posts: RedditPost[] = [];
    const relevantSubreddits =
      SUBREDDITS[category as keyof typeof SUBREDDITS] || [];

    for (const subreddit of relevantSubreddits) {
      const response = await axios.get(
        `${REDDIT_API_BASE}/${subreddit}/hot.json`,
        {
          params: {
            limit: POST_LIMIT,
          },
        }
      );

      const subredditPosts = response.data.data.children.map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        url: post.data.url,
        score: post.data.score,
        author: post.data.author,
        subreddit: post.data.subreddit,
        created_utc: post.data.created_utc,
        num_comments: post.data.num_comments,
        permalink: `https://reddit.com${post.data.permalink}`,
        selftext: post.data.selftext,
        category,
      }));

      posts.push(...subredditPosts);
    }

    // Sort by score and limit to top posts
    const sortedPosts = posts
      .sort((a, b) => b.score - a.score)
      .slice(0, POST_LIMIT);

    // Cache the results
    cache.set(cacheKey, {
      data: sortedPosts,
      timestamp: Date.now(),
    });

    return sortedPosts;
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return [];
  }
}

/**
 * Fetches comments for a specific post
 * @param permalink Post permalink
 * @returns Array of comments
 */
export async function fetchPostComments(permalink: string): Promise<any[]> {
  try {
    const response = await axios.get(`${REDDIT_API_BASE}${permalink}.json`);
    return response.data[1].data.children.map((comment: any) => ({
      id: comment.data.id,
      author: comment.data.author,
      body: comment.data.body,
      score: comment.data.score,
      created_utc: comment.data.created_utc,
    }));
  } catch (error) {
    console.error("Error fetching post comments:", error);
    return [];
  }
}
