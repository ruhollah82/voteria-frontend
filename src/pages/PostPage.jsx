// src/pages/PostPage.jsx

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUp,
  ArrowDown,
  Bookmark,
  Share2,
  ArrowLeft,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { CommentThread } from "@/features/comments";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useAuthStore } from "@/store/authStore";
import { usePostsStore } from "@/store/postsStore";
import { cn } from "@/lib/utils";

export default function PostPage() {
  const { postId } = useParams();
  const { user } = useAuthStore();
  const { currentPost, loading, error, fetchPost, vote, editPost, deletePost } =
    usePostsStore();
  const navigate = useNavigate();

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchPost(postId);
  }, [fetchPost, postId]);

  const handleVote = (dir) => {
    if (!user) {
      navigate("/login");
      return;
    }
    vote(postId, dir);
  };

  // Check if the current user owns the post
  const isOwner =
    user &&
    currentPost &&
    (String(user.id) === String(currentPost.author_id) ||
      user.username === currentPost.author_username);

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("Title and content cannot be empty.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    const result = await editPost(
      currentPost.id,
      editTitle.trim(),
      editContent.trim(),
    );
    setEditLoading(false);
    if (result.success) {
      setIsEditing(false);
    } else {
      setEditError(result.error || "Failed to edit post.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This cannot be undone.",
      )
    )
      return;

    const result = await deletePost(currentPost.id);
    if (result.success) {
      navigate("/"); // Redirect to home feed after deletion
    } else {
      alert(result.error || "Failed to delete post.");
    }
  };

  if (loading && !currentPost) {
    // ... existing skeleton loading code ...
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
    // ... existing error code ...
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
  const score = currentPost.score ?? 0;
  const tags = currentPost.tags ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="-mb-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to Feed
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Content Column */}
        <div className="min-w-0 space-y-6">
          {/* Post Card */}
          <Card className="shadow-none overflow-hidden w-full">
            <div className="p-5 sm:p-6">
              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Avatar size="sm">
                  <AvatarFallback>
                    {community.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  v/{community}
                </span>
                <span>•</span>
                <span>Posted by {currentPost.author}</span>
              </div>

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

                {/* Owner Actions Dropdown */}
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 text-muted-foreground ms-auto"
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="hidden sm:inline">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditTitle(currentPost.title);
                          setEditContent(currentPost.content || "");
                          setEditError(null);
                          setIsEditing(true);
                        }}
                      >
                        <Pencil className="size-4 me-2" /> Edit Post
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        <Trash2 className="size-4 me-2" /> Delete Post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
          {/* ... existing sidebar code ... */}
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

      {/* Edit Post Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg shadow-xl">
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-card-foreground">
                  Edit Post
                </h2>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-sm"
                />
                <Textarea
                  placeholder="What's on your mind?"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-32 text-sm"
                />
              </div>

              {editError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {editError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={
                    editLoading || !editTitle.trim() || !editContent.trim()
                  }
                >
                  {editLoading ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
