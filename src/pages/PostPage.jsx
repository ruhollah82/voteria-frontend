import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUp,
  ArrowDown,
  Bookmark,
  Share2,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import { CommentThread } from "@/features/comments";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
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
      <div className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Card className="shadow-none">
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <Skeleton className="size-10 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
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

  const userVote = currentPost.userVote ?? 0;
  const community = currentPost.community || "general";
  const author = currentPost.author ?? "u/unknown";
  const score = currentPost.score ?? 0;
  const tags = currentPost.tags ?? [];
  const createdAt = currentPost.createdAt;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="-mb-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to Feed
        </Link>
      </Button>

      {/* Fixed sidebar width (320px), fluid main column */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Content Column */}
        <div className="min-w-0 space-y-6">
          {/* Post Card */}
          <Card className="shadow-none overflow-hidden w-full">
            <div className="p-5 sm:p-6">
              {/* Meta */}
              ...
              {/* Title */}
              <h1 className="mt-3 text-xl sm:text-2xl font-bold leading-tight text-card-foreground break-words">
                {currentPost.title}
              </h1>
              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Body (Markdown) */}
              {currentPost.content && (
                <div className="mt-4">
                  <MarkdownRenderer content={currentPost.content} />
                </div>
              )}
              <Separator className="my-5" />
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
                      "min-w-8 px-1 text-center text-sm font-semibold tabular-nums",
                      userVote === 1 && "text-primary",
                      userVote === -1 && "text-destructive",
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
                <Button
                  size="sm"
                  variant="ghost"
                  className="px-2 text-muted-foreground"
                >
                  <Share2 className="size-4 me-1.5" /> Share
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="px-2 text-muted-foreground"
                >
                  <Bookmark className="size-4 me-1.5" /> Save
                </Button>
              </div>
            </div>
          </Card>

          {/* Comments Section Card */}
          <Card className="shadow-none">
            <div className="p-5 sm:p-6">
              <CommentThread postId={String(currentPost.id)} />
            </div>
          </Card>
        </div>

        {/* Right Sidebar (Desktop Only) */}
        <aside className="hidden lg:block space-y-4">
          <Card className="shadow-none sticky top-20">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback>
                    {community.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground">v/{community}</p>
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">1.2k</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">45</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-4" />
                <span>Created Jan 1, 2024</span>
              </div>
              <Button className="w-full" variant="outline">
                Join Community
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
