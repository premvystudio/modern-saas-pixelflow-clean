
# Pixel & Flow

A modern creative SaaS platform built with performance and developer experience in mind. Designed to deliver world-class UX with real-time interactions, fluid animations, and lightning-fast response times.

## 🚀 Tech Stack

### Core Framework
- **[Next.js 15.3](https://nextjs.org/docs)** - React framework with App Router, server components, and edge runtime
- **[React 19](https://react.dev/)** - UI component library with server components
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Type-safe coding experience

### Real-Time Capabilities
- **[AnyCable](https://docs.anycable.io/)** - Low-latency WebSocket server with Redis backend
  - Powers real-time design updates, notifications, and user presence
  - Edge-compatible broadcaster implementation
  - Optimized channels for different update types

### Authentication & Storage
- **[Clerk](https://clerk.com/docs)** - User authentication and profile management
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - Asset storage with CDN distribution

### Styling & Animation
- **[TailwindCSS 4](https://tailwindcss.com/docs)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Declarative animations
- **[Motion One](https://motion.dev/)** - High-performance Web Animations API

### State & Form Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Performance-focused forms
- **[Zod](https://zod.dev/)** - Type-safe validation

### AI Integration
- **[OpenAI](https://platform.openai.com/docs/api-reference)** - GPT-4o with Image API integration

## 🔌 Get Started

```bash
# Clone the repository
git clone https://github.com/your-org/pixelflow.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

## 📐 Architecture Overview

### Application Layers

```
├── UI Layer (React Components)
│   ├── Server Components - Data fetching, auth checks
│   └── Client Components - Interactivity, animations
│
├── Business Logic Layer
│   ├── Server Actions - Data mutations, validations
│   └── Hooks - Client-side state and behavior
│
├── Real-Time Layer
│   ├── AnyCable - WebSockets, channels
│   └── Redis - Pub/Sub, job queues
│
└── Data Storage Layer
    ├── Vercel Blob - Asset storage
    └── Database - Data persistence
```

### Key Design Patterns

1. **Server/Client Boundary Management**
   - Clean separation of server and client code
   - Proper export patterns with 'use server' directives
   - Runtime-specific implementations (Edge vs Node.js)

2. **Real-Time First Architecture**
   - Channel-based communication
   - Progress streaming for long-running operations
   - Optimistic UI updates

3. **Progressive Enhancement**
   - Skeleton → Preview → Full resolution asset pipeline
   - Graceful degradation for network issues

## 🛠️ Development Workflow

- **Server Components** - Use for data fetching and initial rendering
- **Client Components** - Use for interactive elements with 'use client' directive
- **Server Actions** - Use for data mutations with 'use server' directive
- **AnyCable** - Use for real-time updates via channels
- **TypeScript** - Leverage for type safety across the codebase

## 🔄 Real-Time Updates Pattern

```typescript
// Server-side: Broadcast updates
'use server'
async function processDesign(id: string) {
  // Process design and periodically:
  await broadcast('DesignChannel', { id }, { 
    status: 'processing', 
    progress: 50 
  })
}

// Client-side: Subscribe to updates
'use client'
function DesignPreview({ id }) {
  const [progress, setProgress] = useState(0)
  
  useChannel('DesignChannel', { id }, (data) => {
    setProgress(data.progress)
  })
  
  return <ProgressBar value={progress} />
}
```

## 📚 Additional Resources

- [AnyCable Integration Guide](./ANYCABLE_INTEGRATION_GUIDE.md)
- [Architecture Decisions](./ARCHITECTURE.md)
- [Performance Optimization Guide](./PERFORMANCE.md)

## 🚧 Project Status

Active development - Optimized for production use with continuous improvements.
