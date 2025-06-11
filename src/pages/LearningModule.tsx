import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const mockFlashcards: Flashcard[] = [
  {
    id: "1",
    question: "What is the difference between AI and Machine Learning?",
    answer:
      'AI is the broader concept of machines being able to carry out tasks in a way that we would consider "smart". Machine Learning is a current application of AI based on the idea that we should be able to give machines access to data and let them learn for themselves.',
    category: "AI Basics",
  },
  {
    id: "2",
    question: "What is a smart contract in blockchain?",
    answer:
      "A smart contract is a self-executing contract with the terms of the agreement between buyer and seller being directly written into lines of code. The code and the agreements contained therein exist across a distributed, decentralized blockchain network.",
    category: "Blockchain",
  },
  {
    id: "3",
    question: "What is serverless architecture?",
    answer:
      "Serverless architecture is a way to build and run applications and services without having to manage infrastructure. Your application still runs on servers, but all the server management is done by the cloud provider.",
    category: "Cloud Computing",
  },
];

const LearningModule = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const flashcardsCollection = collection(db, "flashcards");
        const flashcardsSnapshot = await getDocs(flashcardsCollection);
        const flashcardsList = flashcardsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Flashcard[];

        if (flashcardsList.length > 0) {
          setFlashcards(flashcardsList);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Daily Learning Challenge
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Take 5 minutes to learn something new about technology
          </p>
        </div>

        <div className="relative h-[400px] perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={{ opacity: 0, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`absolute w-full h-full backface-hidden cursor-pointer ${
                  isFlipped ? "hidden" : "block"
                }`}
                onClick={() => setIsFlipped(true)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-full flex flex-col justify-center items-center">
                  <div className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                    {flashcards[currentIndex].category}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
                    {flashcards[currentIndex].question}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    Click to reveal answer
                  </p>
                </div>
              </div>

              <div
                className={`absolute w-full h-full backface-hidden cursor-pointer ${
                  isFlipped ? "block" : "hidden"
                }`}
                style={{ transform: "rotateY(180deg)" }}
                onClick={() => setIsFlipped(false)}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-full flex flex-col justify-center items-center">
                  <p className="text-xl text-gray-900 dark:text-white text-center">
                    {flashcards[currentIndex].answer}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevious}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Next
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-300">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
