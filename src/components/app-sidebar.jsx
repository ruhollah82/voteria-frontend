"use client";

import * as React from "react";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar";
import {
  Home,
  Flame,
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  Zap,
} from "lucide-react";

const data = {
  user: {
    name: "u/redditor",
    email: "user@reddit.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "r/Frontend",
      logo: Home,
      plan: "Tech",
    },
    {
      name: "r/WebDev",
      logo: TrendingUp,
      plan: "Dev",
    },
    {
      name: "r/Design",
      logo: Users,
      plan: "Design",
    },
  ],
  navMain: [
    {
      title: "Feed",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Hot",
      url: "#",
      icon: Flame,
    },
    {
      title: "Trending",
      url: "#",
      icon: TrendingUp,
    },
    {
      title: "Communities",
      url: "#",
      icon: Users,
      items: [
        { title: "r/reactjs", url: "#" },
        { title: "r/webdev", url: "#" },
        { title: "r/tailwindcss", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Saved Posts",
      url: "#",
      icon: Heart,
    },
    {
      name: "Messages",
      url: "#",
      icon: MessageSquare,
    },
    {
      name: "Drafts",
      url: "#",
      icon: Zap,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
