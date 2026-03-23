# CirclePicks

Social place-sharing and recommendation platform. Users share experiences at restaurants, bars, and venues — and discover picks from people they follow.

**Live:** [circlepicks.com](https://circlepicks.com)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Backend / DB | Supabase (Postgres + Auth + Storage + RLS) |
| Styling | Tailwind CSS 3 with custom design tokens |
| i18n | next-intl — pt-BR (default), en-US |
| Server State | React Query (TanStack Query) |
| Auth State | React Context + Supabase Auth (email/password + Google OAuth) |
| Forms | react-hook-form |
| Analytics | Google Tag Manager, Umami, Google Consent Mode V2 |

## Features

- **Personalized Feed** — curated sections: personal, friends, community, and nearby recommendations
- **Experience Sharing** — rate places (3-5 stars), add price range, tags, images (up to 5 with client-side compression), and descriptions
- **Explore** — browse by city or tag, discover trending places with aggregated recommendation counts
- **Google Places Integration** — autocomplete search with deduplication by Place ID, plus manual entry fallback
- **Social Graph** — follow/unfollow users, friends-only visibility, block/report system
- **Bookmarks** — save experiences for later
- **Admin Dashboard** — content moderation, flagged users, grouped reports with action controls
- **Notifications** — in-app alerts for moderation actions
- **Geo-aware i18n** — locale detection via Vercel IP headers with cookie persistence
- **Responsive Design** — mobile-first with bottom nav, desktop with side nav

## Project Structure

```
src/
├── app/
│   ├── [locale]/                          # i18n-aware pages
│   │   ├── page.tsx                       # Landing page (server component)
│   │   ├── auth/                          # Sign-in, sign-up, password reset
│   │   ├── app/                           # Protected routes
│   │   │   ├── page.tsx                   # Feed
│   │   │   ├── add/                       # Add experience (multi-step form)
│   │   │   ├── explore/                   # Explore by city/tag
│   │   │   ├── experience/[id]/[slug]/    # Experience detail
│   │   │   ├── profile/[userId]/          # User profile
│   │   │   └── admin/                     # Admin dashboard
│   │   └── legal/                         # Terms, privacy, EULA
│   └── api/                               # API routes (Next.js Route Handlers)
│
├── features/                              # Feature modules
│   ├── feed/          # components + hooks (useFeed)
│   ├── explore/       # components + hooks (useExplore)
│   ├── add/           # components + hooks (useCreateExperience, useLocationContext)
│   ├── experience-detail/  # components + hooks (useExperience, useToggleBookmark)
│   ├── profile/       # components + hooks (useProfile, useFollow)
│   ├── admin/         # components + hooks (useAdminExperiences, useAdminReports)
│   └── notifications/ # components + hooks (useNotifications)
│
├── components/        # ~35 shared UI components (Button, Avatar, BottomNav, etc.)
│
├── lib/
│   ├── api/endpoints.ts        # Centralized API client
│   ├── auth/AuthContext.tsx     # Auth state provider
│   ├── supabase/               # Server, browser, and admin clients
│   ├── models/index.ts         # Domain types
│   ├── utils/                  # cn(), slugify, timeAgo, imageCompression
│   └── routes.ts               # Three-tier route system
│
├── i18n/routing.ts             # next-intl config
├── locales/                    # en-US.json, pt-BR.json
├── middleware.ts               # Entry point
└── proxy.ts                    # Custom middleware (auth, locale, redirects)
```

## Architecture Decisions

### Three-Tier Routing

Routes are defined once in `src/lib/routes.ts` and consumed three ways:
- **`ROUTE_PATHS`** — raw path strings for middleware matching
- **`routes`** — locale-prefixed builders for programmatic navigation (`router.push`)
- **`routePaths`** — unprefixed paths for next-intl `<Link>` (locale injected automatically)

This eliminates hardcoded paths across the codebase and ensures locale consistency.

### Server/Client Component Boundaries

- **Server Components** handle data fetching, auth checks, and SEO-critical content (landing page, layouts)
- **Client Components** handle interactivity (forms, filters, real-time UI)
- Auth is initialized server-side via `getServerUser()` and passed as initial state to `AuthContext`, avoiding loading flashes on page load

### Feature-Module Architecture

Each feature (`feed`, `explore`, `add`, etc.) is self-contained with its own components and hooks. Hooks encapsulate React Query logic, mutations, and cache invalidation — keeping components focused on rendering.

### API Layer

A single `endpoints.ts` file defines all API methods. Client components call these methods, which hit Next.js API routes, which talk to Supabase. This keeps Supabase credentials server-side and provides a clean contract between client and server.

### Security

- **Row-Level Security (RLS)** on all Supabase tables
- **Three Supabase clients** with different privilege levels: browser (anon key), server (session-aware), admin (service role, bypasses RLS)
- **Middleware auth guard** protects all `/app` routes, with a whitelist for public pages
- **Admin role checks** on both middleware and API route level

### Smart Location Detection

Cascading detection: user locale cookie → Vercel geo header (`x-vercel-ip-country`) → browser GPS → IP-based fallback. Brazilian IPs automatically get pt-BR locale.

### Image Pipeline

Client-side compression via `browser-image-compression` → upload to Supabase Storage via API route → URL stored in database. Supports up to 5 images per experience.

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # type-check
```

## License

Private project - All rights reserved
