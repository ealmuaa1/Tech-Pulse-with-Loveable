import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, User, Settings } from "lucide-react";

/**
 * Debug component to test profile preferences functionality
 * Shows current state and provides buttons to test save/load operations
 */
const DebugPreferences = () => {
  const { user } = useAuth();
  const [directDbData, setDirectDbData] = useState<any>(null);
  const [testTopics, setTestTopics] = useState<string[]>(["AI", "Blockchain"]);
  const [loading, setLoading] = useState(false);

  // Fetch data directly from Supabase for comparison
  const fetchDirectFromDb = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Direct DB fetch error:", error);
        setDirectDbData({ error: error.message });
      } else {
        setDirectDbData(data);
      }
    } catch (err) {
      console.error("Direct DB fetch exception:", err);
      setDirectDbData({ error: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  // Test saving preferences
  const testSavePreferences = async () => {
    setLoading(true);
    try {
      const success = await updatePreferences(testTopics);
      console.log("Test save result:", success);

      // Refresh to see the change
      setTimeout(() => {
        fetchDirectFromDb();
        refreshPreferences();
      }, 1000);
    } catch (err) {
      console.error("Test save error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg max-w-md">
        <h3 className="font-semibold text-red-800 mb-2">Debug: No User</h3>
        <p className="text-red-600 text-sm">
          User must be logged in to test preferences
        </p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-md max-h-96 overflow-y-auto z-50">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Debug Preferences
        </h3>
      </div>

      {/* User Info */}
      <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">User ID:</span>
        </div>
        <code className="text-xs text-gray-600 dark:text-gray-300">
          {user.id}
        </code>
      </div>

      {/* Direct DB Data */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4" />
          <h4 className="text-sm font-medium">Direct DB Data:</h4>
        </div>
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded text-xs">
          {directDbData ? (
            directDbData.error ? (
              <span className="text-red-500">{directDbData.error}</span>
            ) : (
              <div>
                <p>
                  <strong>Type:</strong>{" "}
                  {Array.isArray(directDbData.favorite_topics)
                    ? "array"
                    : typeof directDbData.favorite_topics}
                </p>
                <p>
                  <strong>Value:</strong>{" "}
                  {JSON.stringify(directDbData.favorite_topics)}
                </p>
              </div>
            )
          ) : (
            <span className="text-gray-500">Not fetched</span>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <div className="space-y-2">
        <Button
          onClick={fetchDirectFromDb}
          disabled={loading}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <Database className="w-4 h-4 mr-2" />
          Fetch Direct DB
        </Button>

        <Button
          onClick={testSavePreferences}
          disabled={loading}
          size="sm"
          className="w-full"
        >
          <Settings className="w-4 h-4 mr-2" />
          Test Save [{testTopics.join(", ")}]
        </Button>

        <Button
          onClick={() => refreshPreferences()}
          disabled={loading}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Context
        </Button>
      </div>

      {/* Current Test Topics */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 mb-1">Test topics to save:</p>
        <div className="flex gap-1">
          {testTopics.map((topic, idx) => (
            <Badge key={idx} className="text-xs bg-orange-500 text-white">
              {topic}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DebugPreferences;
