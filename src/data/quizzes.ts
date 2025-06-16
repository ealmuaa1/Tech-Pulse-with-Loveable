/**
 * Quiz data structure
 * Each quiz has multiple questions with options and correct answers
 * Includes difficulty level and XP reward
 */
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: QuizQuestion[];
  xp: number;
}

export const quizzes: Quiz[] = [
  {
    id: 1,
    title: "AI Fundamentals Quiz",
    description: "Test your knowledge of basic AI concepts",
    category: "AI",
    difficulty: "beginner",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What is the main goal of Machine Learning?",
        options: [
          "To replace human intelligence",
          "To enable systems to learn from data",
          "To create robots",
          "To process big data",
        ],
        correctAnswer: 1,
        explanation:
          "Machine Learning aims to enable systems to learn and improve from experience without explicit programming.",
      },
      {
        id: 2,
        question: "Which of these is NOT a type of Machine Learning?",
        options: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Reinforcement Learning",
          "Automated Learning",
        ],
        correctAnswer: 3,
        explanation:
          "Automated Learning is not a standard type of Machine Learning. The main types are Supervised, Unsupervised, and Reinforcement Learning.",
      },
      {
        id: 3,
        question: "What is Deep Learning?",
        options: [
          "A type of sleep study",
          "A subset of Machine Learning using neural networks",
          "A programming language",
          "A database system",
        ],
        correctAnswer: 1,
        explanation:
          "Deep Learning is a subset of Machine Learning that uses neural networks with multiple layers to process data.",
      },
    ],
  },
  {
    id: 2,
    title: "Web Development Basics",
    description: "Test your knowledge of web development fundamentals",
    category: "Web Development",
    difficulty: "beginner",
    xp: 50,
    questions: [
      {
        id: 1,
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Hyper Text Modern Language",
        ],
        correctAnswer: 0,
        explanation:
          "HTML stands for Hyper Text Markup Language, the standard language for creating web pages.",
      },
      {
        id: 2,
        question: "Which of these is NOT a JavaScript framework?",
        options: ["React", "Angular", "Django", "Vue"],
        correctAnswer: 2,
        explanation:
          "Django is a Python web framework, not a JavaScript framework.",
      },
      {
        id: 3,
        question: "What is CSS used for?",
        options: [
          "Server-side programming",
          "Database management",
          "Styling and layout of web pages",
          "Backend development",
        ],
        correctAnswer: 2,
        explanation:
          "CSS (Cascading Style Sheets) is used for styling and layout of web pages.",
      },
    ],
  },
];
