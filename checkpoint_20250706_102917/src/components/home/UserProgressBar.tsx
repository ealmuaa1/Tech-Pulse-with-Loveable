import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target } from "lucide-react";
import { gradients, textGradients } from "@/styles/gradients";
import { getXPForNextLevel } from "@/utils/fetchUserProgress";

interface UserProgressBarProps {
  totalXP: number;
  currentLevel: number;
  streakDays: number;
  weeklyGoalProgress: number;
  userName: string;
}

const UserProgressBar: React.FC<UserProgressBarProps> = ({
  totalXP,
  currentLevel,
  streakDays,
  weeklyGoalProgress,
  userName,
}) => {
  const { current, needed, percentage } = getXPForNextLevel(totalXP);
  const nextLevel = currentLevel + 1;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStreakColor = () => {
    if (streakDays >= 30) return "text-purple-600 bg-purple-50";
    if (streakDays >= 14) return "text-orange-600 bg-orange-50";
    if (streakDays >= 7) return "text-blue-600 bg-blue-50";
    return "text-green-600 bg-green-50";
  };

  const getStreakEmoji = () => {
    if (streakDays >= 30) return "🔥";
    if (streakDays >= 14) return "⚡";
    if (streakDays >= 7) return "💪";
    return "🌟";
  };

  return (
    <div
      className={`${gradients.purpleCard} rounded-xl p-6 shadow-lg border border-purple-200/50`}
    >
      {/* Greeting and Level */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {userName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${textGradients.purple}`}>
            Level {currentLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {totalXP.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* XP Progress to Next Level */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress to Level {nextLevel}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {current}/{needed} XP
          </span>
        </div>
        <Progress
          value={percentage}
          className="h-3 bg-white/50"
          style={{
            background:
              "linear-gradient(to right, rgb(147 51 234), rgb(99 102 241))",
          }}
        />
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {percentage}% complete
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Streak */}
        <div className="text-center">
          <div
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStreakColor()}`}
          >
            <span>{getStreakEmoji()}</span>
            <span>{streakDays}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Day Streak
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-1">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200 dark:text-gray-600"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#goalGradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${
                  2 * Math.PI * 20 * (1 - weeklyGoalProgress / 100)
                }`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient
                  id="goalGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {weeklyGoalProgress}% Goal
          </div>
        </div>

        {/* Current Level Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Trophy className="w-3 h-3" />
            <span>L{currentLevel}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Current
          </div>
        </div>
      </div>

      {/* Quick Motivational Message */}
      {percentage >= 80 && (
        <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              You're almost at Level {nextLevel}! Keep going! 🚀
            </span>
          </div>
        </div>
      )}

      {streakDays >= 7 && (
        <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStreakEmoji()}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Amazing {streakDays}-day streak! You're on fire!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProgressBar;
