import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
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
import Login from "@/pages/Login";
import SummaryPage from "@/pages/SummaryPage";
import PricingPage from "@/pages/PricingPage";
import SuccessPage from "@/pages/SuccessPage";
import CancelPage from "@/pages/CancelPage";

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
 * - /summary/:id: News summary page
 * - /pricing: Pricing page
 * - /success: Payment success page
 * - /cancel: Payment cancel page
 * - *: 404 Not Found page
 */
function App() {
  return (
    <>
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
        <Route path="/summary/:id" element={<SummaryPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
