// Enhanced image service with comprehensive topic-based image mapping
export const getReliableImageUrl = async (query: string): Promise<string> => {
  // Comprehensive static image library for tech topics
  const staticImages = {
    // AI & Machine Learning
    ai: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "machine learning": [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "artificial intelligence": [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "deep learning": [
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "neural networks": [
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Blockchain & Crypto
    blockchain: [
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    crypto: [
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    bitcoin: [
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    ethereum: [
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    defi: [
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Cybersecurity
    cybersecurity: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    security: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    hacking: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "data breach": [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Web Development
    "web development": [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    javascript: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    react: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    python: [
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    frontend: [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    backend: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Data Science
    "data science": [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    analytics: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "big data": [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Cloud Computing
    cloud: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    aws: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    azure: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "google cloud": [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Mobile Development
    mobile: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    ios: [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    android: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "app development": [
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // AR/VR
    vr: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    ar: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "virtual reality": [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "augmented reality": [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // IoT
    iot: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "internet of things": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "smart home": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Quantum Computing
    quantum: [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "quantum computing": [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Web3
    web3: [
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    metaverse: [
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    nft: [
      "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Startup & Business
    startup: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    business: [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "venture capital": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Additional topics for mock data
    "quantum computing": [
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "green tech": [
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    web3: [
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    mobile: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    gaming: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    fintech: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "machine learning": [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    telecommunications: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    "software engineering": [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    devops: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    microservices: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    api: [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    database: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    sql: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],
    nosql: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&auto=format&q=80",
    ],

    // Default fallback
    default: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=200&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop&auto=format&q=80",
    ],
  };

  // Find matching topic and get a random image from the array
  const queryLower = query.toLowerCase();
  let matchedImages: string[] = staticImages.default;

  // Check for exact matches first (longer phrases first)
  const sortedKeys = Object.keys(staticImages).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    if (key !== "default" && queryLower.includes(key)) {
      matchedImages = staticImages[key];
      break;
    }
  }

  // Return a random image from the matched array
  const randomIndex = Math.floor(Math.random() * matchedImages.length);
  return matchedImages[randomIndex];
};

// Safe image component with error handling
export const getSafeImageUrl = (
  imageUrl: string | undefined,
  fallback: string = "/placeholder.svg"
): string => {
  if (!imageUrl) return fallback;

  // If it's already a relative path, return as is
  if (imageUrl.startsWith("/")) return imageUrl;

  // If it's a valid external URL, return it
  if (imageUrl.startsWith("http")) return imageUrl;

  return fallback;
};

// Handle image loading errors
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = "/placeholder.svg"
) => {
  const target = event.target as HTMLImageElement;
  if (target.src !== fallback) {
    target.src = fallback;
  }
};
