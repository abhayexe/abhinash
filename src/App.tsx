import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Car, LogOut, Menu, Plus } from "lucide-react";
import { supabase } from "./lib/supabase";
import { Auth } from "./components/Auth";
import { CarList } from "./components/CarList";
import { AddCar } from "./components/AddCar";
import { MyCars } from "./components/MyCars";
import { RentCar } from "./components/RentCar";
import { MyRentals } from "./components/MyRentals";
import { ChatBot } from "./components/ChatBot";

function App() {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <Auth />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  CarShare
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <a
                  href="/my-cars"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Cars
                </a>
                <a
                  href="/add-car"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  List a Car
                </a>
                <a
                  href="/rent"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Rent a Car
                </a>
                <a
                  href="/my-rentals"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Rentals
                </a>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-indigo-600"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="/my-cars"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  My Cars
                </a>
                <a
                  href="/add-car"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  List a Car
                </a>
                <a
                  href="/rent"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Rent a Car
                </a>
                <a
                  href="/my-rentals"
                  className="block text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  My Rentals
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/rent" replace />} />
            <Route path="/my-cars" element={<MyCars />} />
            <Route path="/add-car" element={<AddCar />} />
            <Route path="/rent" element={<CarList />} />
            <Route path="/rent/:id" element={<RentCar />} />
            <Route path="/my-rentals" element={<MyRentals />} />
          </Routes>
        </main>

        {/* ChatBot component - available on all pages for authenticated users */}
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
