import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BottomNavigation from "@/components/BottomNavigation";
import { Search, BookOpen, Clock, Eye, Heart, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Mock data for tech digests
 * Each digest represents a tech article or insight
 */
const mockDigests = [
  {
    id: 1,
    title: "The Future of AI in Healthcare",
    category: "AI",
    excerpt:
      "Exploring how artificial intelligence is revolutionizing patient care and medical research...",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=300&fit=crop",
    timeToRead: "5 min",
    views: 1234,
    likes: 89,
    bookmarked: false,
  },
  {
    id: 2,
    title: "Web3: Beyond the Hype",
    category: "Blockchain",
    excerpt:
      "Understanding the real-world applications of Web3 technology and its potential impact...",
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?w=600&h=300&fit=crop",
    timeToRead: "7 min",
    views: 2345,
    likes: 156,
    bookmarked: true,
  },
  {
    id: 3,
    title: "Sustainable Tech: Green Computing",
    category: "Sustainability",
    excerpt:
      "How the tech industry is embracing sustainability and reducing its carbon footprint...",
    image:
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&h=300&fit=crop",
    timeToRead: "6 min",
    views: 1890,
    likes: 134,
    bookmarked: false,
  },
];

/**
 * Digests page component
 * Features:
 * - Search functionality
 * - Category filtering
 * - Bookmark system
 * - Responsive grid layout
 */
const Digests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bookmarkedDigests, setBookmarkedDigests] = useState<number[]>([2]);

  // Filter digests based on search term and category
  const filteredDigests = mockDigests.filter((digest) => {
    const matchesSearch =
      digest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      digest.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || digest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle bookmark status
  const toggleBookmark = (id: number) => {
    setBookmarkedDigests((prev) => {
      const newBookmarks = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      toast.success(
        prev.includes(id) ? "Removed from bookmarks" : "Added to bookmarks",
        { duration: 2000 }
      );

      return newBookmarks;
    });
  };

  // Handle digest click
  const handleDigestClick = (id: number) => {
    toast.info("Full article view coming soon!", { duration: 2000 });
    console.log("Opening digest:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-700 dark:from-white dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Tech Digests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with the latest tech insights
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search digests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              "All",
              "AI",
              "Blockchain",
              "Sustainability",
              "Cloud",
              "Security",
            ].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() =>
                  setSelectedCategory(category === "All" ? null : category)
                }
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Digests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDigests.map((digest) => (
            <Card
              key={digest.id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
              onClick={() => handleDigestClick(digest.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={digest.image}
                  alt={digest.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <Badge className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                  {digest.category}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold line-clamp-2">
                  {digest.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {digest.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{digest.timeToRead}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{digest.views}</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(digest.id);
                    }}
                    className={`${
                      bookmarkedDigests.includes(digest.id)
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        bookmarkedDigests.includes(digest.id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPage="digests" />
    </div>
  );
};

export default Digests;
