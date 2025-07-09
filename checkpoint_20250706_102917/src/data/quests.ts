export interface LearningQuest {
  id: number;
  title: string;
  description: string;
  category:
    | "AI"
    | "Blockchain"
    | "Cloud"
    | "Cybersecurity"
    | "IoT"
    | "Web3"
    | "VR"
    | "AR"
    | "Quantum";
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  lessonsCount: number;
  xp: number;
  image: string;
  tags: string[];
}

export const learningQuests: LearningQuest[] = [
  {
    id: 1,
    title: "Cybersecurity Essentials",
    description:
      "Master the fundamentals of cybersecurity, from basic concepts to practical defense strategies.",
    category: "Cybersecurity",
    level: "Beginner",
    estimatedTime: "2-3 hours",
    lessonsCount: 5,
    xp: 500,
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    tags: ["Security", "Basics", "Defense", "Threats", "Best Practices"],
  },
  {
    id: 2,
    title: "AI Development Fundamentals",
    description:
      "Learn the core concepts of AI development and build your first machine learning model.",
    category: "AI",
    level: "Beginner",
    estimatedTime: "3-4 hours",
    lessonsCount: 6,
    xp: 600,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
    tags: ["Machine Learning", "Python", "Neural Networks", "Data Science"],
  },
  {
    id: 3,
    title: "Blockchain Development",
    description:
      "Dive into blockchain technology and learn to build decentralized applications.",
    category: "Blockchain",
    level: "Intermediate",
    estimatedTime: "4-5 hours",
    lessonsCount: 7,
    xp: 800,
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&auto=format&fit=crop&q=60",
    tags: ["Smart Contracts", "Solidity", "Web3", "DApps"],
  },
  {
    id: 4,
    title: "Cloud Architecture",
    description:
      "Design and implement scalable cloud solutions using modern cloud platforms.",
    category: "Cloud",
    level: "Intermediate",
    estimatedTime: "3-4 hours",
    lessonsCount: 5,
    xp: 700,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60",
    tags: ["AWS", "Azure", "GCP", "Microservices", "DevOps"],
  },
  {
    id: 5,
    title: "IoT Development",
    description:
      "Build and connect IoT devices, from sensors to cloud integration.",
    category: "IoT",
    level: "Intermediate",
    estimatedTime: "4-5 hours",
    lessonsCount: 6,
    xp: 750,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    tags: ["Hardware", "Sensors", "Connectivity", "Data Analysis"],
  },
  {
    id: 6,
    title: "Web3 Development",
    description:
      "Create decentralized applications and explore the future of web development.",
    category: "Web3",
    level: "Advanced",
    estimatedTime: "5-6 hours",
    lessonsCount: 8,
    xp: 1000,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=60",
    tags: ["DeFi", "NFTs", "dApps", "Smart Contracts"],
  },
  {
    id: 7,
    title: "VR Development",
    description: "Design and develop immersive virtual reality experiences.",
    category: "VR",
    level: "Advanced",
    estimatedTime: "4-5 hours",
    lessonsCount: 7,
    xp: 900,
    image:
      "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&auto=format&fit=crop&q=60",
    tags: ["Unity", "3D Modeling", "Interaction Design", "VR SDK"],
  },
  {
    id: 8,
    title: "AR Development",
    description:
      "Create augmented reality applications for mobile and wearable devices.",
    category: "AR",
    level: "Intermediate",
    estimatedTime: "3-4 hours",
    lessonsCount: 6,
    xp: 800,
    image:
      "https://images.unsplash.com/photo-1622979135242-8c4c0c8a1c8a?w=800&auto=format&fit=crop&q=60",
    tags: ["ARKit", "ARCore", "3D Tracking", "Mobile Development"],
  },
];
