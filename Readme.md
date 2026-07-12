# Web-Guider – Learn & Explore

> Learn concepts. Master websites.

Web-Guider is an AI-powered browser extension that helps users learn technology concepts and get guided through websites interactively — all without leaving the current page.

## Features

### 🎓 Learn Mode
- **AI Tutor** – Ask anything about technology, programming, cloud, AI, design, or software
- **Conversational Learning** – Get explanations, examples, analogies, and code snippets
- **Learning Paths** – Structured topics from beginner to advanced (React, Docker, Kubernetes, Azure, Git)
- **Quizzes & Flashcards** – Test your knowledge after each topic
- **Free Resources** – Automatically recommended documentation, tutorials, and videos
- **Progress Tracking** – Visual progress bars for each topic

### 🔍 Explore Mode
- **Step-by-Step Guides** – Get guided through websites interactively
- **DOM Analysis** – Automatically reads page structure to find UI elements
- **Live Highlighting** – Highlights the element you need to interact with
- **Dynamic Updates** – Re-reads DOM if the page changes
- **Multi-Site Support** – Works on GitHub, Azure, LinkedIn, and any website
- **Voice Commands** – "Next", "Repeat", "Explain" hands-free navigation

## Tech Stack

### Frontend (Browser Extension)
- **React** + **TypeScript** – UI framework
- **WXT** – Browser extension framework
- **TailwindCSS** – Styling
- **Framer Motion** – Animations
- **Zustand** – State management
- **TanStack Query** – Data fetching

### Backend
- **Node.js** + **Fastify** – API server
- **TypeScript** – Type safety

### Database
- **Supabase** – PostgreSQL with Row Level Security

### AI
- **OpenRouter** – Multi-model API gateway
- **Supported Models:** GPT-4, Claude 3, Gemini Pro, DeepSeek

## Project Structure

```
WebGuider/
├── Guider-app/          # Browser extension (WXT + React)
│   ├── src/
│   │   ├── entrypoints/
│   │   │   ├── popup/          # Extension popup UI
│   │   │   │   ├── App.tsx
│   │   │   │   └── components/ # ModeSelector, LearnPage, ExplorePage
│   │   │   ├── background.ts   # Service worker
│   │   │   └── content.ts      # Content script (DOM overlay)
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── learn/          # Learn mode components
│   │   │   └── overlay/        # Explore mode overlay components
│   │   ├── stores/             # Zustand state stores
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utilities (API, DOM, AI, helpers)
│   │   └── types/              # TypeScript type definitions
│   ├── wxt.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── web-server/          # Backend API (Fastify)
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── types/        # Type definitions
│   │   ├── config.ts     # Environment config
│   │   ├── app.ts        # Fastify app setup
│   │   └── index.ts      # Server entrypoint
│   └── package.json
├── Guider-Schema/        # Database schema
│   ├── schema.sql        # Supabase schema (11 tables)
│   ├── migrations/       # SQL migrations
│   └── seed.sql          # Seed data
└── Readme.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- A Supabase project (for database)
- An OpenRouter API key (for AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WebGuider.git
   cd WebGuider
   ```

2. **Install dependencies**
   ```bash
   # Extension
   cd Guider-app && npm install

   # Backend
   cd ../web-server && npm install
   ```

3. **Configure environment**
   ```bash
   cp web-server/.env.example web-server/.env
   # Edit .env with your Supabase and OpenRouter credentials
   ```

4. **Set up database**
   - Create a Supabase project
   - Run `Guider-Schema/schema.sql` in the Supabase SQL editor
   - Optionally run `Guider-Schema/seed.sql` for sample data

5. **Run the development servers**
   ```bash
   # Extension (starts dev server with hot reload)
   cd Guider-app && npm run dev

   # Backend
   cd web-server && npm run dev
   ```

6. **Load the extension**
   - Open Chrome/Edge to `chrome://extensions`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select `Guider-app/.wxt/chrome-dev`

## Scripts

### Guider-app (Extension)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Chrome) |
| `npm run dev:firefox` | Start dev server (Firefox) |
| `npm run build` | Build for production |
| `npm run zip` | Package for distribution |

### web-server (Backend)
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build to dist/ |
| `npm start` | Run production build |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/learn/ask` | Ask AI a question |
| GET | `/api/learn/quiz/:topicId` | Generate quiz |
| GET | `/api/learn/resources/:topic` | Get learning resources |
| GET | `/api/learn/progress` | Get user progress |
| POST | `/api/explore/start` | Start guided session |
| POST | `/api/explore/step/:sessionId` | Advance session step |
| POST | `/api/explore/analyze` | Analyze page DOM |
| GET | `/api/resources/search/:query` | Search learning resources |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/preferences` | Update preferences |

## Database Tables

- `users` – User profiles and preferences
- `learning_history` – AI chat history
- `topics` – Learning path definitions
- `user_progress` – Per-topic progress tracking
- `website_sessions` – Explore mode session data
- `bookmarks` – Saved resources and notes
- `tutorials` – Pre-built step-by-step guides
- `analytics` – Usage events
- `feedback` – User ratings and feedback
- `flashcards` – User-created flashcards
- `quiz_results` – Quiz attempt history

## License

MIT
