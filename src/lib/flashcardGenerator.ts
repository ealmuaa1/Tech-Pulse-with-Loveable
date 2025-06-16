import { Flashcard } from "@/data/flashcards";

/**
 * Generate placeholder flashcards for a given tech trend
 * @param trend - The trending tech topic
 * @param category - The detected category of the trend
 * @returns Array of flashcards
 */
export function generateTrendFlashcards(
  trend: string,
  category: string
): Flashcard[] {
  // Base flashcards that are common for all tech trends
  const baseFlashcards: Flashcard[] = [
    {
      id: 1,
      category,
      front: `What is ${trend}?`,
      back: `${trend} is a technology that [placeholder description]. It represents a significant advancement in the field of ${category}.`,
      difficulty: "beginner",
      xp: 10,
    },
    {
      id: 2,
      category,
      front: `Why does ${trend} matter?`,
      back: `${trend} is important because it [placeholder impact]. It has the potential to transform how we [placeholder application].`,
      difficulty: "intermediate",
      xp: 15,
    },
    {
      id: 3,
      category,
      front: `What is a real-world use case of ${trend}?`,
      back: `One practical application of ${trend} is [placeholder use case]. This demonstrates how ${trend} can be used to solve real-world problems.`,
      difficulty: "intermediate",
      xp: 15,
    },
  ];

  // Add category-specific content
  switch (category.toLowerCase()) {
    case "ai":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "uses machine learning algorithms to simulate human intelligence"
          )
          .replace(
            "[placeholder impact]",
            "enables automation of complex tasks and decision-making"
          )
          .replace(
            "[placeholder application]",
            "interact with technology and solve problems"
          )
          .replace(
            "[placeholder use case]",
            "in healthcare for disease diagnosis and treatment planning"
          ),
      }));

    case "blockchain":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "is a distributed ledger technology that ensures secure and transparent transactions"
          )
          .replace(
            "[placeholder impact]",
            "provides trust and transparency in digital transactions"
          )
          .replace(
            "[placeholder application]",
            "conduct business and exchange value"
          )
          .replace(
            "[placeholder use case]",
            "in supply chain management for tracking goods and verifying authenticity"
          ),
      }));

    case "cloud":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "provides on-demand computing resources over the internet"
          )
          .replace(
            "[placeholder impact]",
            "enables scalable and flexible computing resources"
          )
          .replace("[placeholder application]", "store and process data")
          .replace(
            "[placeholder use case]",
            "in enterprise data storage and application hosting"
          ),
      }));

    case "cybersecurity":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "protects systems and networks from digital attacks"
          )
          .replace(
            "[placeholder impact]",
            "ensures the security and privacy of digital assets"
          )
          .replace("[placeholder application]", "protect sensitive information")
          .replace(
            "[placeholder use case]",
            "in financial institutions for protecting customer data"
          ),
      }));

    case "iot":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "connects physical devices to the internet for data exchange"
          )
          .replace(
            "[placeholder impact]",
            "enables smart, connected environments"
          )
          .replace(
            "[placeholder application]",
            "monitor and control physical devices"
          )
          .replace(
            "[placeholder use case]",
            "in smart homes for automated climate control and security"
          ),
      }));

    case "quantum":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "uses quantum mechanics to perform complex calculations"
          )
          .replace(
            "[placeholder impact]",
            "solves problems that are intractable for classical computers"
          )
          .replace(
            "[placeholder application]",
            "solve complex scientific and mathematical problems"
          )
          .replace(
            "[placeholder use case]",
            "in cryptography for secure communications"
          ),
      }));

    case "web3":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "is a decentralized version of the internet built on blockchain"
          )
          .replace(
            "[placeholder impact]",
            "enables user ownership and control of digital assets"
          )
          .replace(
            "[placeholder application]",
            "interact with decentralized applications"
          )
          .replace(
            "[placeholder use case]",
            "in decentralized finance (DeFi) for peer-to-peer financial services"
          ),
      }));

    case "vr":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "creates immersive, computer-generated environments"
          )
          .replace(
            "[placeholder impact]",
            "transforms how we experience digital content"
          )
          .replace(
            "[placeholder application]",
            "interact with virtual environments"
          )
          .replace(
            "[placeholder use case]",
            "in training and simulation for high-risk professions"
          ),
      }));

    case "ar":
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "overlays digital information on the real world"
          )
          .replace(
            "[placeholder impact]",
            "enhances our interaction with the physical world"
          )
          .replace(
            "[placeholder application]",
            "view and interact with digital content in real space"
          )
          .replace(
            "[placeholder use case]",
            "in retail for virtual product try-ons"
          ),
      }));

    default:
      return baseFlashcards.map((card) => ({
        ...card,
        back: card.back
          .replace(
            "[placeholder description]",
            "is an emerging technology with significant potential"
          )
          .replace(
            "[placeholder impact]",
            "has the potential to transform industries"
          )
          .replace("[placeholder application]", "solve complex problems")
          .replace(
            "[placeholder use case]",
            "in various industries for innovation and efficiency"
          ),
      }));
  }
}
