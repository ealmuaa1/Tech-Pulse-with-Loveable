// Mock news data for summary page fallback
export interface MockNewsItem {
  id: string;
  title: string;
  topic: string;
  source: string;
  summary: string;
  takeaways: string[];
  url?: string;
  published_at?: string;
  created_at?: string;
  image?: string;
}

const mockNewsData: Record<string, MockNewsItem> = {
  "ai-healthcare-2024": {
    id: "ai-healthcare-2024",
    title: "AI Revolution in Healthcare",
    topic: "AI Insights",
    source: "Tech News Daily",
    summary:
      "The healthcare industry is experiencing a transformative shift as GPT-4 and advanced AI systems demonstrate unprecedented capabilities in medical diagnosis and treatment planning. Recent clinical trials show that AI-powered diagnostic tools are achieving 95% accuracy in preliminary assessments, significantly outperforming traditional methods while reducing diagnosis time by 60%. These systems analyze patient data, medical histories, and current symptoms to generate personalized treatment recommendations that account for individual genetic factors and medical backgrounds.\n\nHealthcare providers are increasingly adopting these AI solutions to address critical challenges including physician shortages, rising healthcare costs, and the need for more precise, personalized care. The technology enables doctors to focus on complex cases while AI handles routine assessments and preliminary screenings. Early adopters report improved patient outcomes, reduced hospital readmission rates, and enhanced efficiency in emergency departments.\n\nForward-looking insight: AI will become the standard of care within the next 3-5 years, fundamentally reshaping how healthcare is delivered and creating new opportunities for preventive medicine and early intervention strategies.",
    takeaways: [
      "GPT-4 shows 95% accuracy in preliminary diagnoses",
      "Reduces diagnosis time by 60% compared to traditional methods",
      "Enables personalized treatment plans based on patient history",
    ],
    url: "https://technewsdaily.com/ai-healthcare-2024",
    published_at: "2024-01-15T10:00:00Z",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop&auto=format",
  },
  "quantum-computing-breakthrough": {
    id: "quantum-computing-breakthrough",
    title: "Quantum Computing Breakthrough",
    topic: "Tech News Daily",
    source: "Quantum Weekly",
    summary:
      "IBM has achieved a monumental breakthrough in quantum computing with the development of its 1000-qubit Condor chip, marking a significant milestone in the race toward practical quantum supremacy. This advancement represents a 10x improvement in qubit count while simultaneously reducing error rates through innovative error correction techniques. The Condor chip's architecture enables complex quantum algorithms that were previously impossible, opening new frontiers in cryptography, materials science, and pharmaceutical research.\n\nThe implications of this breakthrough extend far beyond computational power. Quantum computers can now simulate molecular interactions with unprecedented accuracy, accelerating drug discovery processes by years and potentially saving billions in research costs. Financial institutions are preparing for the cryptographic revolution, as current encryption standards may become vulnerable within the next 5-10 years. Meanwhile, industries ranging from logistics to climate modeling are exploring quantum solutions for previously intractable problems.\n\nForward-looking insight: Quantum computing will create a new technological paradigm within the next decade, requiring organizations to develop quantum-ready strategies and invest in quantum-resistant security protocols to maintain competitive advantage.",
    takeaways: [
      "IBM's Condor chip achieves 1000+ qubits with improved error rates",
      "Potential to break current encryption standards within 5-10 years",
      "Accelerates drug discovery by simulating molecular interactions",
    ],
    url: "https://quantumweekly.com/ibm-breakthrough",
    published_at: "2024-01-14T14:30:00Z",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop&auto=format",
  },
  "sustainable-tech-innovations": {
    id: "sustainable-tech-innovations",
    title: "Sustainable Tech Innovations",
    topic: "Green Tech Journal",
    source: "Sustainability Today",
    summary:
      "The sustainable technology sector is experiencing unprecedented innovation as companies race to develop solutions that address climate change while maintaining economic viability. Breakthrough developments include next-generation solar panels achieving 47% efficiency in laboratory conditions, representing a 60% improvement over current commercial panels. These advancements, combined with AI-optimized energy grid management systems, are enabling renewable energy to compete directly with fossil fuels on cost and reliability.\n\nBiodegradable electronics represent another major breakthrough, with new materials that decompose naturally while maintaining performance standards. This technology is reducing e-waste by 40% in pilot programs and creating new opportunities for circular economy business models. Companies are also developing carbon capture technologies that can be integrated into existing industrial processes, with some achieving 90% capture rates at competitive costs.\n\nForward-looking insight: Sustainable technology will become the default choice for businesses within the next 5 years, driven by regulatory requirements, consumer demand, and the economic advantages of reduced resource consumption and waste management costs.",
    takeaways: [
      "New solar panel efficiency reaches 47% in lab conditions",
      "Biodegradable electronics reduce e-waste by 40%",
      "AI-optimized energy grids cut carbon emissions by 25%",
    ],
    url: "https://sustainabilitytoday.com/green-tech-innovations",
    published_at: "2024-01-13T09:15:00Z",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=600&fit=crop&auto=format",
  },
  "web3-development-trends": {
    id: "web3-development-trends",
    title: "The Future of Decentralized Social Media",
    topic: "Product Hunt",
    source: "Web3 Weekly",
    summary:
      "Decentralized social media platforms are gaining significant traction as users seek alternatives to traditional social networks that prioritize data privacy and user ownership. Protocols like Farcaster and Lens are leading this revolution by enabling cross-platform social identities and decentralized content ownership. These platforms allow users to maintain control over their data while participating in social networks that operate on blockchain technology, fundamentally changing the power dynamics between users and platform operators.\n\nThe economic implications are profound, as content creators can now monetize their work directly through smart contracts without platform intermediaries taking significant cuts. Early data shows that user engagement on decentralized platforms is 40% higher than traditional social media, with 80% reduction in privacy-related concerns. The technology also enables new forms of social interaction, including token-gated communities and reputation-based systems that reward quality contributions.\n\nForward-looking insight: Decentralized social media will capture 15-20% of the social media market within the next 3 years, creating new opportunities for content creators and challenging the dominance of established platforms while reshaping how digital communities are built and monetized.",
    takeaways: [
      "Farcaster protocol enables cross-platform social identity",
      "Lens Protocol decentralizes content ownership and monetization",
      "User data ownership reduces privacy concerns by 80%",
    ],
    url: "https://web3weekly.com/decentralized-social",
    published_at: "2024-01-12T16:45:00Z",
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=800&h=600&fit=crop&auto=format",
  },
  "edge-ai-mobile-apps": {
    id: "edge-ai-mobile-apps",
    title: "Edge AI in Mobile Applications",
    topic: "Mobile Tech",
    source: "Mobile AI Weekly",
    summary:
      "Edge AI is revolutionizing mobile applications by enabling sophisticated artificial intelligence to run directly on smartphones, eliminating the need for cloud-based processing and fundamentally changing how users interact with their devices. This technology reduces latency by 90% compared to cloud-based AI solutions while providing enhanced privacy protection by keeping sensitive data on the device. Major smartphone manufacturers are integrating dedicated AI processors that can handle complex machine learning models, enabling features like real-time language translation, advanced photography, and personalized user experiences.\n\nThe privacy implications are significant, as edge AI eliminates the need to transmit personal data to cloud servers for processing. This approach addresses growing consumer concerns about data privacy while enabling new applications that require real-time responsiveness. Battery optimization techniques have advanced to the point where AI features can run continuously without significantly impacting device performance, opening possibilities for always-on AI assistants and predictive applications.\n\nForward-looking insight: Edge AI will become the standard for mobile applications within the next 2 years, creating new opportunities for developers to build privacy-first applications while enabling previously impossible real-time AI features that will transform user experiences across all mobile platforms.",
    takeaways: [
      "On-device AI processing reduces latency by 90%",
      "Privacy-first approach eliminates cloud data transmission",
      "Battery optimization allows 24/7 AI features",
    ],
    url: "https://mobileaiweekly.com/edge-ai-mobile",
    published_at: "2024-01-11T11:20:00Z",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&auto=format",
  },
  "blockchain-gaming-metaverse": {
    id: "blockchain-gaming-metaverse",
    title: "Blockchain Gaming & Metaverse",
    topic: "Gaming Tech",
    source: "Metaverse Today",
    summary:
      "Blockchain technology is fundamentally transforming the gaming industry by introducing true digital asset ownership and creating new economic models that blur the lines between gaming and work. Non-fungible tokens (NFTs) enable players to own, trade, and monetize in-game assets across different platforms, creating a new paradigm of digital property rights. Play-to-earn models are generating $2.5 billion in annual revenue, with some players earning substantial incomes through gaming activities, particularly in developing markets where traditional employment opportunities may be limited.\n\nThe metaverse concept is evolving beyond virtual reality to encompass interconnected digital worlds where users can seamlessly move assets and identities between different platforms. Major gaming companies are investing heavily in blockchain infrastructure, with cross-game asset interoperability becoming a key competitive advantage. This technology also enables new forms of community governance, where players can participate in decision-making processes that affect game development and economic policies.\n\nForward-looking insight: Blockchain gaming will represent 25% of the global gaming market by 2027, creating new career opportunities in digital asset management and virtual world development while fundamentally changing how players think about digital ownership and value creation in gaming environments.",
    takeaways: [
      "NFT ownership enables true digital asset portability",
      "Play-to-earn models generate $2.5B in annual revenue",
      "Cross-game asset interoperability increases player engagement",
    ],
    url: "https://metaversetoday.com/blockchain-gaming",
    published_at: "2024-01-10T13:00:00Z",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&auto=format",
  },
};

export const getMockNewsItem = (id: string): MockNewsItem | null => {
  return mockNewsData[id] || null;
};

export const getAllMockNewsIds = (): string[] => {
  return Object.keys(mockNewsData);
};
