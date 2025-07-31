import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import {
  BookOpen,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Zap,
  Target,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Award,
  Briefcase,
  Rocket,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { passionSections, PassionCard } from "@/data/passionSections";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
};

// Jumpstart This Week cards - High-impact short wins
const jumpstartCards = [
  {
    id: "js-1",
    title: "Build Your First AI Chatbot",
    description: "Create a simple chatbot using OpenAI API in under 2 hours",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "AI",
    difficulty: "Beginner",
    completionRate: 92,
    estimatedTime: "2h",
  },
  {
    id: "js-2",
    title: "Deploy Your First Web App",
    description: "Get your project live on Vercel or Netlify in 30 minutes",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Deployment",
    difficulty: "Beginner",
    completionRate: 88,
    estimatedTime: "30m",
  },
  {
    id: "js-3",
    title: "Master Git Workflow",
    description: "Learn essential Git commands and create your first PR",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Development",
    difficulty: "Beginner",
    completionRate: 95,
    estimatedTime: "1h",
  },
];

// Mock recently viewed cards
const mockRecentlyViewed = [
  {
    id: "rv-1",
    title: "Next.js 14 App Router",
    description: "Build modern web apps with the latest Next.js features",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Frontend",
    difficulty: "Intermediate",
    completionRate: 92,
    estimatedTime: "5h",
  },
  {
    id: "rv-2",
    title: "Docker Containerization",
    description: "Master containerization for modern application deployment",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "DevOps",
    difficulty: "Beginner",
    completionRate: 89,
    estimatedTime: "4h",
  },
  {
    id: "rv-3",
    title: "GraphQL API Design",
    description: "Design and implement efficient GraphQL APIs",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Backend",
    difficulty: "Intermediate",
    completionRate: 76,
    estimatedTime: "7h",
  },
  {
    id: "rv-4",
    title: "TypeScript Advanced Types",
    description: "Master complex TypeScript patterns and type safety",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Programming",
    difficulty: "Advanced",
    completionRate: 68,
    estimatedTime: "6h",
  },
  {
    id: "rv-5",
    title: "AWS Serverless Architecture",
    description: "Build scalable serverless applications on AWS",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Cloud",
    difficulty: "Advanced",
    completionRate: 81,
    estimatedTime: "10h",
  },
  {
    id: "rv-6",
    title: "MongoDB Performance Optimization",
    description: "Optimize MongoDB queries and database performance",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Database",
    difficulty: "Intermediate",
    completionRate: 74,
    estimatedTime: "8h",
  },
];

// Mock power tips
const mockPowerTips = [
  {
    id: "pt-1",
    title: "AI Code Review Assistant",
    description:
      "Build an AI-powered code review tool using OpenAI API and GitHub webhooks",
    stack: ["Python", "OpenAI API", "GitHub API", "FastAPI"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 days",
    category: "AI Tools",
  },
  {
    id: "pt-2",
    title: "Real-time Collaboration Dashboard",
    description:
      "Create a live dashboard for team collaboration with WebSocket and React",
    stack: ["React", "Socket.io", "Node.js", "MongoDB"],
    difficulty: "Advanced",
    estimatedTime: "1 week",
    category: "Web Apps",
  },
  {
    id: "pt-3",
    title: "Smart Contract Analyzer",
    description:
      "Analyze Ethereum smart contracts for security vulnerabilities",
    stack: ["Solidity", "Web3.js", "Python", "Slither"],
    difficulty: "Expert",
    estimatedTime: "3-4 days",
    category: "Blockchain",
  },
  {
    id: "pt-4",
    title: "Automated Testing Pipeline",
    description:
      "Set up comprehensive CI/CD with automated testing and deployment",
    stack: ["GitHub Actions", "Jest", "Cypress", "Docker"],
    difficulty: "Intermediate",
    estimatedTime: "2 days",
    category: "DevOps",
  },
  {
    id: "pt-5",
    title: "Personal Finance Tracker",
    description:
      "Build a smart expense tracker with categorization and insights",
    stack: ["React Native", "Firebase", "Plaid API", "Chart.js"],
    difficulty: "Beginner",
    estimatedTime: "1 week",
    category: "Mobile Apps",
  },
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Carousel navigation for power tips
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % mockPowerTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex(
      (prev) => (prev - 1 + mockPowerTips.length) % mockPowerTips.length
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextTip, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExploreClick = (cardId: string, category: string) => {
    toast.success(`Exploring ${category} quests!`, { duration: 2000 });
    navigate(`/learn?category=${encodeURIComponent(category)}&card=${cardId}`);
  };

  const handleCardClick = (cardId: string) => {
    toast.info("Opening quest details...", { duration: 2000 });
    navigate(`/quest/${cardId}`);
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      Trending: "bg-orange-500 text-white",
      Popular: "bg-blue-500 text-white",
      Advanced: "bg-red-500 text-white",
      Beginner: "bg-green-500 text-white",
      Intermediate: "bg-yellow-500 text-white",
      Expert: "bg-purple-500 text-white",
      "High Demand": "bg-pink-500 text-white",
      Executive: "bg-gray-800 text-white",
      Strategic: "bg-indigo-500 text-white",
      Entrepreneurial: "bg-orange-600 text-white",
      Business: "bg-blue-600 text-white",
      "Life Changing": "bg-emerald-500 text-white",
      Essential: "bg-violet-500 text-white",
      Practical: "bg-teal-500 text-white",
    };
    return colors[badge] || "bg-gray-500 text-white";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Beginner: "text-green-600 bg-green-100",
      Intermediate: "text-yellow-600 bg-yellow-100",
      Advanced: "text-red-600 bg-red-100",
      Expert: "text-purple-600 bg-purple-100",
    };
    return colors[difficulty] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Sticky Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Explore by Passion
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover your next learning adventure
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Passion Sections */}
        {Object.entries(passionSections).map(([sectionTitle, cards]) => (
          <div key={sectionTitle} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              {sectionTitle === "Professional Growth" && (
                <TrendingUp className="w-6 h-6 text-slate-500" />
              )}
              {sectionTitle === "Startup & Tech Ideas" && (
                <Rocket className="w-6 h-6 text-rose-500" />
              )}
              {sectionTitle === "Personal Productivity" && (
                <Zap className="w-6 h-6 text-emerald-500" />
              )}
              {sectionTitle}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className="bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl border border-slate-200 dark:border-gray-700 p-6 flex flex-col items-center transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mb-3 shadow-sm">
                    <span className="text-indigo-500 dark:text-indigo-400 text-2xl">
                      {iconMap[card.icon] || <Target className="w-6 h-6" />}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-center mb-2 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </CardTitle>

                  {/* Special subheading for AI-Powered Productivity */}
                  {card.isSpecial && card.subheading && (
                    <p className="text-gray-600 dark:text-gray-300 text-center mb-3 text-sm font-medium italic">
                      {card.subheading}
                    </p>
                  )}

                  <p className="text-gray-500 dark:text-gray-400 text-center mb-4 text-sm leading-relaxed line-clamp-2">
                    {card.description}
                  </p>
                  <div className="flex gap-3 justify-center mb-3">
                    <span className="flex items-center gap-1 bg-slate-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                      <Target className="w-4 h-4" />
                      {card.questCount} quests
                    </span>
                    <span className="flex items-center gap-1 bg-slate-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
                      <Zap className="w-4 h-4" />
                      {card.toolCount} tools
                    </span>
                  </div>
                  <div className="flex gap-2 justify-center mb-4 flex-wrap">
                    {card.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 shadow-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Special collapsible section for enhanced cards */}
                  {card.isSpecial && (
                    <div className="w-full mb-4">
                      <Button
                        onClick={() =>
                          setExpandedCardId(
                            expandedCardId === card.id ? null : card.id
                          )
                        }
                        variant="outline"
                        size="sm"
                        className="w-full text-xs border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        {expandedCardId === card.id ? (
                          <>
                            <ChevronUp className="w-3 h-3 mr-1" />
                            Hide Resources
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3 h-3 mr-1" />
                            Show Resources
                          </>
                        )}
                      </Button>

                      {expandedCardId === card.id && (
                        <div
                          className={`mt-3 p-4 rounded-lg border ${
                            card.id === "pp-1"
                              ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700/50"
                              : card.id === "pp-2"
                              ? "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700/50"
                              : card.id === "pp-3"
                              ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700/50"
                              : card.id === "st-4"
                              ? "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700/50"
                              : "bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-700/50"
                          }`}
                        >
                          <ul className="space-y-4">
                            {/* Daily Challenge */}
                            <li className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  card.id === "pp-1"
                                    ? "bg-emerald-500"
                                    : card.id === "pp-2"
                                    ? "bg-violet-500"
                                    : card.id === "pp-3"
                                    ? "bg-blue-500"
                                    : card.id === "st-4"
                                    ? "bg-orange-500"
                                    : "bg-cyan-500"
                                }`}
                              >
                                <span className="text-white text-xs font-bold">
                                  1
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                  Daily 1-Minute Challenge
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {card.resources?.dailyChallenge.description ||
                                    "Complete today's challenge to boost your skills."}
                                </p>
                                <div className="space-y-1">
                                  <a
                                    href={
                                      card.resources?.dailyChallenge.tool.url ||
                                      "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 text-sm transition-colors ${
                                      card.id === "pp-1"
                                        ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                        : card.id === "pp-2"
                                        ? "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                                        : card.id === "pp-3"
                                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        : card.id === "st-4"
                                        ? "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                                        : "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {card.resources?.dailyChallenge.tool.name ||
                                      "Tool"}
                                  </a>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                    {
                                      card.resources?.dailyChallenge.tool
                                        .description
                                    }{" "}
                                    (
                                    {
                                      card.resources?.dailyChallenge.tool
                                        .pricing
                                    }
                                    )
                                  </p>
                                </div>
                              </div>
                            </li>

                            {/* Tool of the Week */}
                            <li className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  card.id === "pp-1"
                                    ? "bg-blue-500"
                                    : card.id === "pp-2"
                                    ? "bg-purple-500"
                                    : card.id === "pp-3"
                                    ? "bg-indigo-500"
                                    : card.id === "st-4"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                                }`}
                              >
                                <span className="text-white text-xs font-bold">
                                  2
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                  Tool of the Week
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {card.resources?.toolOfTheWeek.description ||
                                    "Try this week's featured tool to enhance your workflow."}
                                </p>
                                <div className="space-y-1">
                                  <a
                                    href={
                                      card.resources?.toolOfTheWeek.tool.url ||
                                      "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 text-sm transition-colors ${
                                      card.id === "pp-1"
                                        ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                        : card.id === "pp-2"
                                        ? "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                                        : card.id === "pp-3"
                                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        : card.id === "st-4"
                                        ? "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                                        : "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {card.resources?.toolOfTheWeek.tool.name ||
                                      "Tool"}
                                  </a>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                    {
                                      card.resources?.toolOfTheWeek.tool
                                        .description
                                    }{" "}
                                    (
                                    {card.resources?.toolOfTheWeek.tool.pricing}
                                    )
                                  </p>
                                </div>
                              </div>
                            </li>

                            {/* Learn More Resources */}
                            <li className="flex items-start gap-3">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  card.id === "pp-1"
                                    ? "bg-purple-500"
                                    : card.id === "pp-2"
                                    ? "bg-indigo-500"
                                    : card.id === "pp-3"
                                    ? "bg-cyan-500"
                                    : card.id === "st-4"
                                    ? "bg-yellow-500"
                                    : "bg-teal-500"
                                }`}
                              >
                                <span className="text-white text-xs font-bold">
                                  3
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                  Learn More Resources
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {card.resources?.learnMoreResources
                                    .description ||
                                    "Explore additional resources to deepen your knowledge."}
                                </p>
                                <div className="space-y-1">
                                  <a
                                    href={
                                      card.resources?.learnMoreResources.tool
                                        .url || "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 text-sm transition-colors ${
                                      card.id === "pp-1"
                                        ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                                        : card.id === "pp-2"
                                        ? "text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                                        : card.id === "pp-3"
                                        ? "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                        : card.id === "st-4"
                                        ? "text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                                        : "text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                                    }`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {card.resources?.learnMoreResources.tool
                                      .name || "Resource"}
                                  </a>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-4">
                                    {
                                      card.resources?.learnMoreResources.tool
                                        .description
                                    }{" "}
                                    (
                                    {
                                      card.resources?.learnMoreResources.tool
                                        .pricing
                                    }
                                    )
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => handleExploreClick(card.id, card.category)}
                    className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md py-2 mt-auto"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Jumpstart This Week Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            🔥 Jumpstart This Week
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jumpstartCards.map((card) => (
              <Card
                key={card.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                    {card.category}
                  </Badge>
                  <Badge
                    className={`absolute top-4 right-4 ${getDifficultyColor(
                      card.difficulty
                    )} backdrop-blur-sm`}
                  >
                    {card.difficulty}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-bold line-clamp-2">
                    {card.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-2">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{card.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{card.completionRate}% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bonus Power Tips Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Bonus Power Tips
          </h2>

          <div className="relative">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700/50 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {mockPowerTips[currentTipIndex].title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                      {mockPowerTips[currentTipIndex].description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mockPowerTips[currentTipIndex].stack.map((tech) => (
                        <Badge
                          key={tech}
                          className="bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span
                        className={`px-3 py-1 rounded-full ${getDifficultyColor(
                          mockPowerTips[currentTipIndex].difficulty
                        )}`}
                      >
                        {mockPowerTips[currentTipIndex].difficulty}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {mockPowerTips[currentTipIndex].estimatedTime}
                        </span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
                        {mockPowerTips[currentTipIndex].category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="flex gap-2">
                    {mockPowerTips.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTipIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentTipIndex
                            ? "bg-yellow-500 scale-125"
                            : "bg-yellow-200 dark:bg-yellow-700"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={prevTip}
                      variant="outline"
                      size="sm"
                      className="bg-white/80 dark:bg-gray-800/80"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={nextTip}
                      variant="outline"
                      size="sm"
                      className="bg-white/80 dark:bg-gray-800/80"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="explore" />
    </div>
  );
};

export default ExplorePage;
