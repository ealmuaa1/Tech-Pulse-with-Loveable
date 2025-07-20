import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/pricing');
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Payment Cancelled
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            No worries! Your payment was cancelled and you haven't been charged. 
            You can try again anytime.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What happened?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Your payment was cancelled before completion</li>
            <li>• No charges were made to your account</li>
            <li>• You can still use the Free plan features</li>
            <li>• Try upgrading again whenever you're ready</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleTryAgain}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Continue with Free Plan
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage; 