import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface TrendTopic {
  id: string;
  name: string;
  title: string;
  category: string;
  summary: string;
  url: string;
  source: string;
  image_url: string;
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
        const response = await fetch("http://localhost:5000/api/daily-trends"); // Assuming your backend is on port 5000
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TrendTopic[] = await response.json();
        setDailyTrends(data);
      } catch (error) {
        console.error("Failed to fetch daily trends:", error);
        setErrorTrends("Failed to load trending topics.");
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
