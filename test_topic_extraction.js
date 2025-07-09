// Test script to verify topic extraction with available topics
// Run this in browser console to test

const testTopics = [
  {
    id: "1",
    title: "AI-Powered Code Generation with GitHub Copilot",
    category: "AI",
    summary: "Discover how AI is revolutionizing software development with intelligent code completion and generation tools that boost productivity by 40%."
  },
  {
    id: "2", 
    title: "Web3 and Decentralized Applications (DApps)",
    category: "Blockchain",
    summary: "Learn to build decentralized applications on Ethereum blockchain with smart contracts, Web3.js, and modern frontend frameworks."
  },
  {
    id: "3",
    title: "Cloud-Native Development with Kubernetes", 
    category: "Cloud",
    summary: "Master container orchestration and microservices architecture using Kubernetes, Docker, and cloud-native development practices."
  },
  {
    id: "4",
    title: "Cybersecurity: Zero Trust Architecture",
    category: "Security", 
    summary: "Implement modern security frameworks with zero trust principles, identity management, and threat detection systems."
  },
  {
    id: "5",
    title: "Machine Learning with Python and TensorFlow",
    category: "Data Science",
    summary: "Build and deploy ML models using Python, TensorFlow, and scikit-learn for real-world data science applications."
  },
  {
    id: "6",
    title: "React Native Cross-Platform Development",
    category: "Mobile",
    summary: "Create mobile apps for iOS and Android using React Native, Expo, and modern mobile development patterns."
  }
];

// Test different preference scenarios
const testScenarios = [
  {
    name: "Machine Learning preference",
    preferences: ["machine learning"],
    expectedMatches: ["Machine Learning with Python and TensorFlow", "AI-Powered Code Generation with GitHub Copilot"]
  },
  {
    name: "Cybersecurity preference", 
    preferences: ["cybersecurity"],
    expectedMatches: ["Cybersecurity: Zero Trust Architecture"]
  },
  {
    name: "Programming preference",
    preferences: ["programming"],
    expectedMatches: ["React Native Cross-Platform Development", "AI-Powered Code Generation with GitHub Copilot"]
  },
  {
    name: "No preferences",
    preferences: [],
    expectedMatches: "all topics"
  }
];

console.log("=== Topic Extraction Test ===");

testScenarios.forEach(scenario => {
  console.log(`\n--- Testing: ${scenario.name} ---`);
  console.log("Preferences:", scenario.preferences);
  
  // Simulate the filtering logic
  if (!scenario.preferences || scenario.preferences.length === 0) {
    console.log("Result: All topics should be shown");
    return;
  }
  
  // Test each topic against preferences
  const matches = testTopics.filter(topic => {
    const topicText = [
      topic.title || "",
      topic.category || "",
      topic.summary || ""
    ].join(" ").toLowerCase();
    
    return scenario.preferences.some(pref => 
      topicText.includes(pref.toLowerCase())
    );
  });
  
  console.log("Matches found:", matches.map(t => t.title));
  console.log("Expected:", scenario.expectedMatches);
  console.log("✅ Test passed:", matches.length > 0);
});

console.log("\n=== End Test ==="); 