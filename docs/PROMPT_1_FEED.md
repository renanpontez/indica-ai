# Feed/Home Screen - Figma Design Prompt

## Design System Foundation
**Colors:**
- Primary: #111111 | Accent: #007AFF | Background: #FFFFFF
- Surface: #F6F7F9 | Chip BG: #EDEEF1 | Text Secondary: #555555 | Divider: #E4E6EA

**Typography:** Inter font
- Title Large: 22px | Title Medium: 19px | Body: 16px | Small: 14px

**Spacing:** 4px / 8px / 16px / 24px | **Border Radius:** 12px (chips) / 14px (cards)

---

## Screen Layout

**Top Bar:** "Friends Places" title (left or centered)
**Content:** Scrollable vertical list of experience cards
**Bottom:** Fixed navigation bar (Feed active, Add, Profile, Explore grayed)

---

## Experience Card Component

**Structure:**
```
White card, 1px #E4E6EA border, 14px radius, 16px padding, subtle shadow

┌─ [32px Avatar] Sarah Johnson ──────────────────┐
│  2d ago                        [Bookmark Icon] │
├────────────────────────────────────────────────┤
│  [Optional 16:9 Image Thumbnail]               │
├────────────────────────────────────────────────┤
│  Blue Bottle Coffee (Title-m, bold, truncate)  │
│  SF, USA (Small, text-secondary)               │
│                                                 │
│  [$$] [Cafe] [Coffee] [Breakfast]              │
│  @bluebottlecoffee (Small, text-secondary)     │
└────────────────────────────────────────────────┘
```

**Specifications:**
- User avatar: 32px circle, left aligned
- Timestamp: Small text, text-secondary
- Bookmark icon: 24px, top-right corner, text-secondary
- Image: Full width if present, 16:9 ratio, 8px margin
- Place name: Title-m, one line with ellipsis, text-primary
- Location: Small, text-secondary
- Price chip: Surface bg (#F6F7F9), 8px×12px padding, 12px radius
- Category chips: Chip-bg (#EDEEF1), horizontal scroll if overflow
- Instagram: Small, text-secondary, optional
- 8px gap between all elements

---

## Bottom Navigation

**4 tabs, 60px height, white bg, top border:**
1. **Feed** (Home icon) - Active state: #007AFF
2. Add (Plus icon) - Inactive: #555555
3. Profile (Person icon) - Inactive: #555555
4. Explore (Search icon) - Inactive/grayed: #555555

Each tab: 24px icon + label below (small text), 44px min touch target

---

## Empty State

Center-aligned vertical stack:
- Large people/community icon (48px, text-secondary)
- "No places yet" (Title-m, bold, text-primary)
- "Follow friends to discover places they love." (Body, text-secondary)

---

## Deliverable
Mobile-first design (320-414px). Show 3-4 experience cards with real content. Include both empty state and filled state. Ensure 44px touch targets, AA color contrast.
