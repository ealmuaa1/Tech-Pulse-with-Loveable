interface ReviewItem {
  id: string;
  lastReviewed: number;
  nextReview: number;
  reviewCount: number;
  difficulty: "easy" | "medium" | "hard";
}

interface ReviewSession {
  items: ReviewItem[];
  lastSession: number;
}

const STORAGE_KEY = "spaced_repetition_data";

// Spacing intervals in milliseconds (1 day, 3 days, 7 days, 14 days, 30 days)
const SPACING_INTERVALS = [
  24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000,
  30 * 24 * 60 * 60 * 1000,
];

/**
 * Initialize or load spaced repetition data
 */
export function initializeSpacedRepetition(): ReviewSession {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    items: [],
    lastSession: Date.now(),
  };
}

/**
 * Add a new item to the spaced repetition system
 */
export function addReviewItem(itemId: string): void {
  const session = initializeSpacedRepetition();
  const now = Date.now();

  // Check if item already exists
  if (session.items.some((item) => item.id === itemId)) {
    return;
  }

  session.items.push({
    id: itemId,
    lastReviewed: now,
    nextReview: now + SPACING_INTERVALS[0],
    reviewCount: 0,
    difficulty: "medium",
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/**
 * Update an item's review status
 */
export function updateReviewItem(
  itemId: string,
  difficulty: "easy" | "medium" | "hard"
): void {
  const session = initializeSpacedRepetition();
  const now = Date.now();
  const item = session.items.find((i) => i.id === itemId);

  if (!item) return;

  item.lastReviewed = now;
  item.reviewCount += 1;
  item.difficulty = difficulty;

  // Calculate next review based on difficulty and review count
  const intervalIndex = Math.min(
    item.reviewCount,
    SPACING_INTERVALS.length - 1
  );
  const baseInterval = SPACING_INTERVALS[intervalIndex];

  // Adjust interval based on difficulty
  const difficultyMultiplier = {
    easy: 1.5,
    medium: 1,
    hard: 0.5,
  }[difficulty];

  item.nextReview = now + baseInterval * difficultyMultiplier;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

/**
 * Get items due for review
 */
export function getDueItems(): ReviewItem[] {
  const session = initializeSpacedRepetition();
  const now = Date.now();

  return session.items.filter((item) => item.nextReview <= now);
}

/**
 * Get review statistics
 */
export function getReviewStats(): {
  totalItems: number;
  dueItems: number;
  completedItems: number;
  averageDifficulty: number;
} {
  const session = initializeSpacedRepetition();
  const now = Date.now();
  const dueItems = session.items.filter((item) => item.nextReview <= now);
  const completedItems = session.items.filter((item) => item.reviewCount > 0);

  const difficultyScores = {
    easy: 3,
    medium: 2,
    hard: 1,
  };

  const averageDifficulty =
    completedItems.reduce(
      (sum, item) => sum + difficultyScores[item.difficulty],
      0
    ) / completedItems.length || 0;

  return {
    totalItems: session.items.length,
    dueItems: dueItems.length,
    completedItems: completedItems.length,
    averageDifficulty,
  };
}

/**
 * Clear all review data
 */
export function clearReviewData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
