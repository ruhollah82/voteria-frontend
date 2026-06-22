// seed.mjs
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // Ensure this matches your backend
const api = axios.create({ baseURL: API_URL });

// Helper to extract JWT from various backend response shapes
function extractToken(resData) {
  const payload = resData?.data ?? resData;
  const body = payload?.tokens ?? payload?.data?.tokens ?? payload;
  const token =
    body?.access ??
    body?.access_token ??
    payload?.access_token ??
    payload?.data?.access_token;
  if (!token)
    console.warn(
      "⚠️ Could not extract token from response:",
      JSON.stringify(payload).substring(0, 150),
    );
  return token;
}

// Helper to extract ID from response
function extractId(resData) {
  const payload = resData?.data ?? resData;
  return payload?.ID ?? payload?.id ?? payload?.data?.ID ?? payload?.data?.id;
}

// Small delay to prevent backend rate-limiting or race conditions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── 1. USERS ────────────────────────────────────────────────────────────────
const users = [
  { username: "dev_master", password: "Password123!" },
  { username: "react_ninja", password: "Password123!" },
  { username: "pixel_crafter", password: "Password123!" },
  { username: "design_sys", password: "Password123!" },
  { username: "algo_rhythm", password: "Password123!" },
  { username: "cinephile_99", password: "Password123!" },
  { username: "astro_nerd", password: "Password123!" },
  { username: "iron_addict", password: "Password123!" },
  { username: "chef_boi", password: "Password123!" },
  { username: "night_shooter", password: "Password123!" },
];
const userTokens = {};

async function seedUsers() {
  console.log("\n👤 Seeding Users...");
  for (const user of users) {
    try {
      await api.post("/users/register", user);
      console.log(`✅ Registered: ${user.username}`);
    } catch (err) {
      console.log(`⚠️ ${user.username} might exist, attempting login...`);
    }

    await delay(100);
    try {
      const res = await api.post("/users/login", user);
      const token = extractToken(res.data);
      if (token) {
        userTokens[user.username] = token;
        console.log(`🔑 Logged in: ${user.username}`);
      }
    } catch (err) {
      console.error(
        `❌ Login failed for ${user.username}:`,
        err.response?.data?.msg || err.message,
      );
    }
  }
}

// ─── 2. SPACES ───────────────────────────────────────────────────────────────
const spaces = [
  {
    title: "webdev",
    description:
      "A community for web developers to share news, discuss frameworks, and show off projects.",
    username: "webdev",
  },
  {
    title: "reactjs",
    description:
      "Discussion, tips, and news about React, React Native, and the ecosystem.",
    username: "reactjs",
  },
  {
    title: "gamedev",
    description: "Indie and AAA game development, engines, art, and design.",
    username: "gamedev",
  },
  {
    title: "ui_design",
    description:
      "Showcasing beautiful UI/UX, design systems, and component libraries.",
    username: "ui_design",
  },
  {
    title: "programming",
    description:
      "Computer programming news, tutorials, and general discussion.",
    username: "programming",
  },
  {
    title: "movies",
    description:
      "Discuss the latest releases, classics, cinematography, and film theory.",
    username: "movies",
  },
  {
    title: "science",
    description: "Peer-reviewed science news, space exploration, and biology.",
    username: "science",
  },
  {
    title: "fitness",
    description:
      "Workout routines, nutrition advice, and transformation stories.",
    username: "fitness",
  },
  {
    title: "cooking",
    description: "Recipes, cooking techniques, and food photography.",
    username: "cooking",
  },
  {
    title: "photography",
    description:
      "Share your shots, discuss gear, and learn editing techniques.",
    username: "photography",
  },
];
const spaceIds = {};

async function seedSpaces() {
  console.log("\n🏘️ Seeding Spaces...");
  // Use the first user to create all spaces
  api.defaults.headers.common["Authorization"] =
    `Bearer ${userTokens[users[0].username]}`;

  for (const space of spaces) {
    try {
      const res = await api.post("/spaces", space);
      spaceIds[space.title] = extractId(res.data);
      console.log(`✅ Created space: v/${space.title}`);
    } catch (err) {
      console.error(
        `❌ Failed to create space ${space.title}:`,
        err.response?.data?.msg || err.message,
      );
    }
    await delay(100);
  }
}

// ─── 3. POSTS ────────────────────────────────────────────────────────────────
const posts = [
  {
    author: "dev_master",
    space: "webdev",
    title:
      "Just migrated our massive monolith to Vite and Tailwind v4. Here's the before/after!",
    content:
      "After 3 months of refactoring, we finally ditched Webpack for Vite and upgraded to Tailwind v4. The build times went from **45 seconds** down to **1.2 seconds**.\n\n![Build times comparison chart](https://picsum.photos/seed/vite/800/400)\n\nThe new CSS-first configuration in Tailwind v4 is a game changer. No more `tailwind.config.js`!\n\n```javascript\n// Old way\nmodule.exports = { theme: { extend: { colors: { primary: '#ff4500' } } } }\n```\n\nWhat are your thoughts on the new Tailwind setup?",
  },
  {
    author: "react_ninja",
    space: "reactjs",
    title: "React 19 is officially out! What's your favorite new feature?",
    content:
      'The React team just dropped React 19! 🚀\n\n![React 19 Logo](https://picsum.photos/seed/react19/800/400)\n\nI\'m personally most excited about the **`use` hook** and the improvements to Server Components. It makes data fetching so much cleaner.\n\n> "The future of React is concurrent and server-first." - Dan Abramov\n\nDrop your favorite features below!',
  },
  {
    author: "pixel_crafter",
    space: "gamedev",
    title: "Finally finished the lighting pass for my indie game. Thoughts?",
    content:
      "Spent the last two weeks tweaking the volumetric lighting and global illumination in Godot 4. Really happy with how the fog interacts with the neon signs.\n\n![Game scene with neon lighting](https://picsum.photos/seed/gamedev/800/400)\n\nStill need to optimize the shadows for lower-end GPUs, but the aesthetic is finally there. Let me know what you think!",
  },
  {
    author: "design_sys",
    space: "ui_design",
    title: "Shadcn UI is changing the game. My custom theme setup.",
    content:
      "I've been building a design system using shadcn/ui and customizing the CSS variables. The ability to just copy the code and own it is brilliant.\n\n![Custom UI components](https://picsum.photos/seed/shadcn/800/400)\n\nHere is my custom `index.css` palette:\n- **Primary**: `#ff4500` (Reddit Orange)\n- **Secondary**: `#0079d1` (Classic Blue)\n- **Background**: `#030303` (Deep Dark)\n\nIt gives a very modern, forum-like feel. Check out the dark mode toggle!",
  },
  {
    author: "algo_rhythm",
    space: "programming",
    title:
      "TIL: You can use `Map` and `Set` in JSON by writing custom replacers.",
    content:
      "Did you know `JSON.stringify()` doesn't support `Map` or `Set` out of the box? It just returns `{}`.\n\n![Code snippet](https://picsum.photos/seed/code/800/400)\n\nBut you can pass a custom replacer and reviver to `JSON.parse` to serialize them!\n\n```javascript\nconst replacer = (key, value) => {\n  if (value instanceof Map) return { dataType: 'Map', value: Array.from(value) };\n  return value;\n};\n```\n\nMind blown today. 🤯",
  },
  {
    author: "cinephile_99",
    space: "movies",
    title: "Dune Part Two cinematography is absolutely breathtaking.",
    content:
      "Just watched it in IMAX again. Greig Fraser's use of infrared cameras for the Giedi Prime scenes is unlike anything I've ever seen in a blockbuster.\n\n![Dune desert landscape](https://picsum.photos/seed/dune/800/400)\n\nThe scale, the sound design, the sheer brutality of the visuals. It's a masterpiece of modern sci-fi.",
  },
  {
    author: "astro_nerd",
    space: "science",
    title:
      "New James Webb Telescope image reveals hidden galaxies behind the Milky Way.",
    content:
      "The Zone of Avoidance has always been hard to observe because of the dust and stars in our own galaxy blocking the view. But JWST's infrared capabilities pierce right through it.\n\n![Deep space galaxy cluster](https://picsum.photos/seed/jwst/800/400)\n\nLook at the sheer number of galaxies in the background! The universe is even more crowded than we thought.",
  },
  {
    author: "iron_addict",
    space: "fitness",
    title: "My 1-year transformation. Consistency is key!",
    content:
      "Started last May at 180 lbs, currently sitting at 165 lbs and feeling stronger than ever. \n\n![Gym progress picture](https://picsum.photos/seed/fitness/800/400)\n\n**My routine:**\n1. PPL split (6 days a week)\n2. High protein (180g/day)\n3. 8 hours of sleep (non-negotiable)\n\nDon't overcomplicate it. Just show up.",
  },
  {
    author: "chef_boi",
    space: "cooking",
    title: "Made homemade tonkotsu ramen from scratch. 24-hour broth!",
    content:
      "Finally nailed the emulsion for the broth. It took boiling pork bones on high heat for 18 hours to get that creamy, opaque white color.\n\n![Bowl of ramen](https://picsum.photos/seed/ramen/800/400)\n\nTopped with chashu, ajitsuke tamago (soy-marinated egg), and handmade noodles. Worth every minute of the wait.",
  },
  {
    author: "night_shooter",
    space: "photography",
    title: "Caught the Milky Way over the mountains last night.",
    content:
      "Drove 3 hours out of the city to escape the light pollution. Used a 14mm f/2.8 lens, 20-second exposure, ISO 3200.\n\n![Milky way over mountains](https://picsum.photos/seed/milkyway/800/400)\n\nThe core of the galaxy is just starting to rise in the eastern sky. Nature's light show never gets old.",
  },
];
const postIds = [];

async function seedPosts() {
  console.log("\n📝 Seeding Posts...");
  for (const post of posts) {
    const token = userTokens[post.author];
    if (!token) {
      console.error(`❌ No token for ${post.author}`);
      continue;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const spaceId = spaceIds[post.space];
    if (!spaceId) {
      console.error(`❌ No space ID for ${post.space}`);
      continue;
    }

    try {
      const res = await api.post(`/spaces/${spaceId}/posts`, {
        title: post.title,
        content: post.content,
      });
      postIds.push(extractId(res.data));
      console.log(
        `✅ Created post by ${post.author}: ${post.title.substring(0, 40)}...`,
      );
    } catch (err) {
      console.error(
        `❌ Failed to create post by ${post.author}:`,
        err.response?.data?.msg || err.message,
      );
    }
    await delay(150);
  }
}

// ─── 4. COMMENTS ─────────────────────────────────────────────────────────────
// parentIndex refers to the index in the `comments` array. null = top-level.
const comments = [
  {
    author: "react_ninja",
    postIndex: 0,
    parentIndex: null,
    content:
      "How long did the migration take? We're considering it for our legacy app but the team is scared of breaking things.",
  },
  {
    author: "dev_master",
    postIndex: 0,
    parentIndex: 0,
    content:
      "Took us about 3 weeks for a 500k LOC codebase. We did it feature-flag by feature-flag. Totally worth it, the DX improvement is massive.",
  },
  {
    author: "algo_rhythm",
    postIndex: 1,
    parentIndex: null,
    content:
      "The new `use` hook is a game changer for data fetching. No more `useEffect` just to load data on mount!",
  },
  {
    author: "pixel_crafter",
    postIndex: 1,
    parentIndex: 2,
    content:
      "Agreed, but I'm still wrapping my head around how it interacts with Suspense boundaries in complex nested routes.",
  },
  {
    author: "design_sys",
    postIndex: 2,
    parentIndex: null,
    content:
      "The volumetric lighting looks insane. What engine are you using? Godot 4?",
  },
  {
    author: "cinephile_99",
    postIndex: 3,
    parentIndex: null,
    content:
      "Love the orange and blue accent colors. Very modern. Reminds me of a mix between Reddit and a sleek SaaS dashboard.",
  },
  {
    author: "design_sys",
    postIndex: 3,
    parentIndex: 5,
    content:
      "Thanks! I spent hours tweaking the CSS variables in `index.css` to get the contrast ratios just right for dark mode.",
  },
  {
    author: "astro_nerd",
    postIndex: 6,
    parentIndex: null,
    content:
      "Space never ceases to amaze me. The scale is just incomprehensible. Every pixel in that image is an entire galaxy.",
  },
  {
    author: "iron_addict",
    postIndex: 8,
    parentIndex: null,
    content:
      "Recipe drop? That broth looks incredibly rich. Did you use kombu in the dashi base?",
  },
  {
    author: "chef_boi",
    postIndex: 8,
    parentIndex: 8,
    content:
      "Pork bones, kombu, and shiitake mushrooms. Low and slow for 24h! I'll post the full recipe in the wiki later today.",
  },
];
const commentIds = [];

async function seedComments() {
  console.log("\n💬 Seeding Comments...");
  for (let i = 0; i < comments.length; i++) {
    const c = comments[i];
    const token = userTokens[c.author];
    if (!token) continue;

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const postId = postIds[c.postIndex];
    if (!postId) continue;

    let parentId = 0;
    if (c.parentIndex !== null) {
      parentId = commentIds[c.parentIndex] || 0;
    }

    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: c.content,
        parent_id: parentId,
      });
      commentIds.push(extractId(res.data));
      console.log(`✅ Created comment by ${c.author} on post ${c.postIndex}`);
    } catch (err) {
      console.error(
        `❌ Failed to create comment by ${c.author}:`,
        err.response?.data?.msg || err.message,
      );
    }
    await delay(150);
  }
}

// ─── RUN ─────────────────────────────────────────────────────────────────────
async function run() {
  console.log("🌱 Starting full database seed...");
  try {
    await seedUsers();
    await seedSpaces();
    await seedPosts();
    await seedComments();
    console.log(
      "\n🎉 Database seeding complete! You can now view the data in your app.",
    );
  } catch (err) {
    console.error("💥 Fatal error during seeding:", err);
  }
}

run();
