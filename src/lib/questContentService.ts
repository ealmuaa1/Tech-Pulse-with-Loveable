import { Topic } from "./topicService";

export interface QuestContent {
  id: string;
  title: string;
  summary: string;
  lessons: QuestLesson[];
  flashcards?: QuestFlashcard[];
  quizQuestions?: QuizQuestion[];
  badges?: QuestBadges;
  // Micro Project model fields (optional)
  microProject?: {
    title: string;
    description: string;
    shareCTA: {
      text: string;
      url: string;
    };
  };
  miniBuilderTools?: Array<{
    name: string;
    url: string;
    use: string;
  }>;
  resourceTrail?: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  toolkits?: any; // Keep as any for now, since Toolkits section is not being changed
}

export interface QuestLesson {
  id: string;
  title: string;
  content: string;
  sources: string[];
  soWhat: string;
}

export interface QuestFlashcard {
  id: string;
  front: string;
  back: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuestBadges {
  earned: string[];
  available: {
    name: string;
    requirement: string;
    description: string;
    icon: string;
  }[];
}

// Topic-specific content templates
const topicContentTemplates: Record<string, QuestContent> = {
  "ai-fundamentals": {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    summary:
      "Understand the basics of Artificial Intelligence, how it works, its types, and real-world use cases.",
    lessons: [
      {
        id: "intro-ai",
        title: "Introduction to Artificial Intelligence",
        content: `Artificial Intelligence (AI) is the simulation of human intelligence by machines to perform tasks like learning, reasoning, and decision-making.\n\nKey concepts:\n• AI vs Human Intelligence\n• Types of AI: Narrow, General, and Superintelligent\n• History and evolution of AI\n• Current state of AI technology\n\nAI is transforming industries from healthcare to finance, making it essential knowledge for the modern world.`,
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
        content: `Machine Learning is a subset of AI that enables machines to learn from data without being explicitly programmed.\n\nThree main types:\n• Supervised Learning: Learning from labeled examples\n• Unsupervised Learning: Finding patterns in unlabeled data  \n• Reinforcement Learning: Learning through trial and error\n\nPopular algorithms include linear regression, decision trees, neural networks, and deep learning models.`,
        sources: ["Coursera ML Course", "Google AI Education", "Kaggle Learn"],
        soWhat:
          "ML powers everything from Netflix recommendations to fraud detection. Knowing these basics helps you understand what's possible with data-driven solutions.",
      },
      {
        id: "ai-applications",
        title: "Real-World AI Applications",
        content: `AI is being applied across virtually every industry, creating new opportunities and transforming existing processes.\n\nCommon applications:\n• Voice assistants (Siri, Alexa)\n• Recommendation systems (Netflix, Amazon)\n• Autonomous vehicles\n• Medical diagnosis\n• Financial trading\n• Content generation\n\nUnderstanding these applications helps you identify opportunities to leverage AI in your own projects.`,
        sources: ["Industry Reports", "AI Case Studies", "Technology News"],
        soWhat:
          "Knowing AI applications helps you identify where AI can solve real problems and create value in your field.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: "What is Artificial Intelligence (AI)?",
        back: "The simulation of human intelligence by machines to perform tasks like learning, reasoning, and decision-making.",
      },
      {
        id: "fc2",
        front: "What are the main types of AI?",
        back: "Narrow AI, General AI, and Superintelligent AI.",
      },
      {
        id: "fc3",
        front: "What is machine learning?",
        back: "A subset of AI that enables machines to learn from data without being explicitly programmed.",
      },
      {
        id: "fc4",
        front: "Name a common use case of AI in everyday life.",
        back: "Voice assistants like Siri or Alexa.",
      },
      {
        id: "fc5",
        front: "What is the Turing Test?",
        back: "A test to evaluate a machine's ability to exhibit human-like intelligence.",
      },
      {
        id: "fc6",
        front: "Difference between supervised and unsupervised learning?",
        back: "Supervised learning uses labeled data; unsupervised learning uses unlabeled data.",
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: "Which of the following is NOT a type of AI?",
        options: ["Narrow AI", "Broad AI", "General AI", "Superintelligent AI"],
        correctAnswer: 1,
        explanation:
          "Broad AI is not a standard classification. The main types are Narrow AI, General AI, and Superintelligent AI.",
      },
      {
        id: "q2",
        question: "What is the goal of the Turing Test?",
        options: [
          "To improve neural networks",
          "To measure memory capacity",
          "To evaluate human-like behavior in machines",
          "To test GPU speed",
        ],
        correctAnswer: 2,
        explanation:
          "The Turing Test evaluates whether a machine can exhibit intelligent behavior equivalent to or indistinguishable from that of a human.",
      },
      {
        id: "q3",
        question: "Which field enables AI to learn from data?",
        options: ["Data Mining", "Machine Learning", "Robotics", "Automation"],
        correctAnswer: 1,
        explanation:
          "Machine Learning is the field that enables AI systems to learn and improve from data without being explicitly programmed.",
      },
      {
        id: "q4",
        question: "Which is an example of Narrow AI?",
        options: [
          "Human-level general intelligence",
          "AI that writes books",
          "Google Maps route optimization",
          "Conscious robots",
        ],
        correctAnswer: 2,
        explanation:
          "Google Maps route optimization is a perfect example of Narrow AI - it's designed for a specific task and cannot perform general intelligence tasks.",
      },
      {
        id: "q5",
        question: "Unsupervised learning uses:",
        options: [
          "Pre-labeled data",
          "Historical reports",
          "Labeled and unlabeled data",
          "Unlabeled data only",
        ],
        correctAnswer: 3,
        explanation:
          "Unsupervised learning works with unlabeled data to find hidden patterns and structures without predefined outputs.",
      },
    ],
  },
  "ai-code-generation-copilot": {
    id: "ai-code-generation-copilot",
    title: "AI-Powered Code Generation with GitHub Copilot",
    summary:
      "Master AI-assisted coding with GitHub Copilot and understand how AI is revolutionizing software development.",
    lessons: [
      {
        id: "intro-copilot",
        title: "Introduction to GitHub Copilot",
        content: `GitHub Copilot is an AI-powered code completion tool that helps developers write code faster and more efficiently.

Key features:
• Real-time code suggestions
• Context-aware completions
• Support for multiple programming languages
• Integration with popular IDEs

Copilot uses OpenAI's Codex model trained on billions of lines of public code to provide intelligent suggestions.`,
        sources: [
          "GitHub Copilot Documentation",
          "OpenAI Research",
          "Developer Surveys",
        ],
        soWhat:
          "Understanding Copilot helps you leverage AI to boost productivity and focus on higher-level problem-solving.",
      },
      {
        id: "best-practices",
        title: "Best Practices for AI-Assisted Coding",
        content: `While AI tools are powerful, they require proper usage to maximize benefits and avoid pitfalls.

Best practices:
• Review all generated code before using
• Understand the code you're implementing
• Use clear comments and documentation
• Test thoroughly
• Keep security in mind

Remember: AI is a tool to enhance your skills, not replace them.`,
        sources: [
          "GitHub Copilot Guidelines",
          "Software Engineering Best Practices",
          "Security Guidelines",
        ],
        soWhat:
          "Following best practices ensures you maintain code quality while leveraging AI assistance effectively.",
      },
      {
        id: "advanced-features",
        title: "Advanced Copilot Features",
        content: `Copilot offers advanced features beyond simple code completion.

Advanced capabilities:
• Function generation from comments
• Test case generation
• Documentation writing
• Code refactoring suggestions
• Multi-file context understanding

These features can significantly speed up development workflows.`,
        sources: [
          "GitHub Copilot Advanced Guide",
          "Developer Tutorials",
          "Community Examples",
        ],
        soWhat:
          "Mastering advanced features unlocks Copilot's full potential for complex development tasks.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: "What is GitHub Copilot?",
        back: "An AI-powered code completion tool that suggests code in real-time based on context and comments.",
      },
      {
        id: "fc2",
        front: "What model does Copilot use?",
        back: "OpenAI's Codex model, trained on billions of lines of public code.",
      },
      {
        id: "fc3",
        front: "What's the most important best practice when using Copilot?",
        back: "Always review generated code before using it to ensure quality and security.",
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: "What is the primary benefit of using GitHub Copilot?",
        options: [
          "It writes all your code for you",
          "It provides real-time code suggestions to speed up development",
          "It automatically fixes all bugs",
          "It replaces the need for testing",
        ],
        correctAnswer: 1,
        explanation:
          "Copilot provides intelligent code suggestions to speed up development, but developers still need to review and understand the code.",
      },
      {
        id: "q2",
        question:
          "Which of the following is NOT a best practice when using AI-assisted coding tools?",
        options: [
          "Review all generated code",
          "Test thoroughly",
          "Use the tool without understanding the code",
          "Keep security in mind",
        ],
        correctAnswer: 2,
        explanation:
          "You should always understand the code you're implementing, even when using AI assistance.",
      },
    ],
    badges: {
      earned: [],
      available: [
        {
          name: "Copilot Explorer",
          requirement: "Complete Introduction lesson",
          description: "You've started your AI-assisted coding journey",
          icon: "🤖",
        },
        {
          name: "Code Master",
          requirement: "Complete all lessons",
          description: "Master of AI-assisted development",
          icon: "💻",
        },
        {
          name: "Best Practices Champion",
          requirement: "Score 100% on quiz",
          description: "You understand safe AI coding practices",
          icon: "🛡️",
        },
      ],
    },
  },
  "web3-dapps-ethereum": {
    id: "web3-dapps-ethereum",
    title: "Web3 and Decentralized Applications (DApps)",
    summary:
      "Learn to build decentralized applications on Ethereum blockchain with smart contracts and Web3.js.",
    lessons: [
      {
        id: "intro-web3",
        title: "Introduction to Web3",
        content: `Web3 represents the next evolution of the internet, built on blockchain technology and decentralization.

Key concepts:
• Decentralization vs centralization
• Blockchain as the foundation
• Cryptocurrencies and tokens
• Smart contracts
• User ownership of data

Web3 aims to create a more open, trustless, and permissionless internet.`,
        sources: [
          "Ethereum Documentation",
          "Web3 Foundation",
          "Blockchain Research",
        ],
        soWhat:
          "Understanding Web3 helps you build applications that give users true ownership and control over their data.",
      },
      {
        id: "smart-contracts",
        title: "Smart Contracts on Ethereum",
        content: `Smart contracts are self-executing programs that run on the blockchain.

Smart contract features:
• Immutable once deployed
• Transparent and verifiable
• Automated execution
• Trustless interactions
• Gas fees for execution

Solidity is the primary language for Ethereum smart contracts.`,
        sources: [
          "Solidity Documentation",
          "Ethereum Developer Resources",
          "OpenZeppelin",
        ],
        soWhat:
          "Smart contracts enable trustless, automated agreements and form the backbone of DeFi and NFT applications.",
      },
      {
        id: "dapp-development",
        title: "Building DApps with Web3.js",
        content: `DApps (Decentralized Applications) combine smart contracts with traditional web interfaces.

DApp architecture:
• Frontend (React, Vue, etc.)
• Web3.js for blockchain interaction
• Smart contracts on Ethereum
• MetaMask for user wallets
• IPFS for decentralized storage

This creates a complete decentralized user experience.`,
        sources: [
          "Web3.js Documentation",
          "DApp Development Guides",
          "MetaMask Integration",
        ],
        soWhat:
          "Building DApps allows you to create applications that leverage blockchain's benefits while maintaining familiar user experiences.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: "What is Web3?",
        back: "The next evolution of the internet built on blockchain technology, focusing on decentralization and user ownership.",
      },
      {
        id: "fc2",
        front: "What are smart contracts?",
        back: "Self-executing programs that run on the blockchain, enabling trustless and automated agreements.",
      },
      {
        id: "fc3",
        front: "What is a DApp?",
        back: "A Decentralized Application that combines smart contracts with traditional web interfaces.",
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: "What is the primary difference between Web2 and Web3?",
        options: [
          "Web3 is faster",
          "Web3 is decentralized and gives users ownership",
          "Web3 only works on mobile",
          "Web3 doesn't use the internet",
        ],
        correctAnswer: 1,
        explanation:
          "Web3's key innovation is decentralization and giving users true ownership of their data and digital assets.",
      },
      {
        id: "q2",
        question:
          "What language is primarily used for Ethereum smart contracts?",
        options: ["JavaScript", "Python", "Solidity", "Java"],
        correctAnswer: 2,
        explanation:
          "Solidity is the primary programming language designed specifically for writing smart contracts on Ethereum.",
      },
    ],
    badges: {
      earned: [],
      available: [
        {
          name: "Web3 Pioneer",
          requirement: "Complete Introduction lesson",
          description: "You've entered the decentralized web",
          icon: "🌐",
        },
        {
          name: "Smart Contract Developer",
          requirement: "Complete Smart Contracts lesson",
          description: "You can build trustless applications",
          icon: "📜",
        },
        {
          name: "DApp Architect",
          requirement: "Complete all lessons",
          description: "Master of decentralized applications",
          icon: "🏗️",
        },
      ],
    },
  },
  "kubernetes-cloud-native": {
    id: "kubernetes-cloud-native",
    title: "Cloud-Native Development with Kubernetes",
    summary:
      "Master container orchestration and microservices architecture using Kubernetes and cloud-native practices.",
    lessons: [
      {
        id: "intro-k8s",
        title: "Introduction to Kubernetes",
        content: `Kubernetes is an open-source container orchestration platform that automates container deployment, scaling, and management.

Key concepts:
• Containers and containerization
• Pods as the smallest deployable units
• Services for networking
• Deployments for scaling
• Namespaces for organization

Kubernetes provides a platform for running distributed systems reliably.`,
        sources: [
          "Kubernetes Documentation",
          "CNCF Resources",
          "Container Orchestration Guides",
        ],
        soWhat:
          "Understanding Kubernetes enables you to build scalable, resilient applications that can handle production workloads.",
      },
      {
        id: "microservices",
        title: "Microservices Architecture",
        content: `Microservices break down applications into small, independent services that communicate over networks.

Microservices benefits:
• Independent deployment and scaling
• Technology diversity
• Fault isolation
• Team autonomy
• Easier maintenance

Each service can be developed, deployed, and scaled independently.`,
        sources: [
          "Microservices Patterns",
          "Martin Fowler's Blog",
          "Industry Best Practices",
        ],
        soWhat:
          "Microservices enable teams to build and maintain complex applications more efficiently and reliably.",
      },
      {
        id: "cloud-native",
        title: "Cloud-Native Development Practices",
        content: `Cloud-native development leverages cloud computing to build scalable, resilient applications.

Cloud-native principles:
• Containerization
• Microservices architecture
• Immutable infrastructure
• Declarative APIs
• DevOps practices

These practices enable rapid, reliable, and frequent application delivery.`,
        sources: [
          "Cloud Native Computing Foundation",
          "12-Factor App Methodology",
          "DevOps Practices",
        ],
        soWhat:
          "Adopting cloud-native practices helps you build applications that can scale globally and handle modern user demands.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: "What is Kubernetes?",
        back: "An open-source container orchestration platform that automates container deployment, scaling, and management.",
      },
      {
        id: "fc2",
        front: "What is a Pod in Kubernetes?",
        back: "The smallest deployable unit in Kubernetes, which can contain one or more containers.",
      },
      {
        id: "fc3",
        front: "What are microservices?",
        back: "Small, independent services that communicate over networks to form a complete application.",
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: "What is the primary benefit of using Kubernetes?",
        options: [
          "It makes applications faster",
          "It automates container deployment, scaling, and management",
          "It reduces costs",
          "It improves security",
        ],
        correctAnswer: 1,
        explanation:
          "Kubernetes automates the complex tasks of deploying, scaling, and managing containerized applications.",
      },
      {
        id: "q2",
        question: "What is the smallest deployable unit in Kubernetes?",
        options: ["Container", "Pod", "Service", "Deployment"],
        correctAnswer: 1,
        explanation:
          "A Pod is the smallest deployable unit in Kubernetes and can contain one or more containers.",
      },
    ],
    badges: {
      earned: [],
      available: [
        {
          name: "K8s Explorer",
          requirement: "Complete Introduction lesson",
          description: "You've started your Kubernetes journey",
          icon: "⚓",
        },
        {
          name: "Microservices Architect",
          requirement: "Complete Microservices lesson",
          description: "You understand distributed systems",
          icon: "🏗️",
        },
        {
          name: "Cloud Native Master",
          requirement: "Complete all lessons",
          description: "Master of cloud-native development",
          icon: "☁️",
        },
      ],
    },
  },
};

// Generate dynamic content for topics not in templates
const generateDynamicContent = (topic: Topic): QuestContent => {
  const topicName = topic.title;
  const category = topic.category || "Technology";

  return {
    id: topic.slug,
    title: topic.title,
    summary:
      topic.summary ||
      `Learn about ${topicName} with interactive lessons and hands-on projects.`,
    lessons: [
      {
        id: "intro",
        title: `Introduction to ${topicName}`,
        content: `Welcome to the world of ${topicName}! This comprehensive course will guide you through the fundamentals and advanced concepts.

Key learning objectives:
• Understand core principles and concepts
• Explore real-world applications
• Master practical implementation
• Develop hands-on skills

${topicName} is transforming the way we approach ${category.toLowerCase()} and offers exciting opportunities for innovation.`,
        sources: [
          `${topicName} Documentation`,
          "Industry Reports",
          "Expert Tutorials",
        ],
        soWhat: `Understanding ${topicName} opens doors to new career opportunities and innovative solutions in ${category.toLowerCase()}.`,
      },
      {
        id: "fundamentals",
        title: `${topicName} Fundamentals`,
        content: `Let's dive deep into the fundamental concepts that make ${topicName} powerful and versatile.

Core concepts:
• Basic principles and theories
• Key terminology and definitions
• Essential tools and technologies
• Common patterns and practices

Mastering these fundamentals provides a solid foundation for advanced applications.`,
        sources: [
          `${topicName} Learning Resources`,
          "Academic Papers",
          "Industry Standards",
        ],
        soWhat:
          "Strong fundamentals enable you to build complex solutions and adapt to new developments in the field.",
      },
      {
        id: "applications",
        title: `Real-World Applications of ${topicName}`,
        content: `${topicName} is being applied across various industries to solve real-world problems.

Application areas:
• Industry-specific use cases
• Success stories and case studies
• Implementation strategies
• Best practices and lessons learned

Understanding these applications helps you identify opportunities in your own domain.`,
        sources: ["Industry Reports", "Case Studies", "Expert Interviews"],
        soWhat:
          "Knowing real-world applications helps you identify how to leverage this technology in your own projects and career.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: `What is ${topicName}?`,
        back: `${topicName} is a ${category.toLowerCase()} field that focuses on innovative approaches and solutions.`,
      },
      {
        id: "fc2",
        front: `What are the key benefits of ${topicName}?`,
        back: `${topicName} offers improved efficiency, scalability, and new capabilities in ${category.toLowerCase()}.`,
      },
      {
        id: "fc3",
        front: `How is ${topicName} applied in industry?`,
        back: `${topicName} is used across various sectors to solve complex problems and create new opportunities.`,
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: `What is the primary focus of ${topicName}?`,
        options: [
          "Making things faster",
          "Solving complex problems in innovative ways",
          "Reducing costs",
          "Improving security",
        ],
        correctAnswer: 1,
        explanation: `${topicName} focuses on innovative approaches to solve complex problems in ${category.toLowerCase()}.`,
      },
      {
        id: "q2",
        question: `Which of the following is a key benefit of ${topicName}?`,
        options: [
          "It's always free to use",
          "It provides new capabilities and efficiencies",
          "It works without internet",
          "It's easier than traditional methods",
        ],
        correctAnswer: 1,
        explanation: `${topicName} provides new capabilities and efficiencies that weren't possible with traditional approaches.`,
      },
    ],
    badges: {
      earned: [],
      available: [
        {
          name: `${topicName} Explorer`,
          requirement: "Complete Introduction lesson",
          description: `You've started your ${topicName} journey`,
          icon: "🔍",
        },
        {
          name: `${topicName} Practitioner`,
          requirement: "Complete all lessons",
          description: `Master of ${topicName}`,
          icon: "🎯",
        },
        {
          name: "Knowledge Seeker",
          requirement: "Score 100% on quiz",
          description: "You've mastered the fundamentals",
          icon: "🧠",
        },
      ],
    },
  };
};

// Main function to get quest content
export const getQuestContent = async (
  slug: string,
  topic?: Topic
): Promise<QuestContent> => {
  // Check if we have a specific template for this topic
  if (topicContentTemplates[slug]) {
    return topicContentTemplates[slug];
  }

  // If we have topic data, generate dynamic content
  if (topic) {
    return generateDynamicContent(topic);
  }

  // Fallback content for unknown topics
  return {
    id: slug,
    title: slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    summary: `Learn about ${slug.replace(
      /-/g,
      " "
    )} with interactive lessons and hands-on projects.`,
    lessons: [
      {
        id: "intro",
        title: "Introduction",
        content:
          "Welcome to this learning quest! This topic covers important concepts and practical applications.",
        sources: ["Documentation", "Tutorials", "Expert Resources"],
        soWhat:
          "Understanding this topic will help you in your learning journey and career development.",
      },
    ],
    flashcards: [
      {
        id: "fc1",
        front: "What is this topic about?",
        back: "This topic covers important concepts and practical applications in technology.",
      },
    ],
    quizQuestions: [
      {
        id: "q1",
        question: "What is the main goal of this topic?",
        options: [
          "To make things faster",
          "To teach important concepts and practical skills",
          "To reduce costs",
          "To improve security",
        ],
        correctAnswer: 1,
        explanation:
          "This topic aims to teach important concepts and practical skills for real-world application.",
      },
    ],
    badges: {
      earned: [],
      available: [
        {
          name: "Explorer",
          requirement: "Complete Introduction lesson",
          description: "You've started your learning journey",
          icon: "🔍",
        },
      ],
    },
  };
};
