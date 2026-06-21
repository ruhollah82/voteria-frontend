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
