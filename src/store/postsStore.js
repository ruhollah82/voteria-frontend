import { create } from "zustand";
import { getResponseData, postsAPI } from "../services/api";
import { normalisePost } from "@/lib/normalise";
import { getErrorMessage } from "@/lib/error";

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
      const incoming = getResponseData(data, []).map(normalisePost);
      set({
        posts: page === 1 ? incoming : [...get().posts, ...incoming],
        loading: false,
        page,
        hasMore: incoming.length > 0,
      });
    } catch (err) {
      set({
        loading: false,
        error: getErrorMessage(err, "Failed to load posts"),
      });
    }
  },

  fetchPost: async (postId) => {
    set({ currentPost: null, loading: true, error: null });
    try {
      const { data } = await postsAPI.getById(postId);
      set({
        currentPost: normalisePost(getResponseData(data, null)),
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: getErrorMessage(err, "Failed to load post"),
      });
    }
  },

  createPost: async (subId, title, content, sort_by = "") => {
    try {
      await postsAPI.create(subId, title, content);
      // Refresh first page
      await get().fetchPosts(1, sort_by);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to create post");
      return { success: false, error: msg };
    }
  },

  vote: async (postId, direction) => {
    const existing =
      get().posts.find((p) => String(p.id) === String(postId)) ??
      (String(get().currentPost?.id) === String(postId)
        ? get().currentPost
        : null);
    const prev = existing?.userVote ?? 0;
    const next = prev === direction ? 0 : direction;

    // Optimistic update
    const update = (posts, fromVote, toVote) =>
      posts.map((p) => {
        if (String(p.id) !== String(postId)) return p;
        const delta = toVote - fromVote;
        return {
          ...p,
          score: (p.score ?? p.votes ?? 0) + delta,
          votes: (p.votes ?? p.score ?? 0) + delta,
          userVote: toVote,
          _userVote: toVote,
        };
      });

    set((s) => ({ posts: update(s.posts, prev, next) }));
    if (get().currentPost && String(get().currentPost.id) === String(postId)) {
      set((s) => ({ currentPost: update([s.currentPost], prev, next)[0] }));
    }

    try {
      if (next === 0) {
        await postsAPI.deleteVote(postId);
      } else if (direction === 1) {
        await postsAPI.upvote(postId);
      } else {
        await postsAPI.downvote(postId);
      }
    } catch {
      set((s) => ({ posts: update(s.posts, next, prev) }));
      if (
        get().currentPost &&
        String(get().currentPost.id) === String(postId)
      ) {
        set((s) => ({ currentPost: update([s.currentPost], next, prev)[0] }));
      }
    }
  },
}));
