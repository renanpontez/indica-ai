# Circle Picks - MVP Growth Implementation Plan

## Pre-Implementation: Rollback Required

Before starting, rollback partial implementation changes:
```bash
git restore src/lib/models/index.ts src/lib/routes.ts src/lib/supabase/database.types.ts src/locales/en-US.json
rm -rf src/app/api/invites/
rm supabase/migrations/20260122000001_growth_features.sql
```

---

## Context
MVP constraints: low users, low content, need to drive signups AND engagement.

---

## Implementation Priority (Recommended Order)

| Priority | Feature | Effort | Impact | Dependencies |
|----------|---------|--------|--------|--------------|
| **P0** | Database Migration | Low | Foundation | None |
| **P1** | Invite Links with Context | Low | High | Migration |
| **P1** | Hidden Gems Badge | Low | Medium | None |
| **P2** | Shareable Profile Cards | Medium | High | Invite Links |
| **P2** | Activity Feed | Medium | High | Migration |
| **P3** | First Pick Onboarding | Medium | High | None |
| **P4** | Push Notifications | Medium | Medium | Activity Feed |
| **P5** | Wishlist-to-Review Loop | Medium | Medium | None |
| **P6** | Ask My Circle | High | Medium | Activity Feed |

---

## Phase 1: Foundation + Quick Wins

### 1.1 Database Migration (P0)
Create single migration with all new tables:

```sql
-- Tables: invites, notifications, circle_questions, circle_answers, push_subscriptions
-- Columns: users.invited_by, users.has_completed_onboarding, bookmarks.visited_at
-- Triggers: Auto-create notifications on bookmark/follow/new_pick
```

**File:** `supabase/migrations/20260122000001_growth_features.sql`

### 1.2 Invite Links (P1)
**What:** `/invite/[code]` landing page showing inviter's profile + top picks

**Files to create:**
- `src/app/api/invites/route.ts` - Create/get invites
- `src/app/api/invites/claim/route.ts` - Claim invite + auto-follow
- `src/app/[locale]/invite/[code]/page.tsx` - Public landing page

**Files to modify:**
- `src/lib/routes.ts` - Add `/invite` to public routes
- `src/app/api/auth/signup/route.ts` - Handle invite_code param
- `src/lib/api/endpoints.ts` - Add invite API methods
- `src/locales/*.json` - Add translations

### 1.3 Hidden Gems Badge (P1)
**What:** Badge on ExperienceCard for places with 2-5 recommendations

**Files to modify:**
- `src/features/feed/components/ExperienceCard.tsx` - Add badge
- `src/locales/*.json` - Add translations

---

## Phase 2: Sharing + Activity

### 2.1 Shareable Profile Cards (P2)
**What:** Generate OG images for Instagram Stories / WhatsApp sharing

**Files to create:**
- `src/app/api/og/profile/route.tsx` - Generate profile card image
- `src/features/profile/components/ShareProfileModal.tsx` - Share UI

**Files to modify:**
- `src/app/[locale]/app/profile/[userId]/page.tsx` - Add share button

### 2.2 Activity Feed (P2)
**What:** In-app notification feed with unread badge

**Files to create:**
- `src/app/api/notifications/route.ts` - Get/mark-read notifications
- `src/app/[locale]/app/activity/page.tsx` - Activity feed page
- `src/features/activity/` - New feature module
  - `components/NotificationItem.tsx`
  - `components/ActivityList.tsx`
  - `hooks/useNotifications.ts`

**Files to modify:**
- `src/components/BottomNav.tsx` - Add unread badge
- `src/lib/api/endpoints.ts` - Add notification API methods

---

## Phase 3: Retention Features

### 3.1 First Pick Onboarding (P3)
**What:** Post-signup modal prompting first pick creation

**Files to create:**
- `src/features/onboarding/components/FirstPickModal.tsx`
- `src/features/onboarding/hooks/useOnboarding.ts`

**Files to modify:**
- `src/app/[locale]/app/layout.tsx` - Show modal for new users
- `src/app/api/profile/route.ts` - Update onboarding status

### 3.2 Push Notifications (P4)
**What:** Web Push API with service worker

**Files to create:**
- `public/sw.js` - Service worker
- `src/app/api/push/subscribe/route.ts`
- `src/app/api/push/send/route.ts`
- `src/features/push/hooks/usePushNotifications.ts`

---

## Phase 4: Engagement Loops

### 4.1 Wishlist-to-Review Loop (P5)
**What:** "I visited" button on bookmarks + review prompt

**Files to modify:**
- `src/features/profile/components/BookmarksList.tsx` - Add visited button
- `src/app/api/bookmarks/[id]/route.ts` - Add PATCH for visited_at
- `src/features/add/` - Simplified quick-add for review

### 4.2 Ask My Circle (P6)
**What:** Post questions, get answers from followers

**Files to create:**
- `src/app/api/questions/route.ts`
- `src/app/api/questions/[id]/answers/route.ts`
- `src/app/[locale]/app/ask/page.tsx`
- `src/features/circle-questions/` - New feature module

---

## Growth Loops

```
SHARE LOOP
Share card on Instagram -> Friend sees -> Signs up -> Creates picks -> Shares

INVITE LOOP
Invite friend -> They see your picks -> Create their own -> Invite their friends

CONTENT LOOP
Bookmark -> Visit -> Prompted to review -> Create pick -> Friends bookmark
```

---

## Verification Checklist

1. **Invite Flow:**
   - [ ] Create invite from profile
   - [ ] Share link to non-user
   - [ ] Non-user sees inviter's profile + picks
   - [ ] Signup via invite
   - [ ] Verify auto-follow + attribution

2. **Share Cards:**
   - [ ] Generate OG image with avatar + picks
   - [ ] Share to Instagram Stories
   - [ ] Verify deep link opens app/invite page

3. **Notifications:**
   - [ ] Follow user → notification appears
   - [ ] Bookmark pick → notification appears
   - [ ] Create pick → followers notified
   - [ ] Unread badge shows in nav

4. **Onboarding:**
   - [ ] New signup sees first-pick modal
   - [ ] Complete first pick → modal dismissed
   - [ ] Skip → modal dismisses, shows later
