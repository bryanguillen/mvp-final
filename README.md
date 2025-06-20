# AI Chat Bot Platform

A full-stack AI chat bot platform built as a monorepo with three main components: an Express API backend, a React frontend, and a marketing landing page.

## 🏗️ Architecture

This project is structured as a monorepo with the following components:

- **[`api/`](./api/README.md)** - Express.js backend that streams OpenAI responses and manages client configurations via Airtable
- **[`bot-fe/`](./bot-fe/README.md)** - React frontend chat interface built with modern UI components  
- **[`static-site/`](./static-site/README.md)** - Marketing landing page demonstrating the end-to-end functionality

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd mvp
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Copy and configure environment variables in api/
   cp api/.env.example api/.env
   # Edit api/.env with your OpenAI and Airtable credentials
   ```

3. **Start all services**
   ```bash
   # Terminal 1: API Server
   cd api && npm run dev
   
   # Terminal 2: Frontend
   cd bot-fe && npm run dev
   
   # Terminal 3: Static Site (optional)
   cd static-site && python -m http.server 8000
   ```

## 📋 Prerequisites

- Node.js 18+
- OpenAI API key
- Airtable account and API key

## 🎯 Use Cases

- **White-label Chat Bots**: Deploy custom AI assistants for different clients
- **Marketing Integration**: Embed chat bots in marketing sites with custom branding
- **Multi-tenant AI**: Manage multiple AI personalities through Airtable configuration

## 📖 Component Documentation

Each component has detailed documentation in their respective directories:

- **[API Documentation](./api/README.md)** - Backend setup, endpoints, and Airtable integration
- **[Frontend Documentation](./bot-fe/README.md)** - React app development and UI components  
- **[Static Site Documentation](./static-site/README.md)** - Marketing page customization
