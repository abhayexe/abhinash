# CarShare - Car Rental Platform

A full-featured car rental marketplace application built with React, TypeScript, and Supabase.

## Features

- User authentication (login and registration)
- Browse available cars with search and filtering
- Detailed car listings with multiple images and specifications
- Booking system with date selection and price calculation
- User dashboard for managing rentals and car listings
- List your own car for rent with image uploads
- AI Car Technician Chat Assistant

## AI Car Technician Chat Assistant

The platform includes an AI-powered chat assistant that helps users with car-related questions and provides personalized information about their rentals and listings.

### Chat Assistant Features:

- **Real-time assistance**: Get instant answers to car maintenance, troubleshooting, and rental questions
- **Personalized information**: The chatbot provides personalized information about your current rentals and car listings
- **Contextual awareness**: The AI understands the cars available in the marketplace and can provide specific information
- **Suggested questions**: Get started easily with suggested car-related questions
- **Streaming responses**: Enjoy a natural conversation with real-time streaming responses

### Using the Chat Assistant:

1. Click the chat bubble icon in the bottom right corner of any page
2. Type your question or select one of the suggested questions
3. Get real-time responses from the AI assistant
4. Ask follow-up questions as needed

Example questions you can ask:

- "What cars are available in my area?"
- "How do I maintain a rental car?"
- "Can you tell me about my current rentals?"
- "What are the most fuel-efficient cars available?"
- "What should I check before renting a car?"
- "How often should I change oil in my car?"

## Tech Stack

- React
- TypeScript
- Supabase (PostgreSQL database, authentication, and storage)
- TailwindCSS
- Google Gemini AI API
- Lucide React Icons

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd carshare
npm install
```

### 2. Supabase Setup

This project uses Supabase for backend services. The configuration is already set up for the production instance:

- **Supabase URL**: `https://bwwjhxpzwlgcfrsfpfzo.supabase.co`
- **API Key**: `sb_publishable_5X75v9B81nOcQKuSRBofyQ_2OV7KIL9`

### 3. Database Migration

Run the following SQL scripts in your Supabase SQL Editor (in order):

1. **Fresh Database Setup**: Run `supabase/migrations/20241221000000_fresh_database_setup.sql`

   - Creates all necessary tables (profiles, cars, rentals)
   - Sets up Row Level Security policies
   - Creates triggers and functions
   - Adds performance indexes

2. **Storage Setup**: Run `supabase/migrations/20241221000001_setup_storage.sql`
   - Creates storage bucket for car images
   - Sets up storage policies

### 4. Environment Configuration

The project includes environment configuration. You can customize the settings by creating a `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://bwwjhxpzwlgcfrsfpfzo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_5X75v9B81nOcQKuSRBofyQ_2OV7KIL9

# AI Configuration
VITE_GEMINI_API_KEY=AIzaSyDdSr5pR60dQv-7KzWQ3zhvpYTfIvqQHK4
```

### 5. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Database Schema

### Tables

1. **profiles** - User profile information

   - Links to Supabase auth.users
   - Stores additional user data

2. **cars** - Car listings

   - Multiple image support (3 images per car)
   - Owner information and availability status
   - Detailed specifications (make, model, year, etc.)

3. **rentals** - Booking system
   - Links cars with renters
   - Date ranges and pricing
   - Status tracking (pending, approved, active, etc.)

### Storage

- **car-images** bucket for storing car photos
- Public read access, authenticated upload access
- User-specific folder structure

## Features Overview

- **Authentication**: Email/password login and registration
- **Car Management**: List, edit, and manage your cars
- **Rental System**: Browse and book available cars
- **Dashboard**: View your rentals and car listings
- **AI Assistant**: Get help with car-related questions
- **Image Upload**: Support for multiple car images
- **Responsive Design**: Works on desktop and mobile devices
