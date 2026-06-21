import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useSpacesStore } from "@/store/spacesStore";
import { usePostsStore } from "@/store/postsStore";
import {
  Bold,
  Italic,
  Link2,
  Image as ImageIcon,
  Quote,
  Code,
  List,
  Eye,
  Edit3,
  FileText,
  Link as LinkIcon,
  BarChart3,
  Send,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

export default function SubmitPage() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const { spaces, fetchSpaces } = useSpacesStore();
  const { createPost } = usePostsStore();

  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [activeTab, setActiveTab] = useState("post");
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const textareaRef = useRef(null);

  // Redirect if not logged in & fetch spaces
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (spaces.length === 0) {
      fetchSpaces(1);
    }
  }, [token, navigate, spaces.length, fetchSpaces]);

  // Auto-select the first space if none is selected
  useEffect(() => {
    if (!selectedSpaceId && spaces.length > 0) {
      setSelectedSpaceId(String(spaces[0].id));
    }
  }, [spaces, selectedSpaceId]);

  // --- Markdown Toolbar Logic ---
  const insertMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0) {
        const newCursorPos =
          start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      } else {
        const newCursorPos = start + before.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // --- Submission Logic ---
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!selectedSpaceId) {
      setError("Please select a space.");
      return;
    }
    if (!content.trim()) {
      setError("Cannot submit an empty Post!");
    }
    if (content.length > 1000) {
      setError("Post content cannot exceed 1,000 characters.");
      return;
    }

    let finalContent = content;
    if (activeTab === "link") {
      if (!linkUrl.trim()) {
        setError("URL is required.");
        return;
      }
      finalContent = `[${title}](${linkUrl})`;
    }

    setLoading(true);
    setError(null);
    const result = await createPost(
      selectedSpaceId,
      title.trim(),
      finalContent,
    );
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Failed to create post.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl py-6 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create a Post</h1>
        <p className="text-sm text-muted-foreground">
          Share your thoughts, links, or media with the community.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main Editor Area */}
        <div className="space-y-4">
          <Card className="shadow-none">
            <CardContent className="p-4 space-y-4">
              {/* Space Selector */}
              <div className="flex flex-wrap items-center gap-3">
                <Select
                  value={selectedSpaceId}
                  onValueChange={setSelectedSpaceId}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose a space" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={String(space.id)}>
                        v/{space.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="text-xs">
                  Posting as u/{user?.username || "you"}
                </Badge>
              </div>

              <Separator />

              {/* Post Type Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="post" className="gap-2">
                    <FileText className="size-4" /> Post
                  </TabsTrigger>
                  <TabsTrigger value="link" className="gap-2">
                    <LinkIcon className="size-4" /> Link
                  </TabsTrigger>
                  <TabsTrigger value="poll" className="gap-2" disabled>
                    <BarChart3 className="size-4" /> Poll
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="post" className="mt-4 space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-medium h-11"
                    maxLength={300}
                  />

                  {/* Markdown Toolbar */}
                  <div className="flex items-center gap-1 p-1 border border-input rounded-lg bg-muted/30">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("**", "**")}
                      title="Bold"
                    >
                      <Bold className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("*", "*")}
                      title="Italic"
                    >
                      <Italic className="size-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("[", "](url)")}
                      title="Link"
                    >
                      <Link2 className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("![alt](", ")")}
                      title="Image"
                    >
                      <ImageIcon className="size-4" />
                    </Button>
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("> ")}
                      title="Quote"
                    >
                      <Quote className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("`", "`")}
                      title="Code"
                    >
                      <Code className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => insertMarkdown("- ")}
                      title="Bullet List"
                    >
                      <List className="size-4" />
                    </Button>

                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={isPreview ? "ghost" : "secondary"}
                        onClick={() => setIsPreview(false)}
                        className="h-7 gap-1.5"
                      >
                        <Edit3 className="size-3.5" /> Write
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={isPreview ? "secondary" : "ghost"}
                        onClick={() => setIsPreview(true)}
                        className="h-7 gap-1.5"
                      >
                        <Eye className="size-3.5" /> Preview
                      </Button>
                    </div>
                  </div>

                  {/* Textarea / Preview */}
                  {isPreview ? (
                    <div className="min-h-[300px] w-full rounded-md border border-input bg-background p-4 text-sm leading-relaxed max-w-none">
                      {/* Render MarkdownRenderer directly as a React component */}
                      {content ? (
                        <MarkdownRenderer content={content} />
                      ) : (
                        <p className="text-muted-foreground italic">
                          Nothing to preview
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        placeholder="Text (optional)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px] text-sm leading-relaxed resize-y pb-10"
                        onKeyDown={(e) => {
                          if (e.ctrlKey || e.metaKey) {
                            if (e.key === "b") {
                              e.preventDefault();
                              insertMarkdown("**", "**");
                            } else if (e.key === "i") {
                              e.preventDefault();
                              insertMarkdown("*", "*");
                            } else if (e.key === "Enter") {
                              e.preventDefault();
                              // Prevent shortcut submission if over limit
                              if (content.length <= 1000) handleSubmit();
                            }
                          }
                        }}
                      />
                      {/* Character counter */}
                      <div
                        className={`absolute bottom-3 end-4 text-xs tabular-nums pointer-events-none ${content.length > 1000 ? "text-destructive font-medium" : "text-muted-foreground"}`}
                      >
                        {content.length.toLocaleString()} / 1,000
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="link" className="mt-4 space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-lg font-medium h-11"
                    maxLength={300}
                  />
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="h-11 ps-9"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="poll" className="mt-4">
                  <p className="text-center text-sm text-muted-foreground py-12">
                    Polls are coming soon!
                  </p>
                </TabsContent>
              </Tabs>

              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || content.length > 1000}
              className="gap-2"
            >
              {loading ? (
                "Posting..."
              ) : (
                <>
                  <Send className="size-4" /> Post
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Sidebar / Rules */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="shadow-none border-dashed">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                  ?
                </span>
                Posting Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-primary/50 shrink-0" />
                  Remember to be human and follow community rules.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-primary/50 shrink-0" />
                  Use Markdown to format your text beautifully.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-primary/50 shrink-0" />
                  No spam, self-promotion, or malicious links.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 size-1.5 rounded-full bg-primary/50 shrink-0" />
                  Choose the correct space for your content.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-none bg-muted/30 border-none">
            <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Keyboard Shortcuts</p>
              <div className="flex justify-between">
                <span>Bold</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">
                  Ctrl + B
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Italic</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">
                  Ctrl + I
                </kbd>
              </div>
              <div className="flex justify-between">
                <span>Submit</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">
                  Ctrl + Enter
                </kbd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
