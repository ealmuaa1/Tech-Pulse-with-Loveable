import express, { Request, Response } from "express";
import Stripe from "stripe";

const router = express.Router();

// Initialize Stripe with secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

interface CreateCheckoutRequest {
  priceId: string;
  userId?: string;
  planName?: string;
}

// POST /api/create-checkout-session
router.post("/create-checkout-session", async (req: Request, res: Response) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { priceId, userId, planName }: CreateCheckoutRequest = req.body;

  if (!priceId) {
    return res.status(400).json({
      error: "Missing required field: priceId",
    });
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${
        req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"
      }/success`,
      cancel_url: `${
        req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"
      }/pricing`,
      // Optional: Add user data if provided
      ...(userId && { client_reference_id: userId }),
      ...(planName && { metadata: { planName } }),
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webhook (for handling Stripe webhooks)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret!);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("Payment successful for session:", session.id);
        // Here you would typically:
        // 1. Update user subscription status in your database
        // 2. Send confirmation email
        // 3. Log the successful payment
        break;

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription created:", subscription.id);
        // Handle new subscription
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", updatedSubscription.id);
        // Handle subscription updates
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", deletedSubscription.id);
        // Handle subscription cancellation
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
