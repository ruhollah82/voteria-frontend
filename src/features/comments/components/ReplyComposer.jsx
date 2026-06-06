import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCommentStore } from "@/store/commentStore";

export function ReplyComposer({ postId, parentId, onClose }) {
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const addReply = useCommentStore((s) => s.addReply);

  const submit = async () => {
    const trimmed = body.trim();
    if (!trimmed) return;
    setLoading(true);
    await addReply(postId, parentId, trimmed);
    setLoading(false);
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
