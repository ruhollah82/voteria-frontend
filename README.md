# 🗳️ Voteria

**Voteria** is a modern, Reddit-inspired community feed and discussion platform. It features a highly responsive, shadcn-inspired UI, nested comment threads, rich markdown editing, and a robust global state management system.

> 🚧 **Note:** This repository contains the **frontend** application. It requires a compatible backend API to function fully.

## ✨ Features

- **📱 Responsive App Shell**: Fixed sidebar navigation, top header, scrollable feed column, and a desktop right-rail for community discovery.
- **🌓 Theme Support**: Seamless Light/Dark mode toggling with system preference detection and localStorage persistence.
- **🗳️ Voting System**: Optimistic UI updates for upvoting/downvoting posts and comments.
- **💬 Nested Comments**: Deeply nested, collapsible comment threads with reply, edit, and delete capabilities.
- **📝 Rich Markdown Editor**: Create posts with full Markdown support, including live preview, syntax highlighting for code blocks, and LaTeX math rendering.
- **🏘️ Community Spaces**: Create, discover, and subscribe to different community spaces (similar to subreddits).
- **🔐 Authentication**: Secure login and registration flows with JWT token management and automatic session clearing on expiry.
- **⚡ Fast & Modern**: Built with React 19, Vite, and Tailwind CSS 4 for a lightning-fast developer and user experience.

## 🛠️ Tech Stack

| Category             | Technology                                                         |
| :------------------- | :----------------------------------------------------------------- |
| **Framework**        | React 19, React Router                                             |
| **Build Tool**       | Vite                                                               |
| **Styling**          | Tailwind CSS 4, `tw-animate-css`                                   |
| **UI Components**    | shadcn/ui (Radix UI primitives)                                    |
| **State Management** | Zustand                                                            |
| **HTTP Client**      | Axios                                                              |
| **Markdown**         | `react-markdown`, `remark-gfm`, `rehype-highlight`, `rehype-katex` |
| **Icons**            | Lucide React                                                       |
| **Package Manager**  | Bun                                                                |

## 📂 Project Structure

```text
src/
├── app/                # App-level providers & router definitions
├── components/
│   └── ui/             # shadcn-style reusable primitives (Button, Card, Sheet, etc.)
├── features/           # Feature-specific product components
│   ├── comments/       # Comment thread logic, voters, & composers
│   └── feed/           # Feed layout, filters, post cards, & right rail
├── layouts/            # Main application shell (RootLayout, Sidebar, Header)
├── lib/                # Utilities, helpers, data normalizers, and seed data
├── pages/              # Route pages (Home, Post, Space, Auth, Submit, etc.)
├── services/           # API layer (Axios instance, interceptors, & endpoints)
└── store/              # Zustand global state (auth, posts, comments, spaces)
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (or npm/yarn/pnpm)
- A running backend API

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ruhollah82/voteria-frontend.git
   cd voteria-frontend
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=http://localhost:8080/api/v1
   ```

### Development

Run the development server:

```bash
bun run dev
```

### Build & Production

Build for production:

```bash
bun run build
```

## 🎨 UI & Theming

Voteria uses a custom theme configuration built on top of Tailwind CSS 4 and shadcn/ui.

- **Design System**: Follows the `radix-nova` style from shadcn.
- **Colors**: Custom palette inspired by modern forum platforms (Orange primary, Blue secondary).
- **Typography**: Inter (Variable), IBM Plex Sans/Mono.
- **Customization**: Theme tokens live in `src/index.css`. Prefer global theme tokens over hard-coded colors.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by Ruhollah Naseri
</p>
