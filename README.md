# Friends Places - Social Recommendations MVP

A mobile-first web app where users can quickly save, view, and browse friends' recommended places.

## 🚀 Project Status

**MVP Frontend - Complete!**

All core features have been implemented:
- ✅ Feed with experience cards
- ✅ Experience detail view with images and maps
- ✅ Quick Add flow with GPS/IP location
- ✅ Profile with tabs
- ✅ Bottom navigation
- ✅ Responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form (for complex forms)
- **HTTP Client**: Custom fetch wrapper with error handling

## 📁 Project Structure

```
src/
├── app/                          # Next.js routes
│   ├── page.tsx                 # Feed (home)
│   ├── add/page.tsx             # Quick Add flow
│   ├── experience/[id]/         # Experience detail
│   ├── profile/[userId]/        # User profile
│   └── explore/                 # Explore (placeholder)
├── components/                   # Shared UI components
│   ├── BottomNav.tsx
│   ├── Avatar.tsx
│   ├── Chip.tsx
│   ├── Button.tsx
│   └── ...
├── features/                     # Feature-specific code
│   ├── feed/                    # Feed components & hooks
│   ├── add/                     # Quick Add components & hooks
│   ├── profile/                 # Profile components & hooks
│   └── experience-detail/       # Detail view components & hooks
└── lib/
    ├── api/                     # API client & endpoints
    ├── models/                  # TypeScript types
    └── utils/                   # Utility functions
```

## 🎨 Design System

### Colors
- Primary: `#111111`
- Accent: `#007AFF`
- Background: `#FFFFFF`
- Surface: `#F6F7F9`
- Chip Background: `#EDEEF1`

### Typography
- Font: Inter
- Sizes: title-l (1.4rem), title-m (1.2rem), body (1rem), small (0.85rem)

### Spacing
- xs: 4px, sm: 8px, md: 16px, lg: 24px

### Accessibility
- Minimum touch targets: 44px
- Focus states on all interactive elements
- AA color contrast
- ARIA labels on navigation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# Set to 'true' to use mock data, 'false' to use real backend
NEXT_PUBLIC_USE_MOCK_API=true
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### 🎭 Mock API Mode

The app includes a complete mock API system for development without a backend!

**Features:**
- 5 mock users with realistic data
- 5 mock places (SF, NYC, Tokyo, Paris)
- 5 mock experiences with reviews
- Working create/read operations
- Simulated network delays (300-800ms)
- Place search functionality
- Location services (GPS/IP simulation)

**Toggle Mock Mode:**
In `.env.local`, set:
```bash
NEXT_PUBLIC_USE_MOCK_API=true   # Use mock data
NEXT_PUBLIC_USE_MOCK_API=false  # Use real backend
```

**Mock Data Includes:**
- Feed with 5 experiences from different users
- Places in San Francisco, Tokyo, New York, Paris
- Full experience details with descriptions
- Bookmark functionality
- Place search results
- IP-based location (defaults to San Francisco)

**Try it out:**
1. Open the app at `http://localhost:3000`
2. See the feed populated with mock data
3. Click on any experience to view details
4. Navigate to `/add` to create a new place
5. Search for places like "Blue Bottle" or "Tartine"
6. Enable location to see GPS simulation

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Features

### Feed (Home)
- View experiences from followed users
- Experience cards with:
  - User info and avatar
  - Place name and location
  - Price range and categories
  - Optional thumbnail image
  - Time ago indicator
- Empty state with friendly message
- Pull to refresh (coming soon)

### Experience Detail
- Full experience view with:
  - Image gallery with navigation
  - User information
  - Place details and location
  - Price range and categories
  - Description
  - Contact info (phone, Instagram)
  - Google Maps link (auto-generated)
  - Bookmark toggle

### Quick Add Flow
**Target: Save a place in ~15 seconds**

1. **Location Context**
   - GPS permission request with explanatory copy
   - Fallback to IP-based location
   - Manual city selector as last resort

2. **Place Search**
   - Search with location context
   - Debounced API calls
   - Place suggestions list
   - Custom place entry fallback

3. **Required Fields**
   - Price range selector ($ to $$$$)
   - Multi-select categories

4. **Optional Fields** (collapsible)
   - Instagram handle
   - Brief description
   - Phone number
   - Images (coming soon)
   - Visit date

5. **Save & Broadcast**
   - Validation
   - Optimistic updates
   - Navigate to feed or detail

### Profile
- User header with avatar and name
- Two tabs:
  - **Experiences**: User's saved places
  - **Bookmarks**: Placeholder for P1
- Empty states with calls to action
- Edit profile entrypoint

### Navigation
- Bottom navigation with 4 tabs:
  - Feed (home)
  - Add (Quick Add)
  - Profile
  - Explore (placeholder)
- Active state indicators
- Accessibility compliant

## 🔌 API Integration

### Endpoints

All endpoints are defined in `src/lib/api/endpoints.ts`:

- `GET /feed` - Get feed items
- `GET /experiences/:id` - Get experience details
- `POST /experiences` - Create experience
- `GET /profile/:userId` - Get user profile
- `POST /bookmarks` - Create bookmark
- `DELETE /bookmarks/:id` - Delete bookmark
- `GET /places/search` - Search places
- `POST /places/ip-location` - Get IP-based location

### Error Handling

The API client includes:
- Automatic error handling
- Custom `ApiException` class
- HTTP status codes
- Error messages from backend

## 📦 Type Safety

All domain models are defined in `src/lib/models/index.ts`:

- `User` - User profile
- `Place` - Place/location data
- `Experience` - User's experience at a place
- `ExperienceFeedItem` - Feed item with denormalized data
- `Bookmark` - Saved experience
- `QuickAddFormState` - Form state for Quick Add

Types mirror backend contracts exactly to ensure consistency.

## 🎯 MVP Scope

### In Scope ✅
- Responsive web UI, mobile-first
- Bottom navigation with core tabs
- Quick Add flow (~15 seconds)
- Experience detail view
- Profile with experiences and bookmarks tab
- Basic error/loading/empty states
- Backend API integration

### Out of Scope (Future)
- Native mobile apps
- Offline-first PWA
- Likes, comments, DMs
- Complex social/explore algorithms
- Advanced theming
- Comprehensive test suite

## 🚧 Next Steps

1. **Connect to Backend API**
   - Update `.env.local` with actual API URL
   - Test all endpoints
   - Handle authentication

2. **Image Upload**
   - Implement file upload in Quick Add
   - Add image compression
   - Handle multiple images

3. **Polish & Testing**
   - Cross-browser testing
   - Mobile device testing
   - Performance optimization
   - Accessibility audit

4. **P1 Features**
   - Bookmarks/Lists functionality
   - Explore/Search
   - Social graph (follow/unfollow)
   - Notifications

## 📚 Documentation

- [Strategy](context/front.strategy.json) - Product goals and scope
- [Tech Spec](context/front.tech.json) - Architecture and stack
- [UX Spec](context/front.ux.json) - Design patterns and tokens
- [Setup Plan](context/front.setup-plan.json) - Implementation guide
- [Navigation Index](context/index.json) - Master index for all docs

## 🤝 Contributing

This is an MVP. Follow the existing patterns:
- Feature-first folder structure
- TypeScript for all new code
- Tailwind CSS for styling
- React Query for data fetching
- Accessible components (44px touch targets, focus states)

## 📄 License

Private project - All rights reserved
