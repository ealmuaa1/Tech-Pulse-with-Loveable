export interface LearningProgress {
  userId: string;
  totalXp: number;
  level: number;
  completedQuizzes: number[];
  completedFlashcards: number[];
  achievements: string[];
  streak: number;
  lastActive: string;
  memoryToolProgress: {
    matching: Record<number, number>;
    fillInTheBlank: Record<number, number>;
    spacedRepetition: Record<number, number>;
    conceptMap: Record<number, number>;
  };
}

export interface FlashcardType {
  id: string;
  front: string;
  back: string;
  category: string;
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface QuizType {
  id: number;
  title: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xp: number;
}
