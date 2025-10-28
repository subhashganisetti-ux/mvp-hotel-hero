-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  amenities TEXT[],
  image_url TEXT,
  total_rooms INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for hotels (public read)
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hotels"
  ON public.hotels FOR SELECT
  USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample hotels
INSERT INTO public.hotels (name, description, location, city, price_per_night, rating, amenities, image_url) VALUES
('Ocean View Resort', 'Luxury beachfront resort with stunning ocean views and world-class amenities', 'Calangute Beach, Goa', 'Goa', 299.99, 4.8, ARRAY['Pool', 'WiFi', 'Restaurant', 'Spa', 'Beach Access'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
('Mountain Retreat Lodge', 'Peaceful mountain getaway perfect for nature lovers', 'Manali Hills', 'Manali', 199.99, 4.6, ARRAY['WiFi', 'Restaurant', 'Parking', 'Mountain View'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
('City Center Hotel', 'Modern hotel in the heart of the city with easy access to attractions', 'MG Road, Bangalore', 'Bangalore', 149.99, 4.5, ARRAY['WiFi', 'Gym', 'Restaurant', 'Business Center'], 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'),
('Royal Palace Inn', 'Heritage property with royal architecture and premium services', 'Old City, Jaipur', 'Jaipur', 249.99, 4.9, ARRAY['Pool', 'WiFi', 'Restaurant', 'Spa', 'Heritage Tours'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
('Lakeside Cottage', 'Cozy cottage by the lake with serene surroundings', 'Nainital Lake Road', 'Nainital', 179.99, 4.7, ARRAY['WiFi', 'Lake View', 'Boating', 'Restaurant'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800')