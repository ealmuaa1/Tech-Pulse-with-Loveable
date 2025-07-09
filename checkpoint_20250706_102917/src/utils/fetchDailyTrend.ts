import { supabase } from "@/lib/supabase";

export interface DailyTrend {
  id: string;
  title: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  category:
    | "ai"
    | "blockchain"
    | "web3"
    | "cybersecurity"
    | "quantum"
    | "iot"
    | "ar-vr"
    | "general";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  tags: string[];
  createdAt: string;
  trending_score?: number;
  engagement_count?: number;
  source?: string;
  quest_available?: boolean;
}

// Mock daily trends for development
const mockDailyTrends: DailyTrend[] = [
  {
    id: "daily-1",
    title: "GPT-4 Vision: Multimodal AI Revolution",
    summary:
      "Explore how GPT-4's vision capabilities are transforming image understanding and opening new possibilities for AI applications.",
    content:
      "GPT-4 Vision represents a significant leap in AI capabilities, combining language understanding with visual comprehension...",
    imageUrl: "/api/placeholder/400/240",
    category: "ai",
    difficulty: "intermediate",
    estimatedTime: 15,
    tags: ["GPT-4", "Computer Vision", "Multimodal AI", "OpenAI"],
    createdAt: new Date().toISOString(),
    trending_score: 98,
    engagement_count: 1420,
    source: "OpenAI Research",
    quest_available: true,
  },
  {
    id: "daily-2",
    title: "Quantum Computing Breakthrough: IBM's 1000-Qubit Processor",
    summary:
      "IBM achieves a major milestone with their new quantum processor, bringing us closer to practical quantum computing applications.",
    content:
      "IBM's latest quantum processor represents a significant advancement in the field of quantum computing...",
    imageUrl: "/api/placeholder/400/240",
    category: "quantum",
    difficulty: "advanced",
    estimatedTime: 20,
    tags: ["Quantum Computing", "IBM", "Qubits", "Technology"],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    trending_score: 92,
    engagement_count: 987,
    source: "IBM Research",
    quest_available: true,
  },
  {
    id: "daily-3",
    title: "Ethereum 2.0 Staking: Complete Guide for Beginners",
    summary:
      "Learn everything you need to know about Ethereum 2.0 staking, from setup to rewards and risks.",
    content:
      "Ethereum 2.0 introduces Proof of Stake consensus mechanism, allowing users to stake their ETH...",
    imageUrl: "/api/placeholder/400/240",
    category: "blockchain",
    difficulty: "beginner",
    estimatedTime: 12,
    tags: ["Ethereum", "Staking", "Cryptocurrency", "DeFi"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    trending_score: 85,
    engagement_count: 756,
    source: "Ethereum Foundation",
    quest_available: false,
  },
  {
    id: "daily-4",
    title: "Zero-Trust Security: The Future of Cybersecurity",
    summary:
      "Discover how Zero-Trust architecture is revolutionizing cybersecurity practices in the modern digital landscape.",
    content:
      'Zero-Trust security model operates on the principle of "never trust, always verify"...',
    imageUrl: "/api/placeholder/400/240",
    category: "cybersecurity",
    difficulty: "intermediate",
    estimatedTime: 18,
    tags: ["Cybersecurity", "Zero-Trust", "Network Security", "Enterprise"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    trending_score: 78,
    engagement_count: 623,
    source: "NIST Guidelines",
    quest_available: true,
  },
  {
    id: "daily-5",
    title: "AR/VR in Education: Transforming Learning Experiences",
    summary:
      "Explore how Augmented and Virtual Reality technologies are creating immersive educational experiences.",
    content:
      "AR and VR technologies are opening new frontiers in educational methodologies...",
    imageUrl: "/api/placeholder/400/240",
    category: "ar-vr",
    difficulty: "beginner",
    estimatedTime: 14,
    tags: ["AR", "VR", "Education", "Immersive Learning"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    trending_score: 71,
    engagement_count: 445,
    source: "EdTech Research",
    quest_available: false,
  },
];

/**
 * Fetch a random daily trending topic from Supabase
 * Falls back to mock data for development
 */
export async function fetchDailyTrend(): Promise<DailyTrend> {
  try {
    // TODO: Replace with actual Supabase query
    /*
    const { data, error } = await supabase
      .from('learn_topics')
      .select(`
        id,
        title,
        summary,
        content,
        image_url,
        category,
        difficulty,
        estimated_time,
        tags,
        created_at,
        trending_score,
        engagement_count,
        source
      `)
      .gte('trending_score', 70) // Only high-trending content
      .order('trending_score', { ascending: false })
      .limit(5);

    if (error) throw error;

    // Select a random topic from the top trending ones
    const randomTopic = data[Math.floor(Math.random() * data.length)];
    
    return {
      id: randomTopic.id,
      title: randomTopic.title,
      summary: randomTopic.summary,
      content: randomTopic.content,
      imageUrl: randomTopic.image_url,
      category: randomTopic.category,
      difficulty: randomTopic.difficulty,
      estimatedTime: randomTopic.estimated_time,
      tags: randomTopic.tags || [],
      createdAt: randomTopic.created_at,
      trending_score: randomTopic.trending_score,
      engagement_count: randomTopic.engagement_count,
      source: randomTopic.source,
      quest_available: true // Determine based on quest table
    };
    */

    // For development, return a random mock trend
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay
    const randomIndex = Math.floor(Math.random() * mockDailyTrends.length);
    return mockDailyTrends[randomIndex];
  } catch (error) {
    console.error("Error fetching daily trend:", error);
    // Fallback to first mock trend
    return mockDailyTrends[0];
  }
}

/**
 * Fetch multiple trending topics for variety
 */
export async function fetchTrendingTopics(
  limit: number = 5
): Promise<DailyTrend[]> {
  try {
    // TODO: Replace with actual Supabase query
    /*
    const { data, error } = await supabase
      .from('learn_topics')
      .select(`
        id,
        title,
        summary,
        content,
        image_url,
        category,
        difficulty,
        estimated_time,
        tags,
        created_at,
        trending_score,
        engagement_count,
        source
      `)
      .gte('trending_score', 60)
      .order('trending_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data.map(topic => ({...})); // Map to DailyTrend interface
    */

    // For development, return shuffled mock trends
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    const shuffled = [...mockDailyTrends].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return mockDailyTrends.slice(0, limit);
  }
}

/**
 * Check if a quest is available for a specific topic
 */
export async function checkQuestAvailability(
  topicId: string
): Promise<boolean> {
  try {
    // TODO: Replace with actual Supabase query
    /*
    const { data, error } = await supabase
      .from('quests')
      .select('id')
      .eq('topic_id', topicId)
      .eq('is_active', true)
      .single();

    return !error && data;
    */

    // For development, randomly determine availability
    return Math.random() > 0.3; // 70% chance of having a quest
  } catch (error) {
    console.error("Error checking quest availability:", error);
    return false;
  }
}

/**
 * Get category icon for trending topics
 */
export function getCategoryIcon(category: DailyTrend["category"]): string {
  const icons = {
    ai: "🤖",
    blockchain: "🔗",
    web3: "🌐",
    cybersecurity: "🔒",
    quantum: "⚛️",
    iot: "📡",
    "ar-vr": "🥽",
    general: "📚",
  };
  return icons[category] || icons.general;
}

/**
 * Get difficulty color class
 */
export function getDifficultyColor(
  difficulty: DailyTrend["difficulty"]
): string {
  const colors = {
    beginner: "text-green-600 bg-green-50",
    intermediate: "text-yellow-600 bg-yellow-50",
    advanced: "text-red-600 bg-red-50",
  };
  return colors[difficulty];
}

/**
 * Format engagement count for display
 */
export function formatEngagementCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
