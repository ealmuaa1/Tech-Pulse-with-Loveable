import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import {
  Lightbulb,
  Heart,
  X,
  RefreshCw,
  Bookmark,
  Share2,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Idea sparks data
 * Each idea represents a potential innovation or concept
 */
const ideaSparks = [
  {
    id: 1,
    title: "Smart City Air Quality",
    prompt:
      "What if every streetlight could monitor air quality and automatically adjust traffic patterns based on real-time pollution data?",
    industry: "Urban Tech",
    image:
      "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600&h=400&fit=crop",
    tags: ["IoT", "Environmental", "Smart Cities"],
    liked: false,
    saved: false,
  },
  {
    id: 2,
    title: "AI-Powered Learning Companion",
    prompt:
      "Imagine an AI tutor that adapts its teaching style to each student's learning patterns, emotional state, and cultural background in real-time.",
    industry: "EdTech",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    tags: ["AI", "Education", "Personalization"],
    liked: true,
    saved: true,
  },
  {
    id: 3,
    title: "Quantum-Encrypted Communication",
    prompt:
      "What if we could create unhackable communication networks using quantum entanglement for instant, secure global messaging?",
    industry: "Quantum Tech",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    tags: ["Quantum", "Security", "Communication"],
    liked: false,
    saved: false,
  },
  {
    id: 4,
    title: "Blockchain Medical Records",
    prompt:
      "How might we use blockchain to create a universal, patient-controlled medical record system that works across all healthcare providers?",
    industry: "HealthTech",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    tags: ["Blockchain", "Healthcare", "Privacy"],
    liked: false,
    saved: true,
  },
  {
    id: 5,
    title: "Sustainable Computing",
    prompt:
      "What if data centers could be powered entirely by excess heat from urban infrastructure, creating a circular energy economy?",
    industry: "GreenTech",
    image:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
    tags: ["Sustainability", "Data Centers", "Energy"],
    liked: true,
    saved: false,
  },
];

/**
 * Ideas page component
 * Features:
 * - Swipeable idea cards
 * - Like and save functionality
 * - Tag system
 * - Industry categorization
 * - Interactive UI elements
 */
const Ideas = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ideas, setIdeas] = useState(ideaSparks);
  const [likedIdeas, setLikedIdeas] = useState<number[]>([2, 5]);
  const [savedIdeas, setSavedIdeas] = useState<number[]>([2, 4]);

  const currentIdea = ideas[currentIndex];

  // Navigate to next idea
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ideas.length);
  };

  // Navigate to previous idea
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + ideas.length) % ideas.length);
  };

  // Toggle like status for an idea
  const toggleLike = (id: number) => {
    setLikedIdeas((prev) => {
      const newLikes = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      toast.success(
        prev.includes(id) ? "Removed from favorites" : "Added to favorites",
        { duration: 2000 }
      );

      return newLikes;
    });
  };

  // Toggle save status for an idea
  const toggleSave = (id: number) => {
    setSavedIdeas((prev) => {
      const newSaves = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      toast.success(
        prev.includes(id) ? "Removed from saved" : "Saved for later",
        { duration: 2000 }
      );

      return newSaves;
    });
  };

  // Refresh ideas
  const handleRefresh = () => {
    toast.info("Loading new ideas...", { duration: 2000 });
    setCurrentIndex(0);
    // In a real app, this would fetch new ideas from an API
  };

  // Share idea
  const handleShare = () => {
    toast.success("Share feature coming soon!", { duration: 2000 });
    console.log("Sharing idea:", currentIdea.title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Idea Sparks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Swipe through innovation inspiration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Main Card */}
        <div className="relative">
          <div className="group">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={currentIdea.image}
                  alt={currentIdea.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                {/* Industry badge */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm shadow-lg border-0 text-sm px-4 py-2">
                    {currentIdea.industry}
                  </Badge>
                </div>

                {/* Navigation dots */}
                <div className="absolute top-6 right-6 flex gap-2">
                  {ideas.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? "bg-white shadow-lg scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    {currentIdea.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      Innovation Prompt
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {currentIdea.prompt}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {currentIdea.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-full px-3 py-1 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => toggleLike(currentIdea.id)}
                    size="lg"
                    variant="outline"
                    className={`rounded-2xl border-2 transform transition-all duration-200 hover:scale-110 ${
                      likedIdeas.includes(currentIdea.id)
                        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50"
                        : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 hover:text-red-500 dark:hover:text-red-400"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        likedIdeas.includes(currentIdea.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {likedIdeas.includes(currentIdea.id) ? "Loved" : "Love it"}
                  </Button>

                  <Button
                    onClick={() => toggleSave(currentIdea.id)}
                    size="lg"
                    variant="outline"
                    className={`rounded-2xl border-2 transform transition-all duration-200 hover:scale-110 ${
                      savedIdeas.includes(currentIdea.id)
                        ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 mr-2 ${
                        savedIdeas.includes(currentIdea.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {savedIdeas.includes(currentIdea.id) ? "Saved" : "Save"}
                  </Button>

                  <Button
                    onClick={handleShare}
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-500 dark:hover:text-purple-400 transform transition-all duration-200 hover:scale-110"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2">
            <Button
              onClick={handlePrevious}
              size="icon"
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-0 hover:bg-white dark:hover:bg-gray-800 transform transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>

          <div className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2">
            <Button
              onClick={handleNext}
              size="icon"
              variant="outline"
              className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-0 hover:bg-white dark:hover:bg-gray-800 transform transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Refresh button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleRefresh}
            size="lg"
            variant="outline"
            className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-500 dark:hover:text-purple-400 transform transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Get New Ideas
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="ideas" />
    </div>
  );
};

export default Ideas;
