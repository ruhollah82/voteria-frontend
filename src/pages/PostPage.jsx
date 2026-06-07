import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { CommentThread } from "@/features/comments";
import { useAuthStore } from "@/store/authStore";
import { usePostsStore } from "@/store/postsStore";
import { cn } from "@/lib/utils";

export default function PostPage() {
  const { postId } = useParams();
  const { currentPost, loading, error, fetchPost, vote } = usePostsStore();
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost(postId);
  }, [fetchPost, postId]);

  const handleVote = (dir) => {
    if (!token) {
      navigate("/login");
      return;
    }
    vote(postId, dir);
  };

  if (loading && !currentPost) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-8 w-24" />
        <Card className="shadow-none">
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!currentPost) return null;

  const userVote = currentPost._userVote ?? 0;
  const community = currentPost.community ?? "general";
  const author = currentPost.author ?? "u/unknown";
  const score = currentPost.votes ?? currentPost.score ?? 0;
  const tags = currentPost.tags ?? [];
  const createdAt = currentPost.createdAt;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">
          <ArrowLeft className="size-4" /> Back
        </Link>
      </Button>

      <Card className="shadow-none">
        <article className="p-4 sm:p-6">
          {/* Meta */}
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <Avatar size="sm">
              <AvatarFallback>
                {community.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">v/{community}</span>
            <span>by {author}</span>
            {createdAt && <span>{createdAt}</span>}
          </div>

          {/* Title */}
          <h1 className="mt-3 text-xl font-bold leading-7 text-card-foreground">
            {currentPost.title}
          </h1>

          {/* Body */}
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {currentPost.content}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          )}

          <Separator className="my-4" />

          {/* Actions */}
          <div className="flex items-center gap-2">
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
                  userVote === -1 && "text-destructive"
                )}
              >
                {score}
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
            <Button size="sm" variant="ghost" className="px-2">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button size="icon-sm" variant="ghost" aria-label="Save">
              <Bookmark className="size-4" />
            </Button>
          </div>

          {/* Comments */}
          <CommentThread postId={String(currentPost.id)} />
        </article>
      </Card>
    </div>
  );
}
