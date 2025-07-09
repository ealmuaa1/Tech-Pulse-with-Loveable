/**
 * Enhanced Topic Extraction and Matching Utility
 * Provides intelligent topic extraction from content and robust matching with user preferences
 */

export interface ExtractedTopic {
  topic: string;
  confidence: number;
  source: "title" | "category" | "tags" | "content";
}

export interface TopicMatch {
  isMatch: boolean;
  confidence: number;
  matchedTopics: string[];
  extractedTopics: ExtractedTopic[];
}

/**
 * Topic mapping for variations and synonyms
 * Maps common variations to standardized topic names
 */
const TOPIC_MAPPINGS: Record<string, string[]> = {
  // AI and Machine Learning
  ai: ["artificial intelligence", "ai", "machine intelligence"],
  "machine learning": [
    "machine learning",
    "ml",
    "ai",
    "artificial intelligence",
    "deep learning",
    "neural networks",
  ],
  "artificial intelligence": [
    "ai",
    "artificial intelligence",
    "machine intelligence",
  ],
  "deep learning": [
    "deep learning",
    "neural networks",
    "machine learning",
    "ai",
  ],
  "neural networks": ["neural networks", "deep learning", "machine learning"],

  // Cybersecurity
  cybersecurity: [
    "cybersecurity",
    "cyber security",
    "security",
    "infosec",
    "information security",
  ],
  "cyber security": ["cybersecurity", "cyber security", "security"],
  security: ["security", "cybersecurity", "cyber security", "infosec"],
  infosec: ["infosec", "information security", "cybersecurity"],

  // Blockchain and Web3
  blockchain: [
    "blockchain",
    "web3",
    "cryptocurrency",
    "crypto",
    "distributed ledger",
  ],
  web3: ["web3", "blockchain", "decentralized", "dapp", "defi"],
  cryptocurrency: [
    "cryptocurrency",
    "crypto",
    "blockchain",
    "bitcoin",
    "ethereum",
  ],
  crypto: ["crypto", "cryptocurrency", "blockchain"],

  // Data Science
  "data science": ["data science", "data analytics", "analytics", "big data"],
  "data analytics": ["data analytics", "data science", "analytics"],
  "big data": ["big data", "data science", "data analytics"],

  // Programming and Development
  programming: ["programming", "coding", "software development", "development"],
  coding: ["coding", "programming", "software development"],
  "software development": ["software development", "programming", "coding"],
  "web development": ["web development", "frontend", "backend", "full stack"],
  frontend: ["frontend", "front-end", "web development", "ui", "ux"],
  backend: ["backend", "back-end", "server-side", "api"],

  // Cloud and DevOps
  cloud: ["cloud", "aws", "azure", "gcp", "cloud computing"],
  devops: ["devops", "ci/cd", "deployment", "automation"],
  kubernetes: ["kubernetes", "k8s", "container orchestration", "docker"],

  // Mobile Development
  mobile: ["mobile", "ios", "android", "mobile development", "app development"],
  ios: ["ios", "iphone", "mobile", "swift"],
  android: ["android", "mobile", "kotlin", "java"],

  // Health Tech
  healthtech: [
    "healthtech",
    "health tech",
    "healthcare technology",
    "medical technology",
  ],
  healthcare: ["healthcare", "health tech", "medical", "health"],

  // Emerging Technologies
  "quantum computing": ["quantum computing", "quantum", "quantum mechanics"],
  iot: ["iot", "internet of things", "smart devices"],
  ar: ["ar", "augmented reality", "virtual reality", "vr"],
  vr: ["vr", "virtual reality", "augmented reality", "ar"],
  metaverse: ["metaverse", "virtual reality", "vr", "ar"],
};

/**
 * Extract topics from content using multiple strategies
 */
export class TopicExtractor {
  /**
   * Extract topics from content title, category, tags, and description
   */
  static extractTopics(content: {
    title?: string;
    category?: string;
    tags?: string[];
    summary?: string;
    description?: string;
  }): ExtractedTopic[] {
    const extracted: ExtractedTopic[] = [];

    // Extract from title
    if (content.title) {
      const titleTopics = this.extractFromText(content.title, "title");
      extracted.push(...titleTopics);
    }

    // Extract from category
    if (content.category) {
      const categoryTopics = this.extractFromText(content.category, "category");
      extracted.push(...categoryTopics);
    }

    // Extract from tags
    if (content.tags && content.tags.length > 0) {
      content.tags.forEach((tag) => {
        const tagTopics = this.extractFromText(tag, "tags");
        extracted.push(...tagTopics);
      });
    }

    // Extract from summary/description
    if (content.summary) {
      const summaryTopics = this.extractFromText(content.summary, "content");
      extracted.push(...summaryTopics);
    }

    if (content.description) {
      const descTopics = this.extractFromText(content.description, "content");
      extracted.push(...descTopics);
    }

    // Remove duplicates and sort by confidence
    return this.deduplicateTopics(extracted);
  }

  /**
   * Extract topics from text using keyword matching and NLP techniques
   */
  private static extractFromText(
    text: string,
    source: ExtractedTopic["source"]
  ): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    const textLower = text.toLowerCase();

    // Check each topic mapping
    for (const [standardTopic, variations] of Object.entries(TOPIC_MAPPINGS)) {
      let maxConfidence = 0;

      for (const variation of variations) {
        const confidence = this.calculateMatchConfidence(
          textLower,
          variation,
          source
        );
        maxConfidence = Math.max(maxConfidence, confidence);
      }

      if (maxConfidence > 0.3) {
        // Minimum confidence threshold
        topics.push({
          topic: standardTopic,
          confidence: maxConfidence,
          source,
        });
      }
    }

    return topics;
  }

  /**
   * Calculate confidence score for topic matching
   */
  private static calculateMatchConfidence(
    text: string,
    topic: string,
    source: ExtractedTopic["source"]
  ): number {
    let confidence = 0;

    // Exact match gets highest score
    if (text.includes(topic.toLowerCase())) {
      confidence = 1.0;
    }
    // Partial word match gets medium score
    else if (
      topic.split(" ").some((word) => text.includes(word.toLowerCase()))
    ) {
      confidence = 0.7;
    }
    // Acronym matching (e.g., "ML" in "Machine Learning")
    else if (this.isAcronymMatch(text, topic)) {
      confidence = 0.6;
    }

    // Adjust confidence based on source
    switch (source) {
      case "title":
        confidence *= 1.0; // Title matches are most important
        break;
      case "category":
        confidence *= 0.9; // Category matches are very important
        break;
      case "tags":
        confidence *= 0.8; // Tag matches are important
        break;
      case "content":
        confidence *= 0.6; // Content matches are less important
        break;
    }

    return confidence;
  }

  /**
   * Check if text contains acronyms that match the topic
   */
  private static isAcronymMatch(text: string, topic: string): boolean {
    const acronyms: Record<string, string[]> = {
      ml: ["machine learning"],
      ai: ["artificial intelligence"],
      iot: ["internet of things"],
      ar: ["augmented reality"],
      vr: ["virtual reality"],
      api: ["application programming interface"],
      ui: ["user interface"],
      ux: ["user experience"],
      devops: ["development operations"],
      "ci/cd": ["continuous integration", "continuous deployment"],
    };

    for (const [acronym, fullForms] of Object.entries(acronyms)) {
      if (
        text.includes(acronym) &&
        fullForms.some((form) => topic.includes(form))
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Remove duplicate topics and keep highest confidence scores
   */
  private static deduplicateTopics(topics: ExtractedTopic[]): ExtractedTopic[] {
    const topicMap = new Map<string, ExtractedTopic>();

    for (const topic of topics) {
      const existing = topicMap.get(topic.topic);
      if (!existing || topic.confidence > existing.confidence) {
        topicMap.set(topic.topic, topic);
      }
    }

    return Array.from(topicMap.values()).sort(
      (a, b) => b.confidence - a.confidence
    );
  }
}

/**
 * Enhanced topic matching with intelligent extraction
 */
export class TopicMatcher {
  /**
   * Match content against user preferences with enhanced extraction
   */
  static matchContent(
    content: {
      title?: string;
      category?: string;
      tags?: string[];
      summary?: string;
      description?: string;
    },
    userPreferences: string[]
  ): TopicMatch {
    // Extract topics from content
    const extractedTopics = TopicExtractor.extractTopics(content);

    // Match against user preferences
    const matchedTopics: string[] = [];
    let maxConfidence = 0;

    for (const extracted of extractedTopics) {
      for (const preference of userPreferences) {
        const matchConfidence = this.calculatePreferenceMatch(
          extracted.topic,
          preference
        );
        if (matchConfidence > 0.3) {
          // Lowered match threshold for better matching
          matchedTopics.push(extracted.topic);
          maxConfidence = Math.max(
            maxConfidence,
            matchConfidence * extracted.confidence
          );
        }
      }
    }

    return {
      isMatch: matchedTopics.length > 0,
      confidence: maxConfidence,
      matchedTopics,
      extractedTopics,
    };
  }

  /**
   * Calculate how well a topic matches a user preference
   */
  private static calculatePreferenceMatch(
    topic: string,
    preference: string
  ): number {
    const topicLower = topic.toLowerCase();
    const prefLower = preference.toLowerCase();

    // Exact match
    if (topicLower === prefLower) {
      return 1.0;
    }

    // Check if topic is in preference mappings
    const topicVariations = TOPIC_MAPPINGS[topicLower] || [];
    const prefVariations = TOPIC_MAPPINGS[prefLower] || [];

    // Check for overlap in variations
    const allTopicVariations = [topicLower, ...topicVariations];
    const allPrefVariations = [prefLower, ...prefVariations];

    for (const topicVar of allTopicVariations) {
      for (const prefVar of allPrefVariations) {
        if (topicVar === prefVar) {
          return 0.9;
        }
        if (topicVar.includes(prefVar) || prefVar.includes(topicVar)) {
          return 0.7;
        }
      }
    }

    // Partial word matching
    const topicWords = topicLower.split(" ");
    const prefWords = prefLower.split(" ");

    const commonWords = topicWords.filter((word) => prefWords.includes(word));
    if (commonWords.length > 0) {
      return (
        0.5 *
        (commonWords.length / Math.max(topicWords.length, prefWords.length))
      );
    }

    return 0;
  }

  /**
   * Filter content array based on user preferences
   */
  static filterContent<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      summary?: string;
      description?: string;
    }
  >(content: T[], userPreferences: string[]): T[] {
    if (!userPreferences || userPreferences.length === 0) {
      return content;
    }

    const filtered = content.filter((item) => {
      const match = this.matchContent(item, userPreferences);

      // Debug logging for filtering
      console.log(`TopicMatcher filtering "${item.title}":`, {
        isMatch: match.isMatch,
        confidence: match.confidence,
        matchedTopics: match.matchedTopics,
        userPreferences,
      });

      return match.isMatch;
    });

    console.log(
      `TopicMatcher: Filtered ${content.length} items to ${filtered.length} matches`
    );
    return filtered;
  }

  /**
   * Sort content by relevance to user preferences
   */
  static sortByRelevance<
    T extends {
      title?: string;
      category?: string;
      tags?: string[];
      summary?: string;
      description?: string;
    }
  >(content: T[], userPreferences: string[]): T[] {
    if (!userPreferences || userPreferences.length === 0) {
      return content;
    }

    return [...content].sort((a, b) => {
      const matchA = this.matchContent(a, userPreferences);
      const matchB = this.matchContent(b, userPreferences);
      return matchB.confidence - matchA.confidence;
    });
  }
}
