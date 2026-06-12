-- Complete setup for new Supabase instance
-- Run this in your Supabase SQL Editor: https://tptzndshdlzwezopbbqy.supabase.co

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  address TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cars table
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  daily_rate NUMERIC(10,2) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  available BOOLEAN DEFAULT true,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON public.cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_available ON public.cars(available);
CREATE INDEX IF NOT EXISTS idx_rentals_car_id ON public.rentals(car_id);
CREATE INDEX IF NOT EXISTS idx_rentals_renter_id ON public.rentals(renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);

-- =============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. DROP EXISTING POLICIES (if any)
-- =============================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Cars are viewable by everyone" ON public.cars;
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON public.cars;
DROP POLICY IF EXISTS "Users can update own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;

DROP POLICY IF EXISTS "Users can view their own rentals" ON public.rentals;
DROP POLICY IF EXISTS "Car owners can view rentals for their cars" ON public.rentals;
DROP POLICY IF EXISTS "Authenticated users can create rentals" ON public.rentals;
DROP POLICY IF EXISTS "Car owners can update rental status" ON public.rentals;

-- =============================================
-- 5. CREATE RLS POLICIES - PROFILES
-- =============================================

-- Everyone can view all profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- 6. CREATE RLS POLICIES - CARS
-- =============================================

-- Everyone can view all cars
CREATE POLICY "Cars are viewable by everyone"
  ON public.cars FOR SELECT
  USING (true);

-- Authenticated users can insert cars
CREATE POLICY "Authenticated users can insert cars"
  ON public.cars FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update their own cars
CREATE POLICY "Users can update own cars"
  ON public.cars FOR UPDATE
  USING (auth.uid() = owner_id);

-- Users can delete their own cars
CREATE POLICY "Users can delete own cars"
  ON public.cars FOR DELETE
  USING (auth.uid() = owner_id);

-- =============================================
-- 7. CREATE RLS POLICIES - RENTALS
-- =============================================

-- Users can view their own rentals (as renter)
CREATE POLICY "Users can view their own rentals"
  ON public.rentals FOR SELECT
  USING (auth.uid() = renter_id);

-- Car owners can view rentals for their cars
CREATE POLICY "Car owners can view rentals for their cars"
  ON public.rentals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cars
      WHERE cars.id = rentals.car_id
      AND cars.owner_id = auth.uid()
    )
  );

-- Authenticated users can create rentals
CREATE POLICY "Authenticated users can create rentals"
  ON public.rentals FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

-- Car owners can update rental status
CREATE POLICY "Car owners can update rental status"
  ON public.rentals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cars
      WHERE cars.id = rentals.car_id
      AND cars.owner_id = auth.uid()
    )
  );

-- Renters can update their own rentals (for payment status)
CREATE POLICY "Renters can update their own rentals"
  ON public.rentals FOR UPDATE
  USING (auth.uid() = renter_id);

-- =============================================
-- 8. CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- 9. GRANT PERMISSIONS
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant all on tables
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.cars TO anon, authenticated;
GRANT ALL ON public.rentals TO anon, authenticated;

-- =============================================
-- DONE! 
-- =============================================

-- Verify setup
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM public.profiles
UNION ALL
SELECT 
  'cars' as table_name, 
  COUNT(*) as row_count 
FROM public.cars
UNION ALL
SELECT 
  'rentals' as table_name, 
  COUNT(*) as row_count 
FROM public.rentals;
