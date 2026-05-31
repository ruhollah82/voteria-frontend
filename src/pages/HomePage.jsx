import { useState } from "react";
import {
  CommunityStrip,
  FeedComposer,
  FeedFilters,
  FeedPostCard,
  FeedRightRail,
} from "@/features/feed";
import { posts } from "@/lib/voteria-data";

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("Best");

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="min-w-0 space-y-3">
        <CommunityStrip />
        <FeedComposer />
        <FeedFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <div className="space-y-3">
          {posts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
      <div className="hidden lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:block lg:self-start">
        <FeedRightRail />
      </div>
    </div>
  );
};

export default HomePage;
