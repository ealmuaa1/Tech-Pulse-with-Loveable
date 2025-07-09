import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingSearch,
  getTrendingSearches,
  GoogleTrendsError,
} from "@/lib/googleTrends";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { generateTrendFlashcards } from "@/lib/flashcardGenerator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TechIllustration } from "@/components/ui/TechIllustration";

// Placeholder tech explanations (in a real app, this would come from an API or database)
const techExplanations: Record<string, string> = {
  AI: "Artificial Intelligence systems that can learn and make decisions.",
  Blockchain:
    "Distributed ledger technology for secure, transparent transactions.",
  Cloud: "Remote computing services delivered over the internet.",
  Cybersecurity: "Protection of systems and networks from digital attacks.",
  IoT: "Network of physical devices connected to the internet.",
  "Machine Learning": "AI systems that improve through experience.",
  Quantum: "Computing using quantum-mechanical phenomena.",
  Web3: "Decentralized internet built on blockchain technology.",
  VR: "Immersive technology creating simulated environments.",
  AR: "Technology overlaying digital information on the real world.",
};

// Helper function to detect tech category from title
function detectTechCategory(title: string): string {
  const categories = Object.keys(techExplanations);
  const matchedCategory = categories.find((category) =>
    title.toLowerCase().includes(category.toLowerCase())
  );
  return matchedCategory || "Tech";
}

export function TrendingTechCarousel() {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<TrendingSearch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>(
    {}
  );

  const fetchTrends = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTrendingSearches("US", "technology");
      setTrends(data.slice(0, 8)); // Get top 8 trends
    } catch (err) {
      if (err instanceof GoogleTrendsError) {
        setError(err.message);
      } else {
        setError("Failed to fetch trending topics");
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchTrends();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % trends.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + trends.length) % trends.length);
  };

  const handleLearnMore = () => {
    const currentTrend = trends[currentIndex];
    navigate(`/learn/${encodeURIComponent(currentTrend.title)}`);
  };

  const handleImageError = (index: number) => {
    setImageLoadError((prev) => ({ ...prev, [index]: true }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
            className="ml-4"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Retry"}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const currentTrend = trends[currentIndex];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Trending in Tech</h2>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow bg-card"
              onClick={handleLearnMore}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold">
                        {currentTrend.title}
                      </h3>
                      <Badge variant="secondary">{currentTrend.category}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {currentTrend.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {currentTrend.traffic}
                      </span>
                    </div>
                    {currentTrend.relatedQueries.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentTrend.relatedQueries
                          .slice(0, 3)
                          .map((query) => (
                            <Badge key={query} variant="outline">
                              {query}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore();
                    }}
                    className="w-full md:w-auto"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold">Key Insights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-muted-foreground">
                          Category
                        </div>
                        <div className="mt-1">{currentTrend.category}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-sm font-medium text-muted-foreground">
                          Search Volume
                        </div>
                        <div className="mt-1">{currentTrend.traffic}</div>
                      </div>
                    </div>
                  </div>

                  {currentTrend.relatedQueries.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Related Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentTrend.relatedQueries.map((query) => (
                          <Badge key={query} variant="secondary">
                            {query}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center space-x-2 mt-6">
          {trends.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
