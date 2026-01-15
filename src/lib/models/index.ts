// Domain Models - Mirror backend contracts exactly

export interface User {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
}

export interface Place {
  id: string;
  google_place_id: string | null;
  name: string;
  city: string;
  country: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  instagram_handle: string | null;
  google_maps_url: string | null;
  custom: boolean;
}

export interface Experience {
  id: string;
  user_id: string;
  place_id: string;
  price_range: '$' | '$$' | '$$$' | '$$$$';
  categories: string[];
  brief_description: string | null;
  phone_number: string | null;
  images: string[] | null;
  visit_date: string | null;
  created_at: string;
}

export interface ExperienceFeedItem {
  id: string;
  experience_id: string;
  user: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  place: {
    id: string;
    name: string;
    city_short: string;
    country: string;
    thumbnail_image_url: string | null;
    instagram?: string | null;
  };
  price_range: '$' | '$$' | '$$$' | '$$$$';
  categories: string[];
  time_ago: string;
  description?: string | null;
}

export interface Bookmark {
  id: string;
  user_id: string;
  experience_id: string;
  created_at: string;
}

// View Models for UI

export type QuickAddStep = 'location_search' | 'select_place' | 'enrich' | 'review';

export interface QuickAddFormState {
  step: QuickAddStep;
  place: Place | null;
  price_range: '$' | '$$' | '$$$' | '$$$$' | null;
  categories: string[];
  instagram_handle: string;
  brief_description: string;
  phone_number: string;
  images: File[] | string[];
  visit_date: string | null;
}

export interface ExperienceCardProps {
  experience: ExperienceFeedItem;
  onClick: () => void;
  onBookmarkToggle?: () => void;
}

// API Response Types

export interface ApiError {
  message: string;
  status: number;
}

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

// Auth Models

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  provider: 'google' | 'email';
  created_at: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  display_name: string;
  username: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}

export interface Session {
  user: AuthUser;
  expires: string;
}
