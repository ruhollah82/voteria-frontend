# voteria — AI Context Map

> **Stack:** raw-http | none | react | javascript

> 0 routes | 0 models | 20 components | 6 lib files | 1 env vars | 1 middleware
> **Token savings:** this file is ~1,500 tokens. Without it, AI exploration would cost ~17,600 tokens. **Saves ~16,000 tokens per conversation.**
> **Last scanned:** 2026-06-21 08:35 — re-run after significant changes

---

# Components

- **ThemeProvider** — `src\app\providers\ThemeProvider.jsx`
- **CommentItem** — props: comment, postId, depth — `src\features\comments\components\CommentItem.jsx`
- **CommentThread** — props: postId — `src\features\comments\components\CommentThread.jsx`
- **CommentVoter** — props: postId, commentId, votes, userVote — `src\features\comments\components\CommentVoter.jsx`
- **ReplyComposer** — props: postId, parentId, onClose — `src\features\comments\components\ReplyComposer.jsx`
- **CommunityStrip** — `src\features\feed\components\community-strip.jsx`
- **FeedComposer** — props: sortBy — `src\features\feed\components\feed-composer.jsx`
- **FeedFilters** — props: activeFilter, onFilterChange — `src\features\feed\components\feed-filters.jsx`
- **FeedPostCard** — props: post — `src\features\feed\components\feed-post-card.jsx`
- **FeedRightRail** — `src\features\feed\components\feed-right-rail.jsx`
- **AppSidebar** — `src\layouts\root\components\app-sidebar.jsx`
- **NavMain** — props: items — `src\layouts\root\components\nav-main.jsx`
- **NavProjects** [client] — props: projects — `src\layouts\root\components\nav-projects.jsx`
- **SiteHeader** — `src\layouts\root\components\site-header.jsx`
- **RootLayout** — `src\layouts\RootLayout.jsx`
- **AboutPage** — `src\pages\AboutPage.jsx`
- **AuthPage** — `src\pages\AuthPage.jsx`
- **HomePage** — `src\pages\HomePage.jsx`
- **NotFoundPage** — `src\pages\NotFoundPage.jsx`
- **PostPage** — `src\pages\PostPage.jsx`

---

# Libraries

- `src\features\feed\hooks\useFeedComposer.js` — function useFeedComposer: (sortBy) => void
- `src\hooks\use-mobile.js` — function useIsMobile: () => void
- `src\lib\error.js` — function getErrorMessage: (err, fallback) => void
- `src\lib\normalise.js`
  - function formatRelativeDate: (value) => void
  - function normalisePost: (post) => void
  - function normaliseComment: (comment) => void
  - function buildCommentTree: (flatComments) => void
- `src\lib\utils.js` — function cn: (...inputs) => void
- `src\services\api.js`
  - function getStoredAccessToken: () => void
  - function storeAuthSession: ({...}, refreshToken, expiresAt, user, }) => void
  - function clearAuthSession: () => void
  - function getResponseData: (payload, fallback) => void
  - const authAPI
  - const spacesAPI
  - _...2 more_

---

# Config

## Environment Variables

- `VITE_API_URL` **required** — src\services\api.js

## Config Files

- `vite.config.js`

## Key Dependencies

- react: ^19.2.5
- tailwindcss: ^4.2.3

---

# Middleware

## auth
- authStore — `src\store\authStore.js`

---

# Dependency Graph

## Most Imported Files (change these carefully)

- `src\lib\utils.js` — imported by **13** files
- `src\components\ui\button.jsx` — imported by **3** files
- `src\services\api.js` — imported by **3** files
- `src\components\ui\tooltip.jsx` — imported by **2** files
- `src\features\comments\components\ReplyComposer.jsx` — imported by **2** files
- `src\layouts\RootLayout.jsx` — imported by **1** files
- `src\pages\HomePage.jsx` — imported by **1** files
- `src\pages\AboutPage.jsx` — imported by **1** files
- `src\pages\NotFoundPage.jsx` — imported by **1** files
- `src\pages\PostPage.jsx` — imported by **1** files
- `src\pages\AuthPage.jsx` — imported by **1** files
- `src\hooks\use-mobile.js` — imported by **1** files
- `src\components\ui\input.jsx` — imported by **1** files
- `src\components\ui\separator.jsx` — imported by **1** files
- `src\components\ui\skeleton.jsx` — imported by **1** files
- `src\features\comments\components\CommentVoter.jsx` — imported by **1** files
- `src\features\comments\components\CommentItem.jsx` — imported by **1** files
- `src\features\comments\components\CommentThread.jsx` — imported by **1** files
- `src\features\feed\hooks\useFeedComposer.js` — imported by **1** files
- `src\features\feed\components\community-strip.jsx` — imported by **1** files

## Import Map (who imports what)

- `src\lib\utils.js` ← `src\components\ui\avatar.jsx`, `src\components\ui\badge.jsx`, `src\components\ui\breadcrumb.jsx`, `src\components\ui\button.jsx`, `src\components\ui\card.jsx` +8 more
- `src\components\ui\button.jsx` ← `src\components\ui\sheet.jsx`, `src\components\ui\sidebar.jsx`, `src\pages\AboutPage.jsx`
- `src\services\api.js` ← `src\store\commentStore.js`, `src\store\postsStore.js`, `src\store\spacesStore.js`
- `src\components\ui\tooltip.jsx` ← `src\components\ui\sidebar.jsx`, `src\main.jsx`
- `src\features\comments\components\ReplyComposer.jsx` ← `src\features\comments\components\CommentItem.jsx`, `src\features\comments\components\CommentThread.jsx`
- `src\layouts\RootLayout.jsx` ← `src\app\router.jsx`
- `src\pages\HomePage.jsx` ← `src\app\router.jsx`
- `src\pages\AboutPage.jsx` ← `src\app\router.jsx`
- `src\pages\NotFoundPage.jsx` ← `src\app\router.jsx`
- `src\pages\PostPage.jsx` ← `src\app\router.jsx`

---

_Generated by [codesight](https://github.com/Houseofmvps/codesight) — see your codebase clearly_