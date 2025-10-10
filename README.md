<div align="center">

# 🚀 AI Chat Boot - Backend API

### *Express.js REST API with OpenAI GPT Integration*

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Stripe](https://img.shields.io/badge/Stripe-API-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

**Location:** `D:\All website project\AI Chat boot\AI Chat boot-backend`

</div>

---

## 📋 Overview

This is the backend API server for AI Chat Boot, built with Express.js and TypeScript. It provides RESTful endpoints for authentication, chat management, AI conversations, and payment processing.

## ✨ Features

### 🔐 **Authentication**
- Firebase Admin SDK integration
- JWT token verification middleware
- Secure password hashing with bcrypt
- Email/password authentication
- Google OAuth support
- Password reset functionality

### 💬 **Chat Management**
- Create and manage chat sessions
- Store conversation history in MongoDB
- Rename chat titles
- Delete chats with cascading message removal
- Pagination support for large chat lists

### 🤖 **AI Integration**
- OpenAI GPT-4 API integration
- Context-aware conversations
- Auto-generate chat titles
- Conversation history management
- Custom system prompts
- Error handling and retry logic

### 💳 **Subscription System**
- Stripe payment integration
- Checkout session creation
- Webhook event handling
- Subscription status tracking
- Multiple pricing tiers (Free, Pro, Team)
- Real-time subscription sync

### 👤 **User Management**
- User profile CRUD operations
- Profile picture URL storage
- Display name management
- Subscription plan tracking
- Last login tracking

## 📁 Project Structure

```
D:\All website project\AI Chat boot\AI Chat boot-backend\
│
├── 📂 src/
│   ├── 📂 controllers/              # Request handlers (MVC pattern)
│   │   ├── 📄 auth.controller.ts    # Authentication endpoints
│   │   ├── 📄 chat.controller.ts    # Chat CRUD operations
│   │   ├── 📄 user.controller.ts    # User profile management
│   │   └── 📄 stripe.controller.ts  # Payment processing
│   │
│   ├── 📂 models/                   # Mongoose schemas
│   │   ├── 📄 User.model.ts         # User document schema
│   │   ├── 📄 Chat.model.ts         # Chat session schema
│   │   ├── 📄 Message.model.ts      # Message schema
│   │   └── 📄 Subscription.model.ts # Subscription records
│   │
│   ├── 📂 routes/                   # API route definitions
│   │   ├── 📄 auth.routes.ts        # /api/auth/*
│   │   ├── 📄 chat.routes.ts        # /api/chats/*
│   │   ├── 📄 user.routes.ts        # /api/users/*
│   │   └── 📄 stripe.routes.ts      # /api/stripe/*
│   │
│   ├── 📂 services/                 # Business logic layer
│   │   ├── 📄 ai.service.ts         # OpenAI API calls
│   │   ├── 📄 chat.service.ts       # Chat business logic
│   │   ├── 📄 user.service.ts       # User operations
│   │   └── 📄 stripe.service.ts     # Stripe API integration
│   │
│   ├── 📂 middlewares/              # Express middlewares
│   │   ├── 📄 auth.middleware.ts    # JWT token verification
│   │   ├── 📄 error.middleware.ts   # Global error handler
│   │   └── 📄 validation.middleware.ts # Input validation
│   │
│   ├── 📂 config/                   # Configuration files
│   │   ├── 📄 database.ts           # MongoDB connection
│   │   ├── 📄 firebase.ts           # Firebase Admin SDK
│   │   └── 📄 openai.ts             # OpenAI client setup
│   │
│   ├── 📂 utils/                    # Helper utilities
│   │   ├── 📄 apiResponse.ts        # Standardized API responses
│   │   ├── 📄 logger.ts             # Logging utility
│   │   └── 📄 validators.ts         # Data validation helpers
│   │
│   └── 📄 server.ts                 # Express app entry point
│
├── 📄 .env                           # Environment variables
├── 📄 .env.example                   # Environment template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 package.json                   # Dependencies & scripts
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 nodemon.json                   # Nodemon configuration
└── 📄 README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- ✅ Node.js 20.x or higher
- ✅ MongoDB 7.0+ (local or Atlas)
- ✅ Firebase project with Admin SDK
- ✅ OpenAI API key
- ✅ Stripe account (test mode)

### Installation

```bash
# Navigate to backend directory
cd "D:\All website project\AI Chat boot\AI Chat boot-backend"

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ai-chat-boot
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-boot?retryWrites=true&w=majority

# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx
STRIPE_TEAM_PRICE_ID=price_xxxxxxxxxxxxxxxxxxxxx

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Running the Server

#### Development Mode (with hot reload)
```bash
npm run dev
```
✅ Server starts at `http://localhost:5000`

#### Production Mode
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 🔌 API Endpoints

### 🌐 Public Endpoints

#### Authentication
```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login              # User login
POST   /api/auth/forgot-password    # Password reset
```

### 🔒 Protected Endpoints (Require Authentication)

#### Chat Management
```http
POST   /api/chats                   # Create new chat
GET    /api/chats                   # Get all user chats
GET    /api/chats/:chatId/messages  # Get chat messages
POST   /api/chats/:chatId/messages  # Send message & get AI response
PATCH  /api/chats/:chatId           # Update chat title
DELETE /api/chats/:chatId           # Delete chat
```

#### User Profile
```http
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update profile
```

#### Subscription
```http
POST   /api/stripe/create-checkout-session  # Create payment session
POST   /api/stripe/verify-session           # Verify payment
GET    /api/stripe/subscription              # Get subscription details
POST   /api/stripe/webhook                   # Stripe webhook handler
```

#### Health Check
```http
GET    /api/health                  # Server health status
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```

## 🗄️ Database Models

### User Model
```typescript
{
  uid: String (Firebase UID),
  email: String (unique),
  displayName: String,
  photoURL: String,
  provider: 'email' | 'google',
  subscriptionPlan: 'free' | 'pro' | 'team',
  subscriptionStatus: 'active' | 'canceled' | 'past_due',
  createdAt: Date,
  lastLoginAt: Date
}
```

### Chat Model
```typescript
{
  userId: String,
  title: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```typescript
{
  chatId: ObjectId,
  role: 'user' | 'assistant',
  content: String,
  createdAt: Date
}
```

### Subscription Model
```typescript
{
  userId: String,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  plan: 'pro' | 'team',
  status: 'active' | 'canceled' | 'past_due' | 'trialing',
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: Boolean
}
```

## 🛠️ Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests (if configured)
npm test

# Check TypeScript types
npm run type-check
```

## 🔒 Security Features

- 🔐 **Firebase Authentication** - Token verification on protected routes
- 🛡️ **CORS Protection** - Configurable allowed origins
- ✅ **Input Validation** - Request data validation middleware
- 🔑 **Environment Variables** - Sensitive data in .env file
- 🚫 **Error Handling** - Global error handler middleware
- 📝 **Logging** - Request and error logging
- 🔒 **Password Hashing** - bcrypt for password security

## 🧪 Testing

### Manual Testing with Postman

1. Import the Postman collection (if available)
2. Set environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: Your Firebase JWT token

### Example cURL Requests

#### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "displayName": "John Doe"
  }'
```

#### Create Chat (Authenticated)
```bash
curl -X POST http://localhost:5000/api/chats \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "title": "My First Chat"
  }'
```

#### Send Message
```bash
curl -X POST http://localhost:5000/api/chats/CHAT_ID/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "content": "Hello, AI! How are you?"
  }'
```

## 🌐 Deployment

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

- `MONGODB_URI` - MongoDB connection string
- `OPENAI_API_KEY` - OpenAI API key
- `FIREBASE_*` - Firebase Admin SDK credentials
- `STRIPE_*` - Stripe API keys
- `ALLOWED_ORIGINS` - Frontend URLs

### Deployment Platforms

#### Railway
```bash
railway up
```

#### Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

#### Heroku
```bash
heroku create ai-chat-boot-api
git push heroku main
```

## 📊 Monitoring

### Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-10T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "openai": "connected"
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Test connection
mongo mongodb://localhost:27017/ai-chat-boot
```

### Firebase Authentication Errors
- Verify `FIREBASE_PRIVATE_KEY` has correct line breaks (`\n`)
- Check Firebase project ID matches
- Ensure service account has proper permissions

### OpenAI API Errors
- Verify API key is valid
- Check rate limits
- Ensure sufficient credits

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Stripe API Documentation](https://stripe.com/docs/api)

## 📧 Support

For backend-specific issues:
- 📂 Check the [issues](https://github.com/yourusername/ai-chat-boot/issues) page
- 💬 Contact: backend@aichatboot.com

---

<div align="center">

**Built with Node.js, Express & TypeScript** 💚

*Part of the AI Chat Boot platform*

</div>
