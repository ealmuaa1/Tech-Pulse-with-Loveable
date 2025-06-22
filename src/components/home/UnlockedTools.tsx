import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Lock, Unlock, ChevronRight, Zap } from "lucide-react";
import { gradients, cardEffects } from "@/styles/gradients";
import { useNavigate } from "react-router-dom";
import type { Tool } from "@/utils/fetchUserProgress";

interface UnlockedToolsProps {
  tools: Tool[];
  maxDisplay?: number;
  showLocked?: boolean;
}

const UnlockedTools: React.FC<UnlockedToolsProps> = ({
  tools,
  maxDisplay = 4,
  showLocked = true,
}) => {
  const navigate = useNavigate();

  const unlockedTools = tools.filter((tool) => tool.isUnlocked);
  const lockedTools = tools.filter((tool) => !tool.isUnlocked);

  const displayTools = showLocked
    ? [
        ...unlockedTools.slice(0, Math.floor(maxDisplay * 0.7)),
        ...lockedTools.slice(0, Math.floor(maxDisplay * 0.3)),
      ]
    : unlockedTools.slice(0, maxDisplay);

  const handleUseTool = (tool: Tool) => {
    if (tool.isUnlocked) {
      navigate(`/tools/${tool.id}`);
    }
  };

  const handleViewAllTools = () => {
    navigate("/tools");
  };

  const getCategoryIcon = (category: Tool["category"]) => {
    const icons = {
      ai: "🤖",
      productivity: "⚡",
      learning: "📚",
      analytics: "📊",
    };
    return icons[category];
  };

  const getCategoryColor = (category: Tool["category"]) => {
    const colors = {
      ai: "bg-purple-100 text-purple-700 border-purple-200",
      productivity: "bg-green-100 text-green-700 border-green-200",
      learning: "bg-blue-100 text-blue-700 border-blue-200",
      analytics: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[category];
  };

  const formatUsageCount = (count?: number) => {
    if (!count) return "New";
    if (count === 1) return "1 use";
    if (count < 10) return `${count} uses`;
    if (count < 100) return `${count} uses`;
    return "99+ uses";
  };

  if (tools.length === 0) {
    return (
      <div
        className={`${gradients.tealCard} ${cardEffects.soft} rounded-xl p-6 border border-teal-200/50`}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center opacity-50">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Unlock AI Tools
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete quests and earn badges to unlock powerful AI-powered
            learning tools.
          </p>
          <Button
            onClick={() => navigate("/learn")}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
          >
            Start Learning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${gradients.tealCard} ${cardEffects.coloredGlow.teal} rounded-xl p-6 border border-teal-200/50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI Tools
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedTools.length} of {tools.length} unlocked
            </p>
          </div>
        </div>
        {tools.length > maxDisplay && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewAllTools}
            className="border-teal-200 text-teal-600 hover:bg-teal-50"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-3">
        {displayTools.map((tool, index) => (
          <div
            key={tool.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              tool.isUnlocked
                ? "bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/70 cursor-pointer"
                : "bg-gray-50/50 border-gray-200/50 opacity-75"
            }`}
            onClick={() => handleUseTool(tool)}
          >
            <div className="flex items-center gap-3">
              {/* Tool Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                  tool.isUnlocked
                    ? "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm"
                    : "bg-gray-200 border border-gray-300"
                }`}
              >
                {tool.icon}
              </div>

              {/* Tool Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`font-semibold truncate ${
                      tool.isUnlocked
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {tool.name}
                  </h4>
                  <Badge
                    className={getCategoryColor(tool.category)}
                    variant="outline"
                  >
                    {getCategoryIcon(tool.category)} {tool.category}
                  </Badge>
                </div>
                <p
                  className={`text-sm mb-1 line-clamp-1 ${
                    tool.isUnlocked
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-400"
                  }`}
                >
                  {tool.description}
                </p>
                {!tool.isUnlocked && (
                  <p className="text-xs text-gray-500">
                    🔒 {tool.unlockRequirement}
                  </p>
                )}
              </div>

              {/* Status and Action */}
              <div className="flex flex-col items-center gap-1">
                {tool.isUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">
                      {formatUsageCount(tool.usageCount)}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Locked</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      {unlockedTools.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tools Unlocked
            </span>
            <span className="text-sm text-teal-600 font-bold">
              {unlockedTools.length}/{tools.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(unlockedTools.length / tools.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Motivational Message */}
      {unlockedTools.length === tools.length ? (
        <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Amazing! You've unlocked all available tools! 🎉
            </span>
          </div>
        </div>
      ) : (
        lockedTools.length > 0 && (
          <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Keep learning to unlock {lockedTools.length} more tool
                {lockedTools.length !== 1 ? "s" : ""}!
              </span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UnlockedTools;
