import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  popular?: boolean;
  priceId?: string;
}

const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const plans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with tech learning",
      features: [
        "5 daily news articles",
        "Basic learning modules",
        "Limited summaries",
        "Community access",
        "Basic progress tracking",
      ],
      buttonText: "Get Started Free",
    },
    {
      name: "Pro",
      price: "$7",
      description: "Unlock unlimited access to all features",
      features: [
        "Unlimited daily news",
        "All learning modules & tools",
        "Unlimited summaries",
        "Save & organize content",
        "Advanced progress tracking",
        "Priority support",
        "Early access to new features",
        "Ad-free experience",
      ],
      buttonText: "Subscribe to Pro",
      popular: true,
      priceId: "prod_Si6IAMNlNshiO2",
    },
  ];

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.name === "Free") {
      // For free plan, just navigate to home
      navigate("/home");
      return;
    }

    if (!user) {
      // Redirect to login if not authenticated
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Start your tech learning journey with our flexible pricing options.
            Upgrade anytime to unlock unlimited access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                plan.popular
                  ? "border-blue-500 ring-4 ring-blue-500/20"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.name === "Pro" && (
                    <span className="text-gray-500 ml-1">/month</span>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Can I cancel my subscription anytime?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can cancel your Pro subscription at any time. You'll
                continue to have access until the end of your current billing
                period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, debit cards, and digital
                wallets through our secure Stripe payment processing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Is there a free trial for Pro?
              </h3>
              <p className="mt-2 text-gray-600">
                Currently, we don't offer a free trial, but you can start with
                our Free plan to explore the platform before upgrading.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Contact Support →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
