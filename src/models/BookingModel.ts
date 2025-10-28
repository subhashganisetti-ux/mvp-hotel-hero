import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  user_id: string;
  hotel_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface CreateBookingParams {
  hotel_id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  total_price: number;
}

export class BookingModel {
  async createBooking(params: CreateBookingParams): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        ...params,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserBookings(): Promise<Booking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
