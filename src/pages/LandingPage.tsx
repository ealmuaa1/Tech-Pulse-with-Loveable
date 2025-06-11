import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const techTrends = [
  {
    title: "AI & Machine Learning",
    description:
      "Discover how AI is transforming industries and creating new opportunities.",
    icon: "🤖",
  },
  {
    title: "Web3 & Blockchain",
    description:
      "Explore the future of decentralized applications and digital ownership.",
    icon: "⛓️",
  },
  {
    title: "Cloud Computing",
    description:
      "Learn about scalable infrastructure and serverless architectures.",
    icon: "☁️",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stay Ahead of Tech Trends
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your daily dose of tech insights, learning resources, and trend
              analysis
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech Trends Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Explore Tech Trends
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techTrends.map((trend, index) => (
              <motion.div
                key={trend.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{trend.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {trend.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {trend.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our community of tech enthusiasts and stay updated with the
            latest trends
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
          >
            Sign Up Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
