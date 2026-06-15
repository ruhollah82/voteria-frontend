import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "access_token_expires_at";
const USER_KEY = "user";

export function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeAuthSession({ accessToken, refreshToken, expiresAt, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (expiresAt) {
    localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  } else {
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(USER_KEY);
}

function shouldClearAuth(status, code) {
  return status === 401 || code === "invalid_token";
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function getAppStatus(response) {
  const status = response?.data?.status;
  return typeof status === "number" ? status : 0;
}

function buildAppError(response) {
  const payload = response?.data;
  const errors = payload?.errors;
  const message =
    errors?.non_field || payload?.msg || payload?.message || "Request failed";
  const error = new Error(message);
  error.response = response;
  return error;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// The backend wraps application status in the JSON body while returning HTTP 200.
api.interceptors.response.use(
  (res) => {
    const appStatus = getAppStatus(res);
    if (appStatus >= 400) {
      if (shouldClearAuth(appStatus, res.data?.code)) {
        clearAuthSession();
        redirectToLogin();
      }
      return Promise.reject(buildAppError(res));
    }
    return res;
  },
  (err) => {
    if (shouldClearAuth(err.response?.status, err.response?.data?.code)) {
      clearAuthSession();
      redirectToLogin();
    }
    return Promise.reject(err);
  },
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    api.post("/users/login", { username, password }),
  register: (username, password) =>
    api.post("/users/register", { username, password }),
};

// ─── Spaces (Communities) ────────────────────────────────────────────────────
export const spacesAPI = {
  getAll: (page = 1, sort_by = "") =>
    api.get("/spaces", { params: { page, sort_by } }),
  getById: (spaceId) => api.get(`/spaces/${spaceId}`),
  create: (title, description, username) =>
    api.post("/spaces", { title, description, username }),
  update: (spaceId, title, description) =>
    api.put(`/spaces/${spaceId}`, { title, description }),
  delete: (spaceId) => api.delete(`/spaces/${spaceId}`),
};

// ─── Posts ───────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: (page = 1, sort_by = "") =>
    api.get("/posts", { params: { page, sort_by } }),
  getById: (postId) => api.get(`/posts/${postId}`),
  create: (subId, title, content) =>
    api.post(`/spaces/${subId}/posts`, { title, content }),
  update: (postId, title, content) =>
    api.put(`/posts/${postId}`, { title, content }),
  delete: (postId) => api.delete(`/posts/${postId}`),
  upvote: (postId) => api.post(`/posts/${postId}/upvote`),
  downvote: (postId) => api.post(`/posts/${postId}/downvote`),
  deleteVote: (postId) => api.delete(`/posts/${postId}/votes`),
};

// ─── Comments ────────────────────────────────────────────────────────────────
export const commentsAPI = {
  // Backend returns flat list; parent_id=0 means top-level
  getAll: (postId, page = 1, sortBy = "") =>
    api.get(`/posts/${postId}/comments`, {
      params: { page, order_by: sortBy },
    }),
  getById: (commentId) => api.get(`/comments/${commentId}`),
  create: (postId, content, parent_id = 0) =>
    api.post(`/posts/${postId}/comments`, { content, parent_id }),
  update: (commentId, content) =>
    api.put(`/comments/${commentId}`, { content }),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
  upvote: (commentId) => api.post(`/comments/${commentId}/upvote`),
  downvote: (commentId) => api.post(`/comments/${commentId}/downvote`),
  deleteVote: (commentId) => api.delete(`/comments/${commentId}/votes`),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Build a nested tree from a flat comment list using parent_id */
export function buildCommentTree(flatComments) {
  const map = {};
  const roots = [];

  flatComments.map(normaliseComment).forEach((c) => {
    map[c.id] = c;
  });

  Object.values(map).forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].children.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}

export function getResponseData(payload, fallback = null) {
  return payload?.data ?? fallback;
}

export function normalisePost(post) {
  if (!post) return null;

  return {
    ...post,
    community: post.sub_name ?? post.community ?? "general",
    author: post.author ?? `u/${post.author_username ?? "unknown"}`,
    createdAt: post.createdAt ?? formatRelativeDate(post.created_at),
    votes: post.votes ?? post.score ?? 0,
    score: post.score ?? post.votes ?? 0,
    _userVote: post._userVote ?? 0,
    description: post.description ?? post.content ?? "",
    comments: post.comments ?? post.comment_count ?? 0,
    tags: post.tags ?? [],
    saved: post.saved ?? false,
  };
}

export function normaliseComment(comment) {
  if (!comment) return null;

  return {
    ...comment,
    parent_id: comment.parent_id ?? comment.parentId ?? 0,
    author: comment.author_username
      ? `u/${comment.author_username}`
      : (comment.author ?? "u/??"),
    body: comment.body ?? comment.content ?? "",
    content: comment.content ?? comment.body ?? "",
    votes: comment.votes ?? comment.score ?? 0,
    score: comment.score ?? comment.votes ?? 0,
    userVote: comment.userVote ?? comment._userVote ?? 0,
    createdAt: comment.createdAt ?? formatRelativeDate(comment.created_at),
    created_at: comment.created_at,
    edited: comment.edited ?? false,
    collapsed: comment.collapsed ?? false,
    deleted: comment.deleted ?? false,
    children: (comment.children ?? []).map(normaliseComment).filter(Boolean),
  };
}

export function formatRelativeDate(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const diff = Math.max(0, Date.now() - date.getTime());
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return value;
  }
}

export default api;
