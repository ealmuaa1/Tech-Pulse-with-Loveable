
import { Link } from "react-router-dom";
import { Home, BookOpen, GraduationCap, Lightbulb, User } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
}

const BottomNavigation = ({ currentPage }: BottomNavigationProps) => {
  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "digests", label: "Digests", icon: BookOpen, path: "/digests" },
    { id: "learn", label: "Learn", icon: GraduationCap, path: "/learn" },
    { id: "ideas", label: "Ideas", icon: Lightbulb, path: "/ideas" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-rose-500 bg-rose-50"
                  : "text-gray-600 hover:text-rose-500 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
