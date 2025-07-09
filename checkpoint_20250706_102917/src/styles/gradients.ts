// Gradient definitions for the personalized AI learning dashboard
// Inspired by modern learning platforms like Coursiv, Duolingo, and Notion

export const gradients = {
  // Primary learning gradients
  purple: "bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500",
  purpleCard:
    "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30",

  // Progress and achievement gradients
  coral: "bg-gradient-to-r from-coral-400 via-orange-400 to-pink-500",
  coralCard:
    "bg-gradient-to-br from-orange-50 to-pink-100 dark:from-orange-900/20 dark:to-pink-800/30",

  // Learning and discovery gradients
  sky: "bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500",
  skyCard:
    "bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/20 dark:to-blue-800/30",

  // Growth and tools gradients
  teal: "bg-gradient-to-r from-teal-400 via-emerald-500 to-green-500",
  tealCard:
    "bg-gradient-to-br from-teal-50 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-800/30",

  // Neutral and content gradients
  slate: "bg-gradient-to-r from-slate-400 via-gray-500 to-zinc-500",
  slateCard:
    "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/20 dark:to-gray-800/30",

  // Special gradients
  sunset: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
  sunsetCard:
    "bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-800/30",

  // Success and completion gradients
  success: "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500",
  successCard:
    "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/30",

  // Badge and achievement gradients
  gold: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500",
  goldCard:
    "bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/30",
};

// Hover effects for interactive elements
export const hoverGradients = {
  purple:
    "hover:bg-gradient-to-r hover:from-purple-500 hover:via-purple-600 hover:to-indigo-600",
  coral:
    "hover:bg-gradient-to-r hover:from-coral-500 hover:via-orange-500 hover:to-pink-600",
  sky: "hover:bg-gradient-to-r hover:from-sky-500 hover:via-blue-600 hover:to-cyan-600",
  teal: "hover:bg-gradient-to-r hover:from-teal-500 hover:via-emerald-600 hover:to-green-600",
  success:
    "hover:bg-gradient-to-r hover:from-green-500 hover:via-emerald-600 hover:to-teal-600",
};

// Text gradients for headings and special text
export const textGradients = {
  purple:
    "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent",
  coral:
    "bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent",
  sky: "bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent",
  teal: "bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent",
  gold: "bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent",
};

// Card shadow effects
export const cardEffects = {
  soft: "shadow-lg hover:shadow-xl transition-all duration-300",
  medium: "shadow-xl hover:shadow-2xl transition-all duration-300",
  glow: "shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300",
  coloredGlow: {
    purple:
      "shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300",
    coral:
      "shadow-lg hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300",
    sky: "shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300",
    teal: "shadow-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300",
  },
};

export default gradients;
