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
import { useFeedComposer } from "../hooks/useFeedComposer";

export function FeedComposer({ sortBy = "" }) {
  const {
    token,
    user,
    open,
    setOpen,
    selectedSpaceId,
    setSelectedSpaceId,
    title,
    setTitle,
    content,
    setContent,
    loading,
    error,
    spaces,
    spacesLoading,
    handleOpen,
    handleSubmit,
  } = useFeedComposer(sortBy);

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
