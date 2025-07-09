import { supabase } from "@/lib/supabase";

export interface UserProgress {
  totalXP: number;
  completedModules: number;
  totalModules: number;
  currentLevel: number;
  lastQuestId?: string;
  lastQuestTitle?: string;
  lastQuestProgress?: number;
  earnedBadges: Badge[];
  unlockedTools: Tool[];
  streakDays: number;
  weeklyGoalProgress: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "learning" | "achievement" | "streak" | "special";
  earnedAt: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "ai" | "productivity" | "learning" | "analytics";
  unlockRequirement: string;
  isUnlocked: boolean;
  usageCount?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string;
  joinedAt: string;
  lastActiveAt: string;
  preferences: {
    dailyGoal: number;
    reminderTime?: string;
    learningStyle: "visual" | "auditory" | "kinesthetic" | "mixed";
    difficulty: "beginner" | "intermediate" | "advanced";
  };
}

// Mock data for development (replace with actual Supabase queries)
const mockUserProgress: UserProgress = {
  totalXP: 2450,
  completedModules: 8,
  totalModules: 12,
  currentLevel: 5,
  lastQuestId: "ai-fundamentals",
  lastQuestTitle: "AI Fundamentals",
  lastQuestProgress: 75,
  earnedBadges: [
    {
      id: "first-quest",
      name: "First Steps",
      description: "Completed your first learning quest",
      icon: "🚀",
      category: "learning",
      earnedAt: "2024-01-15T10:30:00Z",
      rarity: "common",
    },
    {
      id: "week-streak",
      name: "Week Warrior",
      description: "Maintained a 7-day learning streak",
      icon: "🔥",
      category: "streak",
      earnedAt: "2024-01-20T18:45:00Z",
      rarity: "rare",
    },
    {
      id: "ai-expert",
      name: "AI Explorer",
      description: "Mastered AI fundamentals with 90%+ scores",
      icon: "🧠",
      category: "achievement",
      earnedAt: "2024-01-22T14:20:00Z",
      rarity: "epic",
    },
  ],
  unlockedTools: [
    {
      id: "prompt-generator",
      name: "Smart Prompt Generator",
      description: "Generate optimized prompts for AI models",
      icon: "✨",
      category: "ai",
      unlockRequirement: "Complete AI Fundamentals",
      isUnlocked: true,
      usageCount: 15,
    },
    {
      id: "learning-analytics",
      name: "Learning Analytics",
      description: "Track your learning patterns and insights",
      icon: "📊",
      category: "analytics",
      unlockRequirement: "Reach Level 5",
      isUnlocked: true,
      usageCount: 8,
    },
    {
      id: "ai-study-buddy",
      name: "AI Study Buddy",
      description: "Get personalized learning recommendations",
      icon: "🤖",
      category: "ai",
      unlockRequirement: "Earn Week Warrior badge",
      isUnlocked: false,
    },
  ],
  streakDays: 12,
  weeklyGoalProgress: 80,
};

const mockUserProfile: UserProfile = {
  id: "user-123",
  username: "ai_learner",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex@example.com",
  avatarUrl: null,
  joinedAt: "2024-01-01T00:00:00Z",
  lastActiveAt: new Date().toISOString(),
  preferences: {
    dailyGoal: 30, // minutes
    reminderTime: "19:00",
    learningStyle: "mixed",
    difficulty: "intermediate",
  },
};

/**
 * Fetch user progress data from Supabase
 */
export async function fetchUserProgress(userId: string): Promise<UserProgress> {
  try {
    // TODO: Replace with actual Supabase queries
    // Example queries:
    // 1. Get user stats from user_progress table
    // 2. Get badges from user_badges table
    // 3. Get unlocked tools from user_tools table
    // 4. Calculate streak from user_activity table

    /*
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: badgesData, error: badgesError } = await supabase
      .from('user_badges')
      .select(`
        badge_id,
        earned_at,
        badges (
          name,
          description,
          icon,
          category,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    const { data: toolsData, error: toolsError } = await supabase
      .from('user_tools')
      .select(`
        tool_id,
        unlocked_at,
        usage_count,
        tools (
          name,
          description,
          icon,
          category,
          unlock_requirement
        )
      `)
      .eq('user_id', userId);
    */

    // For now, return mock data
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
    return mockUserProgress;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
}

/**
 * Fetch user profile data from Supabase
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  try {
    // TODO: Replace with actual Supabase query
    /*
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    */

    // For now, return mock data
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay
    return mockUserProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

/**
 * Calculate user level based on XP
 */
export function calculateLevel(xp: number): number {
  // Level progression: 0-100 XP = Level 1, 100-300 XP = Level 2, etc.
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  if (xp < 1500) return 5;
  if (xp < 2200) return 6;
  if (xp < 3000) return 7;
  return Math.floor(xp / 500) + 1; // Higher levels
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentXP: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  const level = calculateLevel(currentXP);
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000];

  let current = currentXP;
  let needed = 0;

  if (level <= 7) {
    const levelStart = thresholds[level - 1];
    const levelEnd = thresholds[level];
    current = currentXP - levelStart;
    needed = levelEnd - levelStart;
  } else {
    const levelStart = (level - 1) * 500;
    const levelEnd = level * 500;
    current = currentXP - levelStart;
    needed = levelEnd - levelStart;
  }

  const percentage = Math.round((current / needed) * 100);

  return { current, needed, percentage };
}
