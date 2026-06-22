// src/pages/SpacePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  FileText,
  MessageSquare,
  Check,
  Orbit,
} from "lucide-react";
import { FeedFilters, FeedPostCard } from "@/features/feed";
import { usePostsStore } from "@/store/postsStore";
import { useSpacesStore } from "@/store/spacesStore";
import { useAuthStore } from "@/store/authStore";

const SORT_MAP = {
  Best: "",
  Hot: "score",
  Rising: "date",
};

export default function SpacePage() {
  const { spaceId } = useParams();
  const [activeFilter, setActiveFilter] = useState("Best");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [postsCount, setPostsCount] = useState(0);

  const { posts, loading, error, fetchSpacePosts, hasMore, page } =
    usePostsStore();
  const { subscribedSpaces, spaces, subscribeToSpace, unsubscribeFromSpace } =
    useSpacesStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const sortBy = SORT_MAP[activeFilter];

  // Find the space details from either subscribed or all spaces
  const allSpaces = [...subscribedSpaces, ...spaces];
  const space = allSpaces.find((s) => String(s.id) === String(spaceId));

  // Check if user is subscribed
  useEffect(() => {
    if (space) {
      const subscribed = subscribedSpaces.some(
        (s) => String(s.id) === String(spaceId),
      );
      setIsSubscribed(subscribed);
    }
  }, [space, spaceId, subscribedSpaces]);

  // Count total posts for this space
  useEffect(() => {
    if (posts.length > 0) {
      setPostsCount(posts.length);
    }
  }, [posts]);

  useEffect(() => {
    fetchSpacePosts(spaceId, 1, sortBy);
  }, [fetchSpacePosts, spaceId, sortBy]);

  const handleJoin = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (isSubscribed) {
      await unsubscribeFromSpace(spaceId);
      setIsSubscribed(false);
    } else {
      await subscribeToSpace(spaceId);
      setIsSubscribed(true);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchSpacePosts(spaceId, page + 1, sortBy);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-mb-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to Feed
        </Link>
      </Button>

      {/* Space Header Card */}
      {space ? (
        <Card className="overflow-hidden shadow-none">
          {/* Banner */}
          <div className="h-24 sm:h-32 bg-gradient-to-br from-primary/20 via-secondary/10 to-background relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          <div className="px-4 sm:px-6 pb-6">
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-8 sm:-mt-12 mb-4">
              {/* Avatar & Title */}
              <div className="flex items-end gap-4">
                <Avatar className="size-16 sm:size-20 border-4 border-card bg-muted shadow-md">
                  <AvatarFallback className="text-xl sm:text-2xl font-bold text-foreground bg-gradient-to-br from-primary/20 to-secondary/20">
                    {space.title?.slice(0, 2).toUpperCase() || "V"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    v/{space.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    u/{space.username}
                  </p>
                </div>
              </div>

              {/* Join Button */}
              <Button
                onClick={handleJoin}
                disabled={!token}
                variant={isSubscribed ? "secondary" : "default"}
                size="lg"
                className="sm:w-auto w-full"
              >
                {isSubscribed ? (
                  <>
                    <Check className="size-4 mr-2" />
                    Joined
                  </>
                ) : (
                  <>
                    <Orbit className="size-4 mr-2" />
                    Join Community
                  </>
                )}
              </Button>
            </div>

            {/* Description */}
            {space.description && (
              <p className="text-sm sm:text-base text-foreground mb-4 max-w-3xl">
                {space.description}
              </p>
            )}

            <Separator className="my-4" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {space.subscribersCount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {postsCount > 0 ? postsCount.toLocaleString() : "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {space.views?.toLocaleString() || "0"}
                  </p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 shadow-none">
          <Skeleton className="h-24 w-full mb-4" />
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
      )}

      <FeedFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Posts List */}
      <div className="space-y-3">
        {loading && posts.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card p-4 space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))
          : posts.map((post) => <FeedPostCard key={post.id} post={post} />)}
      </div>

      {error && (
        <p className="text-center text-sm text-destructive py-4">{error}</p>
      )}

      {hasMore && !loading && posts.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="w-full rounded-lg border border-border bg-card py-2.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          Load more
        </button>
      )}

      {loading && posts.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-2">
          Loading…
        </p>
      )}

      {!loading && posts.length === 0 && (
        <Card className="p-8 text-center">
          <FileText className="size-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No posts yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Be the first to post in v/{space?.title}!
          </p>
        </Card>
      )}
    </div>
  );
}
