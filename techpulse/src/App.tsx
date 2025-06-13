import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import TopNavigation from "./components/TopNavigation";
import Home from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import LearningModule from "./pages/LearningModule";
import Dashboard from "./pages/Dashboard";
import QuestPage from "./pages/QuestPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * App component - Main application router
 * Routes:
 * - /: Home page
 * - /profile: User profile page
 * - /digests: Tech digests page
 * - /learn: Learning page
 * - /learn/:slug: Topic page
 * - /learn/:slug/flashcards: Flashcard page
 * - /learn/:slug/quiz: Quiz page
 * - /quest/:slug: Quest page (using slug instead of questId)
 * - /dashboard: Dashboard page
 * - /ideas: Ideas page
 * - /login: Login page
 * - /signup: Signup page
 * - *: 404 Not Found page
 */
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <TopNavigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<LandingPage />} />
            <Route path="/digests" element={<LandingPage />} />
            <Route path="/learn" element={<LearningModule />} />
            <Route path="/learn/:slug" element={<LandingPage />} />
            <Route path="/learn/:slug/flashcards" element={<LandingPage />} />
            <Route path="/learn/:slug/quiz" element={<LandingPage />} />
            <Route path="/quest/:slug" element={<QuestPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ideas" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
