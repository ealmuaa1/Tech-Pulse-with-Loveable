import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight } from "lucide-react";

/**
 * TopNavigation component
 * Features:
 * - App logo/title
 * - Breadcrumb navigation
 * - Responsive design
 * - Consistent styling
 */
const TopNavigation = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on home page
  if (location.pathname === "/") return null;

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent">
              Tech Pulse
            </span>
          </Link>

          {/* Breadcrumb - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              to="/"
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Home
            </Link>
            {pathSegments.map((segment, index) => (
              <div key={segment} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <span className="capitalize">
                  {segment === "profile"
                    ? "Profile"
                    : segment === "learn"
                    ? "Learn"
                    : segment === "ideas"
                    ? "Ideas"
                    : segment === "digests"
                    ? "Digests"
                    : segment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
