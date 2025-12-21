import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { MapPin, Calendar, DollarSign, Star, User, Filter } from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  location: string;
  image_url: string;
  available: boolean;
}

export function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, priceRange]);

  async function fetchCars() {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true);

      if (error) throw error;
      setCars(data || []);
      setFilteredCars(data || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterCars() {
    let filtered = [...cars];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.location.toLowerCase().includes(term) ||
          car.year.toString().includes(term)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (car) =>
        car.daily_rate >= priceRange[0] && car.daily_rate <= priceRange[1]
    );

    setFilteredCars(filtered);
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">
          Finding available cars...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            Available Cars{" "}
            <span className="text-indigo-600">({filteredCars.length})</span>
          </h1>

          <div className="flex items-center">
            <div className="relative flex-grow mr-2">
              <input
                type="text"
                placeholder="Search cars..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search for cars by make, model, location or year"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <button
              onClick={toggleFilters}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div
            className="bg-white rounded-lg shadow-md p-4 mb-6 opacity-0 transform -translate-y-2 transition-all duration-300"
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
          >
            <h3 className="text-lg font-medium mb-3">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range (₹ per day)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-24 px-3 py-1 border border-gray-300 rounded-md"
                    aria-label="Minimum price per day"
                  />
                  <span className="mx-2">to</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-24 px-3 py-1 border border-gray-300 rounded-md"
                    aria-label="Maximum price per day"
                  />
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full accent-indigo-600"
                    aria-label="Minimum price range slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full accent-indigo-600"
                    aria-label="Maximum price range slider"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No cars found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
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
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
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
                    </strong>{" "}
                    up to 24h before pickup
                  </span>
                  <button
                    onClick={() => navigate(`/rent/${car.id}`)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
