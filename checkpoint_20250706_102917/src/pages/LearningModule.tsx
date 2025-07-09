import React from "react";

const flashcards = [
  {
    question: "What is Edge AI?",
    answer: "AI processing on the device itself, not in the cloud.",
  },
  {
    question: "What’s WebAssembly used for?",
    answer: "Running high-performance code in browsers.",
  },
];

export default function LearningModule() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Flashcard Challenge</h2>
      <div className="space-y-4">
        {flashcards.map((card, index) => (
          <details key={index} className="border rounded-md p-4 cursor-pointer">
            <summary className="font-medium">{card.question}</summary>
            <p className="mt-2 text-gray-700">{card.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
