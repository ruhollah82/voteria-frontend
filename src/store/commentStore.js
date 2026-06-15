import { create } from "zustand";
import {
  buildCommentTree,
  commentsAPI,
  getResponseData,
  normaliseComment,
} from "../services/api";

let _nextId = 9000;
const tempId = () => `temp-${_nextId++}`;

export const useCommentStore = create((set, get) => ({
  commentsByPostId: {}, // { [postId]: Comment[] (nested tree) }
  loadingPostId: null,
  error: null,

  // ── Fetch ──────────────────────────────────────────────────────────────────
  fetchComments: async (postId) => {
    // Don't re-fetch if already loaded
    if (get().commentsByPostId[postId]) return;

    set({ loadingPostId: postId, error: null });
    try {
      const { data } = await commentsAPI.getAll(postId, 1);
      const flat = getResponseData(data, []);
      const tree = buildCommentTree(flat);
      set((s) => ({
        commentsByPostId: { ...s.commentsByPostId, [postId]: tree },
        loadingPostId: null,
      }));
    } catch (err) {
      set({ loadingPostId: null, error: err.message });
    }
  },

  // ── Add Reply ──────────────────────────────────────────────────────────────
  addReply: async (postId, parentId, body, author = "u/you") => {
    const tid = tempId();
    const optimistic = normaliseComment({
      id: tid,
      parent_id: parentId || 0,
      author: author,
      body,
      content: body,
      votes: 1,
      score: 1,
      userVote: 1,
      createdAt: "just now",
      created_at: "just now",
    });

    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: insertReply(
          s.commentsByPostId[postId] ?? [],
          parentId,
          optimistic,
        ),
      },
    }));

    try {
      await commentsAPI.create(postId, body, parentId || 0);
      await get().refreshComments(postId);
      return { success: true };
    } catch (err) {
      set((s) => ({
        commentsByPostId: {
          ...s.commentsByPostId,
          [postId]: removeById(s.commentsByPostId[postId] ?? [], tid),
        },
        error: getErrorMessage(err, "Failed to add comment"),
      }));
      return {
        success: false,
        error: getErrorMessage(err, "Failed to add comment"),
      };
    }
  },

  // ── Vote ───────────────────────────────────────────────────────────────────
  vote: (postId, commentId, dir) => {
    const node = findById(get().commentsByPostId[postId] ?? [], commentId);
    const prev = node?.userVote ?? 0;
    const next = prev === dir ? 0 : dir;

    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => {
          return {
            ...c,
            userVote: next,
            votes: (c.votes ?? c.score ?? 0) - prev + next,
            score: (c.score ?? c.votes ?? 0) - prev + next,
          };
        }),
      },
    }));

    const rollback = () => {
      set((s) => ({
        commentsByPostId: {
          ...s.commentsByPostId,
          [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
            ...c,
            userVote: prev,
            votes: (c.votes ?? c.score ?? 0) - next + prev,
            score: (c.score ?? c.votes ?? 0) - next + prev,
          })),
        },
      }));
    };

    if (next === 0) {
      commentsAPI.deleteVote(commentId).catch(rollback);
    } else if (next === 1) {
      commentsAPI.upvote(commentId).catch(rollback);
    } else {
      commentsAPI.downvote(commentId).catch(rollback);
    }
  },

  // ── Collapse ───────────────────────────────────────────────────────────────
  toggleCollapse: (postId, commentId) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
          ...c,
          collapsed: !c.collapsed,
        })),
      },
    }));
  },

  // ── Edit ───────────────────────────────────────────────────────────────────
  editComment: async (postId, commentId, body) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
          ...c,
          body,
          content: body,
          edited: true,
        })),
      },
    }));
    try {
      await commentsAPI.update(commentId, body);
    } catch {
      // keep optimistic
    }
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  deleteComment: async (postId, commentId) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
          ...c,
          body: "[deleted]",
          content: "[deleted]",
          author: "[deleted]",
          author_username: "[deleted]",
          deleted: true,
        })),
      },
    }));
    try {
      await commentsAPI.delete(commentId);
    } catch {
      // Keep optimistic delete in place.
    }
  },

  // ── Force refresh ──────────────────────────────────────────────────────────
  refreshComments: async (postId) => {
    set((s) => {
      const next = { ...s.commentsByPostId };
      delete next[postId];
      return { commentsByPostId: next };
    });
    await get().fetchComments(postId);
  },
}));

// ─── Tree Helpers ──────────────────────────────────────────────────────────────

function insertReply(list, parentId, node) {
  if (!parentId) return [...list, node];
  return list.map((c) =>
    String(c.id) === String(parentId)
      ? { ...c, children: [...(c.children ?? []), node] }
      : { ...c, children: insertReply(c.children ?? [], parentId, node) },
  );
}

function updateById(list, id, fn) {
  if (!Array.isArray(list)) return [];
  return list.map((c) =>
    String(c.id) === String(id)
      ? fn(c)
      : { ...c, children: updateById(c.children ?? [], id, fn) },
  );
}

function removeById(list, id) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((c) => String(c.id) !== String(id))
    .map((c) => ({ ...c, children: removeById(c.children ?? [], id) }));
}

function getErrorMessage(err, fallback) {
  const errors = err.response?.data?.errors;
  return (
    errors?.non_field ||
    errors?.content ||
    Object.values(errors ?? {})
      .filter(Boolean)
      .join(", ") ||
    err.message ||
    fallback
  );
}

function findById(list, id) {
  for (const c of list) {
    if (String(c.id) === String(id)) return c;
    const found = findById(c.children ?? [], id);
    if (found) return found;
  }
  return null;
}
