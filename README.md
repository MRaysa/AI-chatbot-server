# AI Chat Boot - Backend

Backend API for AI Chatbot application built with Express.js, MongoDB, and Firebase Authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/verify` - Verify Firebase token

### Chats
- GET `/api/chats` - Get user's chats
- POST `/api/chats` - Create new chat
- DELETE `/api/chats/:id` - Delete chat

### Messages
- GET `/api/messages/:chatId` - Get chat messages
- POST `/api/messages` - Send message and get AI response
