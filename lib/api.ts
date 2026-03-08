import { supabase } from '@/lib/supabase';
import {
  User,
  Service,
  Appointment,
  Review,
  Gallery,
  AvailableSlots,
  DashboardStats,
  ChartData,
  ServiceCreate,
  ServiceUpdate,
  AppointmentCreate,
  ReviewCreate,
  GalleryCreate,
  LoginForm,
  RegisterForm
} from '@/app/types';

// Auth API
export const authApi = {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    // Get user profile from users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      access_token: data.session?.access_token || '',
      token_type: 'bearer',
      user: profile as User,
    };
  },

  async register(userData: RegisterForm): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;

    // compute password hash locally so we can keep the same schema as backend
    // use bcryptjs which matches backend passlib's bcrypt
    import('bcryptjs').then(async (bcrypt) => {
      const hash = bcrypt.hashSync(userData.password, 10);

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user?.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: 'customer',
          password_hash: hash,
        })
        .select()
        .single();

      if (profileError) throw profileError;
      return profile as User;
    });

    // note: TypeScript will complain about return inside async import, so refactor below instead

    if (profileError) throw profileError;
    return profile as User;
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data as User;
  },
};

// Services API
export const servicesApi = {
  async getServices(filters?: {
    category?: string;
    gender?: string;
    limit?: number;
    offset?: number;
  }): Promise<Service[]> {
    let query = supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.gender) {
      query = query.eq('gender', filters.gender);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Service[];
  },

  async getService(id: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data as Service;
  },

  async createService(service: ServiceCreate): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw error;
    return data as Service;
  },

  async updateService(id: string, updates: ServiceUpdate): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Service;
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  },
};

// Appointments API
export const appointmentsApi = {
  async getAppointments(filters?: {
    status?: string;
    staff_id?: string;
    customer_id?: string;
    date?: string;
  }): Promise<Appointment[]> {
    let query = supabase
      .from('appointments')
      .select(`
        *,
        customer:users!customer_id(name),
        staff:users!staff_id(name),
        service:services(name, category)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.staff_id) {
      query = query.eq('staff_id', filters.staff_id);
    }
    if (filters?.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters?.date) {
      query = query.eq('appointment_date', filters.date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Appointment[];
  },

  async getAppointment(id: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customer:users!customer_id(name),
        staff:users!staff_id(name),
        service:services(name, category)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async createAppointment(appointment: AppointmentCreate): Promise<Appointment> {
    // Generate booking ID
    const bookingId = `LT-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Get service price
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('price')
      .eq('id', appointment.service_id)
      .single();

    if (serviceError) throw serviceError;

    const appointmentData = {
      ...appointment,
      booking_id: bookingId,
      total_price: service.price,
      status: 'pending',
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Appointment;
  },

  async cancelAppointment(id: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
      })
      .eq('id', id);

    if (error) throw error;
  },
};

// Reviews API
export const reviewsApi = {
  async getReviews(limit: number = 10): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        customer:users!customer_id(name),
        staff:users!staff_id(name),
        service:services(name)
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Review[];
  },

  async createReview(review: ReviewCreate): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...review, is_approved: false })
      .select()
      .single();

    if (error) throw error;
    return data as Review;
  },

  async approveReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) throw error;
  },

  async deleteReview(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Gallery API
export const galleryApi = {
  async getGallery(category?: string): Promise<Gallery[]> {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Gallery[];
  },

  async uploadPhoto(photo: GalleryCreate): Promise<Gallery> {
    const { data, error } = await supabase
      .from('gallery')
      .insert(photo)
      .select()
      .single();

    if (error) throw error;
    return data as Gallery;
  },

  async deletePhoto(id: string): Promise<void> {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Admin API
export const adminApi = {
  async getStats(): Promise<DashboardStats> {
    // This would need to be implemented with Supabase RPC functions
    // For now, return mock data
    return {
      today_appointments: 0,
      monthly_revenue: 0,
      active_customers: 0,
      total_staff: 0,
    };
  },

  async getRevenueData(): Promise<ChartData[]> {
    // Mock data - would need RPC function
    return [];
  },

  async getBookingsChart(): Promise<ChartData[]> {
    // Mock data - would need RPC function
    return [];
  },
};

// Time slots API
export const slotsApi = {
  async getAvailableSlots(staffId: string, date: string): Promise<AvailableSlots> {
    // Generate time slots from 9 AM to 7 PM
    const slots = [];
    const startHour = 9;
    const endHour = 19;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Check if slot is booked
        const { data: bookings, error } = await supabase
          .from('appointments')
          .select('id')
          .eq('staff_id', staffId)
          .eq('appointment_date', date)
          .eq('appointment_time', timeString)
          .neq('status', 'cancelled');

        if (error) throw error;

        slots.push({
          time: timeString,
          available: bookings.length === 0,
        });
      }
    }

    return {
      date,
      staff_id: staffId,
      slots,
    };
  },
};