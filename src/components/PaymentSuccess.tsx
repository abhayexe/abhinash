import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CheckCircle, Calendar, MapPin, Car } from "lucide-react";

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rentalId = searchParams.get("rental");
    if (rentalId) {
      fetchRentalDetails(rentalId);
    } else {
      navigate("/my-rentals");
    }
  }, [searchParams, navigate]);

  async function fetchRentalDetails(rentalId: string) {
    try {
      const { data, error } = await supabase
        .from("rentals")
        .select(
          `
          id,
          start_date,
          end_date,
          total_price,
          status,
          cars (
            make,
            model,
            year,
            location,
            image_url
          )
        `
        )
        .eq("id", rentalId)
        .single();

      if (error) throw error;
      setRental(data);
    } catch (error) {
      console.error("Error fetching rental:", error);
      navigate("/my-rentals");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
        <button
          type="button"
          onClick={() => navigate("/my-rentals")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to My Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Success Header */}
        <div className="bg-green-500 text-white p-6 text-center">
          <CheckCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-green-100 mt-2">Your booking has been confirmed</p>
        </div>

        {/* Booking Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {rental.cars.year} {rental.cars.make} {rental.cars.model}
            </h2>
            <p className="text-gray-600">
              Booking ID: {rental.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {rental.cars.image_url && (
            <div className="mb-6">
              <img
                src={rental.cars.image_url}
                alt={`${rental.cars.make} ${rental.cars.model}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Rental Period</p>
                  <p className="text-sm text-gray-600">
                    {new Date(rental.start_date).toLocaleDateString()} -{" "}
                    {new Date(rental.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Pickup Location</p>
                  <p className="text-sm text-gray-600">
                    {rental.cars.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Car className="h-5 w-5 text-indigo-500 mr-3" />
                <div>
                  <p className="font-medium">Total Amount Paid</p>
                  <p className="text-sm text-gray-600">₹{rental.total_price}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You will receive a confirmation email shortly</li>
              <li>• Contact the car owner for pickup arrangements</li>
              <li>• Bring a valid driver's license and ID</li>
              <li>• Inspect the vehicle before driving</li>
            </ul>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              type="button"
              onClick={() => navigate("/my-rentals")}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              View My Rentals
            </button>
            <button
              type="button"
              onClick={() => navigate("/rent")}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Book Another Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
