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
    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="min-h-0 min-w-0 overflow-y-auto pe-1">
        <div className="space-y-3 pb-6">
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
        </div>
      </section>
      <div className="hidden min-h-0 lg:block lg:self-start">
        <FeedRightRail />
      </div>
    </div>
  );
};

export default HomePage;
