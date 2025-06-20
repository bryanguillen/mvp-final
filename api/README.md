# API Backend

Express.js backend that provides streaming AI chat responses via OpenAI integration with client-specific configurations managed through Airtable.

## 🚀 Tech Stack

- **Framework**: Express.js with TypeScript
- **AI Integration**: OpenAI GPT-4o via AI SDK
- **Database**: Airtable for client configuration and system prompts
- **Streaming**: Server-sent events for real-time AI responses
- **Deployment**: Vercel-ready with `@vercel/node`
- **CORS**: Configurable cross-origin resource sharing

## ✨ Features

- **Streaming AI Responses**: Real-time GPT-4o responses via server-sent events
- **Multi-tenant Architecture**: Client-specific system prompts via Airtable
- **CORS Configuration**: Flexible origin management for frontend integration
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Robust error management and logging
- **Environment-based Configuration**: Secure credential management

## 🛠️ Development

### Prerequisites
- Node.js 18+
- OpenAI API key
- Airtable account and API key

### Getting Started

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development Server
The server runs on `http://localhost:3000` by default.
