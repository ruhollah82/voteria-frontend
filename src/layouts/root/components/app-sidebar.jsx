import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { sidebarData } from "@/lib/voteria-data";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        <NavProjects projects={sidebarData.projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
