import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";
import { useTrends } from "@/contexts/TrendContext";

const UNSPLASH_ACCESS_KEY = "hragK8M2kOg69ygh636oVZZelRoZP0aoBsliOlWW1xY";

const digests = [
  {
    id: "1",
    title: "AI Revolution in Healthcare",
    summary: "How GPT-4 is transforming diagnosis and treatment planning.",
    source: "AI Insights",
    link: "#",
  },
  {
    id: "2",
    title: "Quantum Computing Breakthrough",
    summary: "IBM's 1000-qubit chip and its real-world implications.",
    source: "Tech News Daily",
    link: "#",
  },
  {
    id: "3",
    title: "Sustainable Tech Innovations",
    summary: "Exploring new eco-friendly technologies for a greener future.",
    source: "Green Tech Journal",
    link: "#",
  },
];

const LandingPage = () => {
  const { dailyTrends, loadingTrends, errorTrends } = useTrends();
  const [digestImages, setDigestImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = digests.map(async (digest) => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
              digest.title
            )}&client_id=${UNSPLASH_ACCESS_KEY}`
          );
          const data = await response.json();
          return { id: digest.id, url: data.urls.regular };
        } catch (error) {
          console.error("Error fetching image for", digest.title, error);
          return { id: digest.id, url: "" };
        }
      });

      const results = await Promise.all(imagePromises);
      const imageMap = results.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {} as Record<string, string>);

      setDigestImages(imageMap);
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="container space-y-6 p-6 mx-auto">
        {/* Learning Progress Section */}
        <div className="bg-card p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Learning Progress</h2>
          <p className="text-muted-foreground mb-1 text-sm">
            3 more digests to complete your weekly goal! 🚀
          </p>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-4 bg-primary rounded-full"
              style={{ width: "67%" }}
            />
          </div>
          <p className="text-right mt-1 text-sm text-primary font-medium">
            67%
          </p>
        </div>

        {/* Today's Idea Spark Card */}
        <div className="bg-green-100 p-4 rounded-2xl mb-6">
          <h3 className="text-md font-semibold text-green-800">
            Today's Idea Spark
          </h3>
          <p className="text-sm text-green-900">
            Smart City Infrastructure: What if streetlights adjusted traffic by
            air quality?
          </p>
          <button className="mt-2 bg-green-700 text-white px-4 py-1 rounded-md hover:bg-green-800">
            Explore More
          </button>
        </div>

        {/* Today's Top Digests */}
        <div className="bg-card p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Today's Top Digests</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {digests.map((digest) => (
              <div
                key={digest.id}
                className="bg-white dark:bg-muted rounded-xl shadow overflow-hidden border border-border"
              >
                <img
                  src={
                    digestImages[digest.id] || "https://picsum.photos/800/600"
                  }
                  alt={digest.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={(e) => {
                    console.log("Image failed to load:", digest.title);
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFMEUwRTAiLz48dGV4dCB4PSI1MCIgeT0iMTAwIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2NjYyI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
                  }}
                  onLoad={() =>
                    console.log("Image loaded successfully:", digest.title)
                  }
                />
                <div className="p-4">
                  <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    {digest.source}
                  </span>
                  <h4 className="text-xl font-bold mt-2">{digest.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {digest.summary}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={digest.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
                    >
                      Read More
                    </Link>
                    <button className="bg-muted px-3 py-1 rounded">
                      Discuss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sticky Bottom Navigation */}
      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default LandingPage;
