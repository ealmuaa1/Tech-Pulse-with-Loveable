import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { useSubscription } from "@/contexts/SubscriptionContext";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Refresh subscription state and simulate loading
    const refreshAndLoad = async () => {
      try {
        await refreshSubscription();
      } catch (error) {
        console.error("Error refreshing subscription:", error);
      }

      // Simulate loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    };

    refreshAndLoad();
  }, [refreshSubscription]);

  const handleContinue = () => {
    navigate("/home");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Pro! 🎉
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your subscription has been successfully activated. You now have
            unlimited access to all features.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">
                Explore unlimited news articles
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Access all learning modules</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Save and organize content</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">Track your progress</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Learning
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            View Profile
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            You'll receive a confirmation email shortly. If you have any
            questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
