import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PromptPack } from "@/types";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  Star,
  Download,
  Verified,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  Lock,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface PromptPackCardProps {
  promptPack: PromptPack;
  onPreview?: (packId: string) => void;
  onPurchase?: (packId: string) => void;
  onShare?: (packId: string) => void;
}

const PromptPackCard: React.FC<PromptPackCardProps> = ({
  promptPack,
  onPreview,
  onPurchase,
  onShare,
}) => {
  const { hasFeature, canUseFeature, incrementUsage, startTrial } =
    useSubscription();
  const [isLiked, setIsLiked] = useState(false);

  const canAccessPromptPacks = hasFeature("prompt_packs");
  const canUsePromptPacks = canUseFeature("prompt_packs");

  const handlePromptPackAccess = async () => {
    if (promptPack.tier === "Free") {
      // Free packs are always accessible
      if (onPurchase) {
        onPurchase(promptPack.id);
      }
      return;
    }

    if (!canAccessPromptPacks) {
      toast.error("Upgrade to Pro to access premium prompts", {
        action: {
          label: "Start Free Trial",
          onClick: () => startTrial(),
        },
      });
      return;
    }

    if (!canUsePromptPacks) {
      toast.error(
        "You've reached your prompt pack limit. Upgrade for unlimited access!"
      );
      return;
    }

    // Track usage for premium packs
    const success = await incrementUsage("prompt_packs");
    if (success && onPurchase) {
      onPurchase(promptPack.id);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(promptPack.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(promptPack.id);
    }
    // Copy link to clipboard
    navigator.clipboard.writeText(
      `${window.location.origin}/prompt-packs/${promptPack.id}`
    );
    toast.success("Link copied to clipboard!");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Copywriting: "bg-pink-100 text-pink-800 border-pink-200",
      Data_Analysis: "bg-blue-100 text-blue-800 border-blue-200",
      Legal: "bg-gray-100 text-gray-800 border-gray-200",
      Medical: "bg-green-100 text-green-800 border-green-200",
      Sales: "bg-orange-100 text-orange-800 border-orange-200",
      Marketing: "bg-purple-100 text-purple-800 border-purple-200",
      Development: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return colors[category as keyof typeof colors] || colors.Development;
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Free: "bg-gray-100 text-gray-800",
      Pro: "bg-blue-100 text-blue-800",
      Premium: "bg-purple-100 text-purple-800",
    };
    return colors[tier as keyof typeof colors] || colors.Free;
  };

  const isAccessible = promptPack.tier === "Free" || canAccessPromptPacks;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
          promptPack.tier !== "Free"
            ? "border-2 border-purple-200 dark:border-purple-800"
            : ""
        }`}
      >
        {/* Tier Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`text-xs ${getTierColor(promptPack.tier)}`}>
            {promptPack.tier === "Free"
              ? "FREE"
              : promptPack.tier.toUpperCase()}
          </Badge>
        </div>

        {/* Lock Overlay for Premium Content */}
        {!isAccessible && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="text-center text-white">
              <Lock className="w-10 h-10 mx-auto mb-2" />
              <p className="font-semibold text-sm">Pro Required</p>
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {promptPack.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {promptPack.description}
              </p>
            </div>
          </div>

          {/* Author & Category */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={promptPack.author.avatar} />
                <AvatarFallback>
                  {promptPack.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {promptPack.author.name}
                  </span>
                  {promptPack.author.verified && (
                    <Verified className="w-4 h-4 text-blue-500 ml-1" />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {promptPack.author.title}
                </p>
              </div>
            </div>
            <Badge
              className={`text-xs border ${getCategoryColor(
                promptPack.category
              )}`}
            >
              {promptPack.category.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold">
                  {promptPack.rating}
                </span>
              </div>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Download className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm font-semibold">
                  {promptPack.downloads}
                </span>
              </div>
              <p className="text-xs text-gray-500">Downloads</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-sm font-semibold">
                  {promptPack.prompts.length}
                </span>
              </div>
              <p className="text-xs text-gray-500">Prompts</p>
            </div>
          </div>

          {/* Sample Outputs Preview */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
              Sample Outputs:
            </h4>
            <div className="space-y-2">
              {promptPack.sample_outputs.slice(0, 2).map((output, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm italic"
                >
                  "{output}"
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex flex-wrap gap-1">
              {promptPack.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {promptPack.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{promptPack.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="flex-1 text-sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`text-sm ${
                isLiked ? "text-red-500 border-red-300" : ""
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-sm"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handlePromptPackAccess}
            className={`w-full text-sm font-semibold transition-all ${
              isAccessible
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
            }`}
            disabled={!isAccessible}
          >
            {promptPack.tier === "Free" ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Get Free Pack
              </>
            ) : isAccessible ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Get Pack - ${promptPack.price}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade Required
              </>
            )}
          </Button>
        </CardContent>

        {/* Trending Indicator */}
        {promptPack.downloads > 1000 && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-orange-500 text-white text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default PromptPackCard;
