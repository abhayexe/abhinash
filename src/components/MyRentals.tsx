import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Rental {
  id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    image_url: string | null;
    location: string;
    owner_id: string;
  } | null;
}

export function MyRentals() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);

      // Clear the success state from location to prevent showing after refresh
      window.history.replaceState({}, document.title);
    }

    fetchRentals();
  }, [location]);

  async function fetchRentals() {
    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        navigate("/");
        return;
      }

      // First get the rentals
      const { data: rentalData, error: rentalError } = await supabase
        .from("rentals")
        .select(
          "id, start_date, end_date, total_price, status, created_at, car_id"
        )
        .eq("renter_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (rentalError) throw rentalError;

      if (!rentalData || rentalData.length === 0) {
        setRentals([]);
        setLoading(false);
        return;
      }

      // Get all car details in a separate query
      const carIds = rentalData.map((rental) => rental.car_id);
      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("id, make, model, year, image_url, location, owner_id")
        .in("id", carIds);

      if (carsError) throw carsError;

      // Map the cars to the rentals
      const rentalsWithCars = rentalData.map((rental) => ({
        ...rental,
        car: carsData?.find((car) => car.id === rental.car_id) || null,
      }));

      setRentals(rentalsWithCars);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Rental Bookings</h1>
        <button
          onClick={() => navigate("/rent")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Browse Cars
        </button>
      </div>

      {showSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Your rental request has been successfully submitted. The car
                owner will review your request soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {rentals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No rentals yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't booked any cars yet. Browse available cars to make your
            first booking.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/rent")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Find a Car
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="md:flex">
                {rental.car && (
                  <div className="md:flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover md:w-48"
                      src={
                        rental.car.image_url ||
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400"
                      }
                      alt={`${rental.car.make} ${rental.car.model}`}
                    />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {rental.car
                        ? `${rental.car.year} ${rental.car.make} ${rental.car.model}`
                        : "Car details unavailable"}
                    </h3>
                    {getStatusBadge(rental.status)}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {new Date(rental.start_date).toLocaleDateString()} -{" "}
                          {new Date(rental.end_date).toLocaleDateString()}
                        </span>
                      </div>

                      {rental.car && (
                        <div className="flex items-center text-gray-600 mt-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{rental.car.location}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-semibold">
                          Total: ₹{rental.total_price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mt-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          Booked on{" "}
                          {new Date(rental.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {rental.status === "pending" && rental.car && (
                    <div className="mt-4 border-t pt-4 flex justify-end">
                      <button
                        onClick={() =>
                          rental.car && navigate(`/rent/${rental.car.id}`)
                        }
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        View Car
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
