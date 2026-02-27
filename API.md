# Circle Picks API Reference

API documentation for the Circle Picks backend. Designed for mobile app integration.

---

## Base URL & Environments

| Environment | Base URL | Supabase Project |
|-------------|----------|------------------|
| **Production** | `https://circlepicks.com` | `jxrykpyaeqcqkbueexhg.supabase.co` |
| **Staging** | Vercel Preview URL (from `staging` branch) | `utsjtumgfyznjzvpfwos.supabase.co` |

All API routes are under `/api/...`. Example: `https://circlepicks.com/api/feed`.

---

## Authentication

Authentication is powered by **Supabase Auth**. The web app uses cookie-based sessions managed by `@supabase/ssr`. For mobile clients, use the **Supabase client SDK** for your platform.

### Auth Flow for Mobile

1. **Use the Supabase SDK** (iOS/Android/Flutter/React Native) to sign in. This gives you an `access_token` (JWT) and `refresh_token`.
2. **For API calls**, forward the Supabase auth cookies or configure your HTTP client to include the Supabase session. The server reads auth state from cookies set by `@supabase/ssr`.
3. **Token refresh** is handled by the Supabase SDK. The server validates tokens via `supabase.auth.getUser()`.

### Supabase Config (for mobile SDK)

```
SUPABASE_URL:            https://<project-ref>.supabase.co
SUPABASE_ANON_KEY:       <NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY value>
```

### Auth Methods

- **Email/password** — sign up and sign in
- **Google OAuth** — redirect-based flow

### How Protected Routes Work

Protected API routes call `supabase.auth.getUser()` using the server Supabase client, which reads session cookies from the request. If no valid session is found, they return `401 Unauthorized`.

---

## Error Format

All error responses follow this shape:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes:
- `400` — Bad request / validation error
- `401` — Not authenticated
- `403` — Not authorized (e.g. not the owner, not admin)
- `404` — Resource not found
- `500` — Server error

---

## Shared Types

### User

```typescript
{
  id: string
  display_name: string
  username: string
  avatar_url: string | null
}
```

### AuthUser

```typescript
{
  id: string
  email: string
  display_name: string
  username: string
  avatar_url: string | null
  provider: "google" | "email"
  created_at: string
  role: "user" | "admin"
}
```

### Place

```typescript
{
  id: string
  google_place_id: string | null
  name: string
  city: string
  country: string
  address: string | null
  lat: number | null
  lng: number | null
  instagram_handle: string | null
  google_maps_url: string | null
  custom: boolean
  recommendation_count?: number
}
```

### TagInfo

```typescript
{
  slug: string
  display_name: string
}
```

### Tag

```typescript
{
  id: string
  slug: string
  display_name: string | null
  is_system: boolean
  created_by: string | null
  created_at: string
}
```

### ExperienceFeedItem

```typescript
{
  id: string
  experience_id: string
  slug?: string
  user: {
    id: string
    display_name: string
    avatar_url: string | null
  }
  place: {
    id: string
    name: string
    city_short: string
    country: string
    thumbnail_image_url: string | null
    instagram?: string | null
    recommendation_count?: number
  }
  price_range: "$" | "$$" | "$$$" | "$$$$"
  tags: TagInfo[]
  time_ago: string
  description?: string | null
  visibility?: "public" | "friends_only"
  isBookmarked?: boolean
  bookmarkId?: string
}
```

### ExperienceDetail

```typescript
{
  id: string
  experience_id: string
  slug: string
  user: {
    id: string
    display_name: string
    avatar_url: string | null
    username: string | null
  }
  place: {
    id: string
    name: string
    city: string
    country: string
    address: string | null
    lat: number | null
    lng: number | null
    instagram_handle: string | null
    google_maps_url: string | null
    recommendation_count?: number
  }
  price_range: "$" | "$$" | "$$$" | "$$$$"
  tags: TagInfo[]
  brief_description: string | null
  phone_number: string | null
  images: string[]
  visit_date: string | null
  visibility: "public" | "friends_only"
  time_ago: string
  created_at: string | null
  other_recommenders?: OtherRecommender[]
}
```

### OtherRecommender

```typescript
{
  id: string
  display_name: string
  avatar_url: string | null
  username: string | null
  experience_id: string
}
```

### Notification

```typescript
{
  id: string
  user_id: string
  type: "experience_deactivated"
  title: string
  body: string | null
  data: { experience_id?: string; place_name?: string }
  read: boolean
  created_at: string
}
```

### Bookmark

```typescript
{
  id: string
  user_id: string
  experience_id: string
  created_at: string
}
```

### PriceRange

`"$" | "$$" | "$$$" | "$$$$"`

### ExperienceVisibility

`"public" | "friends_only"`

### ExperienceStatus

`"active" | "inactive"`

---

## Endpoints

### Auth

#### `POST /api/auth/signup`

Create a new account with email and password.

- **Auth:** None
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "min6chars",
  "display_name": "John Doe"
}
```

- **Validation:**
  - `email` — required
  - `password` — required, min 6 characters
  - `display_name` — required, min 2 characters

- **Response (200):**

```json
{ "success": true, "user": { /* Supabase Auth User */ } }
```

Or if email confirmation is required:

```json
{ "success": true, "requiresEmailConfirmation": true, "message": "Please check your email to confirm your account" }
```

Or if sign-in is needed after signup:

```json
{ "success": true, "requiresSignIn": true, "message": "Account created. Please sign in." }
```

- **Errors:** `400` (validation, duplicate email), `500`

---

#### `POST /api/auth/signin`

Sign in with email and password.

- **Auth:** None
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response (200):**

```json
{ "success": true, "user": { /* Supabase Auth User */ } }
```

- **Errors:** `400` (missing fields), `401` (invalid credentials), `500`

---

#### `GET /api/auth/oauth/google`

Initiate Google OAuth flow. Redirects the browser to Google's consent screen.

- **Auth:** None
- **Query params:**
  - `redirectTo` (optional) — callback URL after OAuth. Defaults to `{SITE_URL}/auth/callback`
- **Response:** `302` redirect to Google OAuth URL
- **On error:** Redirects to `/auth/error?error=OAuthSignin`

---

#### `POST /api/auth/signout`

Sign out the current user.

- **Auth:** None (clears existing session)
- **Body:** None
- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `500`

---

#### `DELETE /api/auth/delete`

Permanently delete the authenticated user's account and all associated data.

- **Auth:** Required (Bearer token or cookies)
- **Body:** None
- **Response (200):**

```json
{ "success": true }
```

- **Behavior:**
  - Deletes the user from Supabase Auth via admin API
  - All related data is cascade-deleted (experiences, bookmarks, follows, notifications, tags)
  - Signs out the current session
  - This action is irreversible
- **Errors:** `401` (not authenticated), `500` (deletion failed)

---

### Profile

#### `GET /api/profile/:userId`

Get a user's profile, experiences, and stats.

- **Auth:** Optional (affects visibility filtering)
- **Params:**
  - `userId` — UUID or `"me"` (returns the authenticated user)
- **Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "display_name": "John Doe",
    "username": "johndoe",
    "avatar_url": "https://..."
  },
  "experiences": [ /* ExperienceFeedItem[] */ ],
  "stats": {
    "suggestions": 12,
    "followers": 45,
    "following": 30
  }
}
```

- **Visibility rules:**
  - `"me"` → returns all experiences (any visibility)
  - Other users, authenticated → public + friends_only (if requester follows the user)
  - Other users, unauthenticated → public only
- **Errors:** `404` (user not found), `500`

---

#### `PATCH /api/profile`

Update the authenticated user's profile.

- **Auth:** Required
- **Body:**

```json
{
  "display_name": "New Name",
  "username": "newusername",
  "avatar_url": "https://..."
}
```

- **Validation:** Checks username uniqueness (excluding current user)
- **Response (200):**

```json
{
  "id": "uuid",
  "display_name": "New Name",
  "username": "newusername",
  "avatar_url": "https://..."
}
```

- **Errors:** `400` (username taken), `401`, `500`

---

### Experiences

#### `POST /api/experiences`

Create a new experience at a place.

- **Auth:** Required
- **Body:**

```json
{
  "place_id": "uuid",
  "price_range": "$$",
  "tags": ["italian", "date-night"],
  "brief_description": "Amazing pasta!",
  "phone_number": "+1234567890",
  "images": ["https://storage-url/img1.jpg"],
  "visit_date": "2025-06-15"
}
```

- **Required:** `place_id`, `price_range`, `tags` (at least one)
- **Optional:** `brief_description`, `phone_number`, `images`, `visit_date`
- **Response (200):**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "place_id": "uuid",
  "price_range": "$$",
  "tags": ["italian", "date-night"],
  "brief_description": "Amazing pasta!",
  "phone_number": "+1234567890",
  "images": ["https://..."],
  "visit_date": "2025-06-15",
  "created_at": "2025-06-15T12:00:00Z"
}
```

Note: `tags` in the create response are raw slugs (string[]). In feed/detail responses, they are resolved to `TagInfo[]` with display names.

- **Errors:** `400` (validation), `401`, `500`

---

#### `GET /api/experiences/:id`

Get full experience details by ID or slug.

- **Auth:** Optional
- **Params:** `id` — experience UUID or slug
- **Response (200):** `ExperienceDetail` (see Shared Types)
- **Includes:**
  - `other_recommenders` — up to 10 other users who publicly recommended the same place
  - `place.recommendation_count` — total recommendation count for the place
- **Errors:** `404`, `500`

---

#### `PATCH /api/experiences/:id`

Edit an experience. Only the owner can edit.

- **Auth:** Required (owner only)
- **Params:** `id` — experience UUID
- **Body (all fields optional):**

```json
{
  "price_range": "$$$",
  "tags": ["sushi", "special-occasion"],
  "brief_description": "Updated description",
  "phone_number": null,
  "images": ["https://..."],
  "visibility": "friends_only"
}
```

- **Response (200):** `ExperienceDetail` (full detail with other_recommenders)
- **Errors:** `401`, `403` (not owner), `404`, `500`

---

#### `DELETE /api/experiences/:id`

Delete an experience. Only the owner can delete.

- **Auth:** Required (owner only)
- **Params:** `id` — experience UUID
- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `401`, `403` (not owner), `404`, `500`

---

### Feed

#### `GET /api/feed`

Get the home feed with categorized experience sections.

- **Auth:** Optional (enhanced if authenticated)
- **Response (200):**

```json
{
  "mySuggestions": [ /* ExperienceFeedItem[] - user's own, max 10 */ ],
  "friendsSuggestions": [ /* ExperienceFeedItem[] - from followed users, max 20 */ ],
  "communitySuggestions": [ /* ExperienceFeedItem[] - public experiences, max 20 */ ],
  "nearbyPlaces": [ /* ExperienceFeedItem[] - in user's city, max 10 */ ],
  "userCity": "São Paulo"
}
```

- **Behavior:**
  - `mySuggestions` — only populated if authenticated; user's own experiences
  - `friendsSuggestions` — experiences from users the current user follows; respects visibility
  - `communitySuggestions` — other users' public experiences (excludes current user's)
  - `nearbyPlaces` — experiences in the user's detected city (via Vercel geolocation headers)
  - Includes `isBookmarked` and `bookmarkId` for each item if authenticated
  - All items include `place.recommendation_count`
- **Errors:** `500`

---

### Explore

#### `GET /api/explore`

Browse public experiences with filtering and pagination.

- **Auth:** None
- **Query params:**
  - `city` (optional) — filter by city name
  - `citySlug` (optional) — filter by city slug (URL-friendly)
  - `tag` (optional) — filter by tag slug
  - `limit` (optional, default `20`) — page size
  - `offset` (optional, default `0`) — pagination offset
- **Response (200):**

```json
{
  "experiences": [ /* ExperienceFeedItem[] */ ],
  "cities": [
    { "city": "São Paulo", "country": "Brazil", "count": 42, "slug": "sao-paulo" }
  ],
  "tags": [
    { "tag": "italian", "count": 15, "displayName": "Italian" }
  ],
  "total": 150,
  "resolvedCity": "São Paulo"
}
```

- **Behavior:**
  - Only shows `visibility: 'public'` experiences
  - `cities` and `tags` include counts across all public experiences (not just current page)
  - `resolvedCity` is the city name resolved from `citySlug` (if used)
  - Ordered by `created_at` descending
- **Errors:** `500`

---

### Search

#### `GET /api/search`

Search experiences and users.

- **Auth:** None
- **Query params:**
  - `q` (required) — search query, min 2 characters
  - `type` (optional, default `"all"`) — `"all"`, `"experiences"`, or `"users"`
- **Response (200):**

```json
{
  "experiences": [
    {
      "id": "uuid",
      "slug": "experience-slug",
      "brief_description": "Great place",
      "tags": ["italian"],
      "price_range": "$$",
      "place": { "id": "uuid", "name": "Restaurant", "city": "NYC", "country": "USA" },
      "user": { "id": "uuid", "display_name": "John", "username": "john", "avatar_url": null }
    }
  ],
  "users": [
    { "id": "uuid", "display_name": "John Doe", "username": "johndoe", "avatar_url": null }
  ]
}
```

- **Behavior:**
  - Searches experience descriptions and place names (case-insensitive)
  - Searches users by `display_name` or `username`
  - Max 10 results per type
  - Deduplicates experiences
- **Errors:** `400` (query too short), `500`

---

### Bookmarks

#### `GET /api/bookmarks`

Get the authenticated user's bookmarked experiences.

- **Auth:** Required
- **Response (200):** `ExperienceFeedItem[]`
  - Each item has `isBookmarked: true` and `bookmarkId`
  - Filters out inactive/deleted experiences
  - Sorted by bookmark creation date (newest first)
- **Errors:** `401`, `500`

---

#### `POST /api/bookmarks`

Bookmark an experience.

- **Auth:** Required
- **Body:**

```json
{ "experience_id": "uuid" }
```

- **Response (200):**

```json
{
  "id": "bookmark-uuid",
  "user_id": "uuid",
  "experience_id": "uuid",
  "created_at": "2025-06-15T12:00:00Z"
}
```

- **Errors:** `400` (already bookmarked, missing field), `401`, `404` (experience not found), `500`

---

#### `DELETE /api/bookmarks/:id`

Remove a bookmark.

- **Auth:** Required (owner only)
- **Params:** `id` — bookmark UUID
- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `401`, `403` (not owner), `404`, `500`

---

### Follow

#### `GET /api/follow/:userId`

Check if the current user follows a given user.

- **Auth:** Optional
- **Params:** `userId` — target user UUID
- **Response (200):**

```json
{ "isFollowing": true }
```

Returns `{ "isFollowing": false }` if not authenticated.

---

#### `POST /api/follow/:userId`

Follow a user.

- **Auth:** Required
- **Params:** `userId` — target user UUID
- **Body:** None
- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `400` (cannot follow yourself, already following), `401`, `404` (user not found), `500`

---

#### `DELETE /api/follow/:userId`

Unfollow a user.

- **Auth:** Required
- **Params:** `userId` — target user UUID
- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `401`, `500`

---

### Places

#### `POST /api/places`

Create or find an existing place. Uses deduplication to avoid duplicates.

- **Auth:** Required
- **Body:**

```json
{
  "name": "Pizzeria Roma",
  "city": "São Paulo",
  "country": "Brazil",
  "address": "Rua Augusta, 123",
  "lat": -23.5505,
  "lng": -46.6333,
  "instagram_handle": "pizzeriaroma",
  "google_place_id": "ChIJ...",
  "google_maps_url": "https://maps.google.com/..."
}
```

- **Required:** `name`, `city`, `country`
- **Optional:** `address`, `lat`, `lng`, `instagram_handle`, `google_place_id`, `google_maps_url`
- **Response (200):** `Place` (see Shared Types)
- **Deduplication logic (in order):**
  1. Exact `google_place_id` match → returns existing
  2. Case-insensitive name match in same city/country → returns existing
  3. Nearby place (within ~500m) with similar name → returns existing
  4. Otherwise → creates new place
- **Errors:** `400`, `401`, `500`

---

#### `GET /api/places/search`

Search for places in the local database and Google Places.

- **Auth:** None
- **Query params:**
  - `q` (required) — search query, min 2 characters
  - `lat` (optional) — user latitude for distance sorting
  - `lng` (optional) — user longitude for distance sorting
- **Response (200):** `PlaceSearchResult[]` (max 10)

```typescript
{
  id: string | null       // null for Google results not yet saved
  google_place_id: string | null
  name: string
  city: string
  country: string
  address: string | null
  lat: number | null
  lng: number | null
  instagram_handle: string | null
  google_maps_url: string | null
  custom: boolean
  source: "local" | "google"
  recommendation_count?: number
}
```

- **Behavior:**
  - Searches local DB first (up to 5 results)
  - Then searches Google Places API
  - Filters out Google results already in DB
  - Sorts by distance if `lat`/`lng` provided
- **Errors:** `400` (query too short), `500`

---

#### `GET /api/places/match`

Find matching custom places by name, city, and country.

- **Auth:** None
- **Query params:**
  - `name` (required)
  - `city` (required)
  - `country` (required)
- **Response (200):**

```json
{
  "exact_match": { /* Place with recommendation_count */ } | null,
  "similar_matches": [ /* Place[] with recommendation_count, max 5 */ ]
}
```

- **Behavior:**
  - Only searches custom places (not Google Places)
  - Exact match: case-insensitive on all 3 fields
  - Similar: partial name match in same city
- **Errors:** `400` (missing params), `500`

---

#### `GET /api/places/:id/stats`

Get stats for a place.

- **Auth:** None
- **Params:** `id` — place UUID
- **Response (200):**

```json
{
  "recommendation_count": 42,
  "top_tags": ["italian", "date-night", "pizza", "wine", "cozy"]
}
```

- `top_tags` — up to 5 most common tag slugs across all active experiences
- **Errors:** `404`, `500`

---

### Tags

#### `GET /api/tags`

Get all tags (system + custom).

- **Auth:** None
- **Response (200):** `Tag[]` ordered by slug

```json
[
  {
    "id": "uuid",
    "slug": "italian",
    "display_name": "Italian",
    "is_system": true,
    "created_by": null
  }
]
```

---

#### `POST /api/tags`

Create a custom tag.

- **Auth:** Required
- **Body:**

```json
{ "name": "Sunday Brunch" }
```

- **Slug generation:** lowercase, strip diacritics, replace spaces with hyphens (`"Sunday Brunch"` → `"sunday-brunch"`)
- **Response (201):** `Tag` (new tag) or **(200)** if tag already exists (returns existing)
- **Errors:** `400` (empty name), `401`, `500`

---

### Notifications

#### `GET /api/notifications`

Get the authenticated user's notifications.

- **Auth:** Required
- **Response (200):**

```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "experience_deactivated",
      "title": "Experience removed",
      "body": "Your experience at Pizza Place was deactivated.",
      "data": { "experience_id": "uuid", "place_name": "Pizza Place" },
      "read": false,
      "created_at": "2025-06-15T12:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

- Max 50 notifications, ordered by `created_at` descending
- **Errors:** `401`, `500`

---

#### `POST /api/notifications/read`

Mark notifications as read.

- **Auth:** Required
- **Body:**

```json
{ "notificationIds": ["uuid1", "uuid2"] }
```

Or mark all as read:

```json
{}
```

- **Response (200):**

```json
{ "success": true }
```

- **Errors:** `401`, `500`

---

### Upload

#### `POST /api/upload`

Upload image files to Supabase Storage.

- **Auth:** Required
- **Content-Type:** `multipart/form-data`
- **Form fields:**
  - `files` (required) — one or more image files
  - `bucket` (optional, default `"experience-images"`) — `"experience-images"` or `"avatars"`
- **Constraints:**
  - Max file size: 10 MB
  - Allowed types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **Response (200):**

```json
{
  "urls": [
    "https://jxrykpyaeqcqkbueexhg.supabase.co/storage/v1/object/public/experience-images/userId/timestamp-randomId.jpg"
  ]
}
```

- **Errors:** `400` (invalid type/size/bucket, no files), `401`, `500`

---

### City Search

#### `GET /api/cities/search`

Search for cities/addresses using Google Places Autocomplete.

- **Auth:** None
- **Query params:**
  - `q` (required) — search query, min 2 characters
- **Response (200):**

```json
[
  {
    "place_id": "ChIJ...",
    "address": "São Paulo, SP, Brazil",
    "city": "São Paulo",
    "state": "SP",
    "country": "Brazil",
    "description": "São Paulo, SP, Brazil",
    "lat": -23.5505,
    "lng": -46.6333
  }
]
```

- Max 5 results
- **Errors:** `400` (query too short), `500`

---

### Admin

Admin endpoints require the authenticated user to have `role: "admin"` in the `users` table.

#### `GET /api/admin/experiences`

List all experiences for moderation.

- **Auth:** Required (admin only)
- **Query params:**
  - `status` (optional, default `"all"`) — `"all"`, `"active"`, or `"inactive"`
  - `limit` (optional, default `20`)
  - `offset` (optional, default `0`)
- **Response (200):**

```json
{
  "experiences": [
    {
      "id": "uuid",
      "brief_description": "Great pizza",
      "images": ["https://..."],
      "created_at": "2025-06-15T12:00:00Z",
      "time_ago": "2 days ago",
      "status": "active",
      "moderation_reason": null,
      "moderated_at": null,
      "visibility": "public",
      "user": {
        "id": "uuid",
        "display_name": "John",
        "avatar_url": null,
        "username": "john"
      },
      "place": {
        "id": "uuid",
        "name": "Pizzeria Roma",
        "city": "São Paulo",
        "country": "Brazil"
      }
    }
  ],
  "total": 150
}
```

- **Errors:** `401`, `403` (not admin), `500`

---

#### `POST /api/admin/experiences/:id/moderate`

Moderate (deactivate or reactivate) an experience.

- **Auth:** Required (admin only)
- **Params:** `id` — experience UUID
- **Body:**

```json
{
  "action": "deactivate",
  "reason": "Violates community guidelines"
}
```

- `action` — `"deactivate"` or `"reactivate"`
- `reason` — required when `action` is `"deactivate"`
- **Response (200):**

```json
{ "success": true, "status": "inactive" }
```

- **Side effects:** Sends a notification to the experience owner on deactivation
- **Errors:** `400` (missing reason), `401`, `403` (not admin), `404`, `500`

---

#### `GET /api/admin/debug`

Debug endpoint to check auth state.

- **Auth:** Required (any authenticated user)
- **Response (200):**

```json
{
  "authEmail": "user@example.com",
  "authId": "uuid",
  "profile": {
    "id": "uuid",
    "display_name": "John",
    "username": "john",
    "role": "admin"
  }
}
```

---

## Key Behaviors & Conventions

### Visibility

Experiences have a `visibility` field: `"public"` or `"friends_only"`.

- **Public** — visible to everyone
- **Friends only** — visible only to users who follow the experience owner
- The owner always sees their own experiences regardless of visibility
- Explore and search endpoints only return public experiences

### Experience Status

Experiences have a `status` field: `"active"` or `"inactive"`.

- Inactive experiences are hidden from feeds, explore, and search
- Only visible in admin moderation views
- Bookmarks for inactive experiences are filtered out

### Place Deduplication

When creating a place via `POST /api/places`, the server checks:

1. **Exact Google Place ID match** — if a place with the same `google_place_id` exists, returns it
2. **Name match in same city/country** — case-insensitive comparison
3. **Proximity match** — within ~500m with a similar name

This prevents duplicate places in the database.

### Pagination

Endpoints that support pagination use `limit` and `offset` query parameters:

- `limit` — number of items per page (varies by endpoint)
- `offset` — number of items to skip
- Paginated endpoints return a `total` count for building pagination UI

### Feed Geolocation

The `GET /api/feed` endpoint uses Vercel's geolocation headers (`x-vercel-ip-city`) to detect the user's city for the "nearby places" section. If geolocation is unavailable, `nearbyPlaces` will be empty and `userCity` will be `null`.

### Tags

- Tags are identified by `slug` (URL-safe, lowercase, hyphenated)
- System tags have `is_system: true` and are predefined
- Custom tags are created by users via `POST /api/tags`
- When creating experiences, `tags` is an array of slug strings
- In feed/detail responses, tags are resolved to `TagInfo[]` with `display_name`

### Image URLs

Image URLs point to Supabase Storage public buckets:

```
https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
```

Buckets: `experience-images`, `avatars`

### Time Formatting

The `time_ago` field in feed items and experience details is a human-readable relative time string (e.g., `"2 days ago"`, `"3 months ago"`), computed server-side.
