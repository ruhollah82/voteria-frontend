import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuthStore } from "@/store/authStore";
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  LogIn,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchBar } from "./search-bar";

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
  const { user, token } = useAuthStore();
  const title = pageTitles[pathname] ?? "Voteria";

  return (
    <header className="z-40 flex h-(--header-height) w-full shrink-0 items-center border-b bg-background">
      <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ms-1 md:hidden" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 md:hidden"
          />
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src="/Voteria.png"
              alt="Voteria"
              className="size-8 shrink-0 rounded-lg object-cover"
            />
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold leading-4">
                Voteria
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {title}
              </span>
            </span>
          </Link>
        </div>

        <div className="mx-auto hidden w-full max-w-xl sm:block">
          <SearchBar />
        </div>

        <div className="flex items-center justify-end gap-1.5">
          <Button
            className="sm:hidden"
            variant="ghost"
            size="icon"
            aria-label="Search Voteria"
          >
            <Search className="size-4" />
          </Button>

          {token ? (
            <>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/submit">
                  <Plus className="size-4" />
                  Create
                </Link>
              </Button>
              <Button
                className="hidden min-[420px]:inline-flex"
                variant="ghost"
                size="icon"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/login">
                <LogIn className="size-4" />
                Sign in
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          {token ? (
            <AccountMenu user={user} />
          ) : (
            <Button variant="ghost" size="icon" asChild aria-label="Sign in">
              <Link to="/login">
                <Avatar className="size-7 rounded-lg">
                  <AvatarFallback className="rounded-lg">?</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

function AccountMenu({ user }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "VT";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-1.5 sm:px-2"
          aria-label="Open account menu"
        >
          <Avatar className="size-7 rounded-lg">
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate text-sm font-medium lg:inline">
            {user?.username ?? "Account"}
          </span>
          <ChevronsUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">
                u/{user?.username ?? "you"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
