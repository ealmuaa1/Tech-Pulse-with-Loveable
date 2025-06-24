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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data for passion sections
const passionSections = {
  "Skills & Learning": [
    {
      id: "sl-1",
      title: "AI & Machine Learning Mastery",
      description:
        "From neural networks to deep learning, master the AI revolution",
      questCount: 12,
      toolCount: 8,
      badges: ["Trending", "Advanced"],
      category: "Skills & Learning",
      gradient: "from-purple-500 to-pink-500",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      id: "sl-2",
      title: "Full-Stack Development",
      description: "Build end-to-end applications with modern frameworks",
      questCount: 15,
      toolCount: 12,
      badges: ["Popular", "Beginner"],
      category: "Skills & Learning",
      gradient: "from-blue-500 to-cyan-500",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: "sl-3",
      title: "Cloud Architecture & DevOps",
      description: "Scale applications with cloud-native technologies",
      questCount: 9,
      toolCount: 6,
      badges: ["High Demand", "Intermediate"],
      category: "Skills & Learning",
      gradient: "from-green-500 to-teal-500",
      icon: <Zap className="w-6 h-6" />,
    },
  ],
  "Professional Growth": [
    {
      id: "pg-1",
      title: "Tech Leadership & Management",
      description: "Lead engineering teams and drive technical strategy",
      questCount: 8,
      toolCount: 5,
      badges: ["Executive", "Advanced"],
      category: "Professional Growth",
      gradient: "from-orange-500 to-red-500",
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: "pg-2",
      title: "Product Management for Tech",
      description: "Bridge technology and business with product thinking",
      questCount: 10,
      toolCount: 7,
      badges: ["Strategic", "Intermediate"],
      category: "Professional Growth",
      gradient: "from-indigo-500 to-purple-500",
      icon: <Briefcase className="w-6 h-6" />,
    },
  ],
  "Startup & Tech Ideas": [
    {
      id: "st-1",
      title: "MVP Development & Launch",
      description: "Turn your ideas into successful tech products",
      questCount: 6,
      toolCount: 9,
      badges: ["Entrepreneurial", "Practical"],
      category: "Startup & Tech Ideas",
      gradient: "from-yellow-500 to-orange-500",
      icon: <Rocket className="w-6 h-6" />,
    },
    {
      id: "st-2",
      title: "Tech Startup Ecosystem",
      description: "Navigate funding, scaling, and market validation",
      questCount: 7,
      toolCount: 4,
      badges: ["Business", "Advanced"],
      category: "Startup & Tech Ideas",
      gradient: "from-pink-500 to-rose-500",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ],
  "Personal Productivity": [
    {
      id: "pp-1",
      title: "AI-Powered Productivity",
      description: "Leverage AI tools to 10x your personal efficiency",
      questCount: 5,
      toolCount: 15,
      badges: ["Life Changing", "Beginner"],
      category: "Personal Productivity",
      gradient: "from-emerald-500 to-green-500",
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      id: "pp-2",
      title: "Remote Work Mastery",
      description: "Excel in distributed teams and async collaboration",
      questCount: 4,
      toolCount: 8,
      badges: ["Essential", "Intermediate"],
      category: "Personal Productivity",
      gradient: "from-violet-500 to-purple-500",
      icon: <Users className="w-6 h-6" />,
    },
  ],
};

// Mock recommended cards
const mockRecommendedCards = [
  {
    id: "rec-1",
    title: "React Advanced Patterns",
    description: "Master advanced React patterns and performance optimization",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Frontend",
    difficulty: "Advanced",
    completionRate: 78,
    estimatedTime: "6h",
  },
  {
    id: "rec-2",
    title: "Python Data Science Pipeline",
    description: "Build end-to-end data pipelines with Python and pandas",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "Data Science",
    difficulty: "Intermediate",
    completionRate: 85,
    estimatedTime: "8h",
  },
  {
    id: "rec-3",
    title: "Kubernetes Production Deployment",
    description: "Deploy and manage applications in production Kubernetes",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop&crop=center&auto=format&q=75",
    category: "DevOps",
    difficulty: "Advanced",
    completionRate: 72,
    estimatedTime: "12h",
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
              {sectionTitle === "Skills & Learning" && (
                <BookOpen className="w-6 h-6 text-purple-500" />
              )}
              {sectionTitle === "Professional Growth" && (
                <TrendingUp className="w-6 h-6 text-orange-500" />
              )}
              {sectionTitle === "Startup & Tech Ideas" && (
                <Rocket className="w-6 h-6 text-pink-500" />
              )}
              {sectionTitle === "Personal Productivity" && (
                <Zap className="w-6 h-6 text-green-500" />
              )}
              {sectionTitle}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer group"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-full h-32 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <div className="text-white">{card.icon}</div>
                    </div>
                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-2">
                      {card.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>{card.questCount} quests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span>{card.toolCount} tools</span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.badges.map((badge) => (
                        <Badge
                          key={badge}
                          className={`text-xs ${getBadgeColor(badge)}`}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    {/* Explore Button */}
                    <Button
                      onClick={() => handleExploreClick(card.id, card.category)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Recommended for You Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            Recommended for You
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecommendedCards.map((card) => (
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

        {/* Recently Viewed by Others Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-500" />
            Recently Viewed by Others
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecentlyViewed.map((card) => (
              <Card
                key={card.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <Badge className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm text-xs">
                    {card.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold line-clamp-2">
                    {card.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm leading-relaxed line-clamp-2">
                    {card.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span
                      className={`px-2 py-1 rounded-full ${getDifficultyColor(
                        card.difficulty
                      )}`}
                    >
                      {card.difficulty}
                    </span>
                    <span>{card.estimatedTime}</span>
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
