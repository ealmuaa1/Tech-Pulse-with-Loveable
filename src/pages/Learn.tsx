import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge, Progress, Button } from "@/components/ui";
import { Clock, BookOpen, Zap, Lock, CheckCircle2, Play } from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import { achievements } from "@/data/achievements";

const Learn = () => {
  const { trend } = useParams();
  const navigate = useNavigate();
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [trendFlashcards, setTrendFlashcards] = useState<FlashcardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<LearningProgress>({
    userId: "user123",
    totalXp: 0,
    level: 1,
    completedQuizzes: [],
    completedFlashcards: [],
    achievements: achievements,
    streak: 0,
    lastActive: new Date(),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Achievements section */}
        // ... existing code ...
        {/* Learning Quests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningQuests.map((quest) => (
            <div
              key={quest.id}
              className={`group transform transition-all duration-300 hover:scale-[1.02] ${
                quest.locked ? "opacity-60" : ""
              }`}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={quest.image}
                    alt={quest.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className={`bg-gradient-to-r ${getDifficultyColor(
                        quest.difficulty
                      )} text-white backdrop-blur-sm shadow-md`}
                    >
                      {quest.difficulty}
                    </Badge>
                  </div>
                  {quest.locked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white text-center">
                        <Target className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-semibold">Locked</div>
                        <div className="text-sm">
                          Complete previous quests to unlock
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-200">
                    {quest.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{quest.progress}%</span>
                    </div>
                    <Progress value={quest.progress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quest.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {quest.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {quest.xp} XP
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/quest/${quest.id}`)}
                    disabled={quest.locked}
                  >
                    {quest.locked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : quest.completed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Quest
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
