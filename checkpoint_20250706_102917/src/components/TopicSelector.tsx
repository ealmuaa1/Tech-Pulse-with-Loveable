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
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => (
        <button
          key={topic}
          onClick={() =>
            onChange(
              favoriteTopics.includes(topic)
                ? favoriteTopics.filter((t) => t !== topic)
                : [...favoriteTopics, topic]
            )
          }
          className={`px-3 py-1 rounded-full border transition ${
            favoriteTopics.includes(topic)
              ? "bg-primary text-white"
              : "bg-muted text-foreground"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
