# Voteria

Voteria is a Reddit-inspired community feed built with React, Vite, Tailwind CSS, and shadcn-style UI primitives.

The current app focuses on a scalable layout foundation: fixed app chrome, a scrollable feed column, a desktop right rail, collapsible sidebar navigation, theme support, and reusable feed components.

## Tech Stack

- React 19
- Vite
- Tailwind CSS 4
- shadcn-style components
- Radix UI primitives
- React Router
- Bun

## Getting Started

Install dependencies:

```bash
bun install
```

Run the dev server:

```bash
bun run dev
```

Build for production:

```bash
bun run build
```

Run linting:

```bash
bun run lint
```

Preview the production build:

```bash
bun run preview
```

## Project Structure

```text
src/
  app/
    providers/       App-level providers
    router.jsx       Route definitions
  components/
    ui/              shadcn-style reusable primitives
  features/
    feed/            Feed-specific product components
  layouts/
    RootLayout.jsx   Main application shell
    root/            Sidebar and topbar shell components
  lib/               Utilities and seed data
  pages/             Route pages
```

## Layout Notes

- `RootLayout` owns the fixed app shell.
- The topbar and sidebar stay fixed while the feed scrolls.
- `features/feed` contains Voteria-specific feed UI.
- `components/ui` should stay generic and reusable.
- Theme tokens live in `src/index.css`.

## Development Guidelines

- Put product-specific UI in `src/features/<feature-name>`.
- Put route screens in `src/pages`.
- Put shadcn primitives and generic UI components in `src/components/ui`.
- Prefer global theme tokens over hard-coded colors.
- Keep layout behavior in layout files, not individual cards.
