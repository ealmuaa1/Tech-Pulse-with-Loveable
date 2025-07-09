import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface ProgressTrackerProps {
  xpPercentage: number;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  earnedBadges?: string[];
}

const CircularProgress: React.FC<{ percentage: number; size?: number }> = ({
  percentage,
  size = 120,
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgb(229 231 235)" // gray-200
          strokeWidth="6"
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#xpGradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="xpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-xs text-gray-500 font-medium">XP</div>
        </div>
      </div>
    </div>
  );
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  xpPercentage,
  completedModules,
  totalModules,
  completedLessons,
  totalLessons,
  earnedBadges = [],
}) => {
  const moduleProgress = (completedModules / totalModules) * 100;
  const lessonProgress = (completedLessons / totalLessons) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Your Progress
        </h3>
        <p className="text-gray-600">Track your learning journey</p>
      </div>

      {/* Circular XP Progress */}
      <div className="flex justify-center">
        <CircularProgress percentage={xpPercentage} />
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {/* Modules Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Modules</span>
            </div>
            <span className="text-sm text-gray-600">
              {completedModules}/{totalModules}
            </span>
          </div>
          <Progress value={moduleProgress} className="h-2" />
        </div>

        {/* Lessons Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Lessons</span>
            </div>
            <span className="text-sm text-gray-600">
              {completedLessons}/{totalLessons}
            </span>
          </div>
          <Progress value={lessonProgress} className="h-2" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {xpPercentage}%
          </div>
          <div className="text-xs text-purple-600 font-medium">Experience</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {completedModules}
          </div>
          <div className="text-xs text-blue-600 font-medium">Modules Done</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {earnedBadges.length}
          </div>
          <div className="text-xs text-green-600 font-medium">Badges</div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">Recent Badges</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300"
              >
                🏆 {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
