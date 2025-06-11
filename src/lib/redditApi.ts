import axios from "axios";

// Reddit API configuration
const REDDIT_API_BASE = "https://www.reddit.com/r";
const SUBREDDITS = ["technology", "Futurology", "MachineLearning"];
const POST_LIMIT = 5;

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
}

/**
 * Fetches top posts from specified tech-related subreddits
 * @param keywords Optional keywords to filter posts
 * @returns Array of Reddit posts
 */
export async function fetchTechPosts(
  keywords?: string[]
): Promise<RedditPost[]> {
  try {
    const posts: RedditPost[] = [];

    // Fetch posts from each subreddit
    for (const subreddit of SUBREDDITS) {
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
      }));

      posts.push(...subredditPosts);
    }

    // Filter by keywords if provided
    if (keywords && keywords.length > 0) {
      return posts.filter((post) =>
        keywords.some(
          (keyword) =>
            post.title.toLowerCase().includes(keyword.toLowerCase()) ||
            post.selftext?.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    return posts;
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
