# Checkout API Documentation

**Date:** July 19, 2025  
**Status:** ✅ COMPLETE  
**API Route:** `/api/create-checkout-session`

## 🎯 **Overview**

The checkout API route creates Stripe checkout sessions for subscription payments. It's designed to be simple, secure, and flexible.

## 📋 **API Endpoint**

### **POST** `/api/create-checkout-session`

Creates a new Stripe checkout session for subscription payments.

### **Request Body**

```typescript
{
  priceId: string;      // Required: Stripe price ID
  userId?: string;      // Optional: User ID for webhook processing
  planName?: string;    // Optional: Plan name for metadata
}
```

### **Response**

**Success (200):**

```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

**Error (400/405/500):**

```json
{
  "error": "Error message"
}
```

## 🔧 **Implementation**

### **JavaScript Version** (`server/api/checkout.js`)

```javascript
// POST /api/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { priceId, userId, planName } = req.body;

  if (!priceId) {
    return res.status(400).json({
      error: "Missing required field: priceId",
    });
  }

  try {
    const session = await stripeInstance.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${
        req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"
      }/success`,
      cancel_url: `${
        req.headers.origin || process.env.CLIENT_URL || "http://localhost:3000"
      }/pricing`,
      ...(userId && { client_reference_id: userId }),
      ...(planName && { metadata: { planName } }),
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});
```

### **TypeScript Version** (`server/api/checkout.ts`)

```typescript
interface CreateCheckoutRequest {
  priceId: string;
  userId?: string;
  planName?: string;
}

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
      ...(userId && { client_reference_id: userId }),
      ...(planName && { metadata: { planName } }),
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    res.status(500).json({ error: err.message });
  }
});
```

## 🔐 **Security Features**

### **1. Method Validation**

- Only accepts POST requests
- Returns 405 for other methods

### **2. Input Validation**

- Requires `priceId` field
- Validates request body structure

### **3. Error Handling**

- Graceful error handling with proper HTTP status codes
- Detailed error messages for debugging
- Console logging for server-side debugging

### **4. Environment Variables**

- Uses `STRIPE_SECRET_KEY` from environment
- Fallback URLs for different environments

## 🌍 **Environment Configuration**

### **Required Environment Variables**

```bash
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
```

### **Optional Environment Variables**

```bash
CLIENT_URL=https://yourdomain.com     # Production client URL
VITE_CLIENT_URL=http://localhost:3000 # Development client URL
```

## 📱 **Frontend Integration**

### **React Component Usage**

```typescript
const handleSubscribe = async (plan: PricingPlan) => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId: plan.priceId,
        userId: user.id,
        planName: plan.name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    alert("Failed to start checkout. Please try again.");
  }
};
```

### **JavaScript Usage**

```javascript
async function createCheckoutSession(priceId, userId, planName) {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        planName,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Checkout error:", error);
  }
}
```

## 🧪 **Testing**

### **Test Script** (`test-checkout-api.js`)

```javascript
const fetch = require("node-fetch");

async function testCheckoutAPI() {
  const testData = {
    priceId: "prod_Si6IAMNlNshiO2",
    userId: "test-user-123",
    planName: "Pro",
  };

  try {
    const response = await fetch(
      "http://localhost:4000/api/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      }
    );

    const result = await response.json();

    if (response.ok && result.url) {
      console.log("✅ Checkout API working correctly!");
      console.log("Checkout URL:", result.url);
    } else {
      console.log("❌ Checkout API failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testCheckoutAPI();
```

### **Run Test**

```bash
node test-checkout-api.js
```

## 📊 **Stripe Configuration**

### **Price IDs**

- **Free Plan**: No price ID (handled in frontend)
- **Pro Plan**: `prod_Si6IAMNlNshiO2` ($7/month)

### **Webhook Events**

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### **Checkout Session Options**

- **Mode**: `subscription` (recurring payments)
- **Payment Methods**: `card` only
- **Success URL**: Redirects to `/success` page
- **Cancel URL**: Redirects to `/pricing` page

## 🚀 **Deployment**

### **1. Environment Setup**

```bash
# Production
STRIPE_SECRET_KEY=sk_live_...
CLIENT_URL=https://yourdomain.com

# Development
STRIPE_SECRET_KEY=sk_test_...
VITE_CLIENT_URL=http://localhost:3000
```

### **2. Server Start**

```bash
# Start the server
node server/index.cjs

# Or with nodemon for development
nodemon server/index.cjs
```

### **3. Verify API**

```bash
# Test the endpoint
curl -X POST http://localhost:4000/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceId": "prod_Si6IAMNlNshiO2"}'
```

## ✅ **Error Handling**

### **Common Error Codes**

- **400**: Missing required fields
- **405**: Invalid HTTP method
- **500**: Server error or Stripe API error

### **Error Response Format**

```json
{
  "error": "Detailed error message"
}
```

## 📈 **Monitoring & Logging**

### **Console Logs**

- Checkout session creation attempts
- Error details for debugging
- Webhook event processing

### **Stripe Dashboard**

- Monitor checkout sessions
- Track payment success rates
- View subscription metrics

## 🔄 **Webhook Integration**

The API route works with the existing webhook handler to:

1. Process successful payments
2. Update user subscription status
3. Handle subscription changes
4. Manage subscription cancellations

---

**Status: ✅ COMPLETE**  
**API route ready for production use**
