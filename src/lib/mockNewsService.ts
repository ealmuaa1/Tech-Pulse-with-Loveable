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
  whats_new?: string;
  impact?: string;
}

const mockNewsData: Record<string, MockNewsItem> = {
  "ai-healthcare-2024": {
    id: "ai-healthcare-2024",
    title: "AI Revolution in Healthcare",
    topic: "ai",
    source: "Tech News Daily",
    summary:
      "The healthcare industry is experiencing a transformative shift as GPT-4 and advanced AI systems demonstrate unprecedented capabilities in medical diagnosis and treatment planning. Recent clinical trials show that AI-powered diagnostic tools are achieving 95% accuracy in preliminary assessments, significantly outperforming traditional methods while reducing diagnosis time by 60%. These systems analyze patient data, medical histories, and current symptoms to generate personalized treatment recommendations that account for individual genetic factors and medical backgrounds.\n\nHealthcare providers are increasingly adopting these AI solutions to address critical challenges including physician shortages, rising healthcare costs, and the need for more precise, personalized care. The technology enables doctors to focus on complex cases while AI handles routine assessments and preliminary screenings. Early adopters report improved patient outcomes, reduced hospital readmission rates, and enhanced efficiency in emergency departments.\n\nForward-looking insight: AI will become the standard of care within the next 3-5 years, fundamentally reshaping how healthcare is delivered and creating new opportunities for preventive medicine and early intervention strategies.",
    whats_new: "GPT-4 and advanced AI systems are now achieving 95% accuracy in preliminary medical diagnoses, representing a 60% reduction in diagnosis time compared to traditional methods. These systems can analyze patient data, medical histories, and current symptoms to generate personalized treatment recommendations that account for individual genetic factors and medical backgrounds.",
    impact: "This technology is fundamentally reshaping healthcare delivery by enabling doctors to focus on complex cases while AI handles routine assessments. Early adopters report improved patient outcomes, reduced hospital readmission rates, and enhanced efficiency in emergency departments. The technology addresses critical challenges including physician shortages and rising healthcare costs.",
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
    topic: "quantum",
    source: "Quantum Weekly",
    summary:
      "IBM has achieved a monumental breakthrough in quantum computing with the development of its 1000-qubit Condor chip, marking a significant milestone in the race toward practical quantum supremacy. This advancement represents a 10x improvement in qubit count while simultaneously reducing error rates through innovative error correction techniques. The Condor chip's architecture enables complex quantum algorithms that were previously impossible, opening new frontiers in cryptography, materials science, and pharmaceutical research.\n\nThe implications of this breakthrough extend far beyond computational power. Quantum computers can now simulate molecular interactions with unprecedented accuracy, accelerating drug discovery processes by years and potentially saving billions in research costs. Financial institutions are preparing for the cryptographic revolution, as current encryption standards may become vulnerable within the next 5-10 years. Meanwhile, industries ranging from logistics to climate modeling are exploring quantum solutions for previously intractable problems.\n\nForward-looking insight: Quantum computing will create a new technological paradigm within the next decade, requiring organizations to develop quantum-ready strategies and invest in quantum-resistant security protocols to maintain competitive advantage.",
    whats_new: "IBM's 1000-qubit Condor chip represents a 10x improvement in qubit count while simultaneously reducing error rates through innovative error correction techniques. This advancement enables complex quantum algorithms that were previously impossible, opening new frontiers in cryptography, materials science, and pharmaceutical research.",
    impact: "Quantum computers can now simulate molecular interactions with unprecedented accuracy, accelerating drug discovery processes by years and potentially saving billions in research costs. Financial institutions are preparing for the cryptographic revolution, as current encryption standards may become vulnerable within the next 5-10 years.",
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
    topic: "green tech",
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
    topic: "web3",
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
    topic: "mobile",
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
    topic: "gaming",
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
  "cybersecurity-zero-day-exploits": {
    id: "cybersecurity-zero-day-exploits",
    title: "Zero-Day Exploits: The New Cybersecurity Frontier",
    topic: "cybersecurity",
    source: "Security Weekly",
    summary:
      "Zero-day exploits have emerged as the most sophisticated and dangerous cybersecurity threats, with state-sponsored actors and criminal organizations investing heavily in discovering and weaponizing previously unknown vulnerabilities. These attacks target software vulnerabilities before developers can create patches, giving attackers a significant advantage. Recent analysis shows that zero-day exploits are being discovered at a rate of 1.5 per day, with the average time to patch extending to 97 days, creating a critical window of vulnerability for organizations worldwide.\n\nAdvanced persistent threat (APT) groups are increasingly using zero-day exploits as part of multi-stage attack campaigns, targeting critical infrastructure, government agencies, and major corporations. The market for zero-day exploits has become highly sophisticated, with exploit brokers paying up to $2.5 million for high-value vulnerabilities. Meanwhile, organizations are implementing advanced threat detection systems that use machine learning to identify anomalous behavior patterns that might indicate zero-day attacks in progress.\n\nForward-looking insight: Zero-day exploits will become the primary attack vector for high-value targets within the next 2 years, driving increased investment in proactive security measures, threat intelligence sharing, and automated vulnerability discovery systems that can identify and patch vulnerabilities before they can be exploited.",
    takeaways: [
      "Zero-day exploits discovered at rate of 1.5 per day",
      "Average patch time extends to 97 days",
      "Exploit brokers pay up to $2.5M for high-value vulnerabilities",
    ],
    url: "https://securityweekly.com/zero-day-exploits",
    published_at: "2024-01-09T08:30:00Z",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&auto=format",
  },
  "cloud-native-architecture": {
    id: "cloud-native-architecture",
    title: "Cloud-Native Architecture Revolution",
    topic: "cloud",
    source: "Cloud Tech Daily",
    summary:
      "Cloud-native architecture is fundamentally reshaping how organizations build, deploy, and scale applications, with microservices, containers, and serverless computing becoming the standard for modern software development. This approach enables unprecedented agility and scalability, with organizations reporting 60% faster deployment cycles and 40% reduction in infrastructure costs. Kubernetes has emerged as the de facto orchestration platform, with 83% of organizations now using container orchestration in production environments.\n\nThe serverless computing model is gaining significant traction, with functions-as-a-service (FaaS) platforms enabling developers to focus on business logic while cloud providers handle infrastructure management. This shift is democratizing access to enterprise-grade scalability, allowing startups to compete with established players on equal footing. Multi-cloud strategies are becoming increasingly common, with organizations leveraging the strengths of different cloud providers to optimize performance, cost, and compliance requirements.\n\nForward-looking insight: Cloud-native architecture will become the default approach for all new applications within the next 3 years, with traditional monolithic applications being gradually replaced by microservices-based systems that can scale automatically and respond rapidly to changing business requirements.",
    takeaways: [
      "60% faster deployment cycles with cloud-native approach",
      "83% of organizations use container orchestration in production",
      "40% reduction in infrastructure costs",
    ],
    url: "https://cloudtechdaily.com/cloud-native-revolution",
    published_at: "2024-01-08T14:15:00Z",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&auto=format",
  },
  "data-science-automation": {
    id: "data-science-automation",
    title: "Automated Data Science: The Future of Analytics",
    topic: "data science",
    source: "Data Science Weekly",
    summary:
      "Automated machine learning (AutoML) and data science platforms are democratizing access to advanced analytics, enabling organizations without deep technical expertise to leverage the power of artificial intelligence and machine learning. These platforms automate the entire data science workflow, from data preprocessing and feature engineering to model selection and deployment, reducing the time required to develop production-ready models from months to days. Organizations using AutoML platforms report 70% faster model development and 50% improvement in model accuracy through automated hyperparameter optimization.\n\nThe democratization of data science is creating new opportunities for business users to generate insights and make data-driven decisions without requiring specialized technical skills. Automated platforms are also addressing the shortage of qualified data scientists by enabling existing teams to accomplish more with less specialized knowledge. This trend is particularly impactful in industries like healthcare, finance, and retail, where rapid insights can drive significant competitive advantages.\n\nForward-looking insight: Automated data science will become the primary approach for 80% of machine learning projects within the next 2 years, creating new roles focused on business problem definition and model interpretation rather than technical implementation.",
    takeaways: [
      "70% faster model development with AutoML",
      "50% improvement in model accuracy",
      "Reduces development time from months to days",
    ],
    url: "https://datascienceweekly.com/automated-analytics",
    published_at: "2024-01-07T11:45:00Z",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
  },
  "iot-smart-cities": {
    id: "iot-smart-cities",
    title: "IoT and Smart Cities: Urban Transformation",
    topic: "iot",
    source: "Smart City Tech",
    summary:
      "The Internet of Things (IoT) is revolutionizing urban infrastructure, with smart city initiatives deploying millions of connected sensors to optimize everything from traffic management to energy consumption. These systems are generating unprecedented amounts of data that enable real-time decision-making and predictive analytics. Smart cities are reporting 30% reduction in energy consumption, 25% improvement in traffic flow, and 40% faster emergency response times through IoT-enabled infrastructure.\n\nAdvanced IoT networks are enabling new applications like smart parking systems that guide drivers to available spaces, intelligent street lighting that adjusts based on pedestrian activity, and environmental monitoring systems that track air quality and noise levels in real-time. The integration of 5G networks is accelerating IoT adoption by providing the low-latency, high-bandwidth connectivity required for real-time applications. Municipalities are also leveraging IoT data to improve urban planning and create more livable, sustainable communities.\n\nForward-looking insight: IoT will become the foundation of all urban infrastructure within the next 5 years, with smart cities generating $2.5 trillion in economic value through improved efficiency, reduced costs, and enhanced quality of life for residents.",
    takeaways: [
      "30% reduction in energy consumption in smart cities",
      "25% improvement in traffic flow",
      "40% faster emergency response times",
    ],
    url: "https://smartcitytech.com/iot-transformation",
    published_at: "2024-01-06T16:20:00Z",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format",
  },
  "augmented-reality-enterprise": {
    id: "augmented-reality-enterprise",
    title: "Enterprise Augmented Reality Adoption",
    topic: "vr",
    source: "AR Enterprise Weekly",
    summary:
      "Augmented reality (AR) is transforming enterprise operations across industries, with organizations deploying AR solutions to improve training, maintenance, and collaboration. Manufacturing companies are using AR headsets to provide workers with real-time guidance and information overlay, resulting in 40% reduction in training time and 30% improvement in task accuracy. Remote assistance applications enable experts to guide field technicians through complex procedures, reducing travel costs and improving first-time fix rates.\n\nThe healthcare industry is leveraging AR for surgical planning and medical training, with surgeons using AR overlays to visualize patient anatomy and plan procedures with unprecedented precision. AR is also revolutionizing design and engineering processes, enabling teams to collaborate on 3D models in real-time regardless of their physical location. The integration of AR with artificial intelligence is creating intelligent assistants that can provide contextual information and guidance based on the user's environment and task.\n\nForward-looking insight: Enterprise AR will become a $50 billion market by 2027, with AR becoming standard equipment for field workers, technicians, and professionals across multiple industries, fundamentally changing how work is performed and knowledge is shared.",
    takeaways: [
      "40% reduction in training time with AR",
      "30% improvement in task accuracy",
      "Real-time collaboration on 3D models",
    ],
    url: "https://arenterpriseweekly.com/ar-adoption",
    published_at: "2024-01-05T09:30:00Z",
    image:
      "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=600&fit=crop&auto=format",
  },
  "fintech-digital-banking": {
    id: "fintech-digital-banking",
    title: "Digital Banking Revolution",
    topic: "fintech",
    source: "Fintech Today",
    summary:
      "Digital banking is undergoing a revolutionary transformation, with traditional financial institutions and fintech startups competing to deliver seamless, personalized banking experiences. Mobile-first banking applications are becoming the primary interface for financial services, with 85% of banking interactions now occurring through digital channels. Artificial intelligence and machine learning are enabling hyper-personalized financial products and services, with banks using predictive analytics to offer tailored recommendations and proactive financial advice.\n\nOpen banking initiatives are creating new opportunities for innovation by enabling third-party developers to build applications that integrate with banking systems. This ecosystem approach is fostering competition and driving the development of specialized financial services that address specific customer needs. Cryptocurrency and blockchain technology are also being integrated into traditional banking infrastructure, with major institutions exploring digital asset custody and blockchain-based payment systems.\n\nForward-looking insight: Digital banking will become completely personalized and predictive within the next 3 years, with AI-driven financial assistants becoming the primary interface for managing personal finances, fundamentally changing the relationship between consumers and financial institutions.",
    takeaways: [
      "85% of banking interactions through digital channels",
      "AI enables hyper-personalized financial products",
      "Open banking fosters innovation and competition",
    ],
    url: "https://fintechtoday.com/digital-banking-revolution",
    published_at: "2024-01-04T12:00:00Z",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&auto=format",
  },
  "devops-automation": {
    id: "devops-automation",
    title: "DevOps Automation & CI/CD Evolution",
    topic: "devops",
    source: "DevOps Weekly",
    summary:
      "DevOps automation is reaching new levels of sophistication, with organizations implementing comprehensive CI/CD pipelines that enable continuous delivery and deployment. Advanced automation tools are reducing manual intervention in software development processes, with teams achieving deployment frequencies of multiple times per day while maintaining high reliability and security standards. Infrastructure as Code (IaC) practices are becoming standard, enabling teams to manage and version infrastructure configurations alongside application code.\n\nGitOps methodologies are gaining traction, with organizations using Git repositories as the single source of truth for both application and infrastructure changes. This approach provides enhanced security, auditability, and collaboration capabilities. Automated testing and quality assurance processes are being integrated into CI/CD pipelines, with AI-powered tools identifying potential issues before they reach production. The integration of security scanning and compliance checking into automated workflows is creating DevSecOps practices that ensure security is built into the development process from the beginning.\n\nForward-looking insight: DevOps automation will become completely autonomous within the next 2 years, with AI-driven systems making deployment decisions and automatically rolling back changes when issues are detected, enabling organizations to achieve true continuous deployment with zero-downtime releases.",
    takeaways: [
      "Multiple deployments per day with automation",
      "Infrastructure as Code becomes standard practice",
      "AI-powered testing identifies issues pre-production",
    ],
    url: "https://devopsweekly.com/automation-evolution",
    published_at: "2024-01-03T15:45:00Z",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&auto=format",
  },
  "machine-learning-ethics": {
    id: "machine-learning-ethics",
    title: "Machine Learning Ethics & Responsible AI",
    topic: "machine learning",
    source: "AI Ethics Journal",
    summary:
      "As machine learning systems become more pervasive, the importance of ethical AI development and responsible deployment is gaining critical attention. Organizations are implementing comprehensive AI ethics frameworks that address issues of bias, fairness, transparency, and accountability. Bias detection and mitigation tools are becoming standard components of ML pipelines, with teams actively working to identify and address potential sources of discrimination in training data and model outputs.\n\nExplainable AI (XAI) techniques are enabling organizations to understand and communicate how AI systems make decisions, which is crucial for building trust and ensuring compliance with regulatory requirements. Privacy-preserving machine learning techniques, such as federated learning and differential privacy, are allowing organizations to develop AI models without compromising individual privacy. The development of AI governance frameworks is creating new roles focused on ensuring that AI systems are developed and deployed in ways that align with organizational values and societal expectations.\n\nForward-looking insight: Ethical AI will become a competitive advantage within the next 2 years, with organizations that prioritize responsible AI development gaining customer trust and regulatory approval while avoiding the reputational and legal risks associated with biased or harmful AI systems.",
    takeaways: [
      "Bias detection tools become standard in ML pipelines",
      "Explainable AI techniques build trust and compliance",
      "Privacy-preserving ML protects individual data",
    ],
    url: "https://aiethicsjournal.com/responsible-ai",
    published_at: "2024-01-02T10:15:00Z",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&auto=format",
  },
  "5g-network-evolution": {
    id: "5g-network-evolution",
    title: "5G Network Evolution & 6G Preparation",
    topic: "telecommunications",
    source: "5G Tech Weekly",
    summary:
      "5G networks are evolving beyond initial deployments, with advanced features like network slicing, edge computing, and ultra-reliable low-latency communications (URLLC) becoming operational. These capabilities are enabling new applications in autonomous vehicles, industrial automation, and immersive entertainment that were previously impossible. Network slicing technology allows operators to create virtual networks optimized for specific use cases, providing the performance and reliability required for critical applications.\n\nThe integration of edge computing with 5G networks is reducing latency to single-digit milliseconds, enabling real-time applications that require instantaneous response times. This combination is particularly important for autonomous systems, where split-second decisions can have significant consequences. Meanwhile, research into 6G technology is already underway, with early specifications focusing on terahertz frequencies, advanced AI integration, and holographic communications that could enable truly immersive virtual experiences.\n\nForward-looking insight: 5G will become the foundation for all connected systems within the next 3 years, with 6G research accelerating to address the limitations of current technology and enable applications that require even higher bandwidth, lower latency, and more sophisticated AI integration.",
    takeaways: [
      "Network slicing enables virtual networks for specific use cases",
      "Edge computing reduces latency to single-digit milliseconds",
      "6G research focuses on terahertz frequencies and holographic communications",
    ],
    url: "https://5gtechweekly.com/network-evolution",
    published_at: "2024-01-01T08:00:00Z",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop&auto=format",
  },
  "software-engineering-productivity": {
    id: "software-engineering-productivity",
    title: "Software Engineering Productivity Revolution",
    topic: "software engineering",
    source: "Engineering Weekly",
    summary:
      "Software engineering productivity is undergoing a revolution driven by AI-powered development tools, low-code platforms, and advanced automation. AI coding assistants are helping developers write, review, and debug code more efficiently, with some organizations reporting 40% increases in development velocity. These tools are particularly effective for routine tasks like boilerplate code generation, documentation writing, and test case creation, allowing developers to focus on complex problem-solving and innovation.\n\nLow-code and no-code platforms are democratizing software development, enabling business users and citizen developers to create sophisticated applications without traditional programming skills. This trend is accelerating digital transformation initiatives and reducing the backlog of development requests in many organizations. Advanced project management and collaboration tools are improving team coordination and reducing the overhead associated with complex development projects.\n\nForward-looking insight: AI-powered development tools will become standard equipment for all software engineers within the next 2 years, fundamentally changing the nature of programming and enabling organizations to develop software faster, more reliably, and with fewer resources than ever before.",
    takeaways: [
      "40% increase in development velocity with AI assistants",
      "Low-code platforms democratize software development",
      "Advanced collaboration tools improve team coordination",
    ],
    url: "https://engineeringweekly.com/productivity-revolution",
    published_at: "2023-12-31T14:30:00Z",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&auto=format",
  },
  "database-technology-advances": {
    id: "database-technology-advances",
    title: "Next-Generation Database Technologies",
    topic: "database",
    source: "Database Tech Today",
    summary:
      "Database technology is evolving rapidly to meet the demands of modern applications, with new architectures and capabilities that address the challenges of big data, real-time processing, and distributed systems. Time-series databases are becoming essential for IoT and financial applications that generate massive amounts of time-stamped data. Graph databases are enabling new insights in social networks, fraud detection, and recommendation systems by efficiently modeling complex relationships between entities.\n\nVector databases are emerging as a critical technology for AI and machine learning applications, enabling efficient storage and retrieval of high-dimensional data used in similarity search and recommendation systems. Distributed databases are providing the scalability and fault tolerance required for global applications, with advanced consistency models that balance performance and data integrity. The integration of AI and machine learning into database systems is creating intelligent databases that can optimize performance, predict failures, and automatically tune themselves for optimal performance.\n\nForward-looking insight: Database technology will become increasingly specialized and intelligent within the next 3 years, with purpose-built databases for specific use cases becoming the norm, and AI-driven optimization becoming standard across all database platforms.",
    takeaways: [
      "Time-series databases essential for IoT and financial data",
      "Graph databases enable complex relationship modeling",
      "Vector databases critical for AI similarity search",
    ],
    url: "https://databasetechtoday.com/next-generation",
    published_at: "2023-12-30T11:20:00Z",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&auto=format",
  },
};

export const getMockNewsItem = (id: string): MockNewsItem | null => {
  return mockNewsData[id] || null;
};

export const getAllMockNewsIds = (): string[] => {
  return Object.keys(mockNewsData);
};
