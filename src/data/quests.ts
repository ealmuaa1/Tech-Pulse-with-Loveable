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
  summary: string;
  practicalUse: string;
  learningResources: {
    title: string;
    url: string;
    description: string;
  }[];
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
    summary:
      "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. This quest covers essential security concepts, common threats, and practical defense strategies.",
    practicalUse:
      "Apply security best practices in your daily digital activities, protect personal and professional data, and understand how to respond to security incidents.",
    learningResources: [
      {
        title: "Cybersecurity Fundamentals - IBM",
        url: "https://www.ibm.com/training/cybersecurity",
        description: "IBM's comprehensive cybersecurity learning path",
      },
      {
        title: "TryHackMe",
        url: "https://tryhackme.com/",
        description: "Hands-on cybersecurity training platform",
      },
      {
        title: "OWASP Web Security",
        url: "https://owasp.org/www-project-web-security-testing-guide/",
        description: "Web security testing guide",
      },
    ],
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
    summary:
      "Artificial Intelligence is transforming how we interact with technology. This quest introduces you to the fundamental concepts of AI, machine learning, and neural networks.",
    practicalUse:
      "Build basic AI models, understand machine learning workflows, and apply AI concepts to real-world problems.",
    learningResources: [
      {
        title: "Machine Learning - Google",
        url: "https://developers.google.com/machine-learning",
        description: "Google's machine learning crash course",
      },
      {
        title: "Deep Learning Specialization - Coursera",
        url: "https://www.coursera.org/specializations/deep-learning",
        description: "Andrew Ng's famous deep learning course",
      },
      {
        title: "Fast.ai",
        url: "https://www.fast.ai/",
        description: "Practical deep learning for coders",
      },
    ],
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
    summary:
      "Blockchain technology is revolutionizing how we handle digital transactions and data. This quest covers blockchain fundamentals, smart contracts, and decentralized application development.",
    practicalUse:
      "Develop smart contracts, create decentralized applications, and understand blockchain architecture.",
    learningResources: [
      {
        title: "Blockchain Basics - FreeCodeCamp",
        url: "https://www.freecodecamp.org/news/blockchain-basics/",
        description: "Free interactive course on blockchain fundamentals",
      },
      {
        title: "Blockchain Specialization - Coursera",
        url: "https://www.coursera.org/specializations/blockchain",
        description: "Comprehensive blockchain development course",
      },
      {
        title: "Ethereum Documentation",
        url: "https://ethereum.org/developers/",
        description: "Official Ethereum development documentation",
      },
    ],
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
    summary:
      "Cloud computing is essential for modern application development. This quest covers cloud architecture, deployment strategies, and best practices for building scalable applications.",
    practicalUse:
      "Design cloud architectures, deploy applications to cloud platforms, and implement DevOps practices.",
    learningResources: [
      {
        title: "AWS Cloud Practitioner",
        url: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
        description: "AWS cloud fundamentals certification",
      },
      {
        title: "Azure Fundamentals",
        url: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/",
        description: "Microsoft Azure basics certification",
      },
      {
        title: "Google Cloud Fundamentals",
        url: "https://cloud.google.com/certification/cloud-digital-leader",
        description: "Google Cloud Platform fundamentals",
      },
    ],
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
    summary:
      "The Internet of Things connects physical devices to the digital world. This quest covers IoT architecture, sensor integration, and data processing for connected devices.",
    practicalUse:
      "Build IoT projects, integrate sensors, and process device data for real-world applications.",
    learningResources: [
      {
        title: "IoT Fundamentals - Cisco",
        url: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/iot-fundamentals.html",
        description: "Cisco's IoT fundamentals course",
      },
      {
        title: "Arduino IoT Cloud",
        url: "https://docs.arduino.cc/arduino-cloud/",
        description: "Arduino's IoT platform documentation",
      },
      {
        title: "Raspberry Pi IoT Projects",
        url: "https://www.raspberrypi.org/for-industry/iot/",
        description: "IoT projects with Raspberry Pi",
      },
    ],
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
    summary:
      "Web3 represents the next evolution of the internet, built on blockchain technology. This quest covers decentralized applications, smart contracts, and Web3 protocols.",
    practicalUse:
      "Develop decentralized applications, create smart contracts, and build Web3 solutions.",
    learningResources: [
      {
        title: "Web3 University",
        url: "https://www.web3.university/",
        description: "Free Web3 development courses",
      },
      {
        title: "Ethereum Developer Portal",
        url: "https://ethereum.org/developers/",
        description: "Official Ethereum development resources",
      },
      {
        title: "Solidity Documentation",
        url: "https://docs.soliditylang.org/",
        description: "Smart contract programming language",
      },
    ],
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
    summary:
      "Virtual Reality creates immersive digital experiences. This quest covers VR development, 3D modeling, and interactive design for virtual environments.",
    practicalUse:
      "Create VR applications, design 3D environments, and implement interactive experiences.",
    learningResources: [
      {
        title: "Unity VR Development",
        url: "https://learn.unity.com/course/vr-development",
        description: "Unity's VR development course",
      },
      {
        title: "Oculus Developer Hub",
        url: "https://developer.oculus.com/",
        description: "Oculus VR development resources",
      },
      {
        title: "VR Design Principles",
        url: "https://developer.vive.com/resources/knowledgebase/vr-design-principles/",
        description: "VR design best practices",
      },
    ],
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
    summary:
      "Augmented Reality enhances the real world with digital content. This quest covers AR development, 3D tracking, and mobile AR applications.",
    practicalUse:
      "Build AR applications, implement 3D tracking, and create interactive AR experiences.",
    learningResources: [
      {
        title: "ARKit Documentation",
        url: "https://developer.apple.com/augmented-reality/",
        description: "Apple's AR development framework",
      },
      {
        title: "ARCore Documentation",
        url: "https://developers.google.com/ar",
        description: "Google's AR development platform",
      },
      {
        title: "Unity AR Development",
        url: "https://learn.unity.com/course/ar-development",
        description: "Unity's AR development course",
      },
    ],
  },
];
