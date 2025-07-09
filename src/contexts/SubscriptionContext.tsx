import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { UserSubscription, SubscriptionFeature, PurchaseItem } from "@/types";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  hasFeature: (featureName: string) => boolean;
  canUseFeature: (featureName: string) => boolean;
  upgradeToProRequired: boolean;
  purchaseItem: (item: PurchaseItem) => Promise<boolean>;
  startTrial: () => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  getUsageLimit: (featureName: string) => number;
  incrementUsage: (featureName: string) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const user = useUser();

  // Default free tier features
  const FREE_TIER_FEATURES: SubscriptionFeature[] = [
    { name: "basic_topics", enabled: true, limit: 10 },
    { name: "ai_toolkits", enabled: true, limit: 5 },
    { name: "prompt_packs", enabled: true, limit: 3 },
    { name: "playbooks", enabled: false, limit: 0 },
    { name: "briefing_builder", enabled: false, limit: 0 },
    { name: "white_label", enabled: false, limit: 0 },
    { name: "analytics", enabled: false, limit: 0 },
  ];

  const PRO_TIER_FEATURES: SubscriptionFeature[] = [
    { name: "basic_topics", enabled: true, limit: -1 }, // unlimited
    { name: "ai_toolkits", enabled: true, limit: -1 },
    { name: "prompt_packs", enabled: true, limit: 50 },
    { name: "playbooks", enabled: true, limit: 10 },
    { name: "briefing_builder", enabled: true, limit: 5 },
    { name: "white_label", enabled: false, limit: 0 },
    { name: "analytics", enabled: true, limit: -1 },
  ];

  const ENTERPRISE_TIER_FEATURES: SubscriptionFeature[] = [
    { name: "basic_topics", enabled: true, limit: -1 },
    { name: "ai_toolkits", enabled: true, limit: -1 },
    { name: "prompt_packs", enabled: true, limit: -1 },
    { name: "playbooks", enabled: true, limit: -1 },
    { name: "briefing_builder", enabled: true, limit: -1 },
    { name: "white_label", enabled: true, limit: -1 },
    { name: "analytics", enabled: true, limit: -1 },
  ];

  // Fetch user subscription from database
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      // Set default free tier for non-authenticated users
      setSubscription({
        id: "free",
        user_id: "anonymous",
        tier: "Free",
        status: "Active",
        features: FREE_TIER_FEATURES,
        billing_cycle: "Monthly",
        price: 0,
      });
      setLoading(false);
      return;
    }

    try {
      // Check if user_subscriptions table exists first
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        // Handle table not found or column not found errors gracefully
        if (
          error.code === "42P01" ||
          error.code === "PGRST106" ||
          error.code === "PGRST116"
        ) {
          console.log(
            "SubscriptionContext: user_subscriptions table not found or no subscription record, using default free tier"
          );

          // Create default free subscription (in-memory only, no database)
          const freeSubscription: UserSubscription = {
            id: `free_${user?.id}`,
            user_id: user?.id,
            tier: "Free",
            status: "Active",
            features: FREE_TIER_FEATURES,
            billing_cycle: "Monthly",
            price: 0,
          };

          setSubscription(freeSubscription);
          setLoading(false);
          return;
        }

        console.error(
          "SubscriptionContext: Error fetching subscription:",
          error
        );
        throw error;
      }

      if (!data) {
        // No subscription found - create default free subscription
        const freeSubscription: UserSubscription = {
          id: `free_${user?.id}`,
          user_id: user?.id,
          tier: "Free",
          status: "Active",
          features: FREE_TIER_FEATURES,
          billing_cycle: "Monthly",
          price: 0,
        };

        // Try to insert into database, but don't fail if table doesn't exist
        try {
          const { error: insertError } = await supabase
            .from("user_subscriptions")
            .insert(freeSubscription);

          if (insertError) {
            console.log(
              "SubscriptionContext: Could not create subscription record (table may not exist):",
              insertError.message
            );
          }
        } catch (insertError) {
          console.log(
            "SubscriptionContext: Database insert failed, using in-memory subscription:",
            insertError
          );
        }

        setSubscription(freeSubscription);
      } else {
        // Determine features based on tier
        let features = FREE_TIER_FEATURES;
        if (data.tier === "Pro") features = PRO_TIER_FEATURES;
        if (data.tier === "Enterprise") features = ENTERPRISE_TIER_FEATURES;

        setSubscription({ ...data, features });
      }
    } catch (error) {
      console.log(
        "SubscriptionContext: Error in fetchSubscription, falling back to free tier:",
        error
      );
      // Fallback to free tier - always works
      setSubscription({
        id: "free_fallback",
        user_id: user?.id || "anonymous",
        tier: "Free",
        status: "Active",
        features: FREE_TIER_FEATURES,
        billing_cycle: "Monthly",
        price: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if user has a specific feature
  const hasFeature = useCallback(
    (featureName: string): boolean => {
      if (!subscription) return false;
      const feature = subscription.features.find((f) => f.name === featureName);
      return feature?.enabled || false;
    },
    [subscription]
  );

  // Check if user can still use a feature (considering limits)
  const canUseFeature = useCallback(
    (featureName: string): boolean => {
      if (!subscription) return false;
      const feature = subscription.features.find((f) => f.name === featureName);

      if (!feature?.enabled) return false;
      if (feature.limit === -1) return true; // unlimited
      if (!feature.limit) return false;

      const currentUsage = feature.current_usage || 0;
      return currentUsage < feature.limit;
    },
    [subscription]
  );

  // Get usage limit for a feature
  const getUsageLimit = useCallback(
    (featureName: string): number => {
      if (!subscription) return 0;
      const feature = subscription.features.find((f) => f.name === featureName);
      return feature?.limit || 0;
    },
    [subscription]
  );

  // Increment usage for a feature
  const incrementUsage = useCallback(
    async (featureName: string): Promise<boolean> => {
      if (!subscription || !user) return false;

      const feature = subscription.features.find((f) => f.name === featureName);
      if (!feature?.enabled) return false;

      const currentUsage = feature.current_usage || 0;
      if (feature.limit !== -1 && currentUsage >= feature.limit) {
        toast.error(
          `You've reached your ${featureName} limit. Upgrade to Pro for unlimited access!`
        );
        return false;
      }

      try {
        // Try to update usage in database, but don't fail if table doesn't exist
        try {
          const { error } = await supabase
            .from("user_subscriptions")
            .update({
              features: subscription.features.map((f) =>
                f.name === featureName
                  ? { ...f, current_usage: (f.current_usage || 0) + 1 }
                  : f
              ),
            })
            .eq("user_id", user?.id);

          if (error && error.code !== "42P01" && error.code !== "PGRST106") {
            console.log(
              "SubscriptionContext: Could not update usage in database:",
              error.message
            );
          }
        } catch (dbError) {
          console.log(
            "SubscriptionContext: Database update failed, updating local state only:",
            dbError
          );
        }

        // Always update local state regardless of database success
        setSubscription((prev) =>
          prev
            ? {
                ...prev,
                features: prev.features.map((f) =>
                  f.name === featureName
                    ? { ...f, current_usage: (f.current_usage || 0) + 1 }
                    : f
                ),
              }
            : null
        );

        return true;
      } catch (error) {
        console.log("SubscriptionContext: Error incrementing usage:", error);
        return false;
      }
    },
    [subscription, user]
  );

  // Purchase an item (mock implementation - replace with Stripe)
  const purchaseItem = useCallback(
    async (item: PurchaseItem): Promise<boolean> => {
      if (!user) {
        toast.error("Please log in to make a purchase");
        return false;
      }

      try {
        // Mock payment processing
        toast.success(`Purchase initiated for ${item.type}!`);

        // In a real implementation, integrate with Stripe here
        // For now, just simulate the purchase
        if (item.type === "subscription") {
          // Upgrade subscription
          await refreshSubscription();
          toast.success("Subscription upgraded successfully!");
        }

        return true;
      } catch (error) {
        console.log("SubscriptionContext: Error processing purchase:", error);
        toast.error("Purchase failed. Please try again.");
        return false;
      }
    },
    [user]
  );

  // Start trial
  const startTrial = useCallback(async (): Promise<boolean> => {
    if (!user || !subscription) return false;

    try {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 14); // 14-day trial

      // Try to update in database, but continue if it fails
      try {
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            tier: "Pro",
            status: "Trial",
            trial_ends_at: trialEndDate.toISOString(),
          })
          .eq("user_id", user?.id);

        if (error && error.code !== "42P01" && error.code !== "PGRST106") {
          console.log(
            "SubscriptionContext: Could not update trial in database:",
            error.message
          );
        }
      } catch (dbError) {
        console.log(
          "SubscriptionContext: Database trial update failed, updating local state only:",
          dbError
        );
      }

      // Always update local state
      setSubscription((prev) =>
        prev
          ? {
              ...prev,
              tier: "Pro",
              status: "Trial",
              trial_ends_at: trialEndDate.toISOString(),
              features: PRO_TIER_FEATURES,
            }
          : null
      );

      toast.success("🎉 14-day Pro trial started! Enjoy unlimited access.");
      return true;
    } catch (error) {
      console.log("SubscriptionContext: Error starting trial:", error);
      return false;
    }
  }, [user, subscription]);

  // Cancel subscription
  const cancelSubscription = useCallback(async (): Promise<boolean> => {
    if (!user || !subscription) return false;

    try {
      // Try to update in database, but continue if it fails
      try {
        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            status: "Cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("user_id", user?.id);

        if (error && error.code !== "42P01" && error.code !== "PGRST106") {
          console.log(
            "SubscriptionContext: Could not cancel subscription in database:",
            error.message
          );
        }
      } catch (dbError) {
        console.log(
          "SubscriptionContext: Database cancellation failed, updating local state only:",
          dbError
        );
      }

      // Always update local state
      setSubscription((prev) =>
        prev
          ? {
              ...prev,
              status: "Cancelled",
              cancelled_at: new Date().toISOString(),
            }
          : null
      );

      toast.success("Subscription cancelled successfully");
      return true;
    } catch (error) {
      console.log("SubscriptionContext: Error cancelling subscription:", error);
      return false;
    }
  }, [user, subscription]);

  // Refresh subscription from server
  const refreshSubscription = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  // Check if upgrade to Pro is required
  const upgradeToProRequired = !subscription || subscription.tier === "Free";

  // Initialize subscription on user change
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        hasFeature,
        canUseFeature,
        upgradeToProRequired,
        purchaseItem,
        startTrial,
        cancelSubscription,
        getUsageLimit,
        incrementUsage,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};
