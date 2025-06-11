import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "from-green-500 to-emerald-500";
    case "intermediate":
      return "from-blue-500 to-indigo-500";
    case "advanced":
      return "from-purple-500 to-pink-500";
    default:
      return "from-gray-500 to-slate-500";
  }
}
