import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LearningProgress, xpToNextLevel } from "@/data/progress";
import { Trophy, Star, Target, Flame, BookOpen } from "lucide-react";

interface ProgressTrackerProps {
  progress: LearningProgress;
}

const achievementIcons = {
  "First Steps": Target,
  "Flashcard Master": Star,
  "Quiz Champion": Trophy,
  "Learning Streak": Flame,
  "Knowledge Seeker": BookOpen,
};

export function ProgressTracker({ progress }: ProgressTrackerProps) {
  const xpNeeded = xpToNextLevel(progress.totalXp);
  const progressPercentage =
    (progress.totalXp / (progress.totalXp + xpNeeded)) * 100;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Level {progress.level}</h3>
            <span className="text-sm text-muted-foreground">
              {progress.totalXp} XP
            </span>
          </div>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground text-right">
              {xpNeeded} XP to next level
            </p>
          </div>
        </div>
      </Card>

      {/* Streak */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Learning Streak</h3>
            <p className="text-sm text-muted-foreground">
              {progress.streak} days
            </p>
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Flame className="w-6 h-6 text-primary" />
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="space-y-4">
          {progress.achievements.map((achievement) => {
            const Icon =
              achievementIcons[
                achievement.name as keyof typeof achievementIcons
              ];
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  achievement.unlocked ? "bg-primary/5" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      achievement.unlocked ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        achievement.unlocked
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium">+{achievement.xp} XP</div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
