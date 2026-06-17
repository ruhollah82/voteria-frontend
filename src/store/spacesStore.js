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
    id: space.id,
    username: space.username,
    title: space.username ?? "کیر",
    description: space.description ?? "",
    subscribersCount: space.subscribersCount ?? 0,
    views: space.views ?? 0,
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

  createSpace: async (title, description) => {
    set({ createLoading: true, createError: null });
    try {
      const username = slugify(title);
      await spacesAPI.create(title, description, username);
      await get().fetchSpaces(1);
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
