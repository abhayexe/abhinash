import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Car, DollarSign, MapPin, Calendar, Image, Check } from "lucide-react";

export function AddCar() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    daily_rate: "",
    location: "",
    image_url: "",
    image_url_2: "",
    image_url_3: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase.from("cars").insert([
        {
          ...formData,
          owner_id: user.id,
          daily_rate: parseFloat(formData.daily_rate),
        },
      ]);

      if (error) throw error;

      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        daily_rate: "",
        location: "",
        image_url: "",
        image_url_2: "",
        image_url_3: "",
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Error adding car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-lg shadow-md animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Your car has been successfully added to the marketplace!
              </p>
              <p className="mt-2 text-sm text-green-700">
                It is now available for renters to book. You can view and manage
                your listings in the "My Cars" section.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 py-6 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-white" />
              <h2 className="text-2xl font-bold text-white">List Your Car</h2>
            </div>
            <span className="text-indigo-100 text-sm">
              All fields marked with * are required
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2 text-indigo-600" />
                Car Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label
                    htmlFor="make"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Make *
                  </label>
                  <input
                    type="text"
                    name="make"
                    id="make"
                    required
                    value={formData.make}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    aria-label="Car make"
                    placeholder="e.g. Toyota, Honda, Ford"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    id="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    aria-label="Car model"
                    placeholder="e.g. Camry, Civic, Mustang"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    id="year"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.year}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    aria-label="Car year"
                    placeholder="e.g. 2020"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="daily_rate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Daily Rate ($) *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="daily_rate"
                      id="daily_rate"
                      required
                      min="0"
                      step="0.01"
                      value={formData.daily_rate}
                      onChange={handleChange}
                      className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                      aria-label="Daily rental rate in dollars"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                Location
              </h3>

              <div className="space-y-1">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                  aria-label="Car location"
                  placeholder="e.g. Los Angeles, CA"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a city or neighborhood where renters can pick up the
                  car.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="h-5 w-5 mr-2 text-indigo-600" />
                Car Images
              </h3>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Primary Image URL *
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    id="image_url"
                    required
                    value={formData.image_url}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    placeholder="https://example.com/car-image1.jpg"
                    aria-label="Primary car image URL"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    This will be the main image shown to potential renters.
                  </p>

                  {formData.image_url && (
                    <div className="mt-2 relative rounded-lg overflow-hidden h-36 w-full bg-gray-100">
                      <img
                        src={formData.image_url}
                        alt="Primary car image preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Additional Images (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label
                        htmlFor="image_url_2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Additional Image URL 1
                      </label>
                      <input
                        type="url"
                        name="image_url_2"
                        id="image_url_2"
                        value={formData.image_url_2}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                        placeholder="https://example.com/car-image2.jpg"
                        aria-label="Second car image URL (optional)"
                      />
                      {formData.image_url_2 && (
                        <div className="mt-2 relative rounded-lg overflow-hidden h-28 w-full bg-gray-100">
                          <img
                            src={formData.image_url_2}
                            alt="Second car image preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="image_url_3"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Additional Image URL 2
                      </label>
                      <input
                        type="url"
                        name="image_url_3"
                        id="image_url_3"
                        value={formData.image_url_3}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                        placeholder="https://example.com/car-image3.jpg"
                        aria-label="Third car image URL (optional)"
                      />
                      {formData.image_url_3 && (
                        <div className="mt-2 relative rounded-lg overflow-hidden h-28 w-full bg-gray-100">
                          <img
                            src={formData.image_url_3}
                            alt="Third car image preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Submit car listing"
            >
              {loading ? (
                <>
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
                  Adding Your Car...
                </>
              ) : (
                "List Your Car"
              )}
            </button>
            <p className="mt-4 text-sm text-center text-gray-500">
              By listing your car, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Rental Policies
              </a>
              .
            </p>
          </div>
        </form>
      </div>

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        `}
      </style>
    </div>
  );
}
