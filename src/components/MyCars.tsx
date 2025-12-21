import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { MapPin, DollarSign, Calendar, Check, X } from "lucide-react";

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

interface Rental {
  id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  renter: {
    email: string;
  };
}

export function MyCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [rentals, setRentals] = useState<Record<string, Rental[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCars();
  }, []);

  async function fetchMyCars() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: carsData, error: carsError } = await supabase
        .from("cars")
        .select("*")
        .eq("owner_id", user.id);

      if (carsError) throw carsError;
      setCars(carsData || []);

      // Fetch rentals for each car
      for (const car of carsData || []) {
        const { data: rentalsData, error: rentalsError } = await supabase
          .from("rentals")
          .select(
            `
            *,
            renter:renter_id(email)
          `
          )
          .eq("car_id", car.id)
          .order("created_at", { ascending: false });

        if (rentalsError) throw rentalsError;
        setRentals((prev) => ({
          ...prev,
          [car.id]: rentalsData || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRentalStatus(
    rentalId: string,
    status: "approved" | "rejected"
  ) {
    try {
      const { error } = await supabase
        .from("rentals")
        .update({ status })
        .eq("id", rentalId);

      if (error) throw error;
      await fetchMyCars(); // Refresh data
    } catch (error) {
      console.error("Error updating rental status:", error);
      alert("Error updating rental status. Please try again.");
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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Cars</h2>
      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't listed any cars yet.</p>
          <a
            href="/add-car"
            className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Your First Car
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{car.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>₹{car.daily_rate}/day</span>
                      </div>
                    </div>
                  </div>
                  <img
                    src={
                      car.image_url ||
                      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
                    }
                    alt={`${car.make} ${car.model}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Rental Requests */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Rental Requests
                  </h4>
                  {rentals[car.id]?.length > 0 ? (
                    <div className="space-y-4">
                      {rentals[car.id].map((rental) => (
                        <div key={rental.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-gray-600">
                                Renter: {rental.renter.email}
                              </p>
                              <div className="flex items-center mt-1 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  {new Date(
                                    rental.start_date
                                  ).toLocaleDateString()}{" "}
                                  -{" "}
                                  {new Date(
                                    rental.end_date
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="mt-1 text-sm font-semibold">
                                Total: ₹{rental.total_price}
                              </p>
                            </div>
                            {rental.status === "pending" && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleRentalStatus(rental.id, "approved")
                                  }
                                  className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleRentalStatus(rental.id, "rejected")
                                  }
                                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            )}
                            {rental.status !== "pending" && (
                              <span
                                className={`px-3 py-1 rounded-md text-sm ${
                                  rental.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {rental.status.charAt(0).toUpperCase() +
                                  rental.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      No rental requests yet.
                    </p>
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
