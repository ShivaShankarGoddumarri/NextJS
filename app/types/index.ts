// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
  profile_photo?: string;
  loyalty_points: number;
  is_active: boolean;
  created_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface UserUpdate {
  name?: string;
  phone?: string;
  profile_photo?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description?: string;
  category: 'hair' | 'skin' | 'nails' | 'beard' | 'makeup' | 'spa';
  gender: 'men' | 'women' | 'unisex';
  duration_minutes: number;
  price: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCreate {
  name: string;
  description?: string;
  category: 'hair' | 'skin' | 'nails' | 'beard' | 'makeup' | 'spa';
  gender: 'men' | 'women' | 'unisex';
  duration_minutes: number;
  price: number;
  image_url?: string;
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  category?: 'hair' | 'skin' | 'nails' | 'beard' | 'makeup' | 'spa';
  gender?: 'men' | 'women' | 'unisex';
  duration_minutes?: number;
  price?: number;
  image_url?: string;
  is_active?: boolean;
}

// Appointment types
export interface Appointment {
  id: string;
  booking_id: string;
  customer_id: string;
  staff_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  cancellation_reason?: string;
  total_price: number;
  created_at: string;
}

export interface AppointmentCreate {
  customer_id: string;
  staff_id?: string; // optional until staff assignment is implemented
  service_id: string;
  appointment_date: string;
  appointment_time: string;
}

export interface AppointmentUpdate {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  cancellation_reason?: string;
}

export interface AppointmentWithDetails extends Appointment {
  customer_name: string;
  staff_name: string;
  service_name: string;
  service_category: string;
}

// Review types
export interface Review {
  id: string;
  customer_id: string;
  staff_id: string;
  service_id: string;
  appointment_id: string;
  rating: number;
  review_text?: string;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewCreate {
  staff_id: string;
  service_id: string;
  appointment_id: string;
  rating: number;
  review_text?: string;
}

export interface ReviewWithNames extends Review {
  customer_name: string;
  staff_name: string;
  service_name: string;
}

// Gallery types
export interface Gallery {
  id: string;
  title: string;
  image_url: string;
  category: string;
  uploaded_by: string;
  created_at: string;
}

export interface GalleryCreate {
  title: string;
  image_url: string;
  category: string;
}

// Time slot types
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlots {
  date: string;
  staff_id: string;
  slots: TimeSlot[];
}

// Admin dashboard types
export interface DashboardStats {
  today_appointments: number;
  monthly_revenue: number;
  active_customers: number;
  total_staff: number;
}

export interface ChartData {
  date?: string;
  week?: string;
  category?: string;
  bookings?: number;
  revenue?: number;
}

// Booking flow types
export interface BookingStep {
  step: number;
  title: string;
  completed: boolean;
}

export interface BookingData {
  service?: Service;
  staff?: User;
  date?: string;
  time?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}