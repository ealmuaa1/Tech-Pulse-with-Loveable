import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function TopNavigation() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold">
              TechPulse
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                to="/learn"
                className={`hover:text-primary ${
                  isActive("/learn") ? "text-primary" : ""
                }`}
              >
                Learn
              </Link>
              <Link
                to="/ideas"
                className={`hover:text-primary ${
                  isActive("/ideas") ? "text-primary" : ""
                }`}
              >
                Ideas
              </Link>
              <Link
                to="/digests"
                className={`hover:text-primary ${
                  isActive("/digests") ? "text-primary" : ""
                }`}
              >
                Digests
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`hover:text-primary ${
                    isActive("/dashboard") ? "text-primary" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`hover:text-primary ${
                    isActive("/profile") ? "text-primary" : ""
                  }`}
                >
                  Profile
                </Link>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
