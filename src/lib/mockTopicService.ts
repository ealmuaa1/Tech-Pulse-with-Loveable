// Mock topic service for testing when Supabase is not available
export interface MockTopic {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  full_summary: string;
  image: string;
  category: string;
  difficulty: string;
  duration: string;
  lessons_count: number;
  xp_reward: number;
  gpt_lessons: any;
  daily_briefing: any;
  trending_toolkits: any;
  ai_skill_coach: any;
}

const mockTopics: MockTopic[] = [
  {
    id: 1,
    title: "AI Fundamentals",
    slug: "ai-fundamentals",
    subtitle:
      "Master the basics of artificial intelligence and machine learning",
    summary:
      "Learn the core concepts of AI, machine learning, and neural networks.",
    full_summary:
      "Artificial Intelligence (AI) represents one of the most transformative technologies of our time. This comprehensive guide covers everything from basic machine learning concepts to advanced neural network architectures. You'll learn about supervised and unsupervised learning, deep learning frameworks, and real-world applications that are reshaping industries worldwide. The course includes hands-on projects, interactive exercises, and practical examples that will help you understand how AI systems work and how to implement them in your own projects.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=300&fit=crop",
    category: "AI",
    difficulty: "Beginner",
    duration: "45 min",
    lessons_count: 8,
    xp_reward: 150,
    gpt_lessons: {
      skill_lessons: [
        {
          title: "Prompt Engineering Mastery",
          type: "gamified_training",
          description:
            "Learn to craft effective prompts through interactive exercises",
          exercises: [
            "Choose the best prompt for a given task",
            "Fix weak prompts to improve results",
            "Optimize prompts for different AI models",
          ],
        },
        {
          title: "Real-world AI Challenges",
          type: "practical_applications",
          description: "Apply AI concepts to solve real business problems",
          challenges: [
            "Write a marketing plan using AI tools",
            "Debug and optimize machine learning code",
            "Design an AI-powered recommendation system",
          ],
        },
        {
          title: "AI Certifications",
          type: "badges",
          badges: [
            "Prompt Engineering Expert",
            "Machine Learning Practitioner",
            "AI Ethics Specialist",
          ],
        },
      ],
      career_value: {
        title: "Why AI Skills Sell",
        salary_boost: "$15,000-30,000 average increase",
        job_demand: "85% of companies seeking AI talent",
        growth_rate: "37% annual growth in AI jobs",
      },
    },
    daily_briefing: {
      summary: "Latest AI developments from Reddit, HackerNews, and Twitter",
      key_takeaways: [
        "OpenAI releases GPT-5 with improved reasoning capabilities",
        "Google announces new AI safety measures",
        "Microsoft integrates AI into Office 365",
      ],
      career_impact:
        "AI skills becoming mandatory for software development roles",
      tool_implications:
        "New AI tools emerging for code generation and testing",
      flashcard_link: "/flashcards/ai-fundamentals",
      quiz_link: "/quiz/ai-fundamentals",
    },
    trending_toolkits: {
      featured_tools: [
        {
          name: "Claude 3.5 Sonnet",
          description: "Advanced AI assistant for complex reasoning tasks",
          pro_tips: [
            "Use system prompts to define personality and constraints",
            "Break complex tasks into smaller, manageable chunks",
            "Leverage the 200K context window for comprehensive analysis",
          ],
          workflow_examples: [
            "5 best Claude workflows for productivity",
            "Code review and optimization pipeline",
            "Research and analysis framework",
          ],
        },
        {
          name: "Midjourney v6",
          description: "State-of-the-art image generation AI",
          pro_tips: [
            "Master prompt engineering for consistent style",
            "Use reference images for better results",
            "Understand aspect ratios and composition",
          ],
          workflow_examples: [
            "Brand asset creation pipeline",
            "Marketing material generation",
            "Product visualization workflow",
          ],
        },
      ],
      game_blocks: [
        {
          title: "Build an AI Funnel",
          description: "Create a complete marketing funnel using AI tools",
          difficulty: "Intermediate",
          xp_reward: 200,
        },
        {
          title: "Automate with AI",
          description: "Automate repetitive tasks using AI automation tools",
          difficulty: "Beginner",
          xp_reward: 150,
        },
      ],
    },
    ai_skill_coach: {
      resume_analysis: {
        enabled: true,
        missing_skills: [
          "Machine Learning frameworks (TensorFlow, PyTorch)",
          "AI/ML deployment and MLOps",
          "Prompt engineering and optimization",
        ],
        recommendations: [
          "Complete Python for Data Science course",
          "Practice with real-world AI projects",
          "Join AI communities and hackathons",
        ],
      },
      learning_tracker: {
        current_level: 2,
        progress_percentage: 65,
        next_milestone: "Complete first AI project",
        estimated_completion: "2 weeks",
      },
    },
  },
  {
    id: 2,
    title: "Blockchain Basics",
    slug: "blockchain-basics",
    subtitle:
      "Understand blockchain technology and its applications beyond cryptocurrency",
    summary:
      "Explore the fundamentals of blockchain, smart contracts, and decentralized applications.",
    full_summary:
      "Blockchain technology has evolved far beyond its cryptocurrency origins to become a foundational technology for the next generation of digital infrastructure. This comprehensive course covers the technical foundations of blockchain, including cryptographic principles, consensus mechanisms, and distributed ledger technology. You'll learn about smart contracts, decentralized applications (dApps), and how blockchain is being applied across industries from finance to healthcare to supply chain management. The course includes practical exercises in blockchain development, smart contract programming, and real-world case studies.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop",
    category: "Blockchain",
    difficulty: "Beginner",
    duration: "60 min",
    lessons_count: 10,
    xp_reward: 200,
    gpt_lessons: {
      skill_lessons: [
        {
          title: "Smart Contract Development",
          type: "gamified_training",
          description: "Learn Solidity and smart contract best practices",
          exercises: [
            "Write a basic smart contract",
            "Debug common smart contract vulnerabilities",
            "Optimize gas usage in smart contracts",
          ],
        },
        {
          title: "DeFi Protocol Analysis",
          type: "practical_applications",
          description: "Understand and analyze DeFi protocols",
          challenges: [
            "Audit a simple DeFi protocol",
            "Design a yield farming strategy",
            "Build a DEX trading bot",
          ],
        },
        {
          title: "Blockchain Certifications",
          type: "badges",
          badges: [
            "Smart Contract Developer",
            "DeFi Protocol Expert",
            "Blockchain Security Specialist",
          ],
        },
      ],
      career_value: {
        title: "Why Blockchain Skills Sell",
        salary_boost: "$20,000-40,000 average increase",
        job_demand: "Blockchain developers in high demand",
        growth_rate: "300% growth in blockchain jobs",
      },
    },
    daily_briefing: {
      summary: "Latest blockchain developments and DeFi trends",
      key_takeaways: [
        "Ethereum 2.0 staking reaches new milestones",
        "DeFi protocols see record TVL growth",
        "New Layer 2 solutions launch",
      ],
      career_impact: "Blockchain skills highly valued in fintech and Web3",
      tool_implications: "New tools for smart contract development and testing",
      flashcard_link: "/flashcards/blockchain-basics",
      quiz_link: "/quiz/blockchain-basics",
    },
    trending_toolkits: {
      featured_tools: [
        {
          name: "Hardhat",
          description: "Ethereum development environment",
          pro_tips: [
            "Use Hardhat for local development and testing",
            "Integrate with popular wallets and services",
            "Leverage plugins for enhanced functionality",
          ],
          workflow_examples: [
            "Complete smart contract development pipeline",
            "Testing and deployment automation",
            "Gas optimization strategies",
          ],
        },
        {
          name: "MetaMask",
          description: "Cryptocurrency wallet and gateway to dApps",
          pro_tips: [
            "Secure wallet management practices",
            "Network configuration and switching",
            "Transaction monitoring and optimization",
          ],
          workflow_examples: [
            "dApp integration workflow",
            "Multi-chain asset management",
            "DeFi protocol interaction",
          ],
        },
      ],
      game_blocks: [
        {
          title: "Build a DeFi Protocol",
          description: "Create a simple DeFi protocol from scratch",
          difficulty: "Advanced",
          xp_reward: 300,
        },
        {
          title: "Smart Contract Security",
          description:
            "Learn to identify and fix smart contract vulnerabilities",
          difficulty: "Intermediate",
          xp_reward: 250,
        },
      ],
    },
    ai_skill_coach: {
      resume_analysis: {
        enabled: true,
        missing_skills: [
          "Solidity programming language",
          "Smart contract development",
          "DeFi protocol understanding",
        ],
        recommendations: [
          "Learn Solidity fundamentals",
          "Practice with testnet deployments",
          "Study DeFi protocol architectures",
        ],
      },
      learning_tracker: {
        current_level: 1,
        progress_percentage: 30,
        next_milestone: "Deploy first smart contract",
        estimated_completion: "3 weeks",
      },
    },
  },
];

export const getTopicBySlug = async (
  slug: string
): Promise<MockTopic | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const topic = mockTopics.find((t) => t.slug === slug);
  return topic || null;
};

export const getAllTopics = async (): Promise<MockTopic[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockTopics;
};
