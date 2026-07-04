# AGENTS.md

## What this is

Next.js 16 (App Router + Turbopack) chat UI that proxies to an **AstrBot** AI backend. Chinese-language UI (`lang="zh-CN"`). No monorepo, no test suite, no linter configured.

## Commands

```bash
npm run dev      # dev server with Turbopack
npm run build    # production build with Turbopack
npm run start    # production serve
```

No `lint`, `test`, `format`, or `typecheck` scripts exist. TypeScript strict mode is on in `tsconfig.json`.

## Environment

Two required env vars (in `.env.local`, not committed):

- `ASTRBOT_API_KEY` — Bearer token for AstrBot API
- `ASTRBOT_BASE_URL` — AstrBot API base URL (default: `http://localhost:6185/api/v1`)

## Architecture

```
app/
  layout.tsx          # Root layout, wraps in ChatProvider
  page.tsx            # Main page: Sidebar + ChatContainer
  api/chat/route.ts   # Proxies chat requests to AstrBot (SSE streaming)
  api/upload/route.ts # Proxies file uploads to AstrBot
components/
  Chat/               # ChatContainer, ChatInput, MessageBubble, FileUploader
  Sidebar/            # Sidebar, SessionList
  Settings/           # SettingsPanel, HelpPanel
  UI/                 # Modal
context/
  ChatContext.tsx      # All chat state (sessions, messages, uploads) via React Context
lib/
  astrbot.ts          # AstrBot API client (server-side + client-side)
  chat.ts             # Message payload builder + SSE stream parser
types/
  index.ts            # All shared TypeScript interfaces
```

## Key quirks

- **Streaming**: Chat responses use SSE. The API route (`app/api/chat/route.ts`) passes through the raw `ReadableStream` from AstrBot. Client parses it in `lib/chat.ts:handleStreamResponse`.
- **localStorage persistence**: Sessions and messages are stored in `localStorage` keyed by session ID (`chat_messages_{sessionId}`). No server-side persistence.
- **Path alias**: `@/*` maps to project root (configured in `tsconfig.json`).
- **Tailwind CSS v4**: Uses `@tailwindcss/postcss` plugin, not the old `tailwindcss` PostCSS plugin. Config is in `postcss.config.mjs`. Theme variables defined as CSS custom properties in `globals.css`.
- **No API auth on client routes**: The `/api/chat` and `/api/upload` routes have no auth middleware — they rely on the AstrBot API key being server-side only.

## Deployment

Vercel. `deploy.bat` / `deploy.sh` run `vercel --prod`. After deploy, set `ASTRBOT_API_KEY` and `ASTRBOT_BASE_URL` in Vercel dashboard → Settings → Environment Variables, then redeploy.
