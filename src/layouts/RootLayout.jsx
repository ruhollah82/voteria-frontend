import { AppSidebar } from "@/layouts/root/components/app-sidebar";
import { SiteHeader } from "@/layouts/root/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col bg-muted/30">
          <div className="@container/main mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 py-3 sm:px-4 md:px-6 md:py-5">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
