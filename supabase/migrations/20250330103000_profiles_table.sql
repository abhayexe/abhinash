-- Create a profiles table that duplicates some auth.users data
-- This allows us to easily query user information from public schema

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add RLS to profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to view all profiles
CREATE POLICY "Anyone can view profiles" ON profiles 
  FOR SELECT USING (true);

-- Create policy to update own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id); 