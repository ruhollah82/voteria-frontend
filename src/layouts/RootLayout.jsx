import { AppSidebar } from "@/layouts/root/components/app-sidebar";
import { SiteHeader } from "@/layouts/root/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <SidebarProvider
      className="h-svh flex-col overflow-hidden"
      style={{
        "--sidebar-width": "calc(var(--spacing) * 48)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <SiteHeader />
      <div className="flex min-h-0 w-full flex-1">
        <AppSidebar />
        <SidebarInset className="min-h-0 min-w-0">
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-muted/30 w-full">
            <div className="@container/main mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-3 py-3 sm:px-4 md:px-6 md:py-5">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
