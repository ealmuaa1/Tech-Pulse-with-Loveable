/**
 * Flashcard data structure
 * Each flashcard has a front (question) and back (answer)
 * Categories help organize content and track progress
 */
export interface Flashcard {
  id: number;
  category: string;
  front: string;
  back: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xp: number;
}

export const flashcards: Flashcard[] = [
  {
    id: 1,
    category: "AI Fundamentals",
    front: "What is Machine Learning?",
    back: "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
    difficulty: "beginner",
    xp: 10,
  },
  {
    id: 2,
    category: "AI Fundamentals",
    front:
      "What's the difference between supervised and unsupervised learning?",
    back: "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data.",
    difficulty: "intermediate",
    xp: 15,
  },
  {
    id: 3,
    category: "Web Development",
    front: "What is React's Virtual DOM?",
    back: "Virtual DOM is a lightweight copy of the actual DOM that React uses to optimize rendering performance by minimizing direct DOM manipulation.",
    difficulty: "intermediate",
    xp: 15,
  },
  {
    id: 4,
    category: "Web Development",
    front: "Explain the concept of 'props' in React",
    back: "Props (properties) are read-only components that pass data from parent to child components, enabling component reusability and data flow.",
    difficulty: "beginner",
    xp: 10,
  },
  {
    id: 5,
    category: "Blockchain",
    front: "What is a smart contract?",
    back: "A smart contract is a self-executing contract with the terms directly written into code, running on a blockchain network.",
    difficulty: "intermediate",
    xp: 15,
  },
  {
    id: 6,
    category: "Blockchain",
    front: "What is the difference between public and private blockchains?",
    back: "Public blockchains are open to anyone, while private blockchains are restricted to specific participants and controlled by a single organization.",
    difficulty: "advanced",
    xp: 20,
  },
  // Cybersecurity flashcards
  {
    id: 7,
    category: "Cybersecurity",
    front: "What is Zero Trust Security?",
    back: "Zero Trust is a security model that requires all users, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated before being granted access to applications and data.",
    difficulty: "intermediate",
    xp: 15,
  },
  {
    id: 8,
    category: "Cybersecurity",
    front: "What is the difference between authentication and authorization?",
    back: "Authentication verifies who you are (like a username/password), while authorization determines what you can access (like permissions and roles).",
    difficulty: "beginner",
    xp: 10,
  },
  {
    id: 9,
    category: "Cybersecurity",
    front: "What is a Man-in-the-Middle (MitM) attack?",
    back: "A MitM attack occurs when an attacker secretly intercepts and relays messages between two parties who believe they are communicating directly with each other.",
    difficulty: "intermediate",
    xp: 15,
  },
  {
    id: 10,
    category: "Cybersecurity",
    front: "What is the principle of least privilege?",
    back: "The principle of least privilege states that users should be given the minimum levels of access necessary to perform their job functions, reducing the potential impact of a security breach.",
    difficulty: "beginner",
    xp: 10,
  },
  {
    id: 11,
    category: "Cybersecurity",
    front: "What is multi-factor authentication (MFA)?",
    back: "MFA is a security method that requires users to provide two or more verification factors to gain access to a resource, such as something you know (password), something you have (phone), or something you are (fingerprint).",
    difficulty: "beginner",
    xp: 10,
  },
  {
    id: 12,
    category: "Cybersecurity",
    front: "What is a security vulnerability assessment?",
    back: "A vulnerability assessment is a systematic review of security weaknesses in an information system, evaluating if the system is susceptible to any known vulnerabilities, assigning severity levels, and recommending remediation or mitigation.",
    difficulty: "advanced",
    xp: 20,
  },
];

import type { FlashcardType } from "@/types";

export const defaultFlashcards: FlashcardType[] = [
  {
    id: "cyber-1",
    topic: "Cybersecurity",
    front: "What is Zero Trust Security?",
    back: "A security model that requires all users, whether inside or outside the organization's network, to be authenticated, authorized, and continuously validated before being granted access to applications and data.",
    category: "Cybersecurity",
    difficulty: "Beginner",
    xp: 10,
  },
  {
    id: "cyber-2",
    topic: "Cybersecurity",
    front: "What is the difference between authentication and authorization?",
    back: "Authentication verifies who you are (e.g., username/password), while authorization determines what you can access and what actions you can perform.",
    category: "Cybersecurity",
    difficulty: "Beginner",
    xp: 10,
  },
  {
    id: "cyber-3",
    topic: "Cybersecurity",
    front: "What is a Man-in-the-Middle (MitM) attack?",
    back: "A type of cyber attack where an attacker secretly intercepts and relays messages between two parties who believe they are communicating directly with each other.",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    xp: 15,
  },
  {
    id: "cyber-4",
    topic: "Cybersecurity",
    front: "What is Multi-Factor Authentication (MFA)?",
    back: "A security system that requires multiple methods of authentication from independent categories of credentials to verify the user's identity for a login or other transaction.",
    category: "Cybersecurity",
    difficulty: "Beginner",
    xp: 10,
  },
  {
    id: "cyber-5",
    topic: "Cybersecurity",
    front: "What is a DDoS attack?",
    back: "A Distributed Denial of Service attack attempts to make an online service unavailable by overwhelming it with traffic from multiple sources.",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    xp: 15,
  },
  {
    id: "ai-1",
    topic: "AI",
    front: "What is Machine Learning?",
    back: "A subset of AI that enables systems to learn and improve from experience without being explicitly programmed.",
    category: "AI",
    difficulty: "Beginner",
    xp: 10,
  },
  {
    id: "ai-2",
    topic: "AI",
    front: "What is Deep Learning?",
    back: "A subset of machine learning that uses neural networks with many layers (hence 'deep') to analyze various factors of data.",
    category: "AI",
    difficulty: "Intermediate",
    xp: 15,
  },
  {
    id: "blockchain-1",
    topic: "Blockchain",
    front: "What is a Smart Contract?",
    back: "Self-executing contracts with the terms of the agreement directly written into code, stored and replicated on the blockchain network.",
    category: "Blockchain",
    difficulty: "Intermediate",
    xp: 15,
  },
  {
    id: "cloud-1",
    topic: "Cloud Computing",
    front: "What is Serverless Computing?",
    back: "A cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources, and pricing is based on the actual amount of resources consumed by an application.",
    category: "Cloud",
    difficulty: "Intermediate",
    xp: 15,
  },
];
