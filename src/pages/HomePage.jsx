import { useState } from "react";
import {
  Sparkles,
  Filter,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";

const feedOptions = ["Hot", "New", "Top", "Rising"];

const posts = [
  {
    id: 1,
    community: "r/webdev",
    author: "u/fastcoder",
    avatar: "👨‍💻",
    createdAt: "2h ago",
    votes: 422,
    title: "Building Reddit-style interfaces with shadcn",
    description:
      "A comprehensive guide to using shadcn blocks for modern social feeds and dashboards.",
    tags: ["React", "shadcn", "UI"],
    comments: 28,
  },
  {
    id: 2,
    community: "r/frontend",
    author: "u/designguru",
    avatar: "🎨",
    createdAt: "4h ago",
    votes: 189,
    title: "Dark mode implementation patterns",
    description:
      "Exploring the best practices for implementing theme providers and persistent storage.",
    tags: ["Design", "Dark Mode"],
    comments: 18,
  },
  {
    id: 3,
    community: "r/tailwindcss",
    author: "u/cssmaster",
    avatar: "🎯",
    createdAt: "8h ago",
    votes: 512,
    title: "Tailwind v4 with custom components",
    description:
      "Deep dive into the new features and how to structure reusable components efficiently.",
    tags: ["Tailwind", "CSS", "Components"],
    comments: 54,
  },
];

const HomePage = () => {
  const [activeFeed, setActiveFeed] = useState("Hot");

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="rounded-4xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-primary/5 to-transparent p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Trending now
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 mb-2">
              Explore the community
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Discover the latest posts, trending discussions, and connect with
              the community.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="accent">Reddit-inspired</Badge>
            <Badge variant="accent">shadcn blocks</Badge>
            <Badge variant="accent">Responsive</Badge>
          </div>
        </div>
      </Card>

      {/* Feed Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">
            Community Posts
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Top posts from your communities
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {feedOptions.map((option) => (
            <Button
              key={option}
              variant={activeFeed === option ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveFeed(option)}
            >
              {option}
            </Button>
          ))}
          <Button variant="secondary" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> More
          </Button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex gap-4 p-5">
              {/* Vote Section */}
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-400 h-fit">
                <ArrowUp className="h-4 w-4" />
                <span className="text-xs font-semibold">{post.votes}</span>
                <ArrowDown className="h-4 w-4" />
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-semibold">{post.community}</span>
                  <span>•</span>
                  <span>Posted by {post.author}</span>
                  <span>•</span>
                  <span>{post.createdAt}</span>
                </div>

                {/* Title & Description */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100 mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {post.description}
                  </p>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="accent" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 dark:text-slate-400 h-8"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 dark:text-slate-400 h-8"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4">
        <Button variant="secondary" className="w-full sm:w-auto">
          Load more posts
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
