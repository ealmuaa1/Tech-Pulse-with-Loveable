interface Progress {
  totalXp: number;
  completedQuests: number[];
  memoryTools: {
    [key: string]: {
      [questId: number]: number;
    };
  };
}

const STORAGE_KEY = "techpulse_progress";

export function loadProgress(): Progress {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    totalXp: 0,
    completedQuests: [],
    memoryTools: {
      matching: {},
      fillInTheBlank: {},
      spacedRepetition: {},
      conceptMap: {},
    },
  };
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateMemoryToolProgress(
  tool: "matching" | "fillInTheBlank" | "spacedRepetition" | "conceptMap",
  questId: number,
  score: number
) {
  const progress = loadProgress();
  progress.memoryTools[tool][questId] = score;
  progress.totalXp += score;
  saveProgress(progress);
}

export function getMemoryToolProgress(
  tool: "matching" | "fillInTheBlank" | "spacedRepetition" | "conceptMap",
  questId: number
): number {
  const progress = loadProgress();
  return progress.memoryTools[tool][questId] || 0;
}
