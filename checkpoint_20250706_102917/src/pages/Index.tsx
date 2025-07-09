import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import { TrendingTechCarousel } from "@/components/TrendingTechCarousel";

/**
 * Index page component - Landing page of the application
 * Features:
 * - Hero section with call-to-action
 * - Feature highlights with navigation
 * - Responsive design
 */
const Index = () => {
  const navigate = useNavigate();

  // Feature cards data with navigation
  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: "Daily Digests",
      description: "Stay updated with curated tech insights",
      path: "/digests",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-green-500" />,
      title: "Learn & Grow",
      description: "Expand your knowledge with structured learning",
      path: "/learn",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-purple-500" />,
      title: "Spark Ideas",
      description: "Turn insights into innovative ideas",
      path: "/ideas",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            Welcome to Tech Pulse
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Your personalized tech insights, delivered fresh. Stay ahead of the
            curve with curated content and smart learning.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            onClick={() => navigate("/learn")}
          >
            Get Started
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.path)}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tech Carousel */}
      <TrendingTechCarousel />
    </div>
  );
};

export default Index;
