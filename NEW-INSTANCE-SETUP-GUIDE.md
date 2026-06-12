# Complete Setup Guide for New Supabase Instance

Your new Supabase instance: `https://tptzndshdlzwezopbbqy.supabase.co`

## 🚀 Quick Setup Steps

Follow these steps **in order** to set up your new Supabase instance:

---

## Step 1: Run Database Migration

Go to your Supabase SQL Editor:
**https://supabase.com/dashboard/project/tptzndshdlzwezopbbqy/sql/new**

Copy and paste the entire content of `fix-new-instance.sql` and click **RUN**.

This script will:

- ✅ Create all tables (profiles, cars, rentals)
- ✅ Set up Row Level Security (RLS)
- ✅ Create all necessary RLS policies
- ✅ Add indexes for performance
- ✅ Create triggers for auto-profile creation
- ✅ Grant proper permissions

**Verify**: After running, you should see a table showing 0 rows for each table (they're empty but created).

---

## Step 2: Set Up Storage Bucket

In the same SQL Editor, run the content of `fix-storage-new-instance.sql`.

This script will:

- ✅ Create 'car-images' storage bucket
- ✅ Set up storage policies for image uploads
- ✅ Allow public read access to images
- ✅ Restrict uploads to authenticated users

**Verify**: Go to **Storage** in the sidebar and you should see the `car-images` bucket.

---

## Step 3: Disable Email Verification

**Important**: This must be done manually in the dashboard!

1. Go to **Authentication > Email Auth**:
   https://supabase.com/dashboard/project/tptzndshdlzwezopbbqy/auth/settings

2. Scroll down to "Email Auth" section

3. Find "Enable email confirmations" toggle

4. **Turn OFF** "Enable email confirmations"

5. Click **Save**

**Why?** This allows users to sign in immediately after signup without waiting for email confirmation.

---

## Step 4: Verify API Keys

Your environment is already configured with:

```env
VITE_SUPABASE_URL=https://tptzndshdlzwezopbbqy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_w6ouOzOE-iUHmSFVkzkSLQ_tFSEF9ZB
```

**Verify**: Check that these match your dashboard:
https://supabase.com/dashboard/project/tptzndshdlzwezopbbqy/settings/api

---

## Step 5: Test Your Setup

1. **Stop** any running dev server (Ctrl+C)

2. **Restart** the development server:

   ```bash
   npm run dev
   ```

3. **Test Signup**:

   - Open http://localhost:5173
   - Click "Create Account"
   - Fill in the form with test data
   - Submit

4. **Expected Result**: You should be logged in immediately without email verification

---

## 🔍 Troubleshooting

### Issue: "Invalid API key" error

**Solution**:

1. Verify the API key in your Supabase dashboard matches `.env`
2. Make sure you're using the **anon/public** key, not the service_role key
3. Restart your dev server after changing `.env`

### Issue: "Row Level Security policy violation"

**Solution**:

1. Make sure you ran `fix-new-instance.sql` completely
2. Check if RLS is enabled: Go to **Database > Tables** and verify each table has a green shield icon
3. Re-run the RLS policies section of the script

### Issue: "relation does not exist"

**Solution**:

1. Tables weren't created properly
2. Re-run `fix-new-instance.sql` from the beginning
3. Check for error messages in the SQL Editor

### Issue: Can't upload images

**Solution**:

1. Make sure you ran `fix-storage-new-instance.sql`
2. Verify the bucket exists in **Storage** section
3. Check storage policies are created
4. Ensure user is authenticated when uploading

### Issue: Can't see other users' cars

**Solution**:

1. This is expected! RLS policies control what each user can see
2. The "Cars are viewable by everyone" policy should allow viewing all cars
3. Check if the policy exists: Run this in SQL Editor:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'cars';
   ```

---

## 📊 Verify Everything is Working

Run this query in the SQL Editor to check your setup:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'cars', 'rentals');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'cars', 'rentals');

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Check storage bucket
SELECT id, name, public
FROM storage.buckets
WHERE id = 'car-images';
```

**Expected Results**:

- 3 tables: profiles, cars, rentals
- All tables have `rowsecurity = true`
- Multiple policies for each table
- 1 storage bucket: car-images

---

## 🎯 What Each Policy Does

### Profiles Policies:

- **Public profiles are viewable by everyone**: Anyone can see user profiles
- **Users can insert their own profile**: Auto-created on signup
- **Users can update own profile**: Users can edit their own info

### Cars Policies:

- **Cars are viewable by everyone**: Browse all cars
- **Authenticated users can insert cars**: List new cars
- **Users can update own cars**: Edit own listings
- **Users can delete own cars**: Remove own listings

### Rentals Policies:

- **Users can view their own rentals**: See bookings as renter
- **Car owners can view rentals for their cars**: See incoming bookings
- **Authenticated users can create rentals**: Make bookings
- **Car owners can update rental status**: Approve/reject
- **Renters can update their own rentals**: Update payment status

---

## 🔐 Security Notes

1. **Never expose the service_role key** in client code
2. **Always use the anon/public key** for frontend
3. **RLS policies protect your data** - don't disable them
4. **Test with multiple users** to ensure isolation
5. **Storage policies** prevent unauthorized uploads

---

## 📝 Next Steps After Setup

1. ✅ Create your first user account
2. ✅ List your first car
3. ✅ Test the booking flow
4. ✅ Test the payment flow
5. ✅ Try the AI chatbot
6. ✅ Upload car images

---

## 🆘 Still Having Issues?

1. Check browser console for errors (F12)
2. Check Supabase logs: **Logs & Reports** in dashboard
3. Verify API key is correct
4. Ensure dev server restarted after `.env` changes
5. Clear browser cache and cookies
6. Try in incognito/private mode

---

## ✅ Setup Complete Checklist

- [ ] Ran `fix-new-instance.sql` successfully
- [ ] Ran `fix-storage-new-instance.sql` successfully
- [ ] Disabled email verification in dashboard
- [ ] Verified API keys match
- [ ] Restarted dev server
- [ ] Successfully signed up a test user
- [ ] Can browse the application
- [ ] Can list a car (test upload)
- [ ] Can make a booking
- [ ] Payment flow works

Once all checkboxes are complete, your new Supabase instance is fully set up! 🎉

---

**Last Updated**: December 2024
**Supabase Project**: tptzndshdlzwezopbbqy
