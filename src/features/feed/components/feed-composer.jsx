import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image, Link2, Plus, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { usePostsStore } from "@/store/postsStore";
import { useSpacesStore } from "@/store/spacesStore";

export function FeedComposer({ sortBy = "" }) {
  const { token, user } = useAuthStore();
  const { createPost } = usePostsStore();
  const {
    spaces,
    fetchSpaces,
    loading: spacesLoading,
    error: spacesError,
  } = useSpacesStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || spaces.length > 0 || spacesLoading) return;

    let cancelled = false;

    async function loadSpaces() {
      setError(null);
      try {
        await fetchSpaces(1);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load spaces"));
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, [open, spaces.length, spacesLoading, fetchSpaces]);

  useEffect(() => {
    if (!selectedSpaceId && spaces.length > 0) {
      setSelectedSpaceId(String(spaces[0].id));
    }
    if (spaces.length === 0 && open) {
      setError("Create a space first, then you can post to it.");
    }
  }, [spaces, selectedSpaceId, open]);

  useEffect(() => {
    if (spacesError) {
      setError(spacesError);
    }
  }, [spacesError]);

  const handleOpen = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    if (!selectedSpaceId) {
      setError("Choose a space before posting.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await createPost(
      selectedSpaceId,
      title.trim(),
      content.trim(),
      sortBy,
    );
    setLoading(false);
    if (result.success) {
      setOpen(false);
      setTitle("");
      setContent("");
    } else {
      setError(result.error ?? "Something went wrong");
    }
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "VT";

  return (
    <>
      {/* Trigger card */}
      <Card className="border-dashed bg-card/80 p-2.5 shadow-none">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <button
            onClick={handleOpen}
            className="h-9 min-w-0 flex-1 rounded-lg border border-input bg-muted/50 px-3 text-start text-sm text-muted-foreground hover:bg-muted transition-colors"
          >
            Create a post
          </button>
          <Button size="icon-sm" variant="ghost" aria-label="Attach media">
            <Image className="size-4" />
          </Button>
          <Button
            className="hidden sm:inline-flex"
            size="icon-sm"
            variant="ghost"
            aria-label="Add link"
          >
            <Link2 className="size-4" />
          </Button>
          <Button size="icon-sm" aria-label="Create post" onClick={handleOpen}>
            <Plus className="size-4" />
          </Button>
        </div>
      </Card>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-lg shadow-xl">
            <div className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-card-foreground">
                  Create Post
                </h2>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                <Select
                  value={selectedSpaceId}
                  onValueChange={setSelectedSpaceId}
                  disabled={spacesLoading || spaces.length === 0}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue
                      placeholder={
                        spacesLoading ? "Loading spaces..." : "Choose a space"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={String(space.id)}>
                        v/{space.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm"
                />
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-28 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey))
                      handleSubmit();
                  }}
                />
              </div>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  ⌘↵ to post
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={
                      loading ||
                      spacesLoading ||
                      !selectedSpaceId ||
                      !title.trim() ||
                      !content.trim()
                    }
                  >
                    {loading ? "Posting…" : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

function normaliseSpace(space) {
  return {
    id: space.id ?? space.ID,
    title: space.title ?? space.Title ?? "space",
    description: space.description ?? space.Description ?? "",
  };
}

function getErrorMessage(err, fallback) {
  const errors = err.response?.data?.errors;
  return (
    errors?.non_field ||
    Object.values(errors ?? {})
      .filter(Boolean)
      .join(", ") ||
    err.message ||
    fallback
  );
}
