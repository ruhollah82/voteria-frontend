import { create } from "zustand";
import { getResponseData, spacesAPI } from "../services/api";
import { getErrorMessage } from "@/lib/error";

function slugify(input) {
  if (!input) return "";
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

function normaliseSpace(space) {
  return {
    ...space,
    id: space.ID,
    username: space.Username,
    title: space.Title,
    description: space.Description,
    subscribersCount: space.SubscribersCount,
    views: space.Views,
  };
}

export const useSpacesStore = create((set, get) => ({
  spaces: [],
  subscribedSpaces: [],
  loading: false,
  subscriptionsLoading: false,
  error: null,
  subscriptionsError: null,
  page: 1,
  hasMore: true,
  subscribeLoading: false,
  currentSpace: null, // ✅ Add this

  fetchSpaces: async (page = 1, sort_by = "") => {
    set({ loading: true, error: null });
    try {
      const { data } = await spacesAPI.getAll(page, sort_by);
      const incoming = getResponseData(data, []).map(normaliseSpace);
      set({
        spaces: page === 1 ? incoming : [...get().spaces, ...incoming],
        loading: false,
        page,
        hasMore: incoming.length > 0,
      });
    } catch (err) {
      set({
        loading: false,
        error: getErrorMessage(err, "Failed to load spaces"),
      });
    }
  },
  fetchSpace: async (spaceId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await spacesAPI.getById(spaceId);
      const space = normaliseSpace(getResponseData(data, null));
      set({ currentSpace: space, loading: false });
      return space;
    } catch (err) {
      set({
        loading: false,
        error: getErrorMessage(err, "Failed to load space"),
      });
      return null;
    }
  },

  fetchSubscriptions: async () => {
    set({ subscriptionsLoading: true, subscriptionsError: null });
    try {
      const { data } = await spacesAPI.getSubscriptions();
      const incoming = getResponseData(data, []).map(normaliseSpace);
      set({ subscribedSpaces: incoming, subscriptionsLoading: false });
    } catch (err) {
      set({
        subscriptionsLoading: false,
        subscriptionsError: getErrorMessage(
          err,
          "Failed to load subscriptions",
        ),
      });
    }
  },

  subscribeToSpace: async (spaceId) => {
    set({ subscribeLoading: true, error: null });
    try {
      await spacesAPI.subscribe(spaceId);
      await get().fetchSubscriptions();
      await get().fetchSpaces(1);
      set({ subscribeLoading: false });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to subscribe to space");
      set({ subscribeLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },
  unsubscribeFromSpace: async (spaceId) => {
    set({ subscribeLoading: true, error: null });
    try {
      await spacesAPI.unsubscribe(spaceId);
      await get().fetchSubscriptions();
      await get().fetchSpaces(1);
      set({ subscribeLoading: false });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to unsubscribe from space");
      set({ subscribeLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  // src/store/spacesStore.js

  createSpace: async (title, description, username) => {
    set({ createLoading: true, createError: null });
    try {
      // Use provided username or fallback to slugified title
      const finalUsername = username || slugify(title);

      // 1. Create the space
      const { data } = await spacesAPI.create(
        title,
        description,
        finalUsername,
      );

      // Extract the ID from the response (handles various backend shapes)
      const payload = data?.data ?? data;
      const newSpaceId =
        payload?.ID ?? payload?.id ?? payload?.data?.ID ?? payload?.data?.id;

      // 2. Automatically subscribe to the newly created space
      if (newSpaceId) {
        try {
          await spacesAPI.subscribe(newSpaceId);
        } catch (subErr) {
          // If subscription fails, we log it but don't block the creation success
          console.warn("Space created, but auto-subscription failed:", subErr);
        }
      }

      // 3. Refresh both spaces and subscriptions so the UI updates immediately
      await Promise.all([get().fetchSpaces(1), get().fetchSubscriptions()]);

      set({ createLoading: false });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to create space");
      set({ createLoading: false, createError: msg });
      return { success: false, error: msg };
    }
  },
}));

export default useSpacesStore;
