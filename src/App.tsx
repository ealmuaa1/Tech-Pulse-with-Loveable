import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import TopNavigation from "@/components/TopNavigation";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import ExplorePage from "./pages/ExplorePage";
import Learn from "@/pages/Learn";
import TopicPage from "@/pages/TopicPage";
import FlashcardPage from "@/pages/FlashcardPage";
import QuizPage from "@/pages/QuizPage";
import NotFound from "@/pages/NotFound";
import QuestPage from "@/pages/QuestPage";
import Dashboard from "@/pages/Dashboard";
import Ideas from "@/pages/Ideas";
import Login from "@/pages/Login";
import { TrendProvider } from "@/contexts/TrendContext";

/**
 * App component - Main application router
 * Routes:
 * - /: Landing page
 * - /home: Personalized AI learning dashboard
 * - /login: Login page
 * - /profile: User profile page
 * - /explore: Explore by passion page
 * - /learn: Learning page
 * - /learn/:slug: Topic page
 * - /learn/:slug/flashcards: Flashcard page
 * - /learn/:slug/quiz: Quiz page
 * - /quest/:slug: Quest page
 * - /dashboard: Dashboard page
 * - /ideas: Ideas page
 * - *: 404 Not Found page
 */
function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <TrendProvider>
          <TopNavigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<TopicPage />} />
            <Route path="/learn/:slug/flashcards" element={<FlashcardPage />} />
            <Route path="/learn/:slug/quiz" element={<QuizPage />} />
            <Route path="/quest/:slug" element={<QuestPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </TrendProvider>
      </Router>
    </SessionContextProvider>
  );
}

export default App;
