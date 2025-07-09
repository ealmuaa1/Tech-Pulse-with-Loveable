import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

export type TrendingTopic = {
  title: string;
  topic: string;
  source: "Reddit" | "Hacker News";
  image: string;
  summary: string;
};

interface RedditPost {
  data: {
    title: string;
    subreddit_name_prefixed: string;
    selftext: string;
    permalink: string;
    thumbnail: string;
  };
}

interface RedditResponse {
  data: {
    children: RedditPost[];
  };
}

interface HackerNewsItem {
  title: string;
  url?: string;
  text?: string;
}

async function fetchReddit(): Promise<TrendingTopic[]> {
  try {
    const res = await fetch(
      "https://www.reddit.com/r/technology/top.json?limit=5"
    );
    const data = (await res.json()) as RedditResponse;
    return data.data.children.map((child) => {
      const post = child.data;
      const topic =
        post.subreddit_name_prefixed.replace("r/", "") || "technology";
      return {
        title: post.title,
        topic,
        source: "Reddit",
        image: `https://source.unsplash.com/400x200/?${encodeURIComponent(
          topic
        )}&sig=${uuidv4()}`,
        summary: post.selftext
          ? post.selftext.substring(0, 100) + "..."
          : "No summary available.",
      };
    });
  } catch (e) {
    console.error("Reddit fetch error:", e);
    return [];
  }
}

async function fetchHackerNews(): Promise<TrendingTopic[]> {
  try {
    const idsRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const ids = (await idsRes.json()) as number[];
    const top5 = ids.slice(0, 5);
    const items = await Promise.all(
      top5.map(async (id) => {
        const itemRes = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        const item = (await itemRes.json()) as HackerNewsItem;
        const topic = item.title ? item.title.split(" ")[0] : "technology";
        return {
          title: item.title || "No Title",
          topic,
          source: "Hacker News" as const,
          image: `https://source.unsplash.com/400x200/?${encodeURIComponent(
            topic
          )}&sig=${uuidv4()}`,
          summary: item.url
            ? `Read more at: ${item.url}`
            : item.text
            ? item.text.substring(0, 100) + "..."
            : "No summary available.",
        };
      })
    );
    return items.filter(Boolean);
  } catch (e) {
    console.error("Hacker News fetch error:", e);
    return [];
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [reddit, hackerNews] = await Promise.all([
      fetchReddit(),
      fetchHackerNews(),
    ]);
    const all = [...reddit, ...hackerNews];
    res.status(200).json(all);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch trending topics." });
  }
}
