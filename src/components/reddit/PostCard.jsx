import { ArrowDown, ArrowUp, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const PostCard = ({ post }) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 border-b border-border px-6 py-4">
        <div className="flex flex-col items-center gap-1 rounded-3xl bg-slate-100 px-3 py-2 text-slate-600">
          <ArrowUp className="h-4 w-4" />
          <span className="text-sm font-semibold">{post.votes}</span>
          <ArrowDown className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>r/{post.community}</span>
            <span>•</span>
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.createdAt}</span>
          </div>
          <CardHeader className="space-y-3 pt-3 px-0">
            <h2 className="text-xl font-semibold text-slate-950">
              {post.title}
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              {post.description}
            </p>
          </CardHeader>
          <CardContent className="px-0 pt-0">
            {post.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="accent">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : null}
          </CardContent>
        </div>
      </div>
      <CardFooter>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments} comments</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-3 text-slate-700 hover:bg-slate-100"
          >
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
