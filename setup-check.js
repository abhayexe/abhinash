#!/usr/bin/env node

/**
 * Setup Check Script for CarShare Platform
 *
 * This script verifies that the Supabase connection is working
 * and provides helpful setup information.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bwwjhxpzwlgcfrsfpfzo.supabase.co";
const supabaseKey = "sb_publishable_5X75v9B81nOcQKuSRBofyQ_2OV7KIL9";

async function checkSetup() {
  console.log("🚗 CarShare Platform Setup Check\n");

  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("✅ Supabase client initialized");

    // Test connection by checking if we can access the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.log("❌ Database connection failed:", error.message);
      console.log("\n📋 Setup Instructions:");
      console.log("1. Go to your Supabase SQL Editor");
      console.log("2. Run the migration files in order:");
      console.log(
        "   - supabase/migrations/20241221000000_fresh_database_setup.sql"
      );
      console.log("   - supabase/migrations/20241221000001_setup_storage.sql");
      console.log("3. Run this script again to verify setup");
      return;
    }

    console.log("✅ Database connection successful");

    // Check if storage bucket exists
    const { data: buckets, error: storageError } =
      await supabase.storage.listBuckets();

    if (storageError) {
      console.log("⚠️  Storage check failed:", storageError.message);
    } else {
      const carImagesBucket = buckets.find(
        (bucket) => bucket.name === "car-images"
      );
      if (carImagesBucket) {
        console.log("✅ Storage bucket configured");
      } else {
        console.log("⚠️  Storage bucket not found - run storage migration");
      }
    }

    console.log("\n🎉 Setup appears to be complete!");
    console.log("You can now run: npm run dev");
  } catch (error) {
    console.log("❌ Setup check failed:", error.message);
    console.log("\nPlease check your Supabase configuration and try again.");
  }
}

checkSetup();
