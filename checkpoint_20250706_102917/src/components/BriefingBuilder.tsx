import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TechBriefing, BriefingSection } from "@/types";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  FileText,
  Mail,
  Linkedin,
  Download,
  Share2,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  Send,
  Crown,
  Zap,
  Calendar,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface BriefingBuilderProps {
  existingBriefing?: TechBriefing;
  onSave?: (briefing: TechBriefing) => void;
  onPublish?: (briefing: TechBriefing) => void;
}

const BriefingBuilder: React.FC<BriefingBuilderProps> = ({
  existingBriefing,
  onSave,
  onPublish,
}) => {
  const { hasFeature, canUseFeature, incrementUsage, startTrial } =
    useSubscription();
  const [briefing, setBriefing] = useState<Partial<TechBriefing>>({
    title: "Weekly Tech Pulse Briefing",
    sections: [],
    branding: {
      color_scheme: "purple",
      white_label: false,
    },
    distribution: {
      email_enabled: false,
      linkedin_enabled: false,
      pdf_export: true,
    },
    status: "Draft",
  });

  const canAccessBriefingBuilder = hasFeature("briefing_builder");
  const canUseBriefingBuilder = canUseFeature("briefing_builder");
  const hasWhiteLabel = hasFeature("white_label");

  useEffect(() => {
    if (existingBriefing) {
      setBriefing(existingBriefing);
    }
  }, [existingBriefing]);

  const addSection = (type: BriefingSection["type"]) => {
    if (!canAccessBriefingBuilder) {
      toast.error("Upgrade to Pro to access Briefing Builder", {
        action: {
          label: "Start Free Trial",
          onClick: () => startTrial(),
        },
      });
      return;
    }

    const newSection: BriefingSection = {
      id: `section_${Date.now()}`,
      type,
      title: getSectionDefaultTitle(type),
      content: getSectionDefaultContent(type),
      sources: [],
      order: briefing.sections?.length || 0,
    };

    setBriefing((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection],
    }));
  };

  const getSectionDefaultTitle = (type: BriefingSection["type"]): string => {
    const titles = {
      trending_topics: "🔥 This Week's Trending Tech",
      custom_commentary: "💭 My Take on the Tech Landscape",
      ai_insights: "🤖 AI Tools & Insights",
      tool_recommendations: "⚡ Tools Worth Checking Out",
    };
    return titles[type];
  };

  const getSectionDefaultContent = (type: BriefingSection["type"]): string => {
    const content = {
      trending_topics:
        "Based on our analysis of 10,000+ tech discussions this week, here are the topics gaining the most momentum...",
      custom_commentary:
        "Share your unique perspective on recent tech developments...",
      ai_insights:
        "Latest AI tools and insights that are changing how we work...",
      tool_recommendations:
        "Hand-picked tools that can boost your productivity...",
    };
    return content[type];
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<BriefingSection>
  ) => {
    setBriefing((prev) => ({
      ...prev,
      sections:
        prev.sections?.map((section) =>
          section.id === sectionId ? { ...section, ...updates } : section
        ) || [],
    }));
  };

  const removeSection = (sectionId: string) => {
    setBriefing((prev) => ({
      ...prev,
      sections:
        prev.sections?.filter((section) => section.id !== sectionId) || [],
    }));
  };

  const handleSave = async () => {
    if (!canUseBriefingBuilder) {
      toast.error(
        "You've reached your briefing limit. Upgrade for unlimited access!"
      );
      return;
    }

    const success = await incrementUsage("briefing_builder");
    if (success) {
      if (onSave) {
        onSave(briefing as TechBriefing);
      }
      toast.success("Briefing saved successfully!");
    }
  };

  const handlePublish = async () => {
    if (!canUseBriefingBuilder) {
      toast.error(
        "You've reached your briefing limit. Upgrade for unlimited access!"
      );
      return;
    }

    const success = await incrementUsage("briefing_builder");
    if (success) {
      if (onPublish) {
        onPublish({ ...briefing, status: "Published" } as TechBriefing);
      }
      toast.success("Briefing published successfully! 🎉");
    }
  };

  const generateAIContent = async (sectionType: BriefingSection["type"]) => {
    if (!canAccessBriefingBuilder) return;

    toast.success(
      "AI content generation coming soon! This will pull from our trending topics and generate personalized content."
    );
  };

  if (!canAccessBriefingBuilder) {
    return (
      <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              Pro Feature: Briefing Builder
            </h3>
            <p className="mb-4">
              Create branded newsletters and thought leadership content
            </p>
            <Button
              onClick={() => startTrial()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
        <div className="blur-sm p-8">
          <h2 className="text-2xl font-bold mb-4">
            Tech Pulse Briefing Builder
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              Preview content...
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              Preview content...
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Briefing Builder
              <Badge className="ml-2 bg-purple-100 text-purple-800">Pro</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={handlePublish}
                className="bg-gradient-to-r from-green-600 to-green-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Briefing Header */}
          <div>
            <Label htmlFor="title">Briefing Title</Label>
            <Input
              id="title"
              value={briefing.title || ""}
              onChange={(e) =>
                setBriefing((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Your Weekly Tech Briefing"
              className="mt-1"
            />
          </div>

          {/* Branding Options */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Branding & Customization
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color-scheme">Color Scheme</Label>
                <Select
                  value={briefing.branding?.color_scheme}
                  onValueChange={(value) =>
                    setBriefing((prev) => ({
                      ...prev,
                      branding: { ...prev.branding!, color_scheme: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="white-label"
                  checked={briefing.branding?.white_label}
                  onCheckedChange={(checked) =>
                    setBriefing((prev) => ({
                      ...prev,
                      branding: { ...prev.branding!, white_label: checked },
                    }))
                  }
                  disabled={!hasWhiteLabel}
                />
                <Label htmlFor="white-label">
                  White Label{" "}
                  {!hasWhiteLabel && (
                    <Badge variant="outline" className="ml-1">
                      Enterprise
                    </Badge>
                  )}
                </Label>
              </div>
            </div>
          </Card>

          {/* Distribution Options */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Share2 className="w-4 h-4 mr-2" />
              Distribution Channels
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email"
                  checked={briefing.distribution?.email_enabled}
                  onCheckedChange={(checked) =>
                    setBriefing((prev) => ({
                      ...prev,
                      distribution: {
                        ...prev.distribution!,
                        email_enabled: checked,
                      },
                    }))
                  }
                />
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="linkedin"
                  checked={briefing.distribution?.linkedin_enabled}
                  onCheckedChange={(checked) =>
                    setBriefing((prev) => ({
                      ...prev,
                      distribution: {
                        ...prev.distribution!,
                        linkedin_enabled: checked,
                      },
                    }))
                  }
                />
                <Label htmlFor="linkedin" className="flex items-center">
                  <Linkedin className="w-4 h-4 mr-1" />
                  LinkedIn
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pdf"
                  checked={briefing.distribution?.pdf_export}
                  onCheckedChange={(checked) =>
                    setBriefing((prev) => ({
                      ...prev,
                      distribution: {
                        ...prev.distribution!,
                        pdf_export: checked,
                      },
                    }))
                  }
                />
                <Label htmlFor="pdf" className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  PDF Export
                </Label>
              </div>
            </div>
          </Card>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Content Sections</h3>
              <Select
                onValueChange={(value) =>
                  addSection(value as BriefingSection["type"])
                }
              >
                <SelectTrigger className="w-48">
                  <Plus className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Add Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending_topics">
                    Trending Topics
                  </SelectItem>
                  <SelectItem value="custom_commentary">
                    Custom Commentary
                  </SelectItem>
                  <SelectItem value="ai_insights">AI Insights</SelectItem>
                  <SelectItem value="tool_recommendations">
                    Tool Recommendations
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {briefing.sections?.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(section.id, { title: e.target.value })
                        }
                        className="font-semibold text-lg border-none p-0 h-auto bg-transparent"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIContent(section.type)}
                        >
                          <Sparkles className="w-4 h-4 mr-1" />
                          AI Generate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(section.id, { content: e.target.value })
                      }
                      placeholder="Write your content here..."
                      className="min-h-[100px]"
                    />
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {(!briefing.sections || briefing.sections.length === 0) && (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">
                  No sections added yet. Click "Add Section" to start building
                  your briefing.
                </p>
              </div>
            )}
          </div>

          {/* Preview & Export */}
          <div className="flex gap-4 pt-6 border-t">
            <Button variant="outline" className="flex-1">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="flex-1">
              <Linkedin className="w-4 h-4 mr-2" />
              Share on LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BriefingBuilder;
