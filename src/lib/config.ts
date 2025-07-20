// Configuration for API endpoints and environment variables
export const config = {
  // Base URL for API requests - use environment variable or fallback
  BASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "https://yourproject.supabase.co",

  // Client URL for redirects and webhooks
  CLIENT_URL:
    process.env.NEXT_PUBLIC_CLIENT_URL ||
    process.env.VITE_CLIENT_URL ||
    window.location.origin,

  // API endpoints
  API_ENDPOINTS: {
    // Use relative URLs for same-origin requests
    CREATE_CHECKOUT_SESSION: "/api/create-checkout-session",
    WEBHOOK: "/api/webhook",
    TRENDS: "/api/trends",
    LESSONS: "/api/lessons",
  },

  // Environment detection
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // For same-origin requests, use relative URLs
  if (endpoint.startsWith("/api/")) {
    return endpoint;
  }

  // For external API calls, use the base URL
  return `${config.BASE_URL}${endpoint}`;
};

// Helper function to get client URL for redirects
export const getClientUrl = (path: string = ""): string => {
  return `${config.CLIENT_URL}${path}`;
};
