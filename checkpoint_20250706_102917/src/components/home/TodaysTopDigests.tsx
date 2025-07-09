import React, { useState, useEffect } from "react";
import { Clock, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchTrendingTopics } from "@/lib/topicFetcher";

export interface TopicCard {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  readTime: number;
  trending_score: number;
  image: string;
  url?: string;
  tags: string[];
}

interface TodaysTopDigestsProps {
  maxDisplay?: number;
}

// Mock data for trending topics - in production, this would come from different APIs
const generateMockTopics = (): TopicCard[] => {
  const topics = [
    {
      id: "ai-healthcare-2024",
      title: "AI Revolution in Healthcare",
      summary: "How GPT-4 is transforming diagnosis and treatment planning.",
      category: "AI Insights",
      source: "Tech News Daily",
      readTime: 4,
      trending_score: 98,
      image:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&auto=format",
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
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&auto=format",
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
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop&auto=format",
      tags: ["Sustainability", "Green Tech", "Innovation"],
    },
    {
      id: "web3-development-trends",
      title: "The Future of Decentralized Social Media",
      summary:
        "Exploring protocols like Fracaster and Lens in decentralized platforms.",
      category: "Product Hunt",
      source: "Web3 Weekly",
      readTime: 7,
      trending_score: 92,
      image:
        "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=300&fit=crop&auto=format",
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
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format",
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
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&auto=format",
      tags: ["Blockchain", "Gaming", "NFTs"],
    },
  ];

  // Shuffle and return random topics
  return topics.sort(() => Math.random() - 0.5);
};

const getCategoryColor = (category: string) => {
  const colors = {
    "AI Insights": "bg-purple-100 text-purple-700 border-purple-200",
    "Tech News Daily": "bg-blue-100 text-blue-700 border-blue-200",
    "Green Tech Journal": "bg-green-100 text-green-700 border-green-200",
    "Product Hunt": "bg-orange-100 text-orange-700 border-orange-200",
    "Mobile Tech": "bg-pink-100 text-pink-700 border-pink-200",
    "Gaming Tech": "bg-indigo-100 text-indigo-700 border-indigo-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[category as keyof typeof colors] || colors.default;
};

const TodaysTopDigests: React.FC<TodaysTopDigestsProps> = ({
  maxDisplay = 4,
}) => {
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);

        // Fetch topics from multiple sources using our dynamic fetcher
        const fetchedTopics = await fetchTrendingTopics(maxDisplay);
        setTopics(fetchedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
        // Fallback to mock data
        const mockTopics = generateMockTopics();
        setTopics(mockTopics.slice(0, maxDisplay));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();

    // Refresh topics every 30 minutes
    const interval = setInterval(fetchTopics, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [maxDisplay]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Today's Top Digests
          </h2>
          <Badge variant="secondary" className="animate-pulse">
            Loading...
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: maxDisplay }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl aspect-square animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Today's Top Digests
        </h2>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Live
        </Badge>
      </div>

      {/* Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={topic.image}
                alt={topic.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  className={`text-xs ${getCategoryColor(
                    topic.category
                  )} backdrop-blur-sm`}
                >
                  {topic.category}
                </Badge>
              </div>

              {/* Trending Score */}
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {topic.trending_score}
                  </span>
                </div>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 leading-tight">
                  {topic.title}
                </h3>

                <div className="flex items-center justify-between text-white/80 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{topic.readTime}m read</span>
                  </div>
                  <span>{topic.source}</span>
                </div>
              </div>

              {/* Hover Action */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  size="sm"
                  className="bg-white/90 text-gray-900 hover:bg-white border-none shadow-lg"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Read More
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tags Preview */}
      <div className="flex flex-wrap gap-2 pt-2">
        {topics
          .slice(0, 2)
          .flatMap((topic) => topic.tags)
          .slice(0, 6)
          .map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
      </div>
    </div>
  );
};

export default TodaysTopDigests;
