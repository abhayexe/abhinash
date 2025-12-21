/*
  # Storage Setup for CarShare Platform
  
  This migration sets up storage buckets and policies for car images.
  Uses IF NOT EXISTS and DROP/CREATE to handle existing policies safely.
*/

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Authenticated users can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'car-images' 
    AND auth.role() = 'authenticated'
  );

-- Policy to allow public access to view car images
CREATE POLICY "Anyone can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

-- Policy to allow users to update their own car images
CREATE POLICY "Users can update their own car images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'car-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy to allow users to delete their own car images
CREATE POLICY "Users can delete their own car images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'car-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );