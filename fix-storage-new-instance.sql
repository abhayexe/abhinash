-- Storage Bucket Setup for new Supabase instance
-- Run this AFTER running fix-new-instance.sql

-- =============================================
-- 1. CREATE STORAGE BUCKET
-- =============================================

-- Insert the car-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

-- =============================================
-- 2. DROP EXISTING STORAGE POLICIES (if any)
-- =============================================

DROP POLICY IF EXISTS "Public Access for Car Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own car images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own car images" ON storage.objects;

-- =============================================
-- 3. CREATE STORAGE POLICIES
-- =============================================

-- Allow public read access to car images
CREATE POLICY "Public Access for Car Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'car-images');

-- Allow authenticated users to upload car images
CREATE POLICY "Authenticated users can upload car images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'car-images'
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own car images
CREATE POLICY "Users can update their own car images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'car-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own car images
CREATE POLICY "Users can delete their own car images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'car-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================
-- DONE!
-- =============================================

-- Verify bucket creation
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'car-images';
