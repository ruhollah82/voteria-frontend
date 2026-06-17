import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePostsStore } from "@/store/postsStore";
import { useAuthStore } from "@/store/authStore";
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FeedPostCard({ post }) {
  const { vote } = usePostsStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const userVote = post.userVote ?? 0;

  const handleVote = (dir) => {
    if (!token) {
      navigate("/login");
      return;
    }
    vote(post.id, dir);
  };

  const community = post.community || "general";

  return (
    <Card className="shadow-none transition-colors hover:border-ring/40">
      <article className="p-3 sm:p-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar size="sm" className="mt-0.5">
            <AvatarFallback>
              {(post.community ?? "??").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">
                v/{community}
              </span>
              <span>by {post.author}</span>
              {post.createdAt && <span>{post.createdAt}</span>}
            </div>
            <h2 className="mt-1 text-base font-semibold leading-6 text-card-foreground sm:text-lg">
              <Link to={`/post/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
          </div>
          <Button size="icon-sm" variant="ghost" aria-label="More post options">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        {post.description && (
          <p className="mt-3 text-sm leading-6 text-muted-foreground line-clamp-3">
            {post.description}
          </p>
        )}

        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator className="my-3" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center rounded-lg bg-muted p-0.5">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Upvote"
              onClick={() => handleVote(1)}
              className={cn(userVote === 1 && "text-primary")}
            >
              <ArrowUp className="size-4" />
            </Button>
            <span
              className={cn(
                "min-w-8 px-1 text-center text-xs font-semibold tabular-nums",
                userVote === 1 && "text-primary",
                userVote === -1 && "text-destructive",
              )}
            >
              {post.votes ?? 0}
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Downvote"
              onClick={() => handleVote(-1)}
              className={cn(userVote === -1 && "text-destructive")}
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>

          <div className="flex min-w-0 items-center gap-1">
            <Button size="sm" variant="ghost" className="px-2" asChild>
              <Link to={`/post/${post.id}`}>
                <MessageCircle className="size-4" />
                <span className="hidden min-[420px]:inline">
                  {post.comments ?? ""}
                </span>
              </Link>
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <Share2 className="size-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Save post">
              <Bookmark className="size-4" />
            </Button>
          </div>
        </div>
      </article>
    </Card>
  );
}
