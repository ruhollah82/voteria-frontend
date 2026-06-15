import { create } from "zustand";
import {
  authAPI,
  clearAuthSession,
  getStoredAccessToken,
  storeAuthSession,
} from "../services/api";

const USER_KEY = "user";
const ACCESS_TOKEN_EXPIRES_AT_KEY = "access_token_expires_at";

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getErrorMessage(err, fallback) {
  const response = err.response?.data || err.data;
  const errors = response?.errors;
  const message = response?.msg || response?.message;

  if (errors) {
    return (
      errors.non_field ||
      errors.username ||
      errors.password ||
      Object.values(errors).filter(Boolean).join(", ") ||
      message ||
      fallback
    );
  }

  return message || fallback;
}

function buildSessionFromResponse(response, fallbackUsername) {
  const payload = response?.data ?? response;
  const body = payload?.tokens ?? payload?.data?.tokens ?? payload;
  const accessToken =
    body?.access ??
    body?.access_token ??
    payload?.access_token ??
    payload?.data?.access_token;
  const refreshToken =
    body?.refresh ?? body?.refresh_token ?? payload?.refresh_token ?? null;

  if (!accessToken) {
    throw new Error(
      "Authentication succeeded but no access token was returned",
    );
  }

  const decoded = decodeJwtPayload(accessToken) ?? {};
  const accessExpireSeconds = Number(
    body?.accessExpireSeconds ??
      body?.access_expire_seconds ??
      payload?.accessExpireSeconds ??
      payload?.access_expire_seconds,
  );
  const expiresAt = decoded.exp
    ? decoded.exp * 1000
    : accessExpireSeconds
      ? Date.now() + accessExpireSeconds * 1000
      : null;
  const user = {
    id: decoded.userId ?? decoded.id ?? null,
    username: decoded.username ?? fallbackUsername,
  };

  storeAuthSession({ accessToken, refreshToken, expiresAt, user });

  return { token: accessToken, refreshToken, expiresAt, user };
}

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  token: getStoredAccessToken(),
  expiresAt: Number(localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY)) || null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(username, password);
      const { token, expiresAt, user } = buildSessionFromResponse(
        data,
        username,
      );
      set({ token, expiresAt, user, loading: false, error: null });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, err.message || "Login failed");
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(username, password);
      const { token, expiresAt, user } = buildSessionFromResponse(
        data,
        username,
      );
      set({ token, expiresAt, user, loading: false, error: null });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, err.message || "Registration failed");
      set({ loading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  clearError: () => set({ error: null }),

  logout: () => {
    clearAuthSession();
    set({ token: null, user: null, expiresAt: null, error: null });
  },
}));
