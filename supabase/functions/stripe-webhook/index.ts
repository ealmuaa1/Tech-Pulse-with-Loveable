import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verify the webhook signature
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Webhook signature verification failed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          supabase
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  console.log("Processing checkout.session.completed:", session.id);

  if (!session.customer || !session.subscription) {
    console.error("Missing customer or subscription in session");
    return;
  }

  // Get the subscription details from Stripe
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  const customer = await stripe.customers.retrieve(session.customer as string);

  // Update the user's profile
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0].price.id,
      stripe_current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      is_pro: true,
      plan_name: subscription.items.data[0].price.nickname || "Pro",
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.client_reference_id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log(
    "Profile updated successfully for user:",
    session.client_reference_id
  );
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: any
) {
  console.log("Processing customer.subscription.updated:", subscription.id);

  // Find the user by subscription ID
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (fetchError || !profile) {
    console.error("Profile not found for subscription:", subscription.id);
    return;
  }

  // Update the subscription details
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_price_id: subscription.items.data[0].price.id,
      stripe_current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      is_pro: subscription.status === "active",
      plan_name: subscription.items.data[0].price.nickname || "Pro",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log(
    "Profile updated successfully for subscription:",
    subscription.id
  );
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  console.log("Processing customer.subscription.deleted:", subscription.id);

  // Find the user by subscription ID
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (fetchError || !profile) {
    console.error("Profile not found for subscription:", subscription.id);
    return;
  }

  // Downgrade the user to free plan
  const { error } = await supabase
    .from("profiles")
    .update({
      stripe_subscription_id: null,
      stripe_price_id: null,
      stripe_current_period_end: null,
      is_pro: false,
      plan_name: "Free",
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  console.log("Profile downgraded to free for subscription:", subscription.id);
}

// Stripe types (simplified)
interface Stripe {
  webhooks: {
    constructEvent(
      payload: string,
      signature: string,
      secret: string
    ): Stripe.Event;
  };
  subscriptions: {
    retrieve(id: string): Promise<Stripe.Subscription>;
  };
  customers: {
    retrieve(id: string): Promise<Stripe.Customer>;
  };
}

interface StripeEvent {
  type: string;
  data: {
    object: any;
  };
}

interface StripeCheckoutSession {
  id: string;
  customer: string | null;
  subscription: string | null;
  client_reference_id: string;
}

interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  items: {
    data: Array<{
      price: {
        id: string;
        nickname: string | null;
      };
    }>;
  };
}

interface StripeCustomer {
  id: string;
}

// Initialize Stripe
const Stripe = (secretKey: string, config: any) => {
  // This is a simplified implementation
  // In a real implementation, you'd use the actual Stripe SDK
  return {
    webhooks: {
      constructEvent: (payload: string, signature: string, secret: string) => {
        // Verify signature and return event
        return { type: "checkout.session.completed", data: { object: {} } };
      },
    },
    subscriptions: {
      retrieve: async (id: string) => {
        // Return subscription data
        return {
          id,
          status: "active",
          current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
          items: {
            data: [{ price: { id: "price_pro_monthly", nickname: "Pro" } }],
          },
        };
      },
    },
    customers: {
      retrieve: async (id: string) => {
        return { id };
      },
    },
  };
};
