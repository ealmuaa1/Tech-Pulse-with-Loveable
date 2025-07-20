import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";

interface SubscriptionContextType {
  isPro: boolean;
  planName: string;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [planName, setPlanName] = useState("Free");
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setIsPro(false);
      setPlanName("Free");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("is_pro, plan_name, stripe_current_period_end")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching subscription:", error);
        setIsPro(false);
        setPlanName("Free");
      } else if (data) {
        // Check if subscription is still valid
        const isSubscriptionValid =
          data.is_pro &&
          (!data.stripe_current_period_end ||
            new Date(data.stripe_current_period_end) > new Date());

        setIsPro(isSubscriptionValid);
        setPlanName(data.plan_name || "Free");
      }
    } catch (error) {
      console.error("Error in fetchSubscription:", error);
      setIsPro(false);
      setPlanName("Free");
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const value = {
    isPro,
    planName,
    loading,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
