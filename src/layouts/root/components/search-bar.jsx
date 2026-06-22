// src/layouts/root/components/search-bar.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useSpacesStore } from "@/store/spacesStore";
import { usePostsStore } from "@/store/postsStore";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ spaces: [], posts: [] });
  const containerRef = useRef(null);

  const { spaces, fetchSpaces } = useSpacesStore();
  const { posts, fetchPosts } = usePostsStore();
  const navigate = useNavigate();

  // Fetch initial data when search is opened
  useEffect(() => {
    if (isOpen) {
      if (spaces.length === 0) fetchSpaces(1);
      if (posts.length === 0) fetchPosts(1);
    }
  }, [isOpen, spaces.length, posts.length, fetchSpaces, fetchPosts]);

  // Filter data with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ spaces: [], posts: [] });
      return;
    }
    const timer = setTimeout(() => {
      const q = query.toLowerCase();

      const spaceResults = spaces
        .filter(
          (s) =>
            s.title?.toLowerCase().includes(q) ||
            s.username?.toLowerCase().includes(q),
        )
        .slice(0, 5);

      const postResults = posts
        .filter(
          (p) =>
            p.title?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q), // searches content but doesn't show it
        )
        .slice(0, 5);

      setResults({ spaces: spaceResults, posts: postResults });
    }, 300);

    return () => clearTimeout(timer);
  }, [query, spaces, posts]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type, item) => {
    setIsOpen(false);
    setQuery("");
    if (type === "space") navigate(`/space/${item.id}`);
    if (type === "post") navigate(`/post/${item.id}`);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Search Voteria"
          className="h-9 bg-muted/60 ps-8"
          placeholder="Search Voteria"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen &&
        (query.trim() ||
          results.spaces.length > 0 ||
          results.posts.length > 0) && (
          <div className="absolute top-full mt-2 w-full rounded-lg border border-border bg-popover p-2 shadow-lg z-50 max-h-96 overflow-y-auto">
            {results.spaces.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                  Spaces
                </p>
                {results.spaces.map((space) => (
                  <button
                    key={space.id}
                    className="w-full flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent text-start"
                    onClick={() => handleSelect("space", space)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        v/{space.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        u/{space.username}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ms-2 shrink-0">
                      {space.subscribersCount?.toLocaleString() || 0} members
                    </span>
                  </button>
                ))}
              </div>
            )}

            {results.posts.length > 0 && (
              <div>
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
                  Posts
                </p>
                {results.posts.map((post) => (
                  <button
                    key={post.id}
                    className="w-full flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent text-start"
                    onClick={() => handleSelect("post", post)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {post.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground ms-2 shrink-0">
                      {post.comments} comments
                    </span>
                  </button>
                ))}
              </div>
            )}

            {query.trim() &&
              results.spaces.length === 0 &&
              results.posts.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No results found
                </p>
              )}
          </div>
        )}
    </div>
  );
}
