/**
 * Topic Slug Mapper
 * Handles slug mismatches and provides consistent topic name resolution
 */

export interface TopicMapping {
  slug: string;
  displayName: string;
  category: string;
  aliases?: string[];
}

// Comprehensive topic mapping with aliases and categories
export const topicMappings: Record<string, TopicMapping> = {
  // AI & Machine Learning
  "ai-code-generation-copilot": {
    slug: "ai-code-generation-copilot",
    displayName: "AI-Powered Code Generation with GitHub Copilot",
    category: "AI",
    aliases: ["copilot", "ai-coding", "github-copilot", "code-generation"],
  },
  "machine-learning": {
    slug: "machine-learning",
    displayName: "Machine Learning Fundamentals",
    category: "AI",
    aliases: ["ml", "ai-ml", "machine-learning-basics", "ml-fundamentals"],
  },
  "artificial-intelligence": {
    slug: "artificial-intelligence",
    displayName: "Artificial Intelligence Fundamentals",
    category: "AI",
    aliases: ["ai", "ai-fundamentals", "artificial-intelligence-basics"],
  },

  // Web3 & Blockchain
  "web3-dapps-ethereum": {
    slug: "web3-dapps-ethereum",
    displayName: "Web3 and Decentralized Applications (DApps)",
    category: "Blockchain",
    aliases: [
      "web3",
      "dapps",
      "ethereum",
      "blockchain-apps",
      "decentralized-apps",
    ],
  },
  "web3-decentralized-apps": {
    slug: "web3-dapps-ethereum",
    displayName: "Web3 and Decentralized Applications (DApps)",
    category: "Blockchain",
    aliases: ["web3", "dapps", "ethereum", "blockchain-apps"],
  },
  "blockchain": {
    slug: "blockchain",
    displayName: "Blockchain Technology Fundamentals",
    category: "Blockchain",
    aliases: ["crypto", "distributed-ledger", "blockchain-basics"],
  },

  // Cloud & DevOps
  "kubernetes-cloud-native": {
    slug: "kubernetes-cloud-native",
    displayName: "Cloud-Native Development with Kubernetes",
    category: "Cloud",
    aliases: ["kubernetes", "k8s", "cloud-native", "container-orchestration"],
  },
  "cloud-computing": {
    slug: "cloud-computing",
    displayName: "Cloud Computing Fundamentals",
    category: "Cloud",
    aliases: ["cloud", "aws", "azure", "gcp", "cloud-basics"],
  },
  "devops": {
    slug: "devops",
    displayName: "DevOps Practices and Tools",
    category: "Cloud",
    aliases: ["ci-cd", "deployment", "automation", "devops-basics"],
  },

  // Security
  "cybersecurity": {
    slug: "cybersecurity",
    displayName: "Cybersecurity Fundamentals",
    category: "Security",
    aliases: ["security", "cyber-security", "infosec", "security-basics"],
  },
  "zero-trust-cybersecurity": {
    slug: "zero-trust-cybersecurity",
    displayName: "Zero Trust Cybersecurity Architecture",
    category: "Security",
    aliases: ["zero-trust", "cybersecurity-advanced", "security-architecture"],
  },

  // Data Science
  "data-science": {
    slug: "data-science",
    displayName: "Data Science Fundamentals",
    category: "Data Science",
    aliases: ["data-analytics", "data-science-basics", "analytics"],
  },
  "python-data-science": {
    slug: "python-data-science",
    displayName: "Python for Data Science",
    category: "Data Science",
    aliases: ["python", "data-science-python", "pandas", "numpy"],
  },

  // Mobile Development
  "react-native-mobile": {
    slug: "react-native-mobile",
    displayName: "React Native Cross-Platform Development",
    category: "Mobile",
    aliases: [
      "react-native",
      "mobile-development",
      "cross-platform",
      "mobile-apps",
    ],
  },
  "mobile-development": {
    slug: "mobile-development",
    displayName: "Mobile App Development",
    category: "Mobile",
    aliases: ["mobile", "app-development", "ios", "android"],
  },

  // Web Development
  "web-development": {
    slug: "web-development",
    displayName: "Modern Web Development",
    category: "Web Development",
    aliases: ["web-dev", "frontend", "backend", "fullstack"],
  },
  "react-development": {
    slug: "react-development",
    displayName: "React Development",
    category: "Web Development",
    aliases: ["react", "reactjs", "frontend-react", "ui-development"],
  },

  // Emerging Technologies
  "quantum-computing": {
    slug: "quantum-computing",
    displayName: "Quantum Computing Fundamentals",
    category: "Emerging Tech",
    aliases: ["quantum", "quantum-tech", "quantum-basics"],
  },
  "ar-vr": {
    slug: "ar-vr",
    displayName: "Augmented and Virtual Reality",
    category: "Emerging Tech",
    aliases: ["augmented-reality", "virtual-reality", "metaverse", "xr"],
  },
  "iot": {
    slug: "iot",
    displayName: "Internet of Things (IoT)",
    category: "Emerging Tech",
    aliases: ["internet-of-things", "iot-basics", "smart-devices"],
  },
};

/**
 * Resolve a slug to its proper topic mapping
 */
export const resolveTopicSlug = (inputSlug: string): TopicMapping | null => {
  if (!inputSlug) return null;

  // Clean and normalize the slug
  const cleanSlug = inputSlug.toLowerCase().trim();

  // Direct match
  if (topicMappings[cleanSlug]) {
    return topicMappings[cleanSlug];
  }

  // Check aliases
  for (const [key, mapping] of Object.entries(topicMappings)) {
    if (mapping.aliases?.includes(cleanSlug)) {
      return mapping;
    }
  }

  // Try to find partial matches
  for (const [key, mapping] of Object.entries(topicMappings)) {
    if (key.includes(cleanSlug) || cleanSlug.includes(key)) {
      return mapping;
    }
  }

  return null;
};

/**
 * Generate a fallback topic mapping for unknown slugs
 */
export const generateFallbackMapping = (slug: string): TopicMapping => {
  const cleanSlug = slug.toLowerCase().trim();
  const displayName = cleanSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    slug: cleanSlug,
    displayName: displayName,
    category: "Technology",
    aliases: [],
  };
};

/**
 * Get all available topics for navigation
 */
export const getAvailableTopics = (): TopicMapping[] => {
  return Object.values(topicMappings);
};

/**
 * Search topics by keyword
 */
export const searchTopics = (keyword: string): TopicMapping[] => {
  if (!keyword) return getAvailableTopics();

  const searchTerm = keyword.toLowerCase();
  return Object.values(topicMappings).filter(
    (topic) =>
      topic.displayName.toLowerCase().includes(searchTerm) ||
      topic.category.toLowerCase().includes(searchTerm) ||
      topic.aliases?.some((alias) => alias.toLowerCase().includes(searchTerm))
  );
};
