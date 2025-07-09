import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProPlaybook } from "@/types";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { 
  Lock, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Eye,
  Download,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProPlaybookCardProps {
  playbook: ProPlaybook;
  onPreview?: (playbookId: string) => void;
  onPurchase?: (playbookId: string) => void;
}

const ProPlaybookCard: React.FC<ProPlaybookCardProps> = ({ 
  playbook, 
  onPreview, 
  onPurchase 
}) => {
  const { hasFeature, canUseFeature, incrementUsage, startTrial } = useSubscription();
  const [isHovered, setIsHovered] = useState(false);

  const canAccessPlaybooks = hasFeature("playbooks");
  const canUsePlaybooks = canUseFeature("playbooks");

  const handlePlaybookAccess = async () => {
    if (!canAccessPlaybooks) {
      // Offer trial or upgrade
      toast.error("Upgrade to Pro to access AI Playbooks", {
        action: {
          label: "Start Free Trial",
          onClick: () => startTrial()
        }
      });
      return;
    }

    if (!canUsePlaybooks) {
      toast.error("You've reached your playbook limit. Upgrade for unlimited access!");
      return;
    }

    // Track usage
    const success = await incrementUsage("playbooks");
    if (success && onPurchase) {
      onPurchase(playbook.id);
    }
  };

  const handlePreview = () => {
    if (playbook.preview_available && onPreview) {
      onPreview(playbook.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800 border-green-200",
      Intermediate: "bg-blue-100 text-blue-800 border-blue-200", 
      Advanced: "bg-orange-100 text-orange-800 border-orange-200",
      Expert: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[difficulty as keyof typeof colors] || colors.Beginner;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Premium Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-md">
            <Star className="w-3 h-3 mr-1" />
            PRO
          </Badge>
        </div>

        {/* Lock Overlay for Free Users */}
        {!canAccessPlaybooks && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-12 h-12 mx-auto mb-2" />
              <p className="font-semibold">Pro Feature</p>
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {playbook.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {playbook.description}
              </p>
            </div>
          </div>

          {/* Industry & Role Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {playbook.industry}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {playbook.role}
            </Badge>
            <Badge className={`text-xs border ${getDifficultyColor(playbook.difficulty)}`}>
              {playbook.difficulty}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* ROI & Time Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                {playbook.estimated_roi}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Est. ROI</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {playbook.time_to_implement}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">To Implement</p>
            </div>
          </div>

          {/* Use Cases Preview */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              What You'll Build:
            </h4>
            <div className="space-y-1">
              {playbook.use_cases.slice(0, 3).map((useCase, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 line-clamp-1">{useCase}</span>
                </div>
              ))}
              {playbook.use_cases.length > 3 && (
                <p className="text-xs text-gray-500 ml-6">
                  +{playbook.use_cases.length - 3} more use cases
                </p>
              )}
            </div>
          </div>

          {/* Tools Preview */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Tools Included:
            </h4>
            <div className="flex flex-wrap gap-1">
              {playbook.tools.slice(0, 3).map((tool, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tool.name}
                </Badge>
              ))}
              {playbook.tools.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{playbook.tools.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {playbook.preview_available && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                className="flex-1 text-sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            )}
            
            <Button
              onClick={handlePlaybookAccess}
              className={`flex-1 text-sm font-semibold transition-all ${
                canAccessPlaybooks
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
              }`}
              disabled={!canAccessPlaybooks && !playbook.preview_available}
            >
              {canAccessPlaybooks ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Get Playbook
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Upgrade to Access
                </>
              )}
            </Button>
          </div>

          {/* Price Display */}
          <div className="text-center pt-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${playbook.price}
            </span>
            <span className="text-sm text-gray-500 ml-1">one-time</span>
          </div>
        </CardContent>

        {/* Animated Border Effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(45deg, transparent 30%, rgba(168, 85, 247, 0.4) 50%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}
      </Card>
    </motion.div>
  );
};

export default ProPlaybookCard; 