import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import TopNavigation from "@/components/TopNavigation";
import Home from "./pages/Index";
import Profile from "./pages/Profile";
import Digests from "./pages/Digests";
import Learn from "@/pages/Learn";
import TopicPage from "@/pages/TopicPage";
import FlashcardPage from "@/pages/FlashcardPage";
import QuizPage from "@/pages/QuizPage";
import NotFound from "@/pages/NotFound";
import QuestPage from "@/pages/QuestPage";
import Dashboard from "@/pages/Dashboard";
import Ideas from "@/pages/Ideas";

function App() {
  return (
    <Router>
      <TopNavigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/digests" element={<Digests />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<TopicPage />} />
        <Route path="/learn/:slug/flashcards" element={<FlashcardPage />} />
        <Route path="/learn/:slug/quiz" element={<QuizPage />} />
        <Route path="/quest/:questId" element={<QuestPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
