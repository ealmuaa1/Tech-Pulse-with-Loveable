import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  User as UserIcon,
  Settings,
  Bell,
  Moon,
  HelpCircle,
  Shield,
  Sparkles,
  Trophy,
  BookOpen,
  Lightbulb,
  ChevronRight,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useEffect, useState, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { SettingsModal } from "@/components/ui/settings-modal";
import { UserSettings, loadUserSettings, saveSettings } from "@/lib/settings";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TopicSelector from "@/components/TopicSelector";
import { supabase } from "@/lib/supabase";
import { useUser } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";

interface Achievement {
  name: string;
  description: string;
  icon: string;
}

interface UserStats {
  streak: number;
  totalDigests: number;
  questsCompleted: number;
  savedIdeas: number;
}

const ALL_TOPICS = [
  "Artificial intelligence",
  "Image and Video Generation",
  "Machine Learning",
  "Blockchain",
  "Quantum Computing",
  "Cloud Computing",
  "Cybersecurity",
  "AR/VR",
  "DevOps",
  "Data Science",
];

const interests = [
  "AI",
  "Blockchain",
  "Cybersecurity",
  "IoT",
  "Quantum Computing",
] as const;

const achievements: Achievement[] = [
  {
    name: "Early Adopter",
    description: "Joined Synapse in the first month",
    icon: "🚀",
  },
  {
    name: "Knowledge Seeker",
    description: "Read 50+ tech digests",
    icon: "📚",
  },
  {
    name: "Quest Master",
    description: "Completed your first learning quest",
    icon: "👑",
  },
  {
    name: "Idea Collector",
    description: "Saved 10+ innovation ideas",
    icon: "💡",
  },
];

const Profile: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    notifications: true,
    emailUpdates: true,
  });
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    totalDigests: 0,
    questsCompleted: 0,
    savedIdeas: 0,
  });

  // Modal states
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteTopics, setFavoriteTopics] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user: supabaseUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      if (supabaseUser) {
        setUser(supabaseUser);
        const { data, error } = await supabase
          .from("profiles")
          .select("favorite_topics")
          .eq("id", supabaseUser.id)
          .single();

        if (!error && data) {
          try {
            const parsed = JSON.parse(data.favorite_topics);
            setFavoriteTopics(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            setFavoriteTopics([]);
          }
        } else {
          // Upsert a profile if it doesn't exist
          await supabase.from("profiles").upsert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            full_name:
              supabaseUser.user_metadata?.full_name || supabaseUser.email,
            favorite_topics: JSON.stringify([]),
          });
        }
      }
      setLoading(false);
    };
    fetchUserAndProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        if (currentUser) {
          const userSettings = await loadUserSettings(currentUser.uid);
          setSettings(userSettings);
        }
      },
      (error) => {
        console.error("Auth state change error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleSettingChange = async (
    key: keyof UserSettings,
    value: boolean
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (user) {
      await saveSettings(user.uid, newSettings);
    }
  };

  const memoizedInterests = useMemo(() => interests, []);
  const memoizedAchievements = useMemo(() => achievements, []);

  const savePreferences = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        favorite_topics: JSON.stringify(favoriteTopics),
      });

      if (error) throw error;

      setSaveSuccess(true);
      toast({
        title: "Preferences saved",
        description: "Your favorite topics have been updated successfully.",
      });

      // Reset success state after animation
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
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

  if (loading) return <div>Loading profile...</div>;
  if (!user) return <div>Please log in</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header with back button */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <UserIcon className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                {user?.user_metadata?.full_name || "Guest User"}
              </h2>
              {user && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Favorite Topics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Favorite Topics
              </h3>
              <Button
                onClick={savePreferences}
                disabled={isSaving}
                className={`relative ${
                  saveSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-primary hover:bg-primary/90"
                } text-white transition-all duration-300`}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: saveSuccess ? [1, 1.2, 1] : 1,
                    opacity: saveSuccess ? [1, 0.8, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : saveSuccess ? (
                    <Check className="w-4 h-4" />
                  ) : null}
                  {isSaving
                    ? "Saving..."
                    : saveSuccess
                    ? "Saved!"
                    : "Save Preferences"}
                </motion.div>
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Select the topics you're most interested in to personalize your
              experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TopicSelector
                favoriteTopics={favoriteTopics}
                onChange={setFavoriteTopics}
              />
            </div>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Streak */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <Sparkles className="w-10 h-10 text-yellow-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {userStats.streak}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>

          {/* Digests Read */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <BookOpen className="w-10 h-10 text-blue-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {userStats.totalDigests}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Digests Read</p>
          </div>

          {/* Quests Completed */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center">
            <Trophy className="w-10 h-10 text-green-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {userStats.questsCompleted}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Quests Completed</p>
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 mb-6">
            Your Interests
          </h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {memoizedInterests.map((interest) => (
              <Badge
                key={interest}
                variant="outline"
                className="px-3 py-1 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-full"
              >
                {interest}
              </Badge>
            ))}
          </div>
          <TopicSelector
            favoriteTopics={favoriteTopics}
            onChange={setFavoriteTopics}
          />
          <Button
            onClick={savePreferences}
            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Save Preferences
          </Button>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 mb-6">
            Your Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {memoizedAchievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 flex items-start gap-4 shadow-sm border border-gray-100 dark:border-gray-600"
              >
                <div className="flex-shrink-0 text-3xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 mb-6">
            Settings
          </h2>
          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Toggle between light and dark themes.
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleSettingChange("darkMode", checked)
                }
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Receive important updates and alerts.
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", checked)
                }
              />
            </div>

            {/* Email Updates Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Email Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get the latest tech digests and news in your inbox.
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailUpdates", checked)
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Account and Privacy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 mb-6">
            Account & Privacy
          </h2>
          <div className="space-y-4">
            {/* Manage Account */}
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setAccountModalOpen(true)}
            >
              <span>Manage Account</span>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Privacy Settings */}
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setPrivacyModalOpen(true)}
            >
              <span>Privacy Settings</span>
              <Shield className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Help & Support */}
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 rounded-lg text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setHelpModalOpen(true)}
            >
              <span>Help & Support</span>
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </Button>

            {/* Logout */}
            <Button
              variant="destructive"
              className="w-full px-4 py-3 rounded-lg text-lg"
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        title="Manage Account"
      >
        <p>Account management options will be available here.</p>
      </SettingsModal>
      <SettingsModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Settings"
      >
        <p>Privacy settings options will be available here.</p>
      </SettingsModal>
      <SettingsModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="Help & Support"
      >
        <p>Help and support content will be displayed here.</p>
      </SettingsModal>
    </div>
  );
};

export default Profile;
