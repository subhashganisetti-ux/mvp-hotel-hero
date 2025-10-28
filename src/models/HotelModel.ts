import { supabase } from "@/integrations/supabase/client";

export interface Hotel {
  id: string;
  name: string;
  description: string | null;
  location: string;
  city: string;
  price_per_night: number;
  rating: number;
  amenities: string[] | null;
  image_url: string | null;
  total_rooms: number;
}

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export class HotelModel {
  async getAllHotels(): Promise<Hotel[]> {
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .order("rating", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchHotels(params: SearchParams): Promise<Hotel[]> {
    let query = supabase.from("hotels").select("*");

    if (params.city) {
      query = query.ilike("city", `%${params.city}%`);
    }

    const { data, error } = await query.order("rating", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
