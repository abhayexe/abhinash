import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function TestCars() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    const results: any = {};

    try {
      // Test 1: Direct cars query
      console.log("Test 1: Direct cars query");
      const { data: cars, error: carsError } = await supabase
        .from("cars")
        .select("*");

      results.allCars = { data: cars, error: carsError, count: cars?.length };
      console.log("All cars:", results.allCars);

      // Test 2: Available cars only
      console.log("Test 2: Available cars only");
      const { data: availableCars, error: availableError } = await supabase
        .from("cars")
        .select("*")
        .eq("available", true);

      results.availableCars = {
        data: availableCars,
        error: availableError,
        count: availableCars?.length,
      };
      console.log("Available cars:", results.availableCars);

      // Test 3: Cars with profiles (the problematic query)
      console.log("Test 3: Cars with profiles");
      const { data: carsWithProfiles, error: profileError } = await supabase
        .from("cars")
        .select(
          `
          *,
          profiles!owner_id (
            full_name,
            profile_picture_url,
            city
          )
        `
        )
        .eq("available", true);

      results.carsWithProfiles = {
        data: carsWithProfiles,
        error: profileError,
        count: carsWithProfiles?.length,
      };
      console.log("Cars with profiles:", results.carsWithProfiles);

      // Test 4: All profiles
      console.log("Test 4: All profiles");
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      results.profiles = {
        data: profiles,
        error: profilesError,
        count: profiles?.length,
      };
      console.log("All profiles:", results.profiles);

      // Test 5: Current user
      console.log("Test 5: Current user");
      const { data: user, error: userError } = await supabase.auth.getUser();
      results.currentUser = { data: user, error: userError };
      console.log("Current user:", results.currentUser);
    } catch (error) {
      console.error("Test error:", error);
      results.error = error;
    }

    setTestResults(results);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6">Running tests...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🧪 Database Connection Tests</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Cars */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-600">
            📊 All Cars ({testResults.allCars?.count || 0})
          </h2>
          {testResults.allCars?.error ? (
            <div className="text-red-600 text-sm">
              Error: {testResults.allCars.error.message}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.allCars?.data?.slice(0, 3).map((car: any) => (
                <div key={car.id} className="border p-2 rounded text-sm">
                  <strong>
                    {car.make} {car.model}
                  </strong>{" "}
                  ({car.year})
                  <br />
                  <span className="text-gray-600">
                    Available: {car.available ? "✅" : "❌"} | Owner:{" "}
                    {car.owner_id?.substring(0, 8)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Cars */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-green-600">
            ✅ Available Cars ({testResults.availableCars?.count || 0})
          </h2>
          {testResults.availableCars?.error ? (
            <div className="text-red-600 text-sm">
              Error: {testResults.availableCars.error.message}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.availableCars?.data?.slice(0, 3).map((car: any) => (
                <div key={car.id} className="border p-2 rounded text-sm">
                  <strong>
                    {car.make} {car.model}
                  </strong>{" "}
                  ({car.year})
                  <br />
                  <span className="text-gray-600">
                    ₹{car.daily_rate}/day | {car.location}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cars with Profiles */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-purple-600">
            👤 Cars with Profiles ({testResults.carsWithProfiles?.count || 0})
          </h2>
          {testResults.carsWithProfiles?.error ? (
            <div className="text-red-600 text-sm">
              Error: {testResults.carsWithProfiles.error.message}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.carsWithProfiles?.data
                ?.slice(0, 3)
                .map((car: any) => (
                  <div key={car.id} className="border p-2 rounded text-sm">
                    <strong>
                      {car.make} {car.model}
                    </strong>{" "}
                    ({car.year})
                    <br />
                    <span className="text-gray-600">
                      Owner: {car.profiles?.full_name || "No profile"} |{" "}
                      {car.location}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Profiles */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-orange-600">
            👥 All Profiles ({testResults.profiles?.count || 0})
          </h2>
          {testResults.profiles?.error ? (
            <div className="text-red-600 text-sm">
              Error: {testResults.profiles.error.message}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.profiles?.data?.slice(0, 3).map((profile: any) => (
                <div key={profile.id} className="border p-2 rounded text-sm">
                  <strong>{profile.full_name || "No name"}</strong>
                  <br />
                  <span className="text-gray-600">
                    {profile.email} | {profile.city || "No city"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current User */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3 text-indigo-600">
          🔐 Current User
        </h2>
        {testResults.currentUser?.error ? (
          <div className="text-red-600">
            Error: {testResults.currentUser.error.message}
          </div>
        ) : (
          <div className="text-sm">
            <strong>Email:</strong>{" "}
            {testResults.currentUser?.data?.user?.email || "Not logged in"}
            <br />
            <strong>ID:</strong>{" "}
            {testResults.currentUser?.data?.user?.id || "N/A"}
            <br />
            <strong>Confirmed:</strong>{" "}
            {testResults.currentUser?.data?.user?.email_confirmed_at
              ? "✅"
              : "❌"}
          </div>
        )}
      </div>

      {/* Console Message */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800">
          📝 Check Browser Console
        </h3>
        <p className="text-yellow-700 text-sm">
          Open browser console (F12) to see detailed logs for each test.
        </p>
      </div>
    </div>
  );
}
