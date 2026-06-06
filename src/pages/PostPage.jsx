import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, Bookmark, Share2, ArrowLeft } from "lucide-react";
import { CommentThread } from "@/features/comments";
import { posts } from "@/lib/voteria-data";

export default function PostPage() {
  const { postId } = useParams();
  const post = posts.find((p) => String(p.id) === postId) ?? posts[0];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/">
          <ArrowLeft className="size-4" /> Back
        </Link>
      </Button>

      <Card className="shadow-none">
        <article className="p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            <Avatar size="sm">
              <AvatarFallback>
                {post.community.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              v/{post.community}
            </span>
            <span>by {post.author}</span>
            <span>{post.createdAt}</span>
          </div>

          <h1 className="mt-3 text-xl font-bold leading-7 text-card-foreground">
            {post.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {post.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-muted p-0.5">
              <Button size="icon-sm" variant="ghost">
                <ArrowUp className="size-4" />
              </Button>
              <span className="min-w-8 px-1 text-center text-xs font-semibold tabular-nums">
                {post.votes}
              </span>
              <Button size="icon-sm" variant="ghost">
                <ArrowDown className="size-4" />
              </Button>
            </div>
            <Button size="sm" variant="ghost" className="px-2">
              <Share2 className="size-4" />
              Share
            </Button>
            <Button size="icon-sm" variant="ghost">
              <Bookmark className="size-4" />
            </Button>
          </div>

          <CommentThread postId={String(post.id)} />
        </article>
      </Card>
    </div>
  );
}
