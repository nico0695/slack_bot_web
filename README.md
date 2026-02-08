# Slack Bot Web Dashboard

Web interface for the [Slack Bot](https://github.com/nico0695/slack_bot) backend. Built with Next.js 14 (App Router), TypeScript, Supabase Auth, and real-time Socket.io communication.

## Features

- **AI Assistant Chat** - Real-time conversational interface with AI (OpenAI/Gemini) via Socket.io
- **Slack Conversations** - Join channels and chat with real-time message updates
- **Task Management** - Create, view, and manage tasks
- **Alert System** - Create and manage time-based alerts
- **Notes** - Simple note-taking interface
- **Image Gallery** - Browse AI-generated images with pagination
- **Text-to-Speech** - Generate and play TTS audio
- **Admin Panel** - User management dashboard
- **Web Push Notifications** - Browser push notification support via Service Worker

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Auth:** Supabase (email/password)
- **State:** Zustand (with localStorage persistence)
- **Real-time:** Socket.io Client
- **Styling:** Sass (CSS Modules)
- **Forms:** Formik + Zod
- **HTTP:** Axios (client/server split with auto Bearer token injection)

## Quick Start

### Prerequisites

- Node.js (LTS)
- pnpm
- Running instance of the [Slack Bot backend](https://github.com/nico0695/slack_bot) (default: `http://localhost:4000`)
- Supabase project configured

### Installation

```bash
# Clone and install
git clone <repository-url>
cd slack_bot_web
pnpm install

# Configure environment
cp .env .env.local
# Edit .env.local with your credentials

# Development mode
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```bash
# Backend API
NEXT_PUBLIC_BASE_URL=           # Backend API URL (default: http://localhost:4000)

# Socket.io
NEXT_PUBLIC_SOCKET_URL=         # Socket.io server URL (default: http://localhost:4000)
NEXT_PUBLIC_SOCKET_PATH=        # Socket.io path (default: /socket.io)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anonymous key

# Web Push (optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=   # VAPID public key for push notifications
```

## Commands

```bash
pnpm run dev          # Development server with hot reload
pnpm run build        # Production build
pnpm run start        # Start production server (requires build)
pnpm run lint         # Run ESLint
```

## Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (header)/           # Route group with shared header layout
│   │   ├── admin/users/    # User management (protected)
│   │   ├── conversations/  # Slack channel chat
│   │   ├── myAssistant/    # AI assistant + tasks, alerts, notes
│   │   ├── images/[page]/  # Image gallery with pagination (protected)
│   │   ├── textToSpeech/   # TTS interface (protected)
│   │   └── globalConstants/
│   ├── login/
│   └── register/
├── components/             # Reusable UI components
├── services/               # API service layer (one per domain)
├── store/                  # Zustand stores (auth, conversations)
├── config/                 # API and service worker config
└── shared/
    ├── interfaces/         # TypeScript interfaces
    ├── hooks/              # Custom React hooks
    ├── utils/api/          # Fetch utilities (client/server split)
    ├── constants/          # Enums and validation messages
    └── styles/             # Global SCSS variables
```

### Backend Integration

This app connects to the Slack Bot backend which provides:

- **REST API** at `NEXT_PUBLIC_BASE_URL` — CRUD for users, tasks, alerts, notes, images, TTS
- **Socket.io** at `NEXT_PUBLIC_SOCKET_URL` — Real-time chat for assistant and public channels

#### Socket.io Events

```javascript
// Assistant (private)
socket.emit('join_assistant_room', { username, channel: userId })
socket.emit('send_assistant_message', { message, userId, iaEnabled })
socket.on('receive_assistant_message', (data) => {})

// Public channels
socket.emit('join_room', { username, channel })
socket.emit('send_message', { message, username, channel, iaEnabled })
socket.on('receive_message', (data) => {})
```

### Authentication

- Supabase Auth handles signup/signin (email/password)
- Next.js middleware protects `/images/*`, `/textToSpeech`, `/admin/*` routes
- Client-side: Bearer token from localStorage injected via Axios interceptor
- Server-side: Supabase session from cookies

## Deploy

Standard Next.js deployment. Compatible with Vercel out of the box.

```bash
pnpm run build && pnpm run start
```

## License

ISC
