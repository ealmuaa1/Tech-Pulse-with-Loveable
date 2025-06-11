import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

interface Trend {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  date: string;
}

const mockTrends: Trend[] = [
  {
    id: "1",
    title: "The Rise of AI Assistants",
    summary: "How AI assistants are transforming productivity and daily life.",
    category: "Artificial Intelligence",
    imageUrl: "https://source.unsplash.com/random/800x600/?ai",
    date: "2024-03-15",
  },
  {
    id: "2",
    title: "Web3 Development Trends",
    summary:
      "Latest developments in decentralized applications and blockchain technology.",
    category: "Web3",
    imageUrl: "https://source.unsplash.com/random/800x600/?blockchain",
    date: "2024-03-14",
  },
  {
    id: "3",
    title: "Cloud Native Architecture",
    summary: "Best practices for building scalable cloud applications.",
    category: "Cloud Computing",
    imageUrl: "https://source.unsplash.com/random/800x600/?cloud",
    date: "2024-03-13",
  },
];

const Dashboard = () => {
  const [trends, setTrends] = useState<Trend[]>(mockTrends);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const trendsCollection = collection(db, "trends");
        const trendsSnapshot = await getDocs(trendsCollection);
        const trendsList = trendsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Trend[];

        if (trendsList.length > 0) {
          setTrends(trendsList);
        }
      } catch (error) {
        console.error("Error fetching trends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tech Trends Dashboard
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Stay updated with the latest technology trends and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trends.map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={trend.imageUrl}
                alt={trend.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                  {trend.category}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {trend.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {trend.summary}
                </p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(trend.date).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
