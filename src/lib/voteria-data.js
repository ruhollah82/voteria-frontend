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

export const communities = [
  {
    name: "voteria",
    members: "42k",
    topic: "Meta",
    online: 312,
    description:
      "The official Voteria meta community. Share feedback, report bugs, and shape the platform.",
  },
  {
    name: "reactjs",
    members: "290k",
    topic: "Frontend",
    online: 1840,
    description:
      "A community for React developers. Discuss hooks, patterns, and the ecosystem.",
  },
  {
    name: "webdev",
    members: "512k",
    topic: "Development",
    online: 3201,
    description:
      "Anything and everything web development — tips, showcases, and discussions.",
  },
  {
    name: "tailwindcss",
    members: "384k",
    topic: "CSS",
    online: 2100,
    description:
      "Utility-first CSS with Tailwind. Share configs, tips, and component ideas.",
  },
  {
    name: "design",
    members: "148k",
    topic: "Product",
    online: 890,
    description:
      "Product design, UX, visual design, and everything in between.",
  },
  {
    name: "typescript",
    members: "203k",
    topic: "Languages",
    online: 1540,
    description:
      "All things TypeScript — types, generics, tooling, and best practices.",
  },
  {
    name: "nextjs",
    members: "178k",
    topic: "Framework",
    online: 1230,
    description:
      "The React framework for production. App Router, server components, and more.",
  },
  {
    name: "devops",
    members: "321k",
    topic: "Infrastructure",
    online: 2780,
    description:
      "CI/CD, containers, cloud, and everything ops. Ship faster, break less.",
  },
  {
    name: "gamedev",
    members: "94k",
    topic: "Gaming",
    online: 670,
    description:
      "Indie and professional game development. Engines, art, audio, and business.",
  },
  {
    name: "photography",
    members: "267k",
    topic: "Creative",
    online: 1920,
    description:
      "From smartphone snaps to studio shoots. Share, critique, and learn.",
  },
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
    saved: false,
    image: null,
    flair: "📣 Announcement",
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
    saved: true,
    image: null,
    flair: "💬 Discussion",
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
    saved: false,
    image: null,
    flair: "🧵 Deep Dive",
  },
  {
    id: 4,
    community: "reactjs",
    author: "u/hookmaster99",
    createdAt: "1h ago",
    votes: 874,
    title: "Stop using useEffect for data fetching — here's why",
    description:
      "React Query, SWR, and the new use() hook all handle caching, deduplication, and race conditions that a plain useEffect will get wrong in subtle ways.",
    tags: ["React", "Hooks", "Performance"],
    comments: 102,
    saved: false,
    image: null,
    flair: "⚡ Hot Take",
  },
  {
    id: 5,
    community: "typescript",
    author: "u/typewhisperer",
    createdAt: "5h ago",
    votes: 341,
    title: "Mapped types with template literals changed how I model APIs",
    description:
      "Generating handler types directly from a route definition object means the compiler catches mismatches before a single test runs.",
    tags: ["TypeScript", "Types", "API"],
    comments: 37,
    saved: true,
    image: null,
    flair: "📘 Tutorial",
  },
  {
    id: 6,
    community: "nextjs",
    author: "u/serversidesamira",
    createdAt: "3h ago",
    votes: 628,
    title:
      "App Router vs Pages Router in 2025: an honest comparison after 18 months",
    description:
      "I migrated a large SaaS from Pages Router to App Router. Caching behavior, data fetching patterns, and deployment gotchas — all documented.",
    tags: ["Next.js", "App Router", "Migration"],
    comments: 89,
    saved: false,
    image: null,
    flair: "📝 Write-up",
  },
  {
    id: 7,
    community: "devops",
    author: "u/k8swhisperer",
    createdAt: "6h ago",
    votes: 1204,
    title: "We cut our CI pipeline from 18 minutes to 4. Here's exactly how.",
    description:
      "Remote caching, parallelized test sharding, Docker layer reuse, and skipping unchanged workspaces. Each change, its impact, and the config.",
    tags: ["CI/CD", "Performance", "Docker"],
    comments: 143,
    saved: false,
    image: null,
    flair: "🚀 Case Study",
  },
  {
    id: 8,
    community: "design",
    author: "u/quietgridwork",
    createdAt: "12h ago",
    votes: 756,
    title: "The 8pt grid isn't dogma — it's a conversation starter",
    description:
      "Rigid adherence to any spacing system can produce layouts that feel mechanical. The goal is visual rhythm, not numerical purity.",
    tags: ["Design Systems", "Grid", "Spacing"],
    comments: 61,
    saved: true,
    image: null,
    flair: "🎨 Opinion",
  },
  {
    id: 9,
    community: "gamedev",
    author: "u/voxeldragon",
    createdAt: "1d ago",
    votes: 2318,
    title: "I spent 3 years building a city builder solo. Just launched. AMA.",
    description:
      "Procedural generation, economy simulation, and a custom ECS in Godot 4. Lessons from 3 years of weekends and evenings.",
    tags: ["Indie", "Godot", "Launch"],
    comments: 287,
    saved: false,
    image: null,
    flair: "🎮 AMA",
  },
  {
    id: 10,
    community: "webdev",
    author: "u/bundlebuster",
    createdAt: "7h ago",
    votes: 493,
    title: "Audit your JS bundle before your users do",
    description:
      "Bundle Buddy, source-map-explorer, and Vite's rollup-plugin-visualizer surface the bloat your linter never will. A practical walkthrough.",
    tags: ["Performance", "JavaScript", "Tooling"],
    comments: 45,
    saved: false,
    image: null,
    flair: "🛠 Tooling",
  },
  {
    id: 4,
    community: "reactjs",
    author: "u/pixelstack",
    createdAt: "1h ago",
    votes: 304,
    title: "How we built Voteria's nested comment system with Zustand",
    description:
      "A walkthrough of our recursive CommentItem component, optimistic updates, and the tree helpers that power collapsing, voting, and inline replies — all without Redux.",
    tags: ["React", "Zustand", "Architecture"],
    comments: 14,
  },
];

export const trendingTopics = [
  { tag: "App Router", posts: 1240, growth: "+18%" },
  { tag: "AI Tooling", posts: 3801, growth: "+42%" },
  { tag: "Bun", posts: 892, growth: "+11%" },
  { tag: "Design Systems", posts: 2104, growth: "+7%" },
  { tag: "Edge Functions", posts: 654, growth: "+29%" },
];

export const popularUsers = [
  { name: "u/cssmaster", karma: "48.2k", badge: "Top Contributor" },
  { name: "u/k8swhisperer", karma: "31.7k", badge: "Helper" },
  { name: "u/voxeldragon", karma: "27.4k", badge: "Creator" },
  { name: "u/typewhisperer", karma: "19.1k", badge: "Expert" },
];

export const sidebarData = {
  user: {
    name: "u/voterian",
    email: "voterian@voteria.app",
    avatar: "/avatars/shadcn.jpg",
    karma: "1,204",
    joined: "3 months ago",
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
      items: communities.slice(1, 8).map((community) => ({
        title: `r/${community.name}`,
        url: `/r/${community.name}`,
        members: community.members,
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
