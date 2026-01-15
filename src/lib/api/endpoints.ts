import { apiRequest } from './client';
import { mockApi } from './mock-api';
import type {
  ExperienceFeedItem,
  Experience,
  User,
  Place,
  Bookmark,
} from '@/lib/models';

// Toggle between mock and real API
// Set to true to use mock data, false to use real backend
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Real API implementation
const realApi = {
  // Feed
  getFeed: () => apiRequest<ExperienceFeedItem[]>('/feed'),

  // Experiences
  getExperience: (id: string) =>
    apiRequest<Experience>(`/experiences/${id}`),

  createExperience: (data: Partial<Experience>) =>
    apiRequest<Experience>('/experiences', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Profile
  getUserProfile: (userId: string) =>
    apiRequest<User>(`/profile/${userId}`),

  // Bookmarks
  createBookmark: (experienceId: string) =>
    apiRequest<Bookmark>('/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ experience_id: experienceId }),
    }),

  deleteBookmark: (bookmarkId: string) =>
    apiRequest<void>(`/bookmarks/${bookmarkId}`, {
      method: 'DELETE',
    }),

  // Places
  searchPlaces: (query: string, lat?: number, lng?: number) => {
    const params = new URLSearchParams({ q: query });
    if (lat !== undefined) params.append('lat', lat.toString());
    if (lng !== undefined) params.append('lng', lng.toString());
    return apiRequest<Place[]>(`/places/search?${params.toString()}`);
  },

  getIpLocation: () =>
    apiRequest<{ lat: number; lng: number; city?: string }>('/places/ip-location', {
      method: 'POST',
    }),
};

// Export the appropriate API based on the environment
export const api = USE_MOCK_API ? mockApi : realApi;
