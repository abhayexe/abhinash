import React from "react";
import { MapPin } from "lucide-react";

interface SimpleLocationDisplayProps {
  location: string;
  carDetails?: {
    make: string;
    model: string;
    year: number;
    dailyRate: number;
  };
}

export function SimpleLocationDisplay({
  location,
  carDetails,
}: SimpleLocationDisplayProps) {
  return (
    <div className="w-full h-64 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="bg-indigo-600 text-white p-4 rounded-full mb-4 inline-block">
          <MapPin className="h-8 w-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {carDetails
            ? `${carDetails.make} ${carDetails.model} (${carDetails.year})`
            : "Car Location"}
        </h3>

        <p className="text-lg text-gray-700 mb-2">📍 {location}</p>

        {carDetails && (
          <p className="text-lg font-semibold text-green-600">
            ₹{carDetails.dailyRate}/day
          </p>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <p>Interactive map will load here</p>
          <p>Location: {location}</p>
        </div>
      </div>
    </div>
  );
}
