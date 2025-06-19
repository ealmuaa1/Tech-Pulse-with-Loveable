import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { useProductHuntTools } from "@/hooks/useProductHuntTools";

const categories = ["All", "Productivity", "Design", "Automation", "Content"];

const Toolkits = () => {
  const { tools, isLoading, error } = useProductHuntTools();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTool, setSelectedTool] = useState(null);

  // Since ProductHuntTool doesn't have categories, we'll show all tools for now
  const filteredTools = tools;

  // Loading skeleton component
  const ToolSkeleton = () => (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden h-64 animate-pulse">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-muted rounded-lg" />
          <div className="flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <div className="flex-1 h-10 bg-muted rounded-lg" />
          <div className="flex-1 h-10 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">AI Toolkits</h1>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Tools
            </h3>
            <p className="text-red-600">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading
              ? // Show 4 skeleton cards while loading
                Array.from({ length: 4 }).map((_, index) => (
                  <ToolSkeleton key={index} />
                ))
              : filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col justify-between items-center text-center p-6 w-full h-80"
                    style={{ aspectRatio: "1/1" }}
                  >
                    <img
                      src={
                        tool.image ||
                        "https://source.unsplash.com/featured/?startup,tech"
                      }
                      alt={`${tool.name} logo`}
                      className="w-24 h-24 rounded-md object-cover mb-4"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://source.unsplash.com/featured/?startup,tech";
                      }}
                      loading="lazy"
                    />
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <h3 className="text-xl font-semibold mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {tool.tagline}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-4 w-full">
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Learn More
                      </button>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors text-center"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                ))}
          </div>
        )}
      </div>

      {/* Modal for Learn More */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">
                    {selectedTool.tagline}
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Created by</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTool.makers.map((maker, index) => (
                      <span
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full text-sm"
                      >
                        {maker.name}
                      </span>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Votes</p>
                      <p className="text-xl font-semibold">
                        {selectedTool.votesCount}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-xl font-semibold">
                        {new Date(selectedTool.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="flex gap-3">
                  <a
                    href={selectedTool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-center"
                  >
                    Visit Website
                  </a>
                  <button
                    onClick={() => setSelectedTool(null)}
                    className="flex-1 bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation currentPage="toolkits" />
    </div>
  );
};

export default Toolkits;
