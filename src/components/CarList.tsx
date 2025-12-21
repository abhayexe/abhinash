import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Calendar, Star, User } from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  location: string;
  image_url: string;
  available: boolean;
  owner_id: string;
}

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  async function fetchCars() {
    console.log("🚗 Fetching ALL available cars...");

    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true);

      console.log("Cars fetched:", { data, error, count: data?.length });

      if (error) {
        console.error("Error:", error);
        return;
      }

      if (data) {
        console.log(
          "Setting cars:",
          data.map((car) => `${car.make} ${car.model}`)
        );
        setCars(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Available Cars ({cars.length})
        </h1>
        <p className="text-xl text-gray-600">
          Choose from our selection of vehicles
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-medium text-gray-900">No cars found</h3>
          <p className="text-gray-500">No cars are currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={
                    car.image_url ||
                    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
                  }
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ₹{car.daily_rate}/day
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.9</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">{car.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">Instant Booking</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">Verified Owner</span>
                  </div>
                </div>

                <hr className="mb-5" />

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    <strong className="text-indigo-600">
                      Free cancellation
                    </strong>
                  </span>
                  <button
                    onClick={() => navigate(`/rent/${car.id}`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
