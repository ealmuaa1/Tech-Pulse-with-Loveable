import { TrendingSearch } from "@/lib/googleTrends";

export const mockTrendingSearches: TrendingSearch[] = [
  {
    title: "AI Development Tools",
    traffic: "1M+ searches",
    relatedQueries: ["GitHub Copilot", "ChatGPT API", "AI Code Assistant"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?ai,coding,development",
    summary:
      "Latest developments in artificial intelligence and machine learning tools for developers.",
    category: "AI",
  },
  {
    title: "Web3 Security",
    traffic: "500K+ searches",
    relatedQueries: [
      "Smart Contract Audit",
      "Blockchain Security",
      "Crypto Wallet",
    ],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?blockchain,security,web3",
    summary:
      "Innovations in blockchain technology and decentralized systems security.",
    category: "Blockchain",
  },
  {
    title: "Cloud Architecture",
    traffic: "750K+ searches",
    relatedQueries: ["Serverless", "Microservices", "Kubernetes"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?cloud,architecture,computing",
    summary:
      "Advances in cloud computing and distributed systems architecture.",
    category: "Cloud",
  },
  {
    title: "Quantum Computing",
    traffic: "300K+ searches",
    relatedQueries: ["Qubits", "Quantum Supremacy", "Quantum Algorithms"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?quantum,computer,technology",
    summary: "Breakthroughs in quantum computing and quantum technologies.",
    category: "Quantum",
  },
  {
    title: "Edge Computing",
    traffic: "400K+ searches",
    relatedQueries: ["IoT", "5G", "Edge AI"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?edge,computing,iot",
    summary: "Developments in edge computing and distributed processing.",
    category: "IoT",
  },
  {
    title: "Cybersecurity Trends",
    traffic: "600K+ searches",
    relatedQueries: ["Zero Trust", "Ransomware", "Threat Detection"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?security,cyber,protection",
    summary: "Latest trends in digital security and threat prevention.",
    category: "Cybersecurity",
  },
  {
    title: "AR Development",
    traffic: "250K+ searches",
    relatedQueries: ["ARKit", "ARCore", "Mixed Reality"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?ar,virtual,reality",
    summary: "Innovations in augmented reality and mixed reality development.",
    category: "AR",
  },
  {
    title: "DevOps Practices",
    traffic: "450K+ searches",
    relatedQueries: ["CI/CD", "Infrastructure as Code", "Containerization"],
    imageUrl:
      "https://source.unsplash.com/featured/800x600/?devops,automation,development",
    summary: "Latest practices in DevOps and software delivery automation.",
    category: "Tech",
  },
];
