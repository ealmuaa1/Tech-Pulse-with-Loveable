// Test script to verify UserContext lifecycle
// Run this in your browser console to check the debug logs

console.log("🧪 Testing UserContext Lifecycle...");

// Check if UserContext is available
const userContextElement = document.querySelector(
  '[data-testid="user-context"]'
);
if (!userContextElement) {
  console.log(
    "ℹ️ UserContext element not found - add data-testid='user-context' to UserProvider for testing"
  );
}

// Monitor console logs for UserContext lifecycle
const originalConsoleLog = console.log;
console.log = function (...args) {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("UserContext:")
  ) {
    console.group("🔍 UserContext Debug");
    originalConsoleLog.apply(console, args);
    console.groupEnd();
  } else {
    originalConsoleLog.apply(console, args);
  }
};

// Test navigation between pages
function testNavigation() {
  console.log("🧪 Testing navigation between pages...");

  // Simulate navigation to Profile
  setTimeout(() => {
    console.log("📍 Navigating to Profile...");
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 1000);

  // Simulate navigation to Learn
  setTimeout(() => {
    console.log("📍 Navigating to Learn...");
    window.history.pushState({}, "", "/learn");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 3000);

  // Simulate navigation back to Profile
  setTimeout(() => {
    console.log("📍 Navigating back to Profile...");
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, 5000);
}

// Check for infinite loading issues
function checkForInfiniteLoading() {
  let loadingCount = 0;
  const checkInterval = setInterval(() => {
    const loadingElements = document.querySelectorAll(
      '[data-testid*="loading"], .animate-spin'
    );
    if (loadingElements.length > 0) {
      loadingCount++;
      console.log(`⏳ Loading detected (${loadingCount} times)`);

      if (loadingCount > 10) {
        console.error("🚨 Potential infinite loading detected!");
        clearInterval(checkInterval);
      }
    } else {
      if (loadingCount > 0) {
        console.log("✅ Loading completed");
        loadingCount = 0;
      }
    }
  }, 1000);

  // Stop checking after 30 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
    console.log("🏁 Loading check completed");
  }, 30000);
}

// Run tests
console.log("🚀 Starting UserContext tests...");
testNavigation();
checkForInfiniteLoading();

// Instructions for manual testing
console.log(`
📋 Manual Testing Checklist:

1. ✅ Check browser console for UserContext lifecycle logs with emojis
2. ✅ Navigate between /profile and /learn pages
3. ✅ Verify no infinite loading spinners
4. ✅ Check that user data persists across navigation
5. ✅ Test with and without authentication
6. ✅ Verify fallback UI shows when user is null
7. ✅ Test preference saving and immediate updates

Look for these debug logs:
- 🔄 UserContext: Starting initialization...
- 👤 UserContext: Current user: [id or none]
- 📊 UserContext: Loading user data for: [userId]
- ✅ UserContext: Profile loaded: [profile data]
- ✅ UserContext: Preferences loaded: [preferences data]
- 🎉 UserContext: User data loaded successfully
`);
