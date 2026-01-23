# Profile/My Suggestions Screen - Figma Design Prompt

## Design System Foundation
**Colors:**
- Primary: #111111 | Accent: #007AFF | Background: #FFFFFF
- Surface: #F6F7F9 | Chip BG: #EDEEF1 | Text Secondary: #555555 | Divider: #E4E6EA

**Typography:** Inter font
- Title Large: 22px | Title Medium: 19px | Body: 16px | Small: 14px

**Spacing:** 4px / 8px / 16px / 24px | **Border Radius:** 12px (chips) / 14px (cards)

---

## Screen Layout

**Top Bar:** "Profile" (centered)

**User Header Section** (Surface bg #F6F7F9, 16px padding):
```
┌─────────────────────────────────────┐
│  ┌────────┐                          │
│  │   JD   │  John Doe (Title-m)      │
│  │  80px  │  @johndoe (Small)        │
│  └────────┘  Edit Profile (Accent)   │
└─────────────────────────────────────┘
```

**User Avatar:**
- 80px circle
- Image cover fit OR initials fallback
- Initials: Text-primary on surface, centered

**User Info:**
- Name: Title-m, text-primary, left of avatar
- Username: Small, text-secondary, below name
- Edit Profile: Accent color text, small size, tappable link

---

## Tab Navigation

**2 Tabs, white bg, full width:**
- "Experiences" | "Bookmarks"
- Active tab: Accent color (#007AFF), 2px bottom border
- Inactive tab: Text-secondary (#555555)
- 44px min height per tab, centered text

---

## Content Area

### Filled State (Experiences Tab)
Scrollable vertical list of experience cards (reuse feed card design):

```
┌─ [32px Avatar] John Doe ───────────────────┐
│  1w ago                      [Bookmark Icon]│
├────────────────────────────────────────────┤
│  [Optional 16:9 Image]                      │
├────────────────────────────────────────────┤
│  Tartine Bakery (Title-m, bold)            │
│  San Francisco, USA (Small)                 │
│                                             │
│  [$$$] [Bakery] [Coffee] [Breakfast]       │
│  @tartinebakery                             │
└────────────────────────────────────────────┘
```

Same card specs as feed:
- White bg, 1px divider border, 14px radius, 16px padding
- 8px gap between elements
- Subtle shadow

### Empty State (No Experiences)
Center-aligned vertical stack:
- Large location icon (48px, text-secondary)
- "No places yet" (Title-m, bold, text-primary)
- "Save places to build your profile." (Body, text-secondary)

### Bookmarks Tab
- Same layout as Experiences
- Shows places bookmarked by user
- Empty state: "No bookmarks yet" / "Bookmark places to find them here."

---

## Bottom Navigation

**4 tabs, 60px height, white bg, top border:**
1. Feed (Home icon) - Inactive: #555555
2. Add (Plus icon) - Inactive: #555555
3. **Profile** (Person icon) - Active state: #007AFF
4. Explore (Search icon) - Inactive/grayed: #555555

Each tab: 24px icon + label below (small text), 44px min touch target

---

## Deliverable
Mobile-first design (320-414px). Show both Experiences and Bookmarks tabs. Include filled state with 2-3 cards AND empty state for both tabs. Ensure profile header is sticky or scrolls with content.
