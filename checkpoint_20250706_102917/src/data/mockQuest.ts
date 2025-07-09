export interface MockLesson {
  id: string;
  title: string;
  content: string;
  sources: string[];
  soWhat: string;
}

export interface MockQuest {
  id: string;
  title: string;
  summary: string;
  lessons: MockLesson[];
  games: string[];
  progress: {
    xpPercentage: number;
    completedModules: number;
    totalModules: number;
    completedLessons: number;
    totalLessons: number;
  };
  badges: {
    earned: string[];
    available: {
      name: string;
      requirement: string;
      description: string;
      icon: string;
    }[];
  };
}

export const mockQuest: MockQuest = {
  id: "ai-fundamentals",
  title: "AI Fundamentals",
  summary:
    "Master the basics of artificial intelligence and machine learning to understand how modern AI systems work.",
  lessons: [
    {
      id: "intro-to-ai",
      title: "Introduction to AI",
      content: `AI is a field of computer science that focuses on creating intelligent machines capable of performing tasks that typically require human intelligence.

Key characteristics of AI:
• Learning from data and experience
• Recognizing patterns and making predictions
• Solving complex problems
• Adapting to new situations

Modern AI systems use machine learning algorithms to improve their performance over time, making them increasingly powerful tools across industries.`,
      sources: [
        "Stanford AI Course",
        "MIT OpenCourseWare",
        "AI Research Papers",
      ],
      soWhat:
        "Understanding AI fundamentals helps you grasp how systems like ChatGPT, recommendation engines, and autonomous vehicles actually work behind the scenes.",
    },
    {
      id: "machine-learning-basics",
      title: "Machine Learning Basics",
      content: `Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed.

Three main types of ML:
• Supervised Learning: Learning from labeled examples
• Unsupervised Learning: Finding patterns in unlabeled data
• Reinforcement Learning: Learning through trial and error

Popular algorithms include linear regression, decision trees, neural networks, and deep learning models.`,
      sources: ["Coursera ML Course", "Google AI Education", "Kaggle Learn"],
      soWhat:
        "ML powers everything from Netflix recommendations to fraud detection. Knowing these basics helps you understand what's possible with data-driven solutions.",
    },
    {
      id: "ethics-in-ai",
      title: "Ethics in AI",
      content: `AI systems must be developed and deployed responsibly to avoid harmful consequences.

Key ethical considerations:
• Bias and fairness in AI decisions
• Privacy and data protection
• Transparency and explainability
• Accountability for AI actions
• Impact on employment and society

Organizations like the EU AI Act and IEEE standards provide frameworks for ethical AI development.`,
      sources: ["AI Ethics Guidelines EU", "Stanford HAI", "Partnership on AI"],
      soWhat:
        "As AI becomes more prevalent, understanding ethics ensures you can build and use AI systems responsibly, avoiding legal issues and societal harm.",
    },
    {
      id: "ai-applications",
      title: "Real-World AI Applications",
      content: `AI is transforming industries and everyday life through practical applications.

Major application areas:
• Healthcare: Diagnostic imaging, drug discovery
• Finance: Fraud detection, algorithmic trading
• Transportation: Autonomous vehicles, route optimization
• Entertainment: Content recommendation, game AI
• Communication: Language translation, chatbots

Each application leverages different AI techniques optimized for specific use cases.`,
      sources: [
        "McKinsey AI Report",
        "World Economic Forum",
        "Tech Industry Reports",
      ],
      soWhat:
        "Recognizing AI applications helps you identify opportunities in your field and understand how AI might impact your career or business.",
    },
  ],
  games: ["flashcards", "quiz", "memory", "fill-blank"],
  progress: {
    xpPercentage: 65,
    completedModules: 2,
    totalModules: 4,
    completedLessons: 2,
    totalLessons: 4,
  },
  badges: {
    earned: ["Explorer", "Quick Learner"],
    available: [
      {
        name: "Prompt Explorer",
        requirement: "Complete 3 lessons",
        description: "You've explored multiple AI concepts",
        icon: "🗺️",
      },
      {
        name: "Knowledge Guru",
        requirement: "Reach 100% XP",
        description: "Master of AI fundamentals",
        icon: "🧠",
      },
      {
        name: "Game Master",
        requirement: "Complete all 4 game types",
        description: "Conquered all learning games",
        icon: "🎮",
      },
      {
        name: "Ethics Champion",
        requirement: "Complete Ethics lesson with 100% quiz score",
        description: "Committed to responsible AI",
        icon: "⚖️",
      },
    ],
  },
};

// Mock game data
export const mockFlashcards = [
  {
    id: "fc1",
    front: "What does AI stand for?",
    back: "Artificial Intelligence - the simulation of human intelligence in machines",
  },
  {
    id: "fc2",
    front: "What are the three main types of Machine Learning?",
    back: "Supervised Learning, Unsupervised Learning, and Reinforcement Learning",
  },
  {
    id: "fc3",
    front: "What is bias in AI?",
    back: "Systematic errors or prejudices in AI models that can lead to unfair or discriminatory outcomes",
  },
  {
    id: "fc4",
    front: "Name one real-world application of AI in healthcare",
    back: "Diagnostic imaging, drug discovery, personalized treatment plans, or medical chatbots",
  },
];

export const mockQuizQuestions = [
  {
    id: "q1",
    question: "Which of the following best describes Artificial Intelligence?",
    options: [
      "A computer program that can only follow pre-written instructions",
      "The simulation of human intelligence in machines that can learn and adapt",
      "A type of calculator that can solve complex math problems",
      "Software that can only work with numbers",
    ],
    correctAnswer: 1,
    explanation:
      "AI is the simulation of human intelligence in machines that are programmed to think, learn, and adapt like humans.",
  },
  {
    id: "q2",
    question: "What type of machine learning uses labeled training data?",
    options: [
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Supervised Learning",
      "Deep Learning",
    ],
    correctAnswer: 2,
    explanation:
      "Supervised learning uses labeled training data where the correct answers are provided to train the model.",
  },
  {
    id: "q3",
    question: "Which is NOT a key ethical consideration in AI development?",
    options: [
      "Bias and fairness",
      "Privacy protection",
      "Code optimization speed",
      "Transparency and explainability",
    ],
    correctAnswer: 2,
    explanation:
      "While code optimization is important for performance, it's not a primary ethical consideration. The main ethical concerns are bias, privacy, transparency, and accountability.",
  },
  {
    id: "q4",
    question: "In which industry is AI commonly used for fraud detection?",
    options: ["Agriculture", "Finance", "Entertainment", "Sports"],
    correctAnswer: 1,
    explanation:
      "The finance industry extensively uses AI for fraud detection by analyzing transaction patterns and identifying suspicious activities.",
  },
];

export default mockQuest;
