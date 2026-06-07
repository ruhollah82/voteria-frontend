import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useCommentStore } from "@/store/commentStore";

export function ReplyComposer({ postId, parentId, onClose }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const addReply = useCommentStore((s) => s.addReply);
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const submit = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    const trimmed = body.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    const result = await addReply(postId, parentId, trimmed);
    setLoading(false);
    if (!result?.success) {
      setError(result?.error ?? "Failed to add comment");
      return;
    }
    setBody("");
    onClose?.();
  };

  return (
    <div className="mt-2 space-y-2">
      <Textarea
        autoFocus
        placeholder="What are your thoughts?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="min-h-20 text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
      />
      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={submit} disabled={!body.trim() || loading}>
          {loading ? "Posting…" : "Reply"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          ⌘↵ to submit
        </span>
      </div>
    </div>
  );
}
