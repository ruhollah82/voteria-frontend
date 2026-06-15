import { create } from "zustand";
import { getResponseData, spacesAPI } from "../services/api";

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

function getErrorMessage(err, fallback) {
  const errors = err.response?.data?.errors;
  return (
    errors?.non_field ||
    errors?.title ||
    errors?.description ||
    Object.values(errors ?? {})
      .filter(Boolean)
      .join(", ") ||
    err.message ||
    fallback
  );
}

function normaliseSpace(space) {
  return {
    id: space.id ?? space.ID,
    title: space.title ?? space.Title ?? "space",
    description: space.description ?? space.Description ?? "",
  };
}

export const useSpacesStore = create((set, get) => ({
  spaces: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,

  createLoading: false,
  createError: null,

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
