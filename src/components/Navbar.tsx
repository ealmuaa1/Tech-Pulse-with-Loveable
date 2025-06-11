import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Learn", path: "/learn" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                TechPulse
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {isDark ? (
                  <SunIcon className="h-6 w-6" />
                ) : (
                  <MoonIcon className="h-6 w-6" />
                )}
              </button>
              {currentUser ? (
                <button
                  onClick={() => logout()}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
            {currentUser ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
