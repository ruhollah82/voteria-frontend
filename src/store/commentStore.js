import { create } from "zustand";
import { commentsAPI, buildCommentTree } from "../services/api";

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
      const flat = data.data ?? [];
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
    const optimistic = {
      id: tid,
      parent_id: parentId || 0,
      author: author,
      body, // display field — mirrors existing component prop
      content: body, // backend field
      votes: 1,
      score: 1,
      userVote: 1,
      createdAt: "just now",
      created_at: "just now",
      collapsed: false,
      children: [],
    };

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
      const { data } = await commentsAPI.create(postId, body, parentId || 0);
      // Replace temp node with real data from server
      const real = normaliseComment(data.data ?? data);
      set((s) => ({
        commentsByPostId: {
          ...s.commentsByPostId,
          [postId]: replaceById(s.commentsByPostId[postId], tid, real),
        },
      }));
    } catch {
      // Keep optimistic on error — user sees their comment
    }
  },

  // ── Vote ───────────────────────────────────────────────────────────────────
  vote: (postId, commentId, dir) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => {
          const prev = c.userVote ?? 0;
          const next = prev === dir ? 0 : dir;
          return {
            ...c,
            userVote: next,
            votes: (c.votes ?? c.score ?? 0) - prev + next,
          };
        }),
      },
    }));

    // Fire & forget API call
    const node = findById(get().commentsByPostId[postId] ?? [], commentId);
    const prev = node?.userVote ?? 0;
    const next = prev === dir ? 0 : dir;

    if (next === 0) {
      commentsAPI.deleteVote(commentId).catch(() => {});
    } else if (next === 1) {
      commentsAPI.upvote(commentId).catch(() => {});
    } else {
      commentsAPI.downvote(commentId).catch(() => {});
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

function normaliseComment(raw) {
  return {
    id: raw.id,
    parent_id: raw.parent_id ?? 0,
    author: raw.author_username
      ? `u/${raw.author_username}`
      : (raw.author ?? "u/??"),
    body: raw.content ?? raw.body ?? "",
    content: raw.content ?? raw.body ?? "",
    votes: raw.score ?? raw.votes ?? 0,
    score: raw.score ?? raw.votes ?? 0,
    userVote: 0,
    createdAt: raw.created_at ?? raw.createdAt ?? "just now",
    created_at: raw.created_at ?? "just now",
    edited: false,
    collapsed: false,
    deleted: false,
    children: [],
  };
}

function insertReply(list, parentId, node) {
  if (!parentId) return [...list, node];
  return list.map((c) =>
    String(c.id) === String(parentId)
      ? { ...c, children: [...(c.children ?? []), node] }
      : { ...c, children: insertReply(c.children ?? [], parentId, node) },
  );
}

function updateById(list, id, fn) {
  return list.map((c) =>
    String(c.id) === String(id)
      ? fn(c)
      : { ...c, children: updateById(c.children ?? [], id, fn) },
  );
}

function replaceById(list, oldId, next) {
  return list.map((c) =>
    String(c.id) === String(oldId)
      ? { ...next, children: c.children ?? [] }
      : { ...c, children: replaceById(c.children ?? [], oldId, next) },
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
