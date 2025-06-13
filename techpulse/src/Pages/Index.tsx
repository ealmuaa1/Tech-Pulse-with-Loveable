import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { RedditFeed } from "../components/RedditFeed";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Stay Ahead with TechPulse
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your daily dose of tech insights, learning resources, and
              community discussions.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/learn">
                <Button size="lg">Start Learning</Button>
              </Link>
              <Link to="/digests">
                <Button size="lg" variant="outline">
                  Read Digests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Tech Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Trending in Tech
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                AI & Machine Learning
              </h3>
              <p className="text-muted-foreground mb-4">
                Explore the latest developments in artificial intelligence and
                machine learning.
              </p>
              <Link to="/learn/ai">
                <Button variant="link">Learn More →</Button>
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Web Development</h3>
              <p className="text-muted-foreground mb-4">
                Master modern web development with our comprehensive learning
                resources.
              </p>
              <Link to="/learn/web-dev">
                <Button variant="link">Learn More →</Button>
              </Link>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Blockchain</h3>
              <p className="text-muted-foreground mb-4">
                Understand blockchain technology and its impact on various
                industries.
              </p>
              <Link to="/learn/blockchain">
                <Button variant="link">Learn More →</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Community Discussions
          </h2>
          <RedditFeed />
        </div>
      </section>
    </div>
  );
}
