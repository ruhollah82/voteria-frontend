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
  const { posts, loading, error, fetchPosts, hasMore, page } = usePostsStore();

  useEffect(() => {
    fetchPosts(1, SORT_MAP[activeFilter]);
  }, [activeFilter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, SORT_MAP[activeFilter]);
    }
  };

  return (
    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="min-h-0 min-w-0 overflow-y-auto pe-1">
        <div className="space-y-3 pb-6">
          <CommunityStrip />
          <FeedComposer />
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
              : posts.map((post) => (
                  <FeedPostCard
                    key={`${post.id}-${post.created_at}`}
                    post={normalisePost(post)}
                  />
                ))}
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

/**
 * Map backend PostOutput → shape that FeedPostCard expects
 * (backend uses snake_case + different field names)
 */
function normalisePost(p) {
  return {
    id: p.id,
    community: p.sub_name ?? "general",
    author: `u/${p.author_username ?? "unknown"}`,
    createdAt: formatDate(p.created_at),
    votes: p.score ?? 0,
    _userVote: p._userVote ?? 0,
    title: p.title,
    description: p.content ?? "",
    tags: p.tags ?? [],
    comments: p.comment_count ?? 0,
    saved: false,
  };
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return iso;
  }
}
