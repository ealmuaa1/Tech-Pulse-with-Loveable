import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Book,
  Brain,
  MessageSquare,
  Link,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchingGame } from "@/components/MatchingGame";
import { FillInTheBlank } from "@/components/FillInTheBlank";
import { SpacedRepetitionTracker } from "@/components/SpacedRepetitionTracker";
import { VisualConceptMap } from "@/components/VisualConceptMap";
import { AudioPlayer } from "@/components/AudioPlayer";
import { learningQuests } from "@/data/quests";
import {
  generateLearningContent,
  generateConceptMap,
  generateAudioSummary,
} from "@/lib/openaiService";
import { toast } from "sonner";

export function QuestPage() {
  const { questId } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<any>(null);
  const [learningContent, setLearningContent] = useState<any>(null);
  const [conceptMap, setConceptMap] = useState<any>(null);
  const [audioSummary, setAudioSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("learn");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadQuestData = async () => {
      try {
        // Find the quest by ID
        const foundQuest = learningQuests.find((q) => q.id === Number(questId));
        if (!foundQuest) {
          toast.error("Quest not found");
          navigate("/learn");
          return;
        }
        setQuest(foundQuest);

        // Generate learning content
        const content = await generateLearningContent(
          foundQuest.title,
          foundQuest.difficulty
        );
        setLearningContent(content);

        // Generate concept map
        const map = await generateConceptMap(foundQuest.title);
        setConceptMap(map);

        // Generate audio summary
        const audio = await generateAudioSummary(foundQuest.title);
        setAudioSummary(audio);

        setLoading(false);
      } catch (error) {
        console.error("Error loading quest data:", error);
        toast.error("Failed to load quest data");
        setLoading(false);
      }
    };

    loadQuestData();
  }, [questId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Quest not found</h1>
        <Button onClick={() => navigate("/learn")}>Back to Learning</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learn")}
            className="rounded-full hover:bg-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {quest.icon && <quest.icon className="w-6 h-6 text-primary" />}
            </div>
            <h1 className="text-3xl font-bold">{quest.title}</h1>
          </div>
        </motion.div>

        {/* Progress */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quest Progress</h2>
            <Badge variant="secondary">{progress}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learn">
              <Book className="w-4 h-4 mr-2" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="practice">
              <Brain className="w-4 h-4 mr-2" />
              Practice
            </TabsTrigger>
            <TabsTrigger value="discussion">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussion
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Link className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            {/* Audio Summary */}
            {audioSummary && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Audio Summary</h2>
                <AudioPlayer
                  src={audioSummary.audioUrl}
                  title={audioSummary.title}
                  duration={audioSummary.duration}
                />
              </Card>
            )}

            {/* Concept Map */}
            {conceptMap && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Concept Map</h2>
                <VisualConceptMap nodes={conceptMap.nodes} />
              </Card>
            )}

            {/* Learning Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Flashcards */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
                <div className="space-y-4">
                  {learningContent?.flashcards.map((flashcard: any) => (
                    <Card key={flashcard.id} className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">{flashcard.term}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {flashcard.definition}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>

              {/* Quiz Questions */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quiz Questions</h2>
                <div className="space-y-4">
                  {learningContent?.quizQuestions.map((question: any) => (
                    <Card key={question.id} className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">{question.question}</h3>
                        <div className="space-y-2">
                          {question.options.map(
                            (option: string, index: number) => (
                              <div
                                key={index}
                                className={`p-2 rounded ${
                                  option === question.correctAnswer
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : "bg-gray-100 dark:bg-gray-800"
                                }`}
                              >
                                {option}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-6">
            {/* Matching Game */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Matching Game</h2>
              <MatchingGame
                terms={learningContent?.flashcards.map((f: any) => ({
                  id: f.id,
                  term: f.term,
                  definition: f.definition,
                }))}
                onComplete={(score) => {
                  setProgress((prev) => Math.min(prev + 25, 100));
                }}
              />
            </Card>

            {/* Fill in the Blank */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Fill in the Blank</h2>
              <FillInTheBlank
                questions={learningContent?.quizQuestions.map((q: any) => ({
                  id: q.id,
                  text: q.question.replace(q.correctAnswer, "_____"),
                  answer: q.correctAnswer,
                  hint: q.explanation,
                }))}
                onComplete={(score) => {
                  setProgress((prev) => Math.min(prev + 25, 100));
                }}
              />
            </Card>

            {/* Spaced Repetition */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Spaced Repetition</h2>
              <SpacedRepetitionTracker
                flashcards={learningContent?.flashcards.map((f: any) => ({
                  id: f.id,
                  term: f.term,
                  definition: f.definition,
                  lastReviewed: null,
                  nextReview: null,
                  reviewCount: 0,
                  confidence: 0,
                }))}
                onReview={(flashcardId, confidence) => {
                  setProgress((prev) => Math.min(prev + 25, 100));
                }}
              />
            </Card>
          </TabsContent>

          {/* Discussion Tab */}
          <TabsContent value="discussion" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Discussion Forum</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join the discussion about {quest.title} with other learners.
              </p>
              {/* Add discussion forum component here */}
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
              <div className="space-y-4">
                {quest.resources?.map((resource: any, index: number) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{resource.title}</h3>
                      <Link className="w-4 h-4" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {resource.description}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
