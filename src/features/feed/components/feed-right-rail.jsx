import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { communities } from "@/lib/voteria-data";

export function FeedRightRail() {
  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader className="space-y-1 p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Voteria
          </p>
          <h2 className="text-base font-semibold text-card-foreground">
            Community front page
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Follow spaces, vote on posts, and keep the feed focused around
            discussions that are active right now.
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Button className="w-full">Create post</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Discover
            </p>
            <h2 className="text-base font-semibold text-card-foreground">
              Growing spaces
            </h2>
          </div>
          <Badge variant="accent">Live</Badge>
        </CardHeader>
        <CardContent className="space-y-1 p-2 pt-0">
          {communities.map((community, index) => (
            <div key={community.name}>
              <div className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-muted/70">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    v/{community.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {community.members} members
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Join
                </Button>
              </div>
              {index < communities.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
