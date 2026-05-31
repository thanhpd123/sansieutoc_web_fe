export type SportType = 'football' | 'basketball' | 'badminton' | 'tennis' | 'volleyball';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Extra {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
}

export interface Field {
  id: string;
  name: string;
  sportType: SportType;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  availableSlots: TimeSlot[];
  amenities: string[];
  distance: string;
  isIndoor: boolean;
  mapX: number; // percentage position on map
  mapY: number;
}

export interface Booking {
  id: string;
  fieldId: string;
  fieldName: string;
  fieldImage: string;
  sportType: SportType;
  date: string;
  timeSlot: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  location: string;
}

export interface FilterState {
  location: string;
  sportType: SportType | 'all';
  date: string;
  timeFrom: string;
  timeTo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  totalBookings: number;
  hoursPlayed: number;
  memberSince: string;
}
