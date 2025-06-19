import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { generateTrendingTopics } from "@/lib/trendGenerator";

interface TrendTopic {
  id: string;
  topic: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  url: string;
  source: string;
}

interface TrendContextType {
  dailyTrends: TrendTopic[];
  loadingTrends: boolean;
  errorTrends: string | null;
}

const TrendContext = createContext<TrendContextType | undefined>(undefined);

export const TrendProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTrends, setDailyTrends] = useState<TrendTopic[]>([]);
  const [loadingTrends, setLoadingTrends] = useState<boolean>(true);
  const [errorTrends, setErrorTrends] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyTrends = async () => {
      try {
        setLoadingTrends(true);
        setErrorTrends(null);
        const mockData = generateTrendingTopics();
        setDailyTrends(mockData);
      } catch (error: any) {
        console.error("Failed to fetch daily trends:", error);
        setErrorTrends(error.message || "Failed to load trending topics.");
      } finally {
        setLoadingTrends(false);
      }
    };

    fetchDailyTrends();
  }, []);

  return (
    <TrendContext.Provider value={{ dailyTrends, loadingTrends, errorTrends }}>
      {children}
    </TrendContext.Provider>
  );
};

export const useTrends = () => {
  const context = useContext(TrendContext);
  if (context === undefined) {
    throw new Error("useTrends must be used within a TrendProvider");
  }
  return context;
};
