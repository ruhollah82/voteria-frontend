import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useSpacesStore } from "@/store/spacesStore";

export function FeedRightRail() {
  const token = useAuthStore((state) => state.token);
  const {
    spaces,
    subscribedSpaces,
    loading,
    subscriptionsLoading,
    fetchSpaces,
    fetchSubscriptions,
    subscribeToSpace,
  } = useSpacesStore();

  useEffect(() => {
    if (spaces.length === 0) {
      fetchSpaces(1);
    }
  }, [spaces.length, fetchSpaces]);

  useEffect(() => {
    if (token && subscribedSpaces.length === 0 && !subscriptionsLoading) {
      fetchSubscriptions();
    }
  }, [
    token,
    subscribedSpaces.length,
    subscriptionsLoading,
    fetchSubscriptions,
  ]);

  const subscribedIds = new Set(subscribedSpaces.map((space) => space.id));

  const growingSpaces = spaces.length
    ? [...spaces]
        .sort((a, b) => b.subscribersCount - a.subscribersCount)
        .slice(0, 6)
    : spaces.map((space) => ({
        name: space.name,
        members: space.members,
      }));

  const handleJoin = async (spaceId) => {
    await subscribeToSpace(spaceId);
  };

  return (
    <aside className="max-h-[calc(100svh-var(--header-height)-2.5rem)] space-y-3 overflow-y-auto pe-1">
      <Card className="shadow-none">
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

      <Card className="shadow-none">
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
          {growingSpaces.map((space, index) => (
            <div key={space.id ?? space.name}>
              <div className="flex items-center justify-between gap-3 rounded-lg p-2 hover:bg-muted/70">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    v/{space.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {space.subscribersCount != null
                      ? `${space.subscribersCount} members`
                      : `${space.members} members`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={
                    subscribedIds.has(space.id) ? "secondary" : "outline"
                  }
                  disabled={!token || subscribedIds.has(space.id)}
                  onClick={() => handleJoin(space.id)}
                >
                  {subscribedIds.has(space.id) ? "Joined" : "Join"}
                </Button>
              </div>
              {index < growingSpaces.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
