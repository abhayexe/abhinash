# 🚗 CarShare - Peer-to-Peer Car Rental Platform

A modern, full-featured car rental marketplace that connects car owners with renters. Built with React, TypeScript, and Supabase, featuring an AI-powered assistant for enhanced user experience.

![Tech Stack](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Database Schema](#-database-schema)
- [Key Features Explained](#-key-features-explained)
- [API Configuration](#-api-configuration)
- [Development](#-development)
- [Screenshots](#-screenshots)

---

## ✨ Features

### 🔐 Authentication & User Management

- **Secure Authentication**: Email/password registration and login via Supabase Auth
- **Email Verification Disabled**: Quick signup for seamless onboarding
- **Enhanced User Profiles**: Full name, phone number, address, and profile picture
- **Profile Management**: Edit and update user information

### 🚙 Car Listing & Management

- **List Your Car**: Add cars to the platform with detailed specifications
- **Multi-Image Upload**: Support for up to 3 images per car listing
- **Rich Car Details**: Make, model, year, daily rate, location, and description
- **Owner Dashboard**: Manage your car listings with edit and delete capabilities
- **Availability Toggle**: Mark cars as available or unavailable

### 🔍 Search & Discovery

- **Browse Cars**: View all available cars in an intuitive grid layout
- **Interactive Maps**: Leaflet-powered maps showing car locations across 50+ Indian cities
- **Location Display**: Precise location information with fallback display
- **Search & Filter**: Find the perfect car based on your needs
- **Detailed Car Pages**: Comprehensive information with image galleries

### 📅 Booking & Rental System

- **Date Selection**: Choose pickup and return dates with calendar interface
- **Dynamic Pricing**: Automatic price calculation based on rental duration
- **Rental Requests**: Submit booking requests to car owners
- **Status Tracking**: Monitor rental status (pending, approved, rejected, completed)
- **My Rentals Dashboard**: View all your booking history and current rentals

### 💳 Payment System

- **Dummy Payment Processing**: Simulated payment flow for testing
- **Multiple Payment Methods**: Credit/Debit Card and UPI options
- **Payment Form**: Realistic payment interface with validation
- **Payment Confirmation**: Success page with booking details and next steps
- **Currency Display**: All prices shown in Indian Rupees (₹)

### 🤖 AI Car Technician Assistant

- **Google Gemini 2.5 Flash**: Powered by the latest Gemini AI model
- **Real-time Chat**: Instant responses with streaming support
- **Contextual Awareness**: AI understands your rentals and listings
- **Car Expertise**: Get help with maintenance, troubleshooting, and rental questions
- **Suggested Questions**: Quick-start prompts for common queries
- **Floating Chat Widget**: Accessible from any page

### 🎨 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean interface with TailwindCSS styling
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: Graceful error messages and fallbacks
- **Navigation**: Intuitive menu with user profile display

---

## 🛠 Tech Stack

### Frontend

- **React 18.3.1** - UI library with hooks and modern patterns
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 5.4.2** - Fast build tool and development server
- **React Router DOM 6.22.2** - Client-side routing
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful icon library

### Backend & Services

- **Supabase 2.39.7** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Storage for images
  - Row Level Security (RLS)
- **Google Gemini AI** - Advanced language model for chatbot

### Maps & Location

- **Leaflet 1.9.4** - Interactive mapping library
- **React Leaflet 4.2.1** - React components for Leaflet

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
carshare/
├── src/
│   ├── components/
│   │   ├── AddCar.tsx                 # Add new car listing form
│   │   ├── Auth.tsx                   # Login/Signup component
│   │   ├── CarList.tsx                # Browse all available cars
│   │   ├── CarLocationMap.tsx         # Interactive map for car locations
│   │   ├── ChatBot.tsx                # AI assistant chat interface
│   │   ├── DebugCars.tsx              # Debug tool for car data
│   │   ├── MapErrorBoundary.tsx       # Error boundary for maps
│   │   ├── MyCars.tsx                 # Owner's car management dashboard
│   │   ├── MyRentals.tsx              # Renter's booking dashboard
│   │   ├── Payment.tsx                # Payment processing page
│   │   ├── PaymentSuccess.tsx         # Payment confirmation page
│   │   ├── Profile.tsx                # User profile management
│   │   ├── RentCar.tsx                # Individual car rental page
│   │   ├── SimpleLocationDisplay.tsx  # Fallback location display
│   │   └── TestCars.tsx               # Testing component
│   ├── lib/
│   │   └── supabase.ts                # Supabase client configuration
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Application entry point
│   └── index.css                      # Global styles
├── supabase/
│   └── migrations/
│       ├── 20241221000000_fresh_database_setup.sql
│       ├── 20241221000001_setup_storage.sql
│       ├── 20241221000002_enhanced_profiles.sql
│       └── 20241221000003_disable_email_verification.sql
├── public/                            # Static assets
├── .env                               # Environment variables
├── .env.example                       # Example environment file
├── package.json                       # Dependencies and scripts
├── tailwind.config.js                 # TailwindCSS configuration
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Vite configuration
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier works)
- Google Gemini API key (optional, for chatbot)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd carshare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tptzndshdlzwezopbbqy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_w6ouOzOE-iUHmSFVkzkSLQ_tFSEF9ZB

# AI Configuration (Optional)
VITE_GEMINI_API_KEY=AIzaSyDdSr5pR60dQv-7KzWQ3zhvpYTfIvqQHK4Okay
```

**Note**: The above credentials are for the pre-configured production instance. To use your own Supabase instance, follow step 4.

### 4. Supabase Setup (Optional - Use Your Own Instance)

If you want to use your own Supabase instance:

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. Update the `.env` file with your credentials
4. Run the database migrations (see step 5)

### 5. Database Migration

Run the following SQL scripts in your Supabase SQL Editor **in this exact order**:

#### Step 1: Fresh Database Setup

Run `supabase/migrations/20241221000000_fresh_database_setup.sql`

This script creates:

- **profiles** table: User information and profile data
- **cars** table: Car listings with specifications
- **rentals** table: Booking and rental management
- **Row Level Security (RLS)** policies for data protection
- **Database functions** and triggers
- **Performance indexes** for optimized queries

#### Step 2: Storage Setup

Run `supabase/migrations/20241221000001_setup_storage.sql`

This script creates:

- **car-images** storage bucket
- Storage policies for public read and authenticated upload
- User-specific folder structure

#### Step 3: Enhanced Profiles

Run `supabase/migrations/20241221000002_enhanced_profiles.sql`

This script adds:

- Additional profile fields (phone, address, profile picture)
- Updated RLS policies

#### Step 4: Disable Email Verification (Optional)

Run `supabase/migrations/20241221000003_disable_email_verification.sql`

This script:

- Disables email confirmation requirement
- Allows immediate user access after signup

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### 7. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

---

## 🗄 Database Schema

### Tables Overview

#### **profiles**

User profile information linked to Supabase authentication.

| Column              | Type      | Description                        |
| ------------------- | --------- | ---------------------------------- |
| id                  | uuid      | Primary key, references auth.users |
| email               | text      | User email address                 |
| full_name           | text      | User's full name                   |
| phone_number        | text      | Contact number                     |
| address             | text      | User's address                     |
| profile_picture_url | text      | URL to profile picture             |
| created_at          | timestamp | Account creation date              |
| updated_at          | timestamp | Last update timestamp              |

#### **cars**

Car listings with detailed specifications.

| Column      | Type      | Description              |
| ----------- | --------- | ------------------------ |
| id          | uuid      | Primary key              |
| owner_id    | uuid      | References profiles(id)  |
| make        | text      | Car manufacturer         |
| model       | text      | Car model name           |
| year        | integer   | Manufacturing year       |
| daily_rate  | numeric   | Rental price per day (₹) |
| location    | text      | Pickup location          |
| description | text      | Car description          |
| image_url   | text      | Primary image URL        |
| image_url_2 | text      | Secondary image URL      |
| image_url_3 | text      | Tertiary image URL       |
| available   | boolean   | Availability status      |
| latitude    | numeric   | Location latitude        |
| longitude   | numeric   | Location longitude       |
| created_at  | timestamp | Listing creation date    |

#### **rentals**

Booking and rental management.

| Column      | Type      | Description             |
| ----------- | --------- | ----------------------- |
| id          | uuid      | Primary key             |
| car_id      | uuid      | References cars(id)     |
| renter_id   | uuid      | References profiles(id) |
| start_date  | date      | Rental start date       |
| end_date    | date      | Rental end date         |
| total_price | numeric   | Total rental cost (₹)   |
| status      | text      | Rental status           |
| created_at  | timestamp | Booking creation date   |

**Rental Status Values**:

- `pending` - Awaiting payment
- `approved` - Payment completed, booking confirmed
- `rejected` - Booking declined
- `completed` - Rental period finished

### Storage Buckets

#### **car-images**

- **Purpose**: Store car listing images
- **Access**: Public read, authenticated upload
- **Structure**: User-specific folders (user_id/filename)
- **Policies**: RLS-protected upload, public download

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

**Profiles**:

- Users can read all profiles
- Users can update only their own profile

**Cars**:

- Anyone can view available cars
- Only car owners can insert/update/delete their listings

**Rentals**:

- Users can view their own rentals (as renter or car owner)
- Only renters can create rental requests
- Only car owners can update rental status

---

## 🎯 Key Features Explained

### 1. Enhanced Authentication

The signup process now collects comprehensive user information:

- Full name
- Phone number
- Address
- Profile picture upload
- Email verification is disabled for seamless onboarding

### 2. Car Listing with Images

Owners can list cars with detailed information and up to 3 images:

- Upload directly from the browser
- Images stored in Supabase Storage
- Automatic image URL generation
- Support for JPEG, PNG, and WebP formats

### 3. Interactive Maps

Car locations are displayed on interactive Leaflet maps:

- **50+ Indian Cities**: Pre-populated with major cities
- **Random Location Assignment**: Cars get realistic coordinates
- **Map Controls**: Zoom, pan, and explore
- **Marker Clustering**: Organized display for multiple cars
- **Error Boundaries**: Graceful fallback if maps fail to load
- **Alternative Display**: Simple location text if maps unavailable

### 4. Booking Flow

Complete rental process from discovery to confirmation:

1. **Browse**: View available cars with prices
2. **Select**: Choose a car and click "Rent This Car"
3. **Date Selection**: Pick rental start and end dates
4. **Price Calculation**: See total cost based on duration
5. **Submit Request**: Create rental with "pending" status
6. **Payment**: Navigate to payment page from "My Rentals"
7. **Process Payment**: Fill dummy payment form (card or UPI)
8. **Confirmation**: Status updates to "approved", success page shown

### 5. Payment System

Realistic payment simulation without real transactions:

**Payment Methods**:

- **Credit/Debit Card**: Card number, expiry, CVV, name
- **UPI**: UPI ID input

**Features**:

- Form validation for all fields
- 2-second processing simulation
- Loading animations
- Rental status update on success
- Detailed confirmation page
- Next steps guidance

### 6. AI Chat Assistant

Powered by Google Gemini 2.5 Flash:

**Capabilities**:

- Answer car maintenance questions
- Provide rental guidance
- Explain marketplace features
- Give personalized information about user's rentals
- Offer fuel efficiency tips
- Maintenance schedule recommendations

**Example Interactions**:

```
User: "What cars are available in Mumbai?"
AI: [Lists cars with Mumbai location]

User: "How often should I change the oil?"
AI: [Provides maintenance schedule advice]

User: "What are my current bookings?"
AI: [Shows user's rental information]
```

**Technical Details**:

- Streaming responses for real-time feel
- Markdown formatting support
- Message history maintained
- Error handling and retry logic
- Floating widget accessible anywhere

---

## 🔑 API Configuration

### Supabase Configuration

The app uses Supabase for:

- **Database**: PostgreSQL with RLS
- **Authentication**: Email/password auth
- **Storage**: Image uploads
- **Real-time**: Auto-refresh capabilities

**Current Instance**:

- URL: `https://tptzndshdlzwezopbbqy.supabase.co`
- Anon Key: `sb_publishable_w6ouOzOE-iUHmSFVkzkSLQ_tFSEF9ZB`

### Google Gemini AI

**API Key**: `AQ.Ab8RN6KdGrYdlAhiMB6qJdgpgFGHh6-N8MSkj1JtHaqV6zDzJwOkay`

**Model**: `gemini-2.5-flash` (or `gemini-1.5-flash` if 2.5 not available)

- Fast responses
- Cost-effective
- Good for conversational AI
- Streaming support

**To Get Your Own Key**:

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace in `.env` file

---

## 💻 Development

### Available Scripts

```bash
# Start development server (default port 5173)
npm run dev

# Start on port 3000
npm run dev:alt

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Workflow

1. **Make Changes**: Edit files in `src/`
2. **Hot Reload**: Changes reflect immediately
3. **Check Types**: TypeScript validates on save
4. **Test**: Use the app in browser
5. **Commit**: Save your changes

### Adding New Features

**To Add a New Page**:

1. Create component in `src/components/`
2. Add route in `src/App.tsx`
3. Add navigation link in navbar

**To Add Database Table**:

1. Create migration SQL file
2. Define table schema
3. Add RLS policies
4. Run migration in Supabase SQL editor

**To Modify UI**:

1. Update component JSX
2. Use TailwindCSS utility classes
3. Test responsiveness

### Debugging Tools

The app includes debug components:

- `/debug` - Car data debugging
- `/test` - Test component
- Browser DevTools for React and Network

### Common Issues & Solutions

**Issue**: Map not loading

- **Solution**: Check Leaflet CSS import, verify coordinates

**Issue**: Images not uploading

- **Solution**: Check storage bucket policies, file size limits

**Issue**: Authentication errors

- **Solution**: Verify Supabase credentials, check RLS policies

**Issue**: Chat not working

- **Solution**: Verify Gemini API key is valid and not leaked

---

## 🎨 Styling & Theming

### Color Scheme

- **Primary**: Indigo (`bg-indigo-600`, `text-indigo-600`)
- **Success**: Green (`bg-green-500`, `text-green-700`)
- **Warning**: Yellow (`bg-yellow-100`, `text-yellow-800`)
- **Error**: Red (`bg-red-100`, `text-red-800`)
- **Neutral**: Gray shades

### Typography

- **Font Family**: System fonts stack
- **Headings**: Bold, various sizes
- **Body**: Regular weight, readable line height

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🔒 Security

### Authentication Security

- Passwords hashed by Supabase
- JWT tokens for session management
- Secure HTTP-only cookies

### Database Security

- Row Level Security (RLS) on all tables
- User can only modify their own data
- SQL injection prevention
- Parameterized queries

### Storage Security

- User-specific folders
- File type validation
- Size limits enforced
- Public read for car images only

### API Security

- Environment variables for sensitive data
- API keys not exposed in client code
- CORS configured properly

---

## 📊 Features Roadmap

### Completed ✅

- User authentication and profiles
- Car listing and management
- Booking system
- Payment simulation
- AI chatbot integration
- Interactive maps
- Currency conversion to INR
- Email verification disable

### Future Enhancements 🚀

- Real payment gateway integration (Razorpay/Stripe)
- Review and rating system
- Advanced search and filters
- Car availability calendar
- In-app messaging between owners and renters
- Push notifications
- Insurance options
- Multi-language support
- Admin dashboard
- Analytics and reporting
- Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
2. **Create a Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature
4. **Commit**: `git commit -m 'Add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Use TailwindCSS for styling
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Support & Contact

For questions, issues, or suggestions:

- Open an issue on GitHub
- Contact the development team
- Check documentation

---

## 🙏 Acknowledgments

- **Supabase** - Amazing backend platform
- **Google Gemini** - Powerful AI capabilities
- **React & TypeScript** - Robust development tools
- **TailwindCSS** - Beautiful styling framework
- **Leaflet** - Interactive mapping library
- **Lucide Icons** - Clean, modern icons

---

## 📸 Screenshots

### Home Page

Browse available cars with beautiful card layouts and instant access to rental information.

### Car Details

View comprehensive car information with image galleries, specifications, and owner details.

### Booking Interface

Select dates, calculate prices, and submit rental requests with an intuitive interface.

### Payment Page

Process payments with a realistic payment form supporting cards and UPI.

### My Rentals Dashboard

Track all your bookings with status indicators and quick actions.

### AI Chat Assistant

Get instant help with car-related questions from the floating chat widget.

### Profile Management

Update your information, upload profile pictures, and manage account settings.

---

**Built with ❤️ for the CarShare Community**

---

_Last Updated: December 2024_
