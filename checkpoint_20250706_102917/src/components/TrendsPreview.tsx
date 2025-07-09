import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  TrendingSearch,
  getTrendingSearches,
  GoogleTrendsError,
} from "@/lib/googleTrends";
import { TrendingUp, AlertCircle } from "lucide-react";

export function TrendsPreview() {
  const [trends, setTrends] = useState<TrendingSearch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTrendingSearches("US", "technology");
        setTrends(data.slice(0, 5)); // Get top 5 trends
      } catch (err) {
        if (err instanceof GoogleTrendsError) {
          setError(err.message);
        } else {
          setError("Failed to fetch trending topics");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Trending in Tech</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="h-32 animate-pulse bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {trend.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {trend.traffic}
                    </span>
                  </div>

                  {trend.relatedQueries.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Related:</p>
                      <div className="flex flex-wrap gap-2">
                        {trend.relatedQueries.slice(0, 2).map((query) => (
                          <span
                            key={query}
                            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                          >
                            {query}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {trend.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={trend.imageUrl}
                        alt={trend.title}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
