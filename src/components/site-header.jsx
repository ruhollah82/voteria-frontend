import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/app/providers/ThemeProvider";
import { Bell, Moon, Plus, Search, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles = {
  "/": "Home",
  "/about": "About",
  "/popular": "Popular",
  "/trending": "Trending",
  "/communities": "Communities",
  "/submit": "Create Post",
  "/saved": "Saved",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/drafts": "Drafts",
};

export function SiteHeader() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const title = pageTitles[pathname] ?? "Voteria";

  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="hidden text-base font-semibold sm:block">{title}</h1>
        <div className="relative ms-auto w-full max-w-sm">
          <Search className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search Voteria"
            className="h-8 bg-muted/60 ps-8"
            placeholder="Search Voteria"
          />
        </div>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link to="/submit">
            <Plus className="size-4" />
            Create
          </Link>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>
    </header>
  );
}
