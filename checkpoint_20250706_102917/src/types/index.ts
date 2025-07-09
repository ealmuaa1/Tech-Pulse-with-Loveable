export interface FlashcardType {
  id: string;
  topic: string;
  front: string;
  back: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
}

export interface LearningProgress {
  userId: string;
  totalXp: number;
  level: number;
  completedQuizzes: number[];
  completedFlashcards: string[];
  achievements: string[];
  streak: number;
  lastActive: Date;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
}
