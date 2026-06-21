import { useEffect, useState } from "react";
import {
  CommunityStrip,
  FeedComposer,
  FeedFilters,
  FeedPostCard,
  FeedRightRail,
} from "@/features/feed";
import { usePostsStore } from "@/store/postsStore";
import { Skeleton } from "@/components/ui/skeleton";

const SORT_MAP = {
  Best: "",
  Hot: "score",
  Rising: "date",
};

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("Best");
  const { posts, loading, error, fetchHome, hasMore, page } = usePostsStore();
  const sortBy = SORT_MAP[activeFilter];

  useEffect(() => {
    fetchHome(1, sortBy);
  }, [fetchHome, sortBy]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchHome(page + 1, sortBy);
    }
  };

  return (
    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="min-h-0 min-w-0 overflow-y-auto pe-1">
        <div className="space-y-3 pb-6">
          <CommunityStrip />
          <FeedComposer sortBy={sortBy} />
          <FeedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Post list */}
          <div className="space-y-3">
            {loading && posts.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-card p-4 shadow-none space-y-3"
                  >
                    <div className="flex gap-3">
                      <Skeleton className="size-8 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
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
      </section>

      <div className="hidden min-h-0 lg:block lg:self-start">
        <FeedRightRail />
      </div>
    </div>
  );
}
