import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";
import {
  fetchTopicPosts,
  fetchPostComments,
  type RedditPost,
} from "@/lib/redditApi";
import { Skeleton } from "@/components/ui/skeleton";

interface RedditFeedProps {
  category: string;
}

export function RedditFeed({ category }: RedditFeedProps) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const topicPosts = await fetchTopicPosts(category);
      setPosts(topicPosts);
      setLoading(false);
    };

    loadPosts();
  }, [category]);

  const handlePostClick = async (permalink: string) => {
    if (selectedPost === permalink) {
      setSelectedPost(null);
      setComments([]);
      return;
    }

    setSelectedPost(permalink);
    const postComments = await fetchPostComments(permalink);
    setComments(postComments);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{post.title}</h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePostClick(post.permalink)}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {post.num_comments}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Posted by u/{post.author} in r/{post.subreddit}
          </p>
          {selectedPost === post.permalink && (
            <div className="mt-4 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm border-l-2 pl-2">
                  <p className="font-medium">u/{comment.author}</p>
                  <p>{comment.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
