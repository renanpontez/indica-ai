# Figma AI Design Prompt: Friends Places Social Recommendations App

## 🎯 Project Overview
Design a **mobile-first social recommendations web app** where users can quickly save, view, and browse friends' recommended places in ~15 seconds.

**Core Value**: Make it extremely easy to save a place you liked and let your friends discover it through a simple, trust-based social graph.

---

## 📐 Design System & Tokens

### Color Palette
```
Primary:       #111111 (black)
Accent:        #007AFF (iOS blue)
Background:    #FFFFFF (white)
Surface:       #F6F7F9 (light gray)
Chip BG:       #EDEEF1 (lighter gray)
Text Primary:  #111111 (black)
Text Secondary: #555555 (medium gray)
Divider:       #E4E6EA (border gray)
```

### Typography
- **Font Family**: Inter (or system-ui fallback)
- **Sizes**:
  - Title Large: 1.4rem / 22px (page titles)
  - Title Medium: 1.2rem / 19px (section headers)
  - Body: 1rem / 16px (main text)
  - Small: 0.85rem / 14px (captions, metadata)

### Spacing Scale
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px

### Border Radius
- Chip: 12px (for category/price chips)
- Surface: 14px (for cards, containers)

### Minimum Touch Targets
- 44px minimum for all interactive elements (buttons, tabs)
- Color contrast: WCAG AA compliant

---

## 📱 Screen Sizes & Breakpoints
- **Primary Target**: Mobile 320-414px
- **Tablet**: ~768px
- **Desktop**: 1024+ (max-width 960-1200px container)

---

## 🗺️ Navigation Structure

### Bottom Navigation (4 Tabs)
Fixed at bottom of screen, always visible:

1. **Feed** (Home icon)
   - Shows experiences from followed users
   - Default/home screen

2. **Add** (Plus icon)
   - Quick Add flow
   - Most important action

3. **Profile** (Person icon)
   - User's experiences and bookmarks
   - Shows current user

4. **Explore** (Search/Compass icon)
   - Placeholder for P1
   - Grayed out or minimal for MVP

**Design Requirements**:
- Each tab: Icon + label below
- Active state: Accent color (#007AFF)
- Inactive state: Text secondary (#555555)
- Height: 60px minimum
- Clear visual feedback for active tab

---

## 🖼️ Screen Designs (In Priority Order)

### 1. FEED SCREEN (Home)

**Layout**:
- Top Bar: "Friends Places" title (centered or left)
- Content: Scrollable list of experience cards
- Bottom: Navigation bar

**Experience Card** (Key Component):
```
┌─────────────────────────────────────┐
│ [Avatar] Sarah Johnson              │ ← User info
│          2d ago                      │
│                                      │
│ [Optional Thumbnail Image]           │ ← 16:9 ratio if present
│                                      │
│ Blue Bottle Coffee                   │ ← Place name (bold, truncate)
│ SF, USA                              │ ← City + Country
│                                      │
│ [$$] [Cafe] [Coffee] [Breakfast]    │ ← Price + Category chips
│ @bluebottlecoffee                    │ ← Instagram (if present)
│                                      │
│ [Bookmark Icon]                      │ ← Top right corner
└─────────────────────────────────────┘
```

**Card Specifications**:
- White background (#FFFFFF)
- 1px border: #E4E6EA
- 14px border radius
- 16px padding
- 8px gap between elements
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))
- User avatar: 32px circle, left aligned
- Price chip: Surface bg, 12px radius
- Category chips: Chip-bg, 12px radius, horizontal scroll if needed
- Place name: Title-m size, one line with ellipsis
- Bookmark icon: 24px, top-right, text-secondary color

**Empty State**:
```
┌─────────────────────────────────────┐
│                                      │
│         [Large Icon]                 │ ← People/community icon
│                                      │
│      No places yet                   │ ← Title-m, bold
│                                      │
│ Follow friends to discover          │ ← Body text
│ places they love.                    │
│                                      │
└─────────────────────────────────────┘
```

---

### 2. EXPERIENCE DETAIL SCREEN

**Layout (Scrollable)**:
```
┌─────────────────────────────────────┐
│ [< Back]                   [⋯ More] │ ← Top bar
│                                      │
│ [Image Gallery - Full Width]        │ ← Optional, swipeable
│ 1 / 3                                │ ← Counter if multiple
│                                      │
│ ─────────────────────────────────── │
│ [Avatar] Sarah Johnson              │ ← User info
│          Visited Jan 5, 2025         │
│                                [♡]   │ ← Bookmark button
│                                      │
│ Blue Bottle Coffee                   │ ← Title-l, bold
│ 66 Mint St, San Francisco, CA       │ ← Address
│                                      │
│ [$$] [Cafe] [Coffee] [Breakfast]    │ ← Chips
│                                      │
│ About                                │ ← Section header
│ Best coffee in SF! Their espresso   │ ← Description
│ is perfectly balanced...             │
│                                      │
│ Contact                              │ ← Section header
│ [Phone Icon] +1 (415) 495-3394      │ ← Phone (tappable)
│ [IG Icon] @bluebottlecoffee         │ ← Instagram (tappable)
│                                      │
│ [Open in Google Maps] ──────────    │ ← Large button
│                                      │
└─────────────────────────────────────┘
```

**Specifications**:
- Image gallery: Full width, 4:3 aspect ratio
- Navigation arrows: Overlaid on images (left/right)
- User section: 16px padding, surface background
- Content padding: 16px all sides
- Section headers: Title-m, bold, 24px margin-top
- Map button: Primary color, full width, 52px height

---

### 3. QUICK ADD FLOW SCREEN

**Step 1: Location & Search**
```
┌─────────────────────────────────────┐
│ [< Cancel]    Save a Place          │ ← Top bar
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ Enable Location                  │ │ ← Info card
│ │ We use your location to help     │ │
│ │ find nearby places faster.       │ │
│ │ [Enable GPS Button]              │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Search for a place                   │ ← Input label
│ ┌─────────────────────────────────┐ │
│ │ 🔍 Restaurant, cafe, bar...      │ │ ← Search input
│ └─────────────────────────────────┘ │
│                                      │
│ [Dropdown with suggestions]          │ ← Results
│                                      │
└─────────────────────────────────────┘
```

**Step 2: Required Fields**
```
┌─────────────────────────────────────┐
│ Selected:                            │
│ ┌─────────────────────────────────┐ │
│ │ Blue Bottle Coffee               │ │ ← Confirmed place
│ │ San Francisco, USA               │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Price Range *                        │
│ [$] [$$] [$$$] [$$$$]               │ ← Chip toggles
│                                      │
│ Categories *                         │
│ [Restaurant] [Cafe] [Bar] ...        │ ← Multi-select chips
│ [Nightlife] [Italian] [Japanese]     │    (wrap to multiple lines)
│                                      │
│ ─────────────────────────────────── │ ← Divider
│ Optional Details ▼                   │ ← Collapsible section
│                                      │
└─────────────────────────────────────┘
```

**Step 3: Optional Fields (Expanded)**
```
┌─────────────────────────────────────┐
│ Optional Details ▼                   │
│                                      │
│ Instagram Handle                     │
│ ┌─────────────────────────────────┐ │
│ │ @amazingplace                    │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Brief Description                    │
│ ┌─────────────────────────────────┐ │
│ │ What did you love about this     │ │
│ │ place?                           │ │
│ │                                  │ │
│ └─────────────────────────────────┘ │
│                                      │
│ Phone Number                         │
│ ┌─────────────────────────────────┐ │
│ │ +1 (555) 123-4567               │ │
│ └─────────────────────────────────┘ │
│                                      │
│ [Upload Images] [0-N]               │ ← Image picker
│                                      │
│ [Save Place] ───────────────────    │ ← Primary button
│                                      │
└─────────────────────────────────────┘
```

**Specifications**:
- All inputs: 44px min height
- Chip selectors: Toggle on tap, active = accent color
- Required fields marked with *
- Save button: Disabled until required fields filled
- Loading state: Show spinner in button
- Max-width: 600px (centered on desktop)

---

### 4. PROFILE SCREEN

**Layout**:
```
┌─────────────────────────────────────┐
│             Profile                  │ ← Top bar
│                                      │
│ ┌────────┐ John Doe                 │ ← User header
│ │  JD    │ @johndoe                 │    (80px avatar)
│ └────────┘ Edit Profile              │
│                                      │
│ ┌─────────────┬──────────────────┐  │
│ │ Experiences │ Bookmarks        │  │ ← Tabs
│ └─────────────┴──────────────────┘  │
│                                      │
│ [Empty state or experience list]     │
│                                      │
│ ─────────────────────────────────── │
│         [Location Icon]              │ ← Empty state
│     No places yet                    │
│ Save places to build your profile.   │
│                                      │
└─────────────────────────────────────┘
```

**Specifications**:
- User section: Surface background, 16px padding
- Avatar: 80px circle with initials fallback
- Edit button: Accent color text, small size
- Tabs: Underline indicator for active (2px, accent)
- Tab content: Reuses ExperienceCard components

---

## 🎨 Component Library to Design

### Global Components

1. **BottomNav**
   - 4 tabs in a row
   - Each: Icon (24px) + Label (small text)
   - Active: Accent color
   - Inactive: Text secondary
   - Background: White with top border

2. **Avatar**
   - Sizes: Small (32px), Medium (48px), Large (80px)
   - Circular
   - Fallback: Initials in center (text-primary on surface)
   - Image: Cover fit

3. **Chip**
   - Background: Chip-bg (#EDEEF1) or Accent (when active)
   - Border-radius: 12px
   - Padding: 8px 12px
   - Text: Small, medium weight
   - Variants: Default, Price, Category (active/inactive)

4. **Button**
   - Primary: Primary bg, white text
   - Secondary: Surface bg, text-primary
   - Outline: White bg, border, text-primary
   - Sizes: Small (36px), Medium (44px), Large (52px)
   - Border-radius: 14px
   - States: Default, Hover, Pressed, Disabled, Loading

5. **Input / TextArea**
   - Border: 1px divider color
   - Border-radius: 14px
   - Padding: 12px
   - Height: 44px minimum (input)
   - Focus state: Accent border (2px)
   - Label: Small text above input

6. **Card Container**
   - Background: White
   - Border: 1px divider
   - Border-radius: 14px
   - Padding: 16px
   - Shadow: 0 1px 3px rgba(0,0,0,0.1)

---

## 🎯 Design Requirements Summary

### Visual Style
- **Clean & Minimal**: Focus on content, not decoration
- **Scannable**: Easy to parse at a glance
- **Social**: Emphasize people and connections
- **Trust-based**: Lightweight, friendly tone

### Interaction Patterns
- **Tap targets**: 44px minimum
- **Feedback**: Clear active states
- **Loading**: Skeleton screens or spinners
- **Errors**: Inline validation messages
- **Empty states**: Helpful copy + icon

### Mobile-First Principles
- **One-handed use**: Bottom navigation, thumb-friendly
- **Fast actions**: Minimal steps to save a place (~15 seconds)
- **Readable text**: 16px minimum body text
- **Scrollable lists**: Infinite scroll or pagination

### Accessibility
- **Focus order**: Top to bottom
- **Color contrast**: AA compliant (4.5:1 for body text)
- **Touch targets**: 44px minimum
- **Labels**: All inputs have visible labels

---

## 📋 Deliverables Requested

Please create Figma designs for:

1. **Feed Screen** (with 3+ experience cards)
2. **Experience Detail Screen** (full content)
3. **Quick Add Flow** (all 3 steps/states)
4. **Profile Screen** (with tabs)
5. **Component Library** (all global components with variants)
6. **Mobile & Desktop Views** (320px, 768px, 1200px)

### Design System Requirements
- **Colors**: Use exact hex values provided
- **Typography**: Inter font family
- **Spacing**: Use 4px/8px/16px/24px scale
- **Components**: Create reusable Auto Layout components
- **Variants**: Show active/inactive/loading/error states

---

## 🎨 Style References
- **iOS Design**: Clean, minimal, system-like
- **Instagram**: Social cards, simple interactions
- **Airbnb**: Place-focused cards, trust signals
- **Apple Maps**: Location context, clear CTAs

---

## 📝 Copy Tone Examples
- "Save a place" (not "Add Experience")
- "Follow friends to discover places they love." (not "No content")
- "Optional" (for extra fields)
- Lightweight, social, trust-based

---

## ⚡ Success Criteria
- Can a user understand the app in 3 seconds?
- Can a user save a place in ~15 seconds?
- Are navigation and actions obvious?
- Does it feel social and trustworthy?
- Is it scannable on mobile screens?

---

## 🚀 Additional Notes

### What NOT to Include (Out of Scope)
- ❌ Likes/comments/reactions on posts
- ❌ Direct messaging
- ❌ Complex filters or sorting
- ❌ Multiple photo albums per place
- ❌ Map view (only Google Maps link)
- ❌ Follow/unfollow UI (assume it exists elsewhere)

### Design Priorities
1. **Speed**: Quick Add must be FAST
2. **Clarity**: Navigation must be OBVIOUS
3. **Scannability**: Feed cards must be READABLE
4. **Trust**: Social elements must be CLEAR

---

## 💡 Pro Tips for AI Design Generation

1. Use the **exact color values** provided
2. Create **Auto Layout frames** for all components
3. Show **multiple states** (empty, loading, filled)
4. Design **mobile-first**, then scale up
5. Include **real content** (not lorem ipsum)
6. Use **Inter font** or system-ui fallback
7. Maintain **consistent spacing** (4/8/16/24px)
8. Ensure **44px touch targets** for all buttons
9. Show **active states** for navigation
10. Include **error/success states** for forms

---

This prompt contains all specifications needed to generate a complete, production-ready UI design for the Friends Places app. Use Figma AI or any design tool to create the screens and components following these exact specifications.
