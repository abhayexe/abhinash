/*
  # Fresh Database Setup for CarShare Platform
  
  This migration sets up the complete database schema for a fresh Supabase instance.
  It includes all tables, policies, and functions needed for the CarShare application.
  
  ## Tables Created:
  1. profiles - User profile information
  2. cars - Car listings with multiple images
  3. rentals - Rental bookings and history
  
  ## Features:
  - Row Level Security (RLS) enabled on all tables
  - Automatic profile creation on user signup
  - Comprehensive policies for data access
  - Support for multiple car images
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create cars table with multiple image support
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  daily_rate NUMERIC NOT NULL CHECK (daily_rate > 0),
  location TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  image_url TEXT,
  image_url_2 TEXT,
  image_url_3 TEXT,
  description TEXT,
  fuel_type TEXT DEFAULT 'gasoline',
  transmission TEXT DEFAULT 'automatic',
  seats INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT year_check CHECK (year >= 1900 AND year <= date_part('year', CURRENT_DATE) + 1),
  CONSTRAINT seats_check CHECK (seats >= 1 AND seats <= 12)
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars ON DELETE CASCADE NOT NULL,
  renter_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC NOT NULL CHECK (total_price > 0),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON profiles 
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cars policies
CREATE POLICY "Anyone can view available cars" ON cars
  FOR SELECT USING (available = true);

CREATE POLICY "Users can view their own cars" ON cars
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own cars" ON cars
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE USING (owner_id = auth.uid());

-- Rentals policies
CREATE POLICY "Users can view their rentals as renter" ON rentals
  FOR SELECT USING (renter_id = auth.uid());

CREATE POLICY "Car owners can view rentals for their cars" ON rentals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = rentals.car_id
      AND cars.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rental requests" ON rentals
  FOR INSERT WITH CHECK (renter_id = auth.uid());

CREATE POLICY "Car owners can update rental status" ON rentals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = rentals.car_id
      AND cars.owner_id = auth.uid()
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_owner_id ON cars(owner_id);
CREATE INDEX IF NOT EXISTS idx_cars_available ON cars(available);
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location);
CREATE INDEX IF NOT EXISTS idx_rentals_car_id ON rentals(car_id);
CREATE INDEX IF NOT EXISTS idx_rentals_renter_id ON rentals(renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);

-- Insert some sample data for testing (optional)
-- You can remove this section if you don't want sample data

-- Sample cars (these will only be inserted if there are users in the system)
-- Note: In a real scenario, you would insert these after users are created