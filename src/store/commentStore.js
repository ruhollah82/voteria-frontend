import { create } from "zustand";
import axios from "axios";

let _nextId = 1000;
const tempId = () => `temp-${_nextId++}`;

export const useCommentStore = create((set, get) => ({
  commentsByPostId: {},
  loadingPostId: null,
  error: null,

  fetchComments: async (postId) => {
    set({ loadingPostId: postId, error: null });
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      set((s) => ({
        commentsByPostId: { ...s.commentsByPostId, [postId]: data },
        loadingPostId: null,
      }));
    } catch {
      set((s) => ({
        commentsByPostId: {
          ...s.commentsByPostId,
          [postId]: seedComments(postId),
        },
        loadingPostId: null,
        error: null,
      }));
    }
  },

  addReply: async (postId, parentId, body, author = "u/you") => {
    const tid = tempId();
    const optimistic = {
      id: tid,
      parentId,
      author,
      body,
      votes: 1,
      userVote: 1,
      createdAt: "just now",
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
      const { data } = await axios.post(`/api/posts/${postId}/comments`, {
        parentId,
        body,
      });
      set((s) => ({
        commentsByPostId: {
          ...s.commentsByPostId,
          [postId]: replaceById(s.commentsByPostId[postId], tid, data),
        },
      }));
    } catch {
      // keep optimistic
    }
  },

  vote: (postId, commentId, dir) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => {
          const prev = c.userVote ?? 0;
          const next = prev === dir ? 0 : dir;
          return { ...c, userVote: next, votes: c.votes - prev + next };
        }),
      },
    }));
  },

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

  editComment: async (postId, commentId, body) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
          ...c,
          body,
          edited: true,
        })),
      },
    }));
    try {
      await axios.patch(`/api/posts/${postId}/comments/${commentId}`, { body });
    } catch {
      // keep optimistic
    }
  },

  deleteComment: async (postId, commentId) => {
    set((s) => ({
      commentsByPostId: {
        ...s.commentsByPostId,
        [postId]: updateById(s.commentsByPostId[postId], commentId, (c) => ({
          ...c,
          body: "[deleted]",
          author: "[deleted]",
          deleted: true,
        })),
      },
    }));
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`);
    } catch {}
  },
}));

// ── tree helpers ────────────────────────────────────────────────────────────

function insertReply(list, parentId, node) {
  if (parentId === null) return [...list, node];
  return list.map((c) =>
    c.id === parentId
      ? { ...c, children: [...(c.children ?? []), node] }
      : { ...c, children: insertReply(c.children ?? [], parentId, node) },
  );
}

function updateById(list, id, fn) {
  return list.map((c) =>
    c.id === id
      ? fn(c)
      : { ...c, children: updateById(c.children ?? [], id, fn) },
  );
}

function replaceById(list, oldId, next) {
  return list.map((c) =>
    c.id === oldId
      ? next
      : { ...c, children: replaceById(c.children ?? [], oldId, next) },
  );
}

// ── seed data ───────────────────────────────────────────────────────────────

function seedComments(postId) {
  if (postId === "4") {
    return [
      {
        id: "4-1",
        parentId: null,
        author: "u/cssmaster",
        body: "The recursive CommentItem approach is clean. Did you hit any performance issues with very deep trees?",
        votes: 87,
        userVote: 0,
        createdAt: "55m ago",
        collapsed: false,
        children: [
          {
            id: "4-1-1",
            parentId: "4-1",
            author: "u/pixelstack",
            body: "Not yet — trees rarely exceed 6 levels in practice. We cap depth at MAX_DEPTH and flatten beyond that. React handles the recursion fine at this scale.",
            votes: 42,
            userVote: 0,
            createdAt: "50m ago",
            collapsed: false,
            children: [
              {
                id: "4-1-1-1",
                parentId: "4-1-1",
                author: "u/cssmaster",
                body: "Makes sense. What does flattening look like — do you render a 'continue thread' link?",
                votes: 19,
                userVote: 0,
                createdAt: "45m ago",
                collapsed: false,
                children: [
                  {
                    id: "4-1-1-1-1",
                    parentId: "4-1-1-1",
                    author: "u/pixelstack",
                    body: "Exactly — at MAX_DEPTH we render a button that navigates to a permalink showing just that subtree as the root. Haven't shipped it yet but the routing is already wired.",
                    votes: 11,
                    userVote: 0,
                    createdAt: "40m ago",
                    collapsed: false,
                    children: [
                      {
                        id: "4-1-1-1-1-1",
                        parentId: "4-1-1-1-1",
                        author: "u/webwizard",
                        body: "Reddit does the same thing. Good call copying the pattern — users already know it.",
                        votes: 7,
                        userVote: 0,
                        createdAt: "35m ago",
                        collapsed: false,
                        children: [
                          {
                            id: "4-1-1-1-1-1-1",
                            parentId: "4-1-1-1-1-1",
                            author: "u/lurker99",
                            body: "This is level 7 deep. Getting philosophical in here.",
                            votes: 3,
                            userVote: 0,
                            createdAt: "30m ago",
                            collapsed: false,
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "4-1-2",
            parentId: "4-1",
            author: "u/designlover",
            body: "The collapsing thread line is a great touch. Clicking the vertical bar feels very natural.",
            votes: 28,
            userVote: 0,
            createdAt: "48m ago",
            collapsed: false,
            children: [
              {
                id: "4-1-2-1",
                parentId: "4-1-2",
                author: "u/modteam",
                body: "We stole that from old Reddit. Still the best UX for dense threads.",
                votes: 15,
                userVote: 0,
                createdAt: "44m ago",
                collapsed: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "4-2",
        parentId: null,
        author: "u/webwizard",
        body: "How does optimistic voting work when two tabs are open? Do you sync via websockets or just let them diverge?",
        votes: 54,
        userVote: 0,
        createdAt: "52m ago",
        collapsed: false,
        children: [
          {
            id: "4-2-1",
            parentId: "4-2",
            author: "u/pixelstack",
            body: "They diverge for now — last write wins on the server. A websocket broadcast is on the roadmap but not worth the complexity at current scale.",
            votes: 31,
            userVote: 0,
            createdAt: "47m ago",
            collapsed: false,
            children: [
              {
                id: "4-2-1-1",
                parentId: "4-2-1",
                author: "u/webwizard",
                body: "Fair enough. Premature optimisation and all that.",
                votes: 12,
                userVote: 0,
                createdAt: "43m ago",
                collapsed: false,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "4-3",
        parentId: null,
        author: "u/voterian",
        body: "Love the write-up. One question — why Zustand over Jotai for this? Both seem like a good fit.",
        votes: 38,
        userVote: 1,
        createdAt: "49m ago",
        collapsed: false,
        children: [
          {
            id: "4-3-1",
            parentId: "4-3",
            author: "u/pixelstack",
            body: "Mostly familiarity. Zustand's flat store + immer-style updates maps well to tree mutations. Jotai's atom model would work too but the recursive update helpers felt more natural as plain functions.",
            votes: 22,
            userVote: 0,
            createdAt: "44m ago",
            collapsed: false,
            children: [],
          },
        ],
      },
      {
        id: "4-4",
        parentId: null,
        author: "u/lurker99",
        body: "Can I upvote my own comments?",
        votes: -4,
        userVote: -1,
        createdAt: "30m ago",
        collapsed: true,
        children: [
          {
            id: "4-4-1",
            parentId: "4-4",
            author: "u/modteam",
            body: "No. And please don't try.",
            votes: 41,
            userVote: 0,
            createdAt: "28m ago",
            collapsed: false,
            children: [],
          },
        ],
      },
    ];
  }

  // generic fallback for other posts
  return [
    {
      id: `${postId}-1`,
      parentId: null,
      author: "u/pixelstack",
      body: "Great post! The layout feels very snappy on mobile.",
      votes: 142,
      userVote: 0,
      createdAt: "3h ago",
      collapsed: false,
      children: [
        {
          id: `${postId}-1-1`,
          parentId: `${postId}-1`,
          author: "u/cssmaster",
          body: "Agreed. The container query approach really pays off here.",
          votes: 57,
          userVote: 0,
          createdAt: "2h ago",
          collapsed: false,
          children: [
            {
              id: `${postId}-1-1-1`,
              parentId: `${postId}-1-1`,
              author: "u/modteam",
              body: "We'll be writing a deep-dive on that soon — stay tuned.",
              votes: 23,
              userVote: 0,
              createdAt: "1h ago",
              collapsed: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: `${postId}-2`,
      parentId: null,
      author: "u/designlover",
      body: "The color palette is clean. Which token system are you using?",
      votes: 89,
      userVote: 0,
      createdAt: "5h ago",
      collapsed: false,
      children: [],
    },
  ];
}
