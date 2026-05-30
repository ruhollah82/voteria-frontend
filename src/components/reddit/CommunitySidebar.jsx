import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

const communities = [
  { name: "reactjs", members: "290k" },
  { name: "frontend", members: "148k" },
  { name: "tailwindcss", members: "384k" },
  { name: "webdev", members: "512k" },
];

const CommunitySidebar = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">
                Trending
              </p>
              <h3 className="text-xl font-semibold text-slate-950">
                Communities
              </h3>
            </div>
            <Badge>Hot</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {communities.map((community) => (
            <div
              key={community.name}
              className="flex items-center justify-between rounded-3xl bg-slate-100 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-950">
                  r/{community.name}
                </p>
                <p className="text-sm text-slate-500">
                  {community.members} members
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Join
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-950">
            About this community
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-600">
            A sample Reddit-inspired read-only feed with shadcn-style blocks for
            navigation, posts, and community info.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Design</Badge>
            <Badge>Frontend</Badge>
            <Badge>React</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitySidebar;
