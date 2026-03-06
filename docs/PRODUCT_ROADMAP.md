# Circle Picks - Product & Marketing Roadmap

## Positioning

**Tagline:** "Stop trusting strangers. Discover places from people you actually know."

**Value Prop:** Trust-filtered recommendations from your personal network, not anonymous reviews.

| Competitor | Trust Source | Circle Picks Advantage |
|------------|--------------|------------------------|
| Yelp | Strangers | Friends you know |
| Google Maps | Algorithm | Personal taste match |
| TripAdvisor | Tourists | Local insiders |

---

## "Wow" Features

### Tier 1 - Build Now

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Smart Wishlist Loop** | Bookmark → Visit → Prompt to recommend | Converts passive users to content creators |
| **Ask My Circle** | Post questions, get friend answers in 24hrs | Reactivates dormant users, creates urgency |
| **Map Explorer** | Visual map with filters (tags, price, distance) | Instant utility, beats Google with trust layer |

### Tier 2 - Next Quarter

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Hidden Gems** | Badge for places with 2-5 recommendations | Creates insider knowledge feeling |
| **Taste Match Score** | "You and Alex: 87% match" | Gamifies following, shareable |
| **Vouch System** | Friends endorse others' recommendations | Low-effort engagement, builds trust |

### Tier 3 - Seasonal

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Travel Pack** | Auto-generated city guides from friends | High value for travelers |
| **Recommendation Receipts** | Spotify Wrapped-style annual stats | Viral sharing moment |
| **Map Overlap** | Visual map of shared taste with a friend | Shareable for couples/BFFs |

---

## Feature Details

### 1. Smart Wishlist → Review Loop

```
Bookmark → Visit (detected) → "How was it?" prompt → One-tap recommend → Friends see → They bookmark
```

**Triggers:**
- Location proximity detection
- Manual "I visited" check-in
- Weekly digest: "5 places to review"

**Gamification:** "You've reviewed 8/12 visited spots this month"

---

### 2. Ask My Circle

**Flow:**
1. User posts: "Best pizza in Brooklyn under $20?"
2. Friends get notified
3. Friends tag existing picks or add new ones
4. 24hr expiration with summary

**Viral:** Non-users receive SMS invites when tagged.

---

### 3. Map Explorer with Smart Filters

**Filters:**
- Tags: Coffee, Dinner, Brunch, Date Night, Family
- Price: $, $$, $$$, $$$$
- Distance: 1mi, 5mi, 15mi
- Source: All friends, Specific friend, High match only

**UI:** Friend avatars on map pins. Tap → see recommender + note.

---

## Growth Loops

```
┌─────────────────────────────────────────────────────┐
│  ASK & ANSWER                                       │
│  User asks → Friends answer → Friends ask → Repeat  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  WISHLIST CONVERSION                                │
│  Save → Visit → Recommend → Friends save → Repeat   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  TASTE DISCOVERY                                    │
│  Follow → See match % → Follow similar → Better feed│
└─────────────────────────────────────────────────────┘
```

---

## Key Metrics

| Metric | Target |
|--------|--------|
| Wishlist → Recommendation conversion | 40% |
| Day 7 retention | 50% |
| Invites sent per user | 5+ |
| Weekly recommendations per active user | 2+ |

---

## Immediate Actions

1. **Week 1-2:** Build Smart Wishlist → Review Loop
2. **Week 2-3:** Launch Ask My Circle
3. **Week 3-4:** Ship Map Explorer with filters
4. **Ongoing:** Shareable profile cards for Instagram Stories

---

## Technical Infrastructure Roadmap

### Testing Setup (Priority: High)

Currently the project has zero testing infrastructure. Recommended stack:

| Tool | Purpose | Why |
|------|---------|-----|
| **Vitest** | Unit & integration tests | 10-20x faster than Jest, native TS/ESM, Jest-compatible API |
| **React Testing Library** | Component tests | Test by user behavior, industry standard, works with Vitest |
| **Playwright** | E2E tests | Official Next.js support, fast, multi-browser, auto-waiting |

**Dependencies:**
```bash
# Unit + Component
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @vitest/coverage-v8

# E2E
npm install -D @playwright/test
npx playwright install chromium
```

**New files needed:**
- `vitest.config.ts` — Vitest config (jsdom env, `@/` alias, setup file)
- `vitest.setup.ts` — Import `@testing-library/jest-dom/vitest`
- `playwright.config.ts` — Playwright config (chromium, dev server integration)

**Scripts to add to package.json:**
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

**Priority test targets:**
1. `cn()` utility — simple unit test to validate setup works
2. `Chip` component — component test with RTL
3. Add experience flow — E2E test with Playwright
4. Auth flows — E2E test
5. API helpers (`src/lib/api/endpoints.ts`) — unit tests with mocked fetch
