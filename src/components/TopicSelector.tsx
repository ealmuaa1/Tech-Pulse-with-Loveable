import { topics } from "@/data/topics";
import { useState } from "react";

export default function TopicSelector({
  favoriteTopics,
  onChange,
}: {
  favoriteTopics: string[];
  onChange: (topics: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {topics.map((topic) => {
        const isSelected = favoriteTopics.includes(topic);
        return (
          <button
            key={topic}
            onClick={() =>
              onChange(
                isSelected
                  ? favoriteTopics.filter((t) => t !== topic)
                  : [...favoriteTopics, topic]
              )
            }
            className={`px-4 py-2 rounded-full border-2 transition-all duration-200 font-medium text-sm hover:scale-105 ${
              isSelected
                ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-600 text-white shadow-md hover:from-purple-700 hover:to-pink-700"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400"
            }`}
          >
            {topic}
          </button>
        );
      })}
    </div>
  );
}
