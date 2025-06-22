import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import TopicCard from "@/components/TopicCard";
import { useProductHuntTools } from "@/hooks/useProductHuntTools";
import type { ProductHuntTool } from "@/lib/productHunt";
import { getAllTopics, Topic } from "@/lib/topicService";

const TOPICS_PER_PAGE = 3;
const TOOLS_PER_PAGE = 6;

/**
 * Learn page component
 * Features:
 * - Learning quests with progress tracking
 * - Achievement system
 * - XP and leveling system
 * - Interactive quest cards
 * - Difficulty indicators
 */
const Learn = () => {
  // Trending Topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topicPage, setTopicPage] = useState(1);

  // AI Toolkits
  const {
    tools,
    isLoading: isLoadingTools,
    error: toolError,
  } = useProductHuntTools();
  const [toolPage, setToolPage] = useState(1);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        const fetched = await getAllTopics();
        setTopics(fetched);
        setError(null);
      } catch (err) {
        setError("Failed to fetch topics.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  // Pagination logic
  const paginatedTopics = topics.slice(
    (topicPage - 1) * TOPICS_PER_PAGE,
    topicPage * TOPICS_PER_PAGE
  );
  const totalTopicPages = Math.ceil(topics.length / TOPICS_PER_PAGE) || 1;

  const paginatedTools = tools.slice(
    (toolPage - 1) * TOOLS_PER_PAGE,
    toolPage * TOOLS_PER_PAGE
  );
  const totalToolPages = Math.ceil(tools.length / TOOLS_PER_PAGE) || 1;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <main className="max-w-6xl mx-auto p-4 space-y-16">
        {/* Trending Tech Topics */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Trending Tech Topics</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(TOPICS_PER_PAGE)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-64 bg-muted rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-semibold mb-4">
              {error}
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center text-gray-500 mb-4">
              <p className="mb-4">No topics found. This could be due to:</p>
              <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
                <li>• Missing Supabase configuration</li>
                <li>• No data in the learn_topics table</li>
                <li>• Network connectivity issues</li>
              </ul>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  To fix this, ensure your .env file contains:
                </p>
                <pre className="text-xs mt-2 bg-blue-100 p-2 rounded">
                  VITE_SUPABASE_URL=your_supabase_url
                  <br />
                  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
                </pre>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedTopics.map((topic) => {
                  return (
                    <TopicCard
                      key={topic.id}
                      title={topic.title || "Untitled"}
                      summary={topic.summary || "No summary available."}
                      imageUrl={topic.image_url || ""}
                      slug={topic.slug}
                      source={topic.source || "Unknown"}
                      fallbackImage={"/placeholder.svg"}
                    />
                  );
                })}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded bg-muted text-sm"
                  disabled={topicPage === 1}
                  onClick={() => setTopicPage(topicPage - 1)}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {topicPage} of {totalTopicPages}
                </span>
                <button
                  className="px-3 py-1 rounded bg-muted text-sm"
                  disabled={topicPage === totalTopicPages}
                  onClick={() => setTopicPage(topicPage + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>

        {/* Trending AI Toolkits */}
        <section>
          <h2 className="text-2xl font-bold mb-6">🔥 Trending AI Toolkits</h2>
          {/* Debug info for tools */}
          <div className="text-xs text-gray-500 mb-2">
            Tools: {tools.length} | Loading: {isLoadingTools ? "Yes" : "No"} |
            Error: {toolError ? "Yes" : "No"}
          </div>
          {toolError ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              <p className="font-semibold">Error loading AI toolkits:</p>
              <p className="text-sm">{toolError.message}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(isLoadingTools
                  ? Array.from({ length: TOOLS_PER_PAGE })
                  : paginatedTools
                ).map((tool, idx) =>
                  isLoadingTools ? (
                    <div
                      key={idx}
                      className="h-64 bg-muted rounded-xl animate-pulse"
                    />
                  ) : (
                    <div
                      key={(tool as ProductHuntTool).id}
                      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col justify-between items-center text-center p-6 w-full h-80"
                    >
                      <img
                        src={
                          (tool as ProductHuntTool).image ||
                          "https://source.unsplash.com/featured/?startup,tech"
                        }
                        alt={(tool as ProductHuntTool).name}
                        className="w-24 h-24 rounded-md object-cover mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        {(tool as ProductHuntTool).name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {(tool as ProductHuntTool).tagline}
                      </p>
                      <div className="flex gap-3 mt-4 w-full">
                        <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                          Learn More
                        </button>
                        <a
                          href={(tool as ProductHuntTool).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors text-center"
                        >
                          Visit Site
                        </a>
                      </div>
                    </div>
                  )
                )}
              </div>
              {totalToolPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 rounded bg-muted text-sm"
                    disabled={toolPage === 1}
                    onClick={() => setToolPage(toolPage - 1)}
                  >
                    Prev
                  </button>
                  <span className="text-sm">
                    Page {toolPage} of {totalToolPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded bg-muted text-sm"
                    disabled={toolPage === totalToolPages}
                    onClick={() => setToolPage(toolPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <BottomNavigation currentPage="learn" />
    </div>
  );
};

export default Learn;
