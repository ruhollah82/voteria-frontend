import { Outlet } from "react-router-dom";
import { Search, Moon, SunMedium, Bell, Plus } from "lucide-react";
import { useTheme } from "../app/providers/ThemeProvider";
import { Button } from "../components/ui/button";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";

const RootLayout = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex w-full flex-col bg-slate-50 dark:bg-slate-950"
        style={{ "--topbar-height": "64px" }}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-lg">
                  V
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                    Voteria
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Community Feed
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3 flex-1 max-w-xs sm:max-w-sm">
              <div className="relative w-full hidden sm:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <SunMedium className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button size="sm" className="gap-2 hidden sm:inline-flex">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;
