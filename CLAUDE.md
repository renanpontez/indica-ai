# Circle Picks (indica-ai)

Social place-sharing and recommendation platform. Users share experiences at places (restaurants, bars, etc.) and discover recommendations from people they follow.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict)
- **Backend/DB**: Supabase (Postgres + Auth + Storage)
- **Styling**: Tailwind CSS 3 with custom design tokens
- **i18n**: next-intl — pt-BR (default), en-US
- **State**: React Query (server state), React Context (auth), useState (UI)
- **Forms**: react-hook-form
- **Analytics/Consent**: Google Tag Manager (GTM-MTXKB248) via `@next/third-parties`, CookieYes cookie consent (installed via GTM, Google Consent Mode V2), Umami
- **Package manager**: npm

## Commands

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # ESLint
npx tsc --noEmit  # type-check
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/       # Pages with i18n routing
│   ├── api/            # API routes
│   └── layout.tsx      # Root layout
├── features/           # Feature modules (feed, explore, add, profile, experience-detail)
│   └── <feature>/
│       ├── components/ # Feature-specific components
│       └── hooks/      # Feature-specific hooks
├── components/         # Shared UI components
├── lib/
│   ├── api/            # API client (endpoints.ts)
│   ├── auth/           # AuthContext
│   ├── supabase/       # Server + client Supabase clients
│   ├── models/         # Domain types
│   ├── utils/          # Utilities (cn.ts, etc.)
│   └── routes.ts       # All route definitions
├── i18n/               # i18n configuration
├── locales/            # Translation files (en-US.json, pt-BR.json)
└── hooks/              # Shared hooks
```

## Key Conventions

### Routing

Three-tier system in `src/lib/routes.ts`:
- `ROUTE_PATHS` — base path strings
- `routes` — locale-prefixed, for programmatic navigation (`router.push`)
- `routePaths` — without locale prefix, for next-intl `<Link>`

### Links

Always use `Link` from `@/i18n/routing`, NOT `next/link`. Exception: the landing page uses `next/link` with full locale URLs.

### Internationalization

- Client components: `useTranslations('namespace')`
- Server components: `getTranslations('namespace')`
- Translation keys organized by feature namespace in `src/locales/*.json`
- Both locale files must stay in sync

### API Layer

`src/lib/api/endpoints.ts` defines `api.*` methods. Feature hooks (`useExplore`, `useFeed`, etc.) consume these and manage state via React Query or manual fetch+state.

### Supabase Clients

- `createClient()` in `src/lib/supabase/server.ts` — server-side, uses `SUPABASE_SECRET_KEY`
- `createBrowserClient()` in `src/lib/supabase/client.ts` — client-side, uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Auth: email/password + Google OAuth

### Styling

- Custom design tokens: `primary` (#FD512E coral), `dark-grey`, `medium-grey`, `surface`, `divider`
- Use `cn()` from `src/lib/utils/cn.ts` for conditional class merging (clsx + tailwind-merge)
- Loading states: skeleton patterns with `animate-pulse` and `bg-surface`
- No icon library — all icons are inline SVGs

### Components

- `'use client'` directive at component level
- Server components fetch data, client components render UI

## Commit Convention

Conventional commits, lowercase: `feat:`, `fix:`, `docs:`, `refactor:`. Short message, no period at end.

## Important Files

| File | Purpose |
|------|---------|
| `src/lib/routes.ts` | All route definitions |
| `src/lib/api/endpoints.ts` | API client + request types |
| `src/lib/models/index.ts` | Domain types |
| `src/lib/auth/AuthContext.tsx` | Auth state provider |
| `src/lib/supabase/server.ts` | Server Supabase client |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/locales/en-US.json` | English translations |
| `src/locales/pt-BR.json` | Portuguese translations |

## Database Tables (Supabase)

- `users` — id, display_name, username, avatar_url, email
- `places` — id, name, city, country, google_place_id, lat, lng, instagram_handle
- `experiences` — id, user_id, place_id, price_range, tags[], images[], visibility, brief_description
- `bookmarks` — id, user_id, experience_id
- `follow` — id, follower_id, following_id
- `tags` — id, slug, display_name, is_system

## Environments

| | Production | Staging |
|---|---|---|
| **Branch** | `main` | `staging` |
| **Vercel** | Production deployment | Preview deployment |
| **Supabase** | `circlepicks` (`jxrykpyaeqcqkbueexhg`) | `circle-picks-staging` (`utsjtumgfyznjzvpfwos`) |
| **Local env** | `.env.local` | `.env.staging` (copy to `.env.local` to use) |

Workflow: develop on `staging` → push → Vercel Preview. Merge `staging` → `main` → Vercel Production.

## Environment Variables

| Variable | Context |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client — Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client — Supabase anon key |
| `SUPABASE_SECRET_KEY` | Server — Supabase service role key |
| `GOOGLE_PLACES_API_KEY` | Server — Google Places API |
| `NEXT_PUBLIC_ZAPBOLT_URL` | Client — Analytics widget |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Client — Umami analytics |
