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
} from "lucide-react";

export const communities = [
  { name: "voteria", members: "42k", topic: "Meta" },
  { name: "reactjs", members: "290k", topic: "Frontend" },
  { name: "webdev", members: "512k", topic: "Development" },
  { name: "tailwindcss", members: "384k", topic: "CSS" },
  { name: "design", members: "148k", topic: "Product" },
];

export const posts = [
  {
    id: 1,
    community: "voteria",
    author: "u/modteam",
    createdAt: "2h ago",
    votes: 422,
    title: "Welcome thread: what should Voteria improve first?",
    description:
      "Drop feedback on the feed, posting flow, community pages, moderation tools, and anything that feels clunky.",
    tags: ["Feedback", "Roadmap", "Community"],
    comments: 28,
  },
  {
    id: 2,
    community: "frontend",
    author: "u/pixelstack",
    createdAt: "4h ago",
    votes: 189,
    title: "Show us the cleanest compact feed layout you have seen",
    description:
      "Dense feeds are hard to get right. Curious which apps balance scanning, voting, comments, and actions best.",
    tags: ["UI", "Feeds"],
    comments: 18,
  },
  {
    id: 3,
    community: "tailwindcss",
    author: "u/cssmaster",
    createdAt: "8h ago",
    votes: 512,
    title: "Theme tokens beat one-off utility soup for large apps",
    description:
      "Once the app has a real design language, color and spacing decisions should come from the system, not each card.",
    tags: ["Tailwind", "CSS", "Design System"],
    comments: 54,
  },
];

export const sidebarData = {
  user: {
    name: "u/voterian",
    email: "voterian@voteria.app",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: communities.slice(0, 3).map((community, index) => ({
    name: `r/${community.name}`,
    logo: [Home, TrendingUp, Users][index],
    plan: community.topic,
  })),
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
    {
      title: "Communities",
      url: "/communities",
      icon: Users,
      items: communities.slice(1, 5).map((community) => ({
        title: `r/${community.name}`,
        url: `/r/${community.name}`,
      })),
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
