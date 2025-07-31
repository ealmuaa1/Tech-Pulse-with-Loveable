import { Topic } from "./topicService";

// Mock trending topics data with reliable Unsplash images
const mockTrendingTopics: Topic[] = [
  {
    id: "ai-fundamentals",
    created_at: new Date().toISOString(),
    title: "AI Fundamentals",
    summary:
      "Understand the basics of Artificial Intelligence, how it works, its types, and real-world use cases.",
    image_url:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "Tech Pulse",
    slug: "ai-fundamentals",
    category: "AI",
    difficulty: "Beginner",
    duration: 2 * 60, // 2 hours in minutes
    xp: 500,
    lessons: 6,
    flashcards: [
      {
        term: "What is Artificial Intelligence (AI)?",
        definition:
          "The simulation of human intelligence by machines to perform tasks like learning, reasoning, and decision-making.",
      },
      {
        term: "What are the main types of AI?",
        definition: "Narrow AI, General AI, and Superintelligent AI.",
      },
      {
        term: "What is machine learning?",
        definition:
          "A subset of AI that enables machines to learn from data without being explicitly programmed.",
      },
      {
        term: "Name a common use case of AI in everyday life.",
        definition: "Voice assistants like Siri or Alexa.",
      },
      {
        term: "What is the Turing Test?",
        definition:
          "A test to evaluate a machine's ability to exhibit human-like intelligence.",
      },
      {
        term: "Difference between supervised and unsupervised learning?",
        definition:
          "Supervised learning uses labeled data; unsupervised learning uses unlabeled data.",
      },
    ],
    quiz: [
      {
        question: "Which of the following is NOT a type of AI?",
        options: ["Narrow AI", "Broad AI", "General AI", "Superintelligent AI"],
        correctAnswer: "Broad AI",
      },
      {
        question: "What is the goal of the Turing Test?",
        options: [
          "To improve neural networks",
          "To measure memory capacity",
          "To evaluate human-like behavior in machines",
          "To test GPU speed",
        ],
        correctAnswer: "To evaluate human-like behavior in machines",
      },
      {
        question: "Which field enables AI to learn from data?",
        options: ["Data Mining", "Machine Learning", "Robotics", "Automation"],
        correctAnswer: "Machine Learning",
      },
      {
        question: "Which is an example of Narrow AI?",
        options: [
          "Human-level general intelligence",
          "AI that writes books",
          "Google Maps route optimization",
          "Conscious robots",
        ],
        correctAnswer: "Google Maps route optimization",
      },
      {
        question: "Unsupervised learning uses:",
        options: [
          "Pre-labeled data",
          "Historical reports",
          "Labeled and unlabeled data",
          "Unlabeled data only",
        ],
        correctAnswer: "Unlabeled data only",
      },
    ],
  },
  {
    id: "1",
    created_at: new Date().toISOString(),
    title: "AI-Powered Code Generation with GitHub Copilot",
    summary:
      "Discover how AI is revolutionizing software development with intelligent code completion and generation tools that boost productivity by 40%.",
    image_url:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "GitHub Trends",
    slug: "ai-code-generation-copilot",
    category: "AI",
    difficulty: "Intermediate",
    duration: 25 * 60, // 25 hours in minutes
    xp: 1200,
    lessons: 8,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    title: "Web3 and Decentralized Applications (DApps)",
    summary:
      "Learn to build decentralized applications on Ethereum blockchain with smart contracts, Web3.js, and modern frontend frameworks.",
    image_url:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "CoinDesk",
    slug: "web3-dapps-ethereum",
    category: "Blockchain",
    difficulty: "Advanced",
    duration: 35 * 60, // 35 hours in minutes
    xp: 1800,
    lessons: 12,
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    title: "Cloud-Native Development with Kubernetes",
    summary:
      "Master container orchestration and microservices architecture using Kubernetes, Docker, and cloud-native development practices.",
    image_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "CNCF",
    slug: "kubernetes-cloud-native",
    category: "Cloud",
    difficulty: "Advanced",
    duration: 30 * 60, // 30 hours in minutes
    xp: 1500,
    lessons: 10,
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    title: "Cybersecurity: Zero Trust Architecture",
    summary:
      "Implement modern security frameworks with zero trust principles, identity management, and threat detection systems.",
    image_url:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "NIST",
    slug: "zero-trust-cybersecurity",
    category: "Security",
    difficulty: "Intermediate",
    duration: 20 * 60, // 20 hours in minutes
    xp: 1000,
    lessons: 7,
  },
];

// Additional trending topics for variety with reliable images
const additionalTopics: Topic[] = [
  {
    id: "5",
    created_at: new Date().toISOString(),
    title: "Machine Learning with Python and TensorFlow",
    summary:
      "Build and deploy ML models using Python, TensorFlow, and scikit-learn for real-world data science applications.",
    image_url:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "Google AI",
    slug: "ml-python-tensorflow",
    category: "Data Science",
    difficulty: "Intermediate",
    duration: 28 * 60,
    xp: 1400,
    lessons: 9,
  },
  {
    id: "6",
    created_at: new Date().toISOString(),
    title: "React Native Cross-Platform Development",
    summary:
      "Create mobile apps for iOS and Android using React Native, Expo, and modern mobile development patterns.",
    image_url:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&h=480&fit=crop&crop=center&auto=format&q=75",
    source: "React Native",
    slug: "react-native-mobile",
    category: "Mobile",
    difficulty: "Intermediate",
    duration: 22 * 60,
    xp: 1100,
    lessons: 8,
  },
];

// Simulate API delay
const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Get trending topics (limit to 4 for the Learn page)
export const getTrendingTopics = async (
  limit: number = 4
): Promise<Topic[]> => {
  await simulateDelay(800); // Simulate network delay

  // Randomly select topics to simulate dynamic content
  const allTopics = [...mockTrendingTopics, ...additionalTopics];
  const shuffled = allTopics.sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
};

// Get a single trending topic by slug
export const getTrendingTopicBySlug = async (
  slug: string
): Promise<Topic | null> => {
  await simulateDelay(500);

  const allTopics = [...mockTrendingTopics, ...additionalTopics];
  return allTopics.find((topic) => topic.slug === slug) || null;
};

// Check if trending topics service is available
export const isTrendingTopicsServiceAvailable = (): boolean => {
  // In a real implementation, this would check API connectivity
  return true;
};

// Fallback topics if service is unavailable
export const getFallbackTopics = (): Topic[] => {
  return mockTrendingTopics.slice(0, 4);
};
