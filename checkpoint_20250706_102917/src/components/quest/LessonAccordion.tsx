import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Book,
  Lightbulb,
  Bot,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import SoWhatCard from "./SoWhatCard";
import { MockLesson } from "@/data/mockQuest";

// The shape of the structured lesson content from the topic
export interface LessonContent {
  introduction: string;
  coreConcepts: string;
  useCases: string;
  practicePrompt: string;
  sources?: string[]; // Optional array of source names or URLs
}

interface LessonAccordionProps {
  // Option 1: Use the original LessonContent structure (for backward compatibility)
  content?: LessonContent;
  onLessonView?: (lessonKey: keyof LessonContent) => void;

  // Option 2: Use the new mock lesson structure
  lessons?: MockLesson[];
  onLessonComplete?: (lessonId: string) => void;
}

const lessonSections: {
  key: keyof LessonContent;
  title: string;
  Icon: React.ElementType;
}[] = [
  { key: "introduction", title: "Introduction", Icon: Globe },
  { key: "coreConcepts", title: "Core Concepts", Icon: Book },
  { key: "useCases", title: "Real-World Use Cases", Icon: Lightbulb },
  { key: "practicePrompt", title: "Practice Prompt", Icon: Bot },
];

const LessonAccordion: React.FC<LessonAccordionProps> = ({
  content,
  onLessonView,
  lessons,
  onLessonComplete,
}) => {
  // If using new lesson structure
  if (lessons && lessons.length > 0) {
    return (
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Your Learning Path
        </h3>
        <Accordion
          type="multiple"
          className="w-full space-y-3"
          onValueChange={(viewedItems) => {
            // Track completed lessons
            viewedItems.forEach((itemKey) => {
              if (onLessonComplete) {
                onLessonComplete(itemKey);
              }
            });
          }}
        >
          {lessons.map((lesson, index) => (
            <AccordionItem
              value={lesson.id}
              key={lesson.id}
              className="bg-white rounded-xl shadow border-none"
            >
              <AccordionTrigger className="w-full text-left font-semibold py-4 px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <span>{lesson.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0 space-y-4">
                <div className="text-muted-foreground">
                  <p className="whitespace-pre-line">{lesson.content}</p>
                </div>

                {/* Sources */}
                {lesson.sources && lesson.sources.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Sources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lesson.sources.map((source, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* So What Section */}
                {lesson.soWhat && (
                  <div className="pt-4 border-t">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="text-sm font-semibold mb-2 text-purple-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        So What?
                      </h4>
                      <p className="text-sm text-purple-700">{lesson.soWhat}</p>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }

  // Fallback to original structure for backward compatibility
  if (content) {
    return (
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-4 text-center">
          Your Learning Path
        </h3>
        <Accordion
          type="multiple"
          className="w-full space-y-3"
          onValueChange={(viewedItems) => {
            // This callback gives us the keys of all open items.
            // We can use this to robustly track viewed lessons.
            viewedItems.forEach((itemKey) => {
              if (onLessonView) {
                onLessonView(itemKey as keyof LessonContent);
              }
            });
          }}
        >
          {lessonSections.map(({ key, title, Icon }) => {
            const lessonText = content[key];
            if (!lessonText) return null; // Don't render if content is missing

            return (
              <AccordionItem
                value={key}
                key={key}
                className="bg-white rounded-xl shadow border-none"
              >
                <AccordionTrigger className="w-full text-left font-semibold py-4 px-6 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span>{title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0 text-muted-foreground">
                  <p className="whitespace-pre-line">{lessonText}</p>
                  {content.sources && content.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Sources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {content.sources.map((source, i) => (
                          <span
                            key={i}
                            className="text-xs bg-muted py-1 px-2 rounded-full"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }

  return null;
};

export default LessonAccordion;
