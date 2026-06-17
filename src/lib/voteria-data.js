import {
  Bell,
  Bookmark,
  Flame,
  Home,
  MessageSquare,
  PlusCircle,
  TrendingUp,
  Users,
  Zap,
  Code2,
  Palette,
  Globe,
  Cpu,
  Shield,
  Gamepad2,
  Camera,
  Music,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Popular",
      url: "/popular",
      icon: Flame,
    },
    {
      title: "Trending",
      url: "/trending",
      icon: TrendingUp,
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
