# Authentication Setup Guide

This document explains the authentication system implemented in Friends Places.

## Overview

The app uses **NextAuth.js** (Auth.js) for authentication with support for:
- **Google OAuth Sign In/Up**
- **Email/Password Sign Up and Sign In**

## Features

- ✅ Google OAuth integration
- ✅ Email/password authentication
- ✅ Protected routes (automatic redirect to sign in)
- ✅ Session management with JWT
- ✅ User menu with sign out
- ✅ Mock mode for development without backend
- ✅ TypeScript types for full type safety

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   └── config.ts              # NextAuth configuration
│   ├── hooks/
│   │   └── useAuth.ts             # Auth hook for components
│   └── models/
│       └── index.ts               # Auth types (AuthUser, Session, etc.)
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.ts       # NextAuth API route
│   │       └── signup/
│   │           └── route.ts       # Sign up API endpoint
│   └── [locale]/
│       └── auth/
│           ├── signin/
│           │   └── page.tsx       # Sign in page
│           ├── signup/
│           │   └── page.tsx       # Sign up page
│           └── error/
│               └── page.tsx       # Auth error page
├── components/
│   ├── UserMenu.tsx               # User menu dropdown
│   ├── AuthGuard.tsx              # Loading state for auth
│   └── Providers.tsx              # SessionProvider wrapper
├── middleware.ts                   # Route protection
└── types/
    └── next-auth.d.ts             # NextAuth type extensions
```

## Environment Variables

Add these to your `.env.local`:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Mode
NEXT_PUBLIC_USE_MOCK_API=true
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to `.env.local`

## Usage

### Using the Auth Hook

```tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not signed in</div>;

  return <div>Welcome, {user.display_name}!</div>;
}
```

### Protecting Pages

All pages are automatically protected by the middleware. To make a page public, add it to the `publicRoutes` array in [src/middleware.ts](src/middleware.ts:18):

```typescript
const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/error', '/about'];
```

### Sign Out

```tsx
import { signOut } from 'next-auth/react';

function handleSignOut() {
  signOut({ callbackUrl: '/auth/signin' });
}
```

## Mock Mode

When `NEXT_PUBLIC_USE_MOCK_API=true`, authentication works without a backend:

- Sign up creates a mock user
- Sign in accepts any email/password
- Google sign in works but creates mock user
- Session is stored locally via JWT

This is perfect for frontend development before backend is ready.

## Production Mode

When `NEXT_PUBLIC_USE_MOCK_API=false`, the app will make real API calls to:

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/google` - Complete Google OAuth

The backend must implement these endpoints and return data matching the [AuthUser](src/lib/models/index.ts:98) type.

## Session Management

- Sessions use JWT (no database required)
- Session expires after 30 days
- Session includes: id, email, display_name, username, avatar_url, provider
- Refresh is automatic on page navigation

## Security Features

- Passwords hashed with bcryptjs (10 rounds)
- JWT signed with NEXTAUTH_SECRET
- CSRF protection via NextAuth
- Secure cookies in production (httpOnly, secure, sameSite)
- Protected routes via middleware

## User Interface

### Sign In Page
- Email/password form
- Google sign in button
- Link to sign up page
- Error handling

### Sign Up Page
- Display name, username, email, password fields
- Password confirmation
- Google sign up button
- Link to sign in page
- Validation (8+ char password, 3+ char username)

### User Menu
- Shows authenticated user avatar
- Display name and username
- Sign out button
- Appears in TopBar component

## Type Safety

All auth types are fully typed:

```typescript
interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  provider: 'google' | 'email';
  created_at: string;
}
```

Session and JWT callbacks are typed via [src/types/next-auth.d.ts](src/types/next-auth.d.ts).

## Testing

### Test Sign In (Mock Mode)
1. Start dev server: `npm run dev`
2. Go to `http://localhost:3001`
3. You'll be redirected to sign in
4. Click "Sign up" and create account
5. Or enter any email/password to sign in

### Test Google Sign In
1. Set up Google OAuth credentials
2. Add credentials to `.env.local`
3. Restart dev server
4. Click "Continue with Google"
5. Complete OAuth flow

## Troubleshooting

### "Invalid credentials" error
- In mock mode, any credentials should work
- In production mode, check backend API is running

### "Configuration" error
- Check `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain

### Google OAuth not working
- Verify redirect URIs in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure using correct environment (dev vs prod URLs)

### Infinite redirect loop
- Clear browser cookies
- Check middleware is not protecting auth routes
- Verify `NEXTAUTH_URL` is correct

## Next Steps

When integrating with backend:

1. Set `NEXT_PUBLIC_USE_MOCK_API=false`
2. Implement backend endpoints for signup, signin, google
3. Update `NEXT_PUBLIC_API_BASE_URL` to point to backend
4. Ensure backend returns data matching `AuthUser` type
5. Test end-to-end flow

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [JWT Strategy](https://next-auth.js.org/configuration/options#session)
