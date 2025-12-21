import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function DebugCars() {
  const [cars, setCars] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    debugFetch();
  }, []);

  async function debugFetch() {
    try {
      // Test 1: Basic cars query
      console.log("Testing basic cars query...");
      const { data: basicCars, error: basicError } = await supabase
        .from("cars")
        .select("*");

      console.log("Basic cars:", basicCars);
      if (basicError) console.error("Basic cars error:", basicError);

      // Test 2: Cars with profiles
      console.log("Testing cars with profiles...");
      const { data: carsWithProfiles, error: joinError } = await supabase.from(
        "cars"
      ).select(`
          *,
          profiles!owner_id (
            full_name,
            profile_picture_url,
            city
          )
        `);

      console.log("Cars with profiles:", carsWithProfiles);
      if (joinError) console.error("Join error:", joinError);

      // Test 3: All profiles
      console.log("Testing profiles query...");
      const { data: allProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      console.log("All profiles:", allProfiles);
      if (profilesError) console.error("Profiles error:", profilesError);

      setCars(basicCars || []);
      setProfiles(allProfiles || []);
    } catch (err) {
      console.error("Debug error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading debug info...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug Information</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">
            🚗 Cars ({cars.length})
          </h2>
          {cars.length === 0 ? (
            <p className="text-gray-500">No cars found</p>
          ) : (
            <div className="space-y-2">
              {cars.map((car: any) => (
                <div key={car.id} className="border p-2 rounded">
                  <p>
                    <strong>
                      {car.make} {car.model}
                    </strong>{" "}
                    ({car.year})
                  </p>
                  <p className="text-sm text-gray-600">
                    Owner ID: {car.owner_id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available: {car.available ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">
            👤 Profiles ({profiles.length})
          </h2>
          {profiles.length === 0 ? (
            <p className="text-gray-500">No profiles found</p>
          ) : (
            <div className="space-y-2">
              {profiles.map((profile: any) => (
                <div key={profile.id} className="border p-2 rounded">
                  <p>
                    <strong>{profile.full_name || "No name"}</strong>
                  </p>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                  <p className="text-sm text-gray-600">
                    City: {profile.city || "Not set"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">💡 Debugging Tips</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Check browser console for detailed logs</li>
          <li>Verify cars have owner_id that matches profile id</li>
          <li>Run fix-car-owners.sql if profiles are missing</li>
          <li>Check Supabase RLS policies</li>
        </ol>
      </div>
    </div>
  );
}
