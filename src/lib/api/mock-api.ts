import type {
  ExperienceFeedItem,
  Experience,
  User,
  Place,
  Bookmark,
} from '@/lib/models';
import {
  mockFeedItems,
  mockExperiences,
  mockPlaces,
  mockUsers,
  mockBookmarks,
  mockDelay,
  findExperienceById,
  findPlaceById,
  findUserById,
  searchMockPlaces,
} from './mock-data';

// In-memory storage for created data
const createdExperiences: Experience[] = [];
const createdBookmarks: Bookmark[] = [];
let experienceIdCounter = 100;
let bookmarkIdCounter = 100;

export const mockApi = {
  // Feed
  getFeed: async (): Promise<ExperienceFeedItem[]> => {
    await mockDelay();
    return [...mockFeedItems];
  },

  // Experiences
  getExperience: async (id: string): Promise<Experience> => {
    await mockDelay();

    // Check created experiences first
    const created = createdExperiences.find((exp) => exp.id === id);
    if (created) return created;

    // Check mock experiences
    const experience = findExperienceById(id);
    if (!experience) {
      throw new Error(`Experience with id ${id} not found`);
    }
    return experience;
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    await mockDelay(500, 1000);

    const newExperience: Experience = {
      id: String(experienceIdCounter++),
      user_id: 'me',
      place_id: data.place_id || '',
      price_range: data.price_range || '$$',
      categories: data.categories || [],
      brief_description: data.brief_description || null,
      phone_number: data.phone_number || null,
      images: data.images || null,
      visit_date: data.visit_date || null,
      created_at: new Date().toISOString(),
    };

    createdExperiences.push(newExperience);

    // Also add to feed
    const place = findPlaceById(newExperience.place_id);
    const user = findUserById('me');

    if (place && user) {
      const feedItem: ExperienceFeedItem = {
        id: newExperience.id,
        experience_id: newExperience.id,
        user: {
          id: user.id,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
        },
        place: {
          id: place.id,
          name: place.name,
          city_short: place.city,
          country: place.country,
          thumbnail_image_url: null,
        },
        price_range: newExperience.price_range,
        categories: newExperience.categories,
        time_ago: 'just now',
      };
      mockFeedItems.unshift(feedItem);
    }

    return newExperience;
  },

  // Profile
  getUserProfile: async (userId: string): Promise<User> => {
    await mockDelay();

    const user = findUserById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    return user;
  },

  // Bookmarks
  createBookmark: async (experienceId: string): Promise<Bookmark> => {
    await mockDelay();

    const newBookmark: Bookmark = {
      id: String(bookmarkIdCounter++),
      user_id: 'me',
      experience_id: experienceId,
      created_at: new Date().toISOString(),
    };

    createdBookmarks.push(newBookmark);
    mockBookmarks.push(newBookmark);

    return newBookmark;
  },

  deleteBookmark: async (bookmarkId: string): Promise<void> => {
    await mockDelay();

    const index = mockBookmarks.findIndex((b) => b.id === bookmarkId);
    if (index !== -1) {
      mockBookmarks.splice(index, 1);
    }

    const createdIndex = createdBookmarks.findIndex((b) => b.id === bookmarkId);
    if (createdIndex !== -1) {
      createdBookmarks.splice(createdIndex, 1);
    }
  },

  // Places
  searchPlaces: async (
    query: string,
    lat?: number,
    lng?: number
  ): Promise<Place[]> => {
    await mockDelay(400, 700);

    if (!query || query.length < 2) {
      return [];
    }

    const results = searchMockPlaces(query);

    // Simulate location-based sorting if coordinates provided
    if (lat && lng) {
      // In a real app, this would sort by distance
      return results.slice(0, 5);
    }

    return results.slice(0, 8);
  },

  getIpLocation: async (): Promise<{
    lat: number;
    lng: number;
    city?: string;
  }> => {
    await mockDelay(300, 500);

    // Mock IP location (San Francisco)
    return {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
    };
  },
};
