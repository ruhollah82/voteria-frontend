import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const CreatePostCard = () => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-slate-950">Create a post</h3>
        <p className="text-sm text-slate-600">
          Draft your post before sharing it with your favorite community.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Post title" />
        <Input placeholder="Subreddit" />
        <Textarea placeholder="What do you want to talk about?" />
        <Button className="w-full">Create post</Button>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;
