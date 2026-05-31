import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, ListFilter, Sparkles, TrendingUp } from "lucide-react";

const filters = [
  { label: "Best", icon: Sparkles },
  { label: "Hot", icon: Flame },
  { label: "Rising", icon: TrendingUp },
];

export function FeedFilters({ activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card p-1.5 shadow-sm">
      <Tabs value={activeFilter} onValueChange={onFilterChange} className="min-w-0">
        <TabsList className="w-full overflow-x-auto">
        {filters.map((filter) => {
          const Icon = filter.icon;

          return (
            <TabsTrigger
              key={filter.label}
              value={filter.label}
              className="px-2.5"
            >
              <Icon className="size-4" />
              {filter.label}
            </TabsTrigger>
          );
        })}
        </TabsList>
      </Tabs>
      <Button size="icon-sm" variant="ghost" aria-label="Open feed filters">
        <ListFilter className="size-4" />
      </Button>
    </div>
  );
}
