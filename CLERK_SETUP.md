# Clerk Authentication Setup

This document explains how to set up and integrate Clerk authentication with our Next.js application and AnyCable real-time features.

## Environment Configuration

Add the following to your `.env.local` file:

```bash
# --- Clerk Auth ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsudXNlcGl4ZWxmbG93LmNvbSQ
CLERK_SECRET_KEY=sk_live_qA9j8ckBW3ceOgjQ6Jbw0A1OSU8TvKDHaZNERJzKGf
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Clerk JWT Template for AnyCable

AnyCable requires JWT-based authentication. Create a JWT template in Clerk:

1. Go to the Clerk Dashboard
2. Navigate to JWT Templates section
3. Create a new template named "anycable"
4. Add the following JSON as the template:

```json
{
  "name": "{{user.first_name}} {{user.last_name}}",
  "email": "{{user.primary_email_address}}",
  "user_id": "{{user.id}}"
}
```

## Middleware Setup

Create a `middleware.ts` file in the project root:

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/", 
    "/sign-in", 
    "/sign-up", 
    "/api/webhook",
    // Add other public routes here
  ]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Root Layout Integration

Wrap your application with `ClerkProvider` in `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

## Authentication Pages

### Sign-In Page

Create `src/app/sign-in/[[...sign-in]]/page.tsx`:

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
```

### Sign-Up Page

Create `src/app/sign-up/[[...sign-up]]/page.tsx`:

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  );
}
```

## Using Authentication in Components

### Client Components

```typescript
'use client';

import { useUser } from "@clerk/nextjs";

export default function ProfileComponent() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <h1>Hello, {user.firstName}!</h1>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### Server Components

```typescript
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();
  
  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>Hello, {user.firstName}!</h1>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
    </div>
  );
}
```

### Server Actions

```typescript
'use server';

import { currentUser } from "@clerk/nextjs/server";

export async function getUserData() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("Not authenticated");
  }
  
  // Safe to return since it will be serialized
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.emailAddresses[0]?.emailAddress,
  };
}
```

## AnyCable Integration with Clerk

### JWT Authentication Flow

1. User authenticates with Clerk
2. AnyCable cable instance requests JWT from Clerk via server-side helper
3. JWT is included in WebSocket connection headers
4. AnyCable server verifies JWT using Clerk's JWKS endpoint

### Internal Implementation

The `anycable.ts` file handles token fetching:

```typescript
'use client';

import { createCable } from '@anycable/web';

// Simple cable instance with auth handled internally
export const cable = createCable(process.env.NEXT_PUBLIC_ANYCABLE_URL || '');
```

Server-side JWT fetching happens in `broadcaster.ts`:

```typescript
'use server';

// Custom broadcaster implementation for server-side usage
export async function broadcast(channel: string, id: Record<string, string>, data: Record<string, any>) {
  // Implementation details...
}
```

## Testing Authentication

1. Start the development server: `pnpm dev`
2. Visit http://localhost:3000/sign-in
3. Sign in with test credentials
4. You should be redirected to /dashboard
5. Open browser console to verify WebSocket connection is authenticated

## Troubleshooting

### JWT Issues

- Check the JWT template configuration in Clerk dashboard
- Verify JWKS URL is accessible
- Ensure the token is correctly passed to AnyCable

### Authentication Flow Issues

- Check middleware configuration
- Verify public routes are correctly set
- Check browser console for authentication errors

### AnyCable Connection Issues

- Verify environment variables for AnyCable URLs
- Check that JWT is being fetched correctly
- Check server logs for authentication errors 