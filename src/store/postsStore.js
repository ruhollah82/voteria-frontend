import { create } from "zustand";
import { postsAPI } from "../services/api";

export const usePostsStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchPosts: async (page = 1, sort_by = "") => {
    set({ loading: true, error: null });
    try {
      const { data } = await postsAPI.getAll(page, sort_by);
      const incoming = data.data ?? [];
      set({
        posts: page === 1 ? incoming : [...get().posts, ...incoming],
        loading: false,
        page,
        hasMore: incoming.length === 20, // backend page limit
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  fetchPost: async (postId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await postsAPI.getById(postId);
      set({ currentPost: data.data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  createPost: async (subId, title, content) => {
    try {
      await postsAPI.create(subId, title, content);
      // Refresh first page
      get().fetchPosts(1);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.errors?.non_field ||
        err.response?.data?.errors?.title ||
        "Failed to create post";
      return { success: false, error: msg };
    }
  },

  vote: async (postId, direction) => {
    // Optimistic update
    const update = (posts) =>
      posts.map((p) => {
        if (String(p.id) !== String(postId)) return p;
        const prev = p._userVote ?? 0;
        const next = prev === direction ? 0 : direction;
        return {
          ...p,
          score: p.score - prev + next,
          _userVote: next,
        };
      });

    set((s) => ({ posts: update(s.posts) }));
    if (get().currentPost && String(get().currentPost.id) === String(postId)) {
      set((s) => ({ currentPost: update([s.currentPost])[0] }));
    }

    try {
      const prev =
        get().posts.find((p) => String(p.id) === String(postId))?._userVote ??
        0;
      if (prev === direction) {
        await postsAPI.deleteVote(postId);
      } else if (direction === 1) {
        await postsAPI.upvote(postId);
      } else {
        await postsAPI.downvote(postId);
      }
    } catch {
      // Revert on failure — refetch
      get().fetchPosts(get().page);
    }
  },
}));
