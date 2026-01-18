import type {
  ExperienceFeedItem,
  Experience,
  User,
  Place,
  Bookmark,
} from '@/lib/models';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    display_name: 'Sarah Johnson',
    username: 'sarahj',
    avatar_url: null,
  },
  {
    id: '2',
    display_name: 'Mike Chen',
    username: 'mikechen',
    avatar_url: null,
  },
  {
    id: '3',
    display_name: 'Emma Rodriguez',
    username: 'emmarodriguez',
    avatar_url: null,
  },
  {
    id: 'me',
    display_name: 'John Doe',
    username: 'johndoe',
    avatar_url: null,
  },
];

// Mock Places
export const mockPlaces: Place[] = [
  {
    id: '1',
    google_place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    name: 'Blue Bottle Coffee',
    city: 'San Francisco',
    country: 'USA',
    address: '66 Mint St, San Francisco, CA 94103',
    lat: 37.7833,
    lng: -122.4167,
    instagram_handle: '@bluebottlecoffee',
    google_maps_url: 'https://maps.google.com/?cid=10281119596374313554',
    custom: false,
  },
  {
    id: '2',
    google_place_id: 'ChIJVVVVVVV3j4ARgwoXAW3g',
    name: 'Tartine Bakery',
    city: 'San Francisco',
    country: 'USA',
    address: '600 Guerrero St, San Francisco, CA 94110',
    lat: 37.7599,
    lng: -122.4241,
    instagram_handle: '@tartinebakery',
    google_maps_url: 'https://maps.google.com/?cid=15420573303433245982',
    custom: false,
  },
  {
    id: '3',
    google_place_id: null,
    name: 'Hidden Gem Ramen',
    city: 'Tokyo',
    country: 'Japan',
    address: '3-14-5 Shibuya, Tokyo',
    lat: 35.6595,
    lng: 139.7004,
    instagram_handle: '@hiddengemramen',
    google_maps_url: 'https://maps.google.com/?q=Hidden+Gem+Ramen+Tokyo',
    custom: true,
  },
  {
    id: '4',
    google_place_id: 'ChIJKxjxuaNZwokRMJ84n',
    name: 'The Spotted Pig',
    city: 'New York',
    country: 'USA',
    address: '314 W 11th St, New York, NY 10014',
    lat: 40.7357,
    lng: -74.0064,
    instagram_handle: '@thespottedpig',
    google_maps_url: 'https://maps.google.com/?cid=13284936473829',
    custom: false,
  },
  {
    id: '5',
    google_place_id: null,
    name: 'La Petite Boulangerie',
    city: 'Paris',
    country: 'France',
    address: '42 Rue Montmartre, Paris',
    lat: 48.8566,
    lng: 2.3522,
    instagram_handle: '@lapetiteboulangerie',
    google_maps_url: 'https://maps.google.com/?q=La+Petite+Boulangerie+Paris',
    custom: true,
  },
];

// Mock Experiences
export const mockExperiences: Experience[] = [
  {
    id: '1',
    user_id: '1',
    place_id: '1',
    price_range: '$$',
    categories: ['Cafe', 'Coffee', 'Breakfast'],
    brief_description: 'Best coffee in SF! Their espresso is perfectly balanced and the pastries are amazing. The minimalist interior is perfect for working.',
    phone_number: '+1 (415) 495-3394',
    images: null,
    visit_date: '2025-01-05',
    visibility: 'public',
    created_at: '2025-01-06T10:30:00Z',
  },
  {
    id: '2',
    user_id: '2',
    place_id: '2',
    price_range: '$$',
    categories: ['Bakery', 'Breakfast', 'Dessert'],
    brief_description: 'Their morning buns are legendary! Get there early because they sell out fast. The sourdough bread is also incredible.',
    phone_number: '+1 (415) 487-2600',
    images: null,
    visit_date: '2025-01-03',
    visibility: 'public',
    created_at: '2025-01-04T08:15:00Z',
  },
  {
    id: '3',
    user_id: '3',
    place_id: '3',
    price_range: '$',
    categories: ['Japanese', 'Ramen', 'Casual'],
    brief_description: 'Found this tiny ramen shop in Shibuya. No English menu but the tonkotsu ramen was worth the adventure!',
    phone_number: null,
    images: null,
    visit_date: '2024-12-28',
    visibility: 'friends_only',
    created_at: '2024-12-29T19:45:00Z',
  },
  {
    id: '4',
    user_id: '1',
    place_id: '4',
    price_range: '$$$',
    categories: ['British', 'Gastropub', 'Dinner'],
    brief_description: 'Excellent gastropub with creative dishes. The burger is a must-try. Make a reservation!',
    phone_number: '+1 (212) 620-0393',
    images: null,
    visit_date: '2024-12-20',
    visibility: 'public',
    created_at: '2024-12-21T14:20:00Z',
  },
  {
    id: '5',
    user_id: '2',
    place_id: '5',
    price_range: '$',
    categories: ['Bakery', 'French', 'Breakfast'],
    brief_description: 'Charming local bakery with authentic French pastries. The croissants remind me of Paris!',
    phone_number: null,
    images: null,
    visit_date: '2024-12-15',
    visibility: 'public',
    created_at: '2024-12-16T11:00:00Z',
  },
];

// Mock Feed Items (denormalized for display)
export const mockFeedItems: ExperienceFeedItem[] = [
  {
    id: '1',
    experience_id: '1',
    user: {
      id: '1',
      display_name: 'Sarah Johnson',
      avatar_url: null,
    },
    place: {
      id: '1',
      name: 'Blue Bottle Coffee',
      city_short: 'SF',
      country: 'USA',
      thumbnail_image_url: null,
    },
    price_range: '$$',
    categories: ['Cafe', 'Coffee', 'Breakfast'],
    time_ago: '2d ago',
  },
  {
    id: '2',
    experience_id: '2',
    user: {
      id: '2',
      display_name: 'Mike Chen',
      avatar_url: null,
    },
    place: {
      id: '2',
      name: 'Tartine Bakery',
      city_short: 'SF',
      country: 'USA',
      thumbnail_image_url: null,
    },
    price_range: '$$',
    categories: ['Bakery', 'Breakfast', 'Dessert'],
    time_ago: '4d ago',
  },
  {
    id: '3',
    experience_id: '3',
    user: {
      id: '3',
      display_name: 'Emma Rodriguez',
      avatar_url: null,
    },
    place: {
      id: '3',
      name: 'Hidden Gem Ramen',
      city_short: 'Tokyo',
      country: 'Japan',
      thumbnail_image_url: null,
    },
    price_range: '$',
    categories: ['Japanese', 'Ramen', 'Casual'],
    time_ago: '2w ago',
  },
  {
    id: '4',
    experience_id: '4',
    user: {
      id: '1',
      display_name: 'Sarah Johnson',
      avatar_url: null,
    },
    place: {
      id: '4',
      name: 'The Spotted Pig',
      city_short: 'NYC',
      country: 'USA',
      thumbnail_image_url: null,
    },
    price_range: '$$$',
    categories: ['British', 'Gastropub', 'Dinner'],
    time_ago: '3w ago',
  },
  {
    id: '5',
    experience_id: '5',
    user: {
      id: '2',
      display_name: 'Mike Chen',
      avatar_url: null,
    },
    place: {
      id: '5',
      name: 'La Petite Boulangerie',
      city_short: 'Paris',
      country: 'France',
      thumbnail_image_url: null,
    },
    price_range: '$',
    categories: ['Bakery', 'French', 'Breakfast'],
    time_ago: '1mo ago',
  },
];

// Mock Bookmarks
export const mockBookmarks: Bookmark[] = [
  {
    id: '1',
    user_id: 'me',
    experience_id: '2',
    created_at: '2025-01-05T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'me',
    experience_id: '3',
    created_at: '2025-01-04T15:30:00Z',
  },
];

// Helper function to generate random delay
export const mockDelay = (min = 300, max = 800): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Helper function to find items
export const findExperienceById = (id: string): Experience | undefined => {
  return mockExperiences.find((exp) => exp.id === id);
};

export const findPlaceById = (id: string): Place | undefined => {
  return mockPlaces.find((place) => place.id === id);
};

export const findUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// Search places by query
export const searchMockPlaces = (query: string): Place[] => {
  const lowerQuery = query.toLowerCase();
  return mockPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(lowerQuery) ||
      place.city.toLowerCase().includes(lowerQuery) ||
      place.country.toLowerCase().includes(lowerQuery)
  );
};
