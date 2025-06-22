import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Settings, Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";

// Import the new home components
import UserProgressBar from "@/components/home/UserProgressBar";
import ContinueQuestCard from "@/components/home/ContinueQuestCard";
import DailySparkCard from "@/components/home/DailySparkCard";
import BadgeShowcase from "@/components/home/BadgeShowcase";
import UnlockedTools from "@/components/home/UnlockedTools";
import MicroContentGrid from "@/components/home/MicroContentGrid";
import TodaysTopDigests from "@/components/home/TodaysTopDigests";

// Import utilities
import {
  fetchUserProgress,
  fetchUserProfile,
  UserProgress,
  UserProfile,
  calculateLevel,
} from "@/utils/fetchUserProgress";
import { fetchDailyTrend, DailyTrend } from "@/utils/fetchDailyTrend";
import { gradients } from "@/styles/gradients";

// Import existing context if available
// import { useAuth } from '@/contexts/AuthContext';

/**
 * HomePage component - Personalized AI learning dashboard
 * Inspired by Coursiv, Duolingo, and Notion
 * Features:
 * - Personalized greeting and progress tracking
 * - Continue Quest functionality
 * - Daily AI Spark trending content
 * - Badge showcase and achievements
 * - Unlocked tools based on progress
 * - Micro-learning content grid
 * - Theme toggle and settings
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Uncomment when auth context is available

  // State management
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTrend, setDailyTrend] = useState<DailyTrend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "gradient">("light");

  // Mock user ID for development - replace with actual auth
  const mockUserId = "user-123";

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [progressData, profileData, trendData] = await Promise.all([
          fetchUserProgress(mockUserId),
          fetchUserProfile(mockUserId),
          fetchDailyTrend(),
        ]);

        setUserProgress(progressData);
        setUserProfile(profileData);
        setDailyTrend(trendData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Theme toggle functionality
  const toggleTheme = () => {
    const themes: Array<"light" | "dark" | "gradient"> = [
      "light",
      "dark",
      "gradient",
    ];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);

    // Apply theme to document root
    document.documentElement.className = nextTheme;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading your personalized dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Data not available
  if (!userProgress || !userProfile || !dailyTrend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Dashboard data unavailable
          </p>
        </div>
      </div>
    );
  }

  const firstName = userProfile.firstName || userProfile.username || "Learner";
  const hasActiveQuest = Boolean(userProgress.lastQuestId);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "gradient"
          ? "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20"
          : "bg-gray-50 dark:bg-gray-900"
      }`}
    >
      {/* Header with Theme Toggle */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Learning Dashboard
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your personalized AI learning experience
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="border-gray-200 dark:border-gray-700"
              >
                {theme === "light" && <Sun className="w-4 h-4" />}
                {theme === "dark" && <Moon className="w-4 h-4" />}
                {theme === "gradient" && <Palette className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile/settings")}
                className="border-gray-200 dark:border-gray-700"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        {/* Progress Section - Full Width */}
        <div className="mb-8">
          <UserProgressBar
            totalXP={userProgress.totalXP}
            currentLevel={userProgress.currentLevel}
            streakDays={userProgress.streakDays}
            weeklyGoalProgress={userProgress.weeklyGoalProgress}
            userName={firstName}
          />
        </div>

        {/* Today's Top Digests - Full Width */}
        <div className="mb-8">
          <TodaysTopDigests maxDisplay={4} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Continue Quest Card */}
          <ContinueQuestCard
            questId={userProgress.lastQuestId}
            questTitle={userProgress.lastQuestTitle}
            questProgress={userProgress.lastQuestProgress}
            estimatedTimeRemaining={15} // This could be calculated from quest data
            questCategory="AI" // This could come from quest data
            questDifficulty="intermediate"
            lastActivity={userProfile.lastActiveAt}
            hasActiveQuest={hasActiveQuest}
          />

          {/* Daily AI Spark */}
          <DailySparkCard trend={dailyTrend} isLoading={false} />
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Badge Showcase */}
          <BadgeShowcase
            badges={userProgress.earnedBadges}
            maxDisplay={3}
            showViewAll={true}
          />

          {/* Unlocked Tools */}
          <UnlockedTools
            tools={userProgress.unlockedTools}
            maxDisplay={4}
            showLocked={true}
          />
        </div>

        {/* Micro Learning Section - Full Width */}
        <div className="mb-8">
          <MicroContentGrid maxDisplay={4} refreshInterval={30000} />
        </div>

        {/* Quick Stats Banner */}
        <div
          className={`${gradients.purpleCard} rounded-xl p-6 border border-purple-200/50`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {userProgress.totalXP.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total XP
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {userProgress.completedModules}/{userProgress.totalModules}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Modules
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {userProgress.earnedBadges.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Badges
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {userProgress.streakDays}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Day Streak
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default HomePage;
