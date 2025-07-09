import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

/**
 * NotFound page component
 * Features:
 * - 404 error page
 * - Navigation back to home
 * - Consistent styling with app theme
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center transform rotate-3">
          <span className="text-4xl font-bold text-white">404</span>
        </div>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <Button size="lg" onClick={() => navigate("/")} className="gap-2">
          <Home className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
