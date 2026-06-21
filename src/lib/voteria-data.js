import {
  Bell,
  Bookmark,
  Flame,
  Home,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Zap,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
  ],
  projects: [
    {
      name: "Create Post",
      url: "/submit",
      icon: PlusCircle,
    },
    {
      name: "Saved",
      url: "/saved",
      icon: Bookmark,
    },
    {
      name: "Messages",
      url: "/messages",
      icon: MessageSquare,
    },
    {
      name: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      name: "Drafts",
      url: "/drafts",
      icon: Zap,
    },
  ],
};
