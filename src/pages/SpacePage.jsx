// src/pages/SpacePage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { FeedFilters, FeedPostCard } from "@/features/feed";
import { usePostsStore } from "@/store/postsStore";
import { useSpacesStore } from "@/store/spacesStore";

const SORT_MAP = {
  Best: "",
  Hot: "score",
  Rising: "date",
};

export default function SpacePage() {
  const { spaceId } = useParams();
  const [activeFilter, setActiveFilter] = useState("Best");
  const { posts, loading, error, fetchSpacePosts, hasMore, page } =
    usePostsStore();
  const { subscribedSpaces, spaces } = useSpacesStore();

  const sortBy = SORT_MAP[activeFilter];

  // Find the space details from either subscribed or all spaces
  const allSpaces = [...subscribedSpaces, ...spaces];
  const space = allSpaces.find((s) => String(s.id) === String(spaceId));

  useEffect(() => {
    fetchSpacePosts(spaceId, 1, sortBy);
  }, [fetchSpacePosts, spaceId, sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchSpacePosts(spaceId, page + 1, sortBy);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" asChild className="-mb-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Back to Feed
        </Link>
      </Button>

      {/* Space Header */}
      {space && (
        <Card className="p-4 shadow-none">
          <h1 className="text-xl font-bold text-foreground">v/{space.title}</h1>
          {space.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {space.description}
            </p>
          )}
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
    </div>
  );
}
