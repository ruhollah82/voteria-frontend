import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { usePostsStore } from "@/store/postsStore";
import { useSpacesStore } from "@/store/spacesStore";
import { getErrorMessage } from "@/lib/error";

const DEFAULT_SUBMIT_ERROR = "Something went wrong";

export function useFeedComposer(sortBy = "") {
  const { token, user } = useAuthStore();
  const {
    spaces,
    fetchSpaces,
    loading: spacesLoading,
    error: spacesError,
  } = useSpacesStore();
  const { createPost } = usePostsStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || spaces.length > 0 || spacesLoading) return;

    let cancelled = false;

    async function loadSpaces() {
      setError(null);
      try {
        await fetchSpaces(1);
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, "Failed to load spaces"));
        }
      }
    }

    loadSpaces();

    return () => {
      cancelled = true;
    };
  }, [open, spaces.length, spacesLoading, fetchSpaces]);

  useEffect(() => {
    if (!selectedSpaceId && spaces.length > 0) {
      setSelectedSpaceId(String(spaces[0].id));
    }

    if (spaces.length === 0 && open) {
      setError("Create a space first, then you can post to it.");
    }
  }, [spaces, selectedSpaceId, open]);

  useEffect(() => {
    if (spacesError) {
      setError(spacesError);
    }
  }, [spacesError]);

  const handleOpen = useCallback(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setError(null);
    setOpen(true);
  }, [navigate, token]);

  const resetForm = useCallback(() => {
    setOpen(false);
    setTitle("");
    setContent("");
    setSelectedSpaceId("");
    setLoading(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    if (!selectedSpaceId) {
      setError("Choose a space before posting.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createPost(
      selectedSpaceId,
      title.trim(),
      content.trim(),
      sortBy,
    );

    setLoading(false);

    if (result.success) {
      resetForm();
    } else {
      setError(result.error ?? DEFAULT_SUBMIT_ERROR);
    }
  }, [createPost, content, resetForm, selectedSpaceId, sortBy, title]);

  return {
    token,
    user,
    open,
    setOpen,
    selectedSpaceId,
    setSelectedSpaceId,
    title,
    setTitle,
    content,
    setContent,
    loading,
    error,
    spaces,
    spacesLoading,
    handleOpen,
    handleSubmit,
  };
}
