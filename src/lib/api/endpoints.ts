import type {
  ExperienceFeedItem,
  Experience,
  ExperienceDetail,
  User,
  Place,
  PlaceSearchResult,
  Bookmark,
  Tag,
} from '@/lib/models';

// Explore response type
export interface ExploreResponse {
  experiences: ExperienceFeedItem[];
  cities: { city: string; country: string; count: number }[];
  tags: { tag: string; count: number }[];
  total: number;
}

// Feed response type
export interface FeedResponse {
  mySuggestions: ExperienceFeedItem[];
  communitySuggestions: ExperienceFeedItem[];
  nearbyPlaces: ExperienceFeedItem[];
  userCity: string | null;
}

// Real API implementation using Next.js API routes
export const api = {
  // Feed
  getFeed: async (): Promise<FeedResponse> => {
    const response = await fetch('/api/feed');
    if (!response.ok) throw new Error('Failed to fetch feed');
    return response.json();
  },

  // Experiences
  getExperience: async (slugOrId: string): Promise<ExperienceDetail> => {
    const response = await fetch(`/api/experiences/${slugOrId}`);
    if (!response.ok) throw new Error('Failed to fetch experience');
    return response.json();
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    const response = await fetch('/api/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create experience');
    }
    return response.json();
  },

  updateExperience: async (
    id: string,
    data: {
      price_range?: Experience['price_range'];
      tags?: string[];
      brief_description?: string | null;
      phone_number?: string | null;
      images?: string[] | null;
      visibility?: Experience['visibility'];
    }
  ): Promise<ExperienceDetail> => {
    const response = await fetch(`/api/experiences/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update experience');
    }
    return response.json();
  },

  deleteExperience: async (id: string): Promise<void> => {
    const response = await fetch(`/api/experiences/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete experience');
    }
  },

  // Profile
  getUserProfile: async (userId: string): Promise<{
    user: User;
    experiences: ExperienceFeedItem[];
    stats: { suggestions: number; followers: number; following: number };
  }> => {
    const response = await fetch(`/api/profile/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (data: { display_name: string; username: string }): Promise<User> => {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update profile');
    }
    return response.json();
  },

  // Bookmarks - TODO: implement with Supabase
  createBookmark: async (experienceId: string): Promise<Bookmark> => {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ experience_id: experienceId }),
    });
    if (!response.ok) throw new Error('Failed to create bookmark');
    return response.json();
  },

  deleteBookmark: async (bookmarkId: string): Promise<void> => {
    const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete bookmark');
  },

  // Places
  searchPlaces: async (query: string, lat?: number, lng?: number): Promise<PlaceSearchResult[]> => {
    const params = new URLSearchParams({ q: query });
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    const response = await fetch(`/api/places/search?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search places');
    return response.json();
  },

  createPlace: async (data: {
    name: string;
    city: string;
    country: string;
    address?: string;
    lat?: number;
    lng?: number;
    instagram_handle?: string;
    google_place_id?: string;
    google_maps_url?: string;
  }): Promise<Place> => {
    const response = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create place');
    }
    return response.json();
  },

  // IP Location - using a free service
  getIpLocation: async (): Promise<{ lat: number; lng: number; city?: string }> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('IP location failed');
      const data = await response.json();
      return {
        lat: data.latitude,
        lng: data.longitude,
        city: data.city,
      };
    } catch {
      // Fallback to a default location if IP location fails
      throw new Error('Could not determine location');
    }
  },

  // Follow/Unfollow
  getFollowStatus: async (userId: string): Promise<{ isFollowing: boolean }> => {
    const response = await fetch(`/api/follow/${userId}`);
    if (!response.ok) throw new Error('Failed to get follow status');
    return response.json();
  },

  followUser: async (userId: string): Promise<void> => {
    const response = await fetch(`/api/follow/${userId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to follow user');
    }
  },

  unfollowUser: async (userId: string): Promise<void> => {
    const response = await fetch(`/api/follow/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to unfollow user');
    }
  },

  // Explore - public experiences
  getExplore: async (params?: {
    city?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }): Promise<ExploreResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.append('city', params.city);
    if (params?.tag) searchParams.append('tag', params.tag);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const url = `/api/explore${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch explore data');
    return response.json();
  },

  // Tags
  getTags: async (): Promise<Tag[]> => {
    const response = await fetch('/api/tags');
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  },

  createTag: async (name: string): Promise<Tag> => {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to create tag');
    }
    return response.json();
  },
};
