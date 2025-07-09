import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  EnhancedPreferencesService,
  EnhancedUserPreferences,
} from "@/lib/enhancedPreferences";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Brain,
  BookOpen,
  Video,
  Newspaper,
  Globe,
  Settings,
  Save,
  Check,
  Loader2,
  Sparkles,
  Target,
  Clock,
  Bell,
  Mail,
  Smartphone,
} from "lucide-react";

/**
 * Enhanced User Preferences Form Component
 * Extends existing preferences with additional customization options
 * Maintains backward compatibility with current system
 */
export const UserPreferencesForm: React.FC = () => {
  const user = useUser();
  const { toast } = useToast();

  // Form state
  const [preferences, setPreferences] = useState<EnhancedUserPreferences>(
    EnhancedPreferencesService.getDefaultPreferences()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available options
  const availableTopics = [
    "AI",
    "Machine Learning",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "IoT",
    "Quantum Computing",
    "AR/VR",
    "FinTech",
    "HealthTech",
    "GreenTech",
  ];

  const availableCategories = ["beginner", "intermediate", "advanced"];

  const availableContentTypes = [
    "article",
    "video",
    "tutorial",
    "news",
    "podcast",
    "interactive",
  ];

  const availableLanguages = ["en", "es", "fr", "de", "zh", "ja", "ko"];

  const availableSources = [
    "TechCrunch",
    "Wired",
    "Ars Technica",
    "The Verge",
    "MIT Technology Review",
    "IEEE Spectrum",
    "Nature",
    "Science",
    "GitHub",
    "Stack Overflow",
  ];

  // Load existing preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userPrefs = await EnhancedPreferencesService.getUserPreferences(
          user?.id
        );
        if (userPrefs) {
          setPreferences(userPrefs);
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load preferences. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  // Handle topic selection
  const handleTopicToggle = (topic: string) => {
    setPreferences((prev) => {
      const currentTopics = prev.favorite_topics || [];
      const newTopics = currentTopics.includes(topic)
        ? currentTopics.filter((t) => t !== topic)
        : [...currentTopics, topic];

      return { ...prev, favorite_topics: newTopics };
    });
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setPreferences((prev) => {
      const currentCategories = prev.categories || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category];

      return { ...prev, categories: newCategories };
    });
  };

  // Handle content type selection
  const handleContentTypeToggle = (contentType: string) => {
    setPreferences((prev) => {
      const currentTypes = prev.contentTypes || [];
      const newTypes = currentTypes.includes(contentType)
        ? currentTypes.filter((t) => t !== contentType)
        : [...currentTypes, contentType];

      return { ...prev, contentTypes: newTypes };
    });
  };

  // Handle source selection
  const handleSourceToggle = (source: string) => {
    setPreferences((prev) => {
      const currentSources = prev.sources || [];
      const newSources = currentSources.includes(source)
        ? currentSources.filter((s) => s !== source)
        : [...currentSources, source];

      return { ...prev, sources: newSources };
    });
  };

  // Handle exclude topic selection
  const handleExcludeTopicToggle = (topic: string) => {
    setPreferences((prev) => {
      const currentExcluded = prev.excludeTopics || [];
      const newExcluded = currentExcluded.includes(topic)
        ? currentExcluded.filter((t) => t !== topic)
        : [...currentExcluded, topic];

      return { ...prev, excludeTopics: newExcluded };
    });
  };

  // Save preferences
  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const success = await EnhancedPreferencesService.updateUserPreferences(
        user?.id,
        preferences
      );

      if (success) {
        setSaveSuccess(true);
        toast({
          title: "✅ Preferences saved!",
          description:
            "Your enhanced preferences have been updated successfully.",
        });

        // Reset success state after animation
        setTimeout(() => {
          setSaveSuccess(false);
        }, 2000);
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading Preferences...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Preferences Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Enhanced Content Preferences
          </CardTitle>
          <CardDescription>
            Customize your learning experience with advanced filtering options
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Topic Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Topic Interests
          </CardTitle>
          <CardDescription>
            Select topics you're most interested in learning about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableTopics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={
                    preferences.favorite_topics?.includes(topic) || false
                  }
                  onCheckedChange={() => handleTopicToggle(topic)}
                />
                <Label
                  htmlFor={`topic-${topic}`}
                  className="text-sm cursor-pointer"
                >
                  {topic}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Difficulty Levels
          </CardTitle>
          <CardDescription>
            Choose which difficulty levels you prefer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={preferences.categories?.includes(category) || false}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer capitalize"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Content Types
          </CardTitle>
          <CardDescription>
            Select your preferred content formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableContentTypes.map((contentType) => (
              <div key={contentType} className="flex items-center space-x-2">
                <Checkbox
                  id={`content-${contentType}`}
                  checked={
                    preferences.contentTypes?.includes(contentType) || false
                  }
                  onCheckedChange={() => handleContentTypeToggle(contentType)}
                />
                <Label
                  htmlFor={`content-${contentType}`}
                  className="text-sm cursor-pointer capitalize"
                >
                  {contentType}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-red-600" />
            Preferred Sources
          </CardTitle>
          <CardDescription>
            Choose your favorite news and content sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSources.map((source) => (
              <div key={source} className="flex items-center space-x-2">
                <Checkbox
                  id={`source-${source}`}
                  checked={preferences.sources?.includes(source) || false}
                  onCheckedChange={() => handleSourceToggle(source)}
                />
                <Label
                  htmlFor={`source-${source}`}
                  className="text-sm cursor-pointer"
                >
                  {source}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exclude Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            Exclude Topics
          </CardTitle>
          <CardDescription>
            Topics you'd prefer not to see in your feed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableTopics.slice(0, 9).map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`exclude-${topic}`}
                  checked={preferences.excludeTopics?.includes(topic) || false}
                  onCheckedChange={() => handleExcludeTopicToggle(topic)}
                />
                <Label
                  htmlFor={`exclude-${topic}`}
                  className="text-sm cursor-pointer"
                >
                  {topic}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Learning Preferences
          </CardTitle>
          <CardDescription>Customize your learning experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Preferred Difficulty</Label>
              <Select
                value={preferences.difficulty || "mixed"}
                onValueChange={(value) =>
                  setPreferences((prev) => ({
                    ...prev,
                    difficulty: value as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningStyle">Learning Style</Label>
              <Select
                value={preferences.learningStyle || "mixed"}
                onValueChange={(value) =>
                  setPreferences((prev) => ({
                    ...prev,
                    learningStyle: value as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditory">Auditory</SelectItem>
                  <SelectItem value="kinesthetic">Hands-on</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Daily Learning Goal (minutes)</Label>
            <Select
              value={preferences.dailyGoal?.toString() || "30"}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  dailyGoal: parseInt(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you'd like to be notified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email-notifications"
                checked={preferences.notificationPreferences?.email || false}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      email: checked as boolean,
                    },
                  }))
                }
              />
              <Label
                htmlFor="email-notifications"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Email notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="push-notifications"
                checked={preferences.notificationPreferences?.push || false}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      push: checked as boolean,
                    },
                  }))
                }
              />
              <Label
                htmlFor="push-notifications"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                Push notifications
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="digest-notifications"
                checked={preferences.notificationPreferences?.digest || false}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      digest: checked as boolean,
                    },
                  }))
                }
              />
              <Label
                htmlFor="digest-notifications"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Newspaper className="w-4 h-4" />
                Daily digest
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full ${
              saveSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary hover:bg-primary/90"
            } transition-all duration-300`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Enhanced Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Preferences Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Selected Topics:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {preferences.favorite_topics?.map((topic) => (
                  <Badge key={topic} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {(!preferences.favorite_topics ||
                  preferences.favorite_topics.length === 0) && (
                  <span className="text-sm text-gray-500">
                    No topics selected
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Difficulty:</span>{" "}
                {preferences.difficulty}
              </div>
              <div>
                <span className="font-medium">Learning Style:</span>{" "}
                {preferences.learningStyle}
              </div>
              <div>
                <span className="font-medium">Daily Goal:</span>{" "}
                {preferences.dailyGoal} minutes
              </div>
              <div>
                <span className="font-medium">Content Types:</span>{" "}
                {preferences.contentTypes?.length || 0} selected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
