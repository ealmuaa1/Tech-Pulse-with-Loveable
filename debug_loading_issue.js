// Debug script to identify loading issues
// Run this in your browser console after the app loads

console.log("🔍 Debug: Checking page loading issues...");

// Check if React app is mounted
const reactRoot = document.getElementById("root");
if (!reactRoot) {
  console.error("❌ React root element not found!");
} else {
  console.log("✅ React root element found");
}

// Check for error boundaries or crash indicators
const errorElements = document.querySelectorAll(
  "[data-error], .error-boundary, .error-message"
);
if (errorElements.length > 0) {
  console.error("❌ Error elements found:", errorElements);
} else {
  console.log("✅ No error elements found");
}

// Check for loading spinners stuck on screen
const loadingElements = document.querySelectorAll(
  '.animate-spin, [data-loading="true"]'
);
console.log(`⏳ Loading elements found: ${loadingElements.length}`);
loadingElements.forEach((el, i) => {
  console.log(`Loading element ${i + 1}:`, el);
});

// Check UserContext state
setTimeout(() => {
  console.log("🔍 Checking UserContext state...");

  // Look for UserContext debug logs
  const hasUserContextLogs =
    performance.getEntriesByType("navigation").length > 0;
  console.log("UserContext logs should appear above this line");

  // Check if pages are rendering
  const pageElements = document.querySelectorAll(
    "[data-page], main, .min-h-screen"
  );
  console.log(`📄 Page elements found: ${pageElements.length}`);

  // Check current URL
  console.log(`🌐 Current URL: ${window.location.href}`);

  // Check for specific page content
  const profilePage = document.querySelector(
    '[data-testid="profile-page"], h1, h2'
  );
  const learnPage = document.querySelector('[data-testid="learn-page"]');
  const explorePage = document.querySelector('[data-testid="explore-page"]');

  console.log("Page detection:");
  console.log("- Profile page elements:", !!profilePage);
  console.log("- Learn page elements:", !!learnPage);
  console.log("- Explore page elements:", !!explorePage);

  // Check for navigation elements
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  console.log(`🧭 Navigation elements: ${navElements.length}`);
}, 2000);

// Monitor for changes
let checkCount = 0;
const monitorInterval = setInterval(() => {
  checkCount++;
  const loadingSpinners = document.querySelectorAll(".animate-spin");

  if (loadingSpinners.length > 0) {
    console.log(`⏳ Still loading... (check ${checkCount})`);
  } else {
    console.log(`✅ Loading complete (check ${checkCount})`);
    clearInterval(monitorInterval);
  }

  if (checkCount >= 20) {
    // Stop after 20 checks (40 seconds)
    console.log("🛑 Stopped monitoring - too many checks");
    clearInterval(monitorInterval);
  }
}, 2000);

// Instructions
console.log(`
📋 Debug Instructions:

1. Check the console for UserContext emoji logs (🔄, 👤, 📊, ✅)
2. Navigate to different pages: /profile, /learn, /explore
3. Look for any error messages or stuck loading states
4. Check if the safety timeout triggers (⚠️ UserContext: Safety timeout...)
5. Verify that page content loads after the UserContext initializes

If pages are still not loading:
- Check Network tab for failed requests
- Look for JavaScript errors in Console
- Verify Supabase connection is working
- Check if the database schema is properly set up
`);
