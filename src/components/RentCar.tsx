import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  Clock,
  Zap,
  Shield,
  AlertCircle,
} from "lucide-react";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  daily_rate: number;
  location: string;
  image_url: string;
  available: boolean;
  image_url_2: string | null;
  image_url_3: string | null;
  owner_id: string;
}

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export function RentCar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
      setTotalPrice(diffDays * (car?.daily_rate || 0));
    }
  }, [startDate, endDate, car]);

  async function fetchCar() {
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setCar(data);

      // Try to fetch owner information if the car has an owner_id
      if (data?.owner_id) {
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("id, email, first_name, last_name")
            .eq("id", data.owner_id)
            .single();

          if (profileData) {
            setOwner(profileData);
          }
        } catch (profileError) {
          // Silently handle profile error - table might not exist yet
          console.log(
            "Profile fetch failed, table might not exist yet:",
            profileError
          );
        }
      }
    } catch (error) {
      console.error("Error fetching car:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("End date must be after start date");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("rentals")
        .insert([
          {
            car_id: id,
            renter_id: userData.user?.id,
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
            status: "pending",
          },
        ])
        .select("id");

      if (error) throw error;

      navigate("/my-rentals", { state: { success: true } });
    } catch (error: any) {
      console.error("Error creating rental:", error);
      setError(error.message || "Failed to create rental");
    } finally {
      setSubmitting(false);
    }
  }

  function nextImage() {
    if (!car) return;

    const images = [car.image_url, car.image_url_2, car.image_url_3].filter(
      Boolean
    );
    setImageLoading(true);
    setCurrentImage((currentImage + 1) % images.length);
  }

  function prevImage() {
    if (!car) return;

    const images = [car.image_url, car.image_url_2, car.image_url_3].filter(
      Boolean
    );
    setImageLoading(true);
    setCurrentImage((currentImage - 1 + images.length) % images.length);
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-600 font-medium">
          Loading car details...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg max-w-xl mx-auto">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <Clock className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Car not found
        </h2>
        <p className="mt-3 text-lg text-gray-600">
          The car you're looking for doesn't exist or is no longer available.
        </p>
        <button
          onClick={() => navigate("/rent")}
          className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150"
        >
          Back to Available Cars
        </button>
      </div>
    );
  }

  const images = [car.image_url, car.image_url_2, car.image_url_3].filter(
    Boolean
  ) as string[];
  const currentImageUrl = images[currentImage];

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-200 bg-opacity-80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          )}
          <img
            src={
              currentImageUrl ||
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
            }
            alt={`${car.make} ${car.model}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors duration-200"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-colors duration-200"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImageLoading(true);
                      setCurrentImage(idx);
                    }}
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      idx === currentImage
                        ? "bg-white scale-125"
                        : "bg-white bg-opacity-50 hover:bg-opacity-75"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 md:mb-0">
              {car.year} {car.make} {car.model}
            </h1>
            <div className="inline-flex px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-lg font-semibold">
              ${car.daily_rate}/day
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-8">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                  Car Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start text-gray-700">
                    <MapPin className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">
                        Location
                      </span>
                      <span>{car.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <User className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">
                        Owner
                      </span>
                      <span>
                        {owner?.email
                          ? owner.email
                          : `ID: ${car.id.substring(0, 8)}...`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <Zap className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">
                        Status
                      </span>
                      <span
                        className={
                          car.available ? "text-green-600" : "text-red-600"
                        }
                      >
                        {car.available
                          ? "Available now"
                          : "Currently unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <Clock className="h-6 w-6 mr-3 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-sm font-semibold text-gray-900">
                        Booking
                      </span>
                      <span>Instant confirmation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Features & Amenities
                </h3>

                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Premium Audio
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Bluetooth
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Climate Control
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Navigation
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 px-6">
                  <h3 className="text-xl font-bold text-white">
                    Book This Car
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      min={new Date().toISOString().split("T")[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      min={startDate || new Date().toISOString().split("T")[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  {startDate && endDate && totalDays > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>
                          ${car.daily_rate} × {totalDays} day
                          {totalDays !== 1 ? "s" : ""}
                        </span>
                        <span>${(car.daily_rate * totalDays).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>Service fee</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-indigo-700">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !car.available}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium text-sm shadow-sm transition-all duration-150 ${
                      car.available
                        ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>

                  {!car.available && (
                    <p className="text-center text-sm text-red-600 mt-2">
                      This car is currently unavailable
                    </p>
                  )}

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    By confirming, you agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      terms and conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      cancellation policy
                    </a>
                    .
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
