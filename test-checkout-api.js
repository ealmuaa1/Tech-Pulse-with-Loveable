// Test script for the checkout API route
const fetch = require("node-fetch");

async function testCheckoutAPI() {
  const testData = {
    priceId: "prod_Si6IAMNlNshiO2", // Your Pro plan price ID
    userId: "test-user-123",
    planName: "Pro",
  };

  try {
    console.log("Testing checkout API...");
    console.log("Request data:", testData);

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

    console.log("Response status:", response.status);
    console.log("Response data:", result);

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

// Run the test
testCheckoutAPI();
