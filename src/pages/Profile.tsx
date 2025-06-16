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
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useEffect, useState, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { SettingsModal } from "@/components/ui/settings-modal";
import { UserSettings, loadUserSettings, saveSettings } from "@/lib/settings";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState<FirebaseUser | null>(null);
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        setUser(currentUser);
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
                {user?.displayName || "Guest User"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {user?.email || "No email"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: Sparkles,
              value: userStats.streak,
              label: "Day Streak",
              color: "text-orange-500 dark:text-orange-400",
            },
            {
              icon: BookOpen,
              value: userStats.totalDigests,
              label: "Digests Read",
              color: "text-blue-500 dark:text-blue-400",
            },
            {
              icon: Trophy,
              value: userStats.questsCompleted,
              label: "Quests Done",
              color: "text-emerald-500 dark:text-emerald-400",
            },
            {
              icon: Lightbulb,
              value: userStats.savedIdeas,
              label: "Ideas Saved",
              color: "text-purple-500 dark:text-purple-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <stat.icon className="w-4 h-4" />
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            Your Interests
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {memoizedInterests.map((interest) => (
              <motion.div
                key={interest}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full px-4 py-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200"
                >
                  {interest}
                </Badge>
              </motion.div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize Interests
          </Button>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
            Achievements
          </h3>
          <div className="grid gap-4">
            {memoizedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors duration-200"
              >
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-yellow-900 dark:text-yellow-200">
                    {achievement.name}
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    {achievement.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            Settings
          </h3>
          <div className="space-y-6">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Push Notifications
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Get notified about new content
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications", checked)
                }
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Switch to dark theme
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) =>
                  handleSettingChange("darkMode", checked)
                }
              />
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <UserIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Email Updates
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly digests
                  </div>
                </div>
              </div>
              <Switch
                checked={settings.emailUpdates}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailUpdates", checked)
                }
              />
            </motion.div>

            {/* Additional Settings Buttons */}
            <div className="pt-4 space-y-3">
              {[
                {
                  icon: UserIcon,
                  label: "Account Settings",
                  color: "text-blue-500 dark:text-blue-400",
                  onClick: () => setAccountModalOpen(true),
                },
                {
                  icon: Shield,
                  label: "Privacy Settings",
                  color: "text-green-500 dark:text-green-400",
                  onClick: () => setPrivacyModalOpen(true),
                },
                {
                  icon: HelpCircle,
                  label: "Help & Support",
                  color: "text-purple-500 dark:text-purple-400",
                  onClick: () => setHelpModalOpen(true),
                },
              ].map((button) => (
                <motion.div
                  key={button.label}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={button.onClick}
                  >
                    <button.icon className={`w-4 h-4 mr-2 ${button.color}`} />
                    {button.label}
                    <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        <SettingsModal
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          title="Account Settings"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings, including email preferences and
              password changes.
            </p>
            <Button className="w-full hover:bg-blue-600 transition-colors duration-200">
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Update Email
            </Button>
          </div>
        </SettingsModal>

        <SettingsModal
          isOpen={privacyModalOpen}
          onClose={() => setPrivacyModalOpen(false)}
          title="Privacy Settings"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Control your privacy preferences and data sharing settings.
            </p>
            <Button
              variant="outline"
              className="w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Download My Data
            </Button>
            <Button
              variant="destructive"
              className="w-full hover:bg-red-600 transition-colors duration-200"
            >
              Delete Account
            </Button>
          </div>
        </SettingsModal>

        <SettingsModal
          isOpen={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
          title="Help & Support"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get help with your account or contact our support team.
            </p>
            <Button className="w-full hover:bg-blue-600 transition-colors duration-200">
              Contact Support
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              View FAQ
            </Button>
          </div>
        </SettingsModal>
      </AnimatePresence>
    </div>
  );
};

export default Profile;
