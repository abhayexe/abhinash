/*
  # Create cars and rentals tables

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `make` (text)
      - `model` (text)
      - `year` (integer)
      - `daily_rate` (numeric)
      - `location` (text)
      - `available` (boolean)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `rentals`
      - `id` (uuid, primary key)
      - `car_id` (uuid, references cars)
      - `renter_id` (uuid, references auth.users)
      - `start_date` (date)
      - `end_date` (date)
      - `total_price` (numeric)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for car owners and renters
*/

-- Create cars table
CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  daily_rate numeric NOT NULL,
  location text NOT NULL,
  available boolean DEFAULT true,
  image_url text,
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT year_check CHECK (year >= 1900 AND year <= date_part('year', CURRENT_DATE))
);

-- Create rentals table
CREATE TABLE rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars NOT NULL,
  renter_id uuid REFERENCES auth.users NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_dates CHECK (end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Policies for cars table
CREATE POLICY "Users can view all available cars"
  ON cars
  FOR SELECT
  USING (available = true);

CREATE POLICY "Users can view their own cars"
  ON cars
  FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own cars"
  ON cars
  FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own cars"
  ON cars
  FOR UPDATE
  USING (owner_id = auth.uid());

-- Policies for rentals table
CREATE POLICY "Users can view their rentals as renter"
  ON rentals
  FOR SELECT
  USING (renter_id = auth.uid());

CREATE POLICY "Car owners can view rentals for their cars"
  ON rentals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cars
      WHERE cars.id = rentals.car_id
      AND cars.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rental requests"
  ON rentals
  FOR INSERT
  WITH CHECK (renter_id = auth.uid());