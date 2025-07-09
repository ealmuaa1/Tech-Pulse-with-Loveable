/**
 * Progress tracking data structure
 * Tracks user's learning progress, XP, and achievements
 */
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface LearningProgress {
  userId: string;
  totalXp: number;
  level: number;
  completedQuizzes: number[];
  completedFlashcards: number[];
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
}

// XP required for each level (level 1 starts at 0 XP)
export const levelThresholds = [
  0, // Level 1
  100, // Level 2
  250, // Level 3
  500, // Level 4
  1000, // Level 5
  2000, // Level 6
  4000, // Level 7
  8000, // Level 8
  16000, // Level 9
  32000, // Level 10
];

export const achievements: Achievement[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "🎯",
    xp: 50,
    unlocked: false,
  },
  {
    id: 2,
    name: "Flashcard Master",
    description: "Complete 10 flashcard sets",
    icon: "🎴",
    xp: 100,
    unlocked: false,
  },
  {
    id: 3,
    name: "Quiz Champion",
    description: "Score 100% on any quiz",
    icon: "🏆",
    xp: 200,
    unlocked: false,
  },
  {
    id: 4,
    name: "Learning Streak",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    xp: 150,
    unlocked: false,
  },
  {
    id: 5,
    name: "Knowledge Seeker",
    description: "Complete quizzes in 3 different categories",
    icon: "📚",
    xp: 300,
    unlocked: false,
  },
];

// Helper function to calculate level based on XP
export const calculateLevel = (xp: number): number => {
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (xp >= levelThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Helper function to calculate XP needed for next level
export const xpToNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  if (currentLevel >= levelThresholds.length) {
    return 0; // Max level reached
  }
  return levelThresholds[currentLevel] - currentXp;
};
