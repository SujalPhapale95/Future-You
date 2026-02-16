# Future-You App - Setup Guide

## Issue Diagnosis
The error you're seeing ("An unexpected error occurred") is because the database tables haven't been created in your Supabase project yet.

## Solution: Set Up Database Schema

### Step 1: Access Supabase SQL Editor
1. Go to [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project
4. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Schema SQL
1. Click **New Query**
2. Copy the entire contents of `supabase/schema.sql` (located in your project)
3. Paste it into the SQL editor
4. Click **Run** or press `Ctrl+Enter`

This will create:
- ✅ `contracts` table
- ✅ `conditions` table  
- ✅ `push_subscriptions` table
- ✅ `reminders` table
- ✅ Row Level Security (RLS) policies for all tables

### Step 3: Verify Tables Were Created
1. Click on **Table Editor** in the left sidebar
2. You should see all 4 tables listed
3. Click on `contracts` to verify the structure

### Step 4: Test the App
1. Go to `http://localhost:3000`
2. Sign up or log in
3. Try creating a new contract
4. The error should now be resolved!

## Additional Configuration (Optional)

### Enable Google OAuth (if not already done)
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials

### Generate VAPID Keys for Push Notifications
The push notification system is currently in simulation mode. To enable real notifications:

1. Generate VAPID keys (already done - check `vapid_keys.txt`)
2. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   ```
3. Uncomment the actual notification sending logic in `src/app/api/cron/reminders/route.ts`

## Troubleshooting

### "Could not find the table" error persists
- Make sure you ran the SQL in the correct Supabase project
- Check that the project URL in `.env.local` matches your Supabase project

### RLS Policy errors
- The schema includes RLS policies that ensure users can only see their own data
- If you need to debug, you can temporarily disable RLS in Supabase (not recommended for production)

### Need to reset the database?
Run this in SQL Editor to drop all tables:
```sql
drop table if exists public.reminders cascade;
drop table if exists public.conditions cascade;
drop table if exists public.push_subscriptions cascade;
drop table if exists public.contracts cascade;
```

Then re-run the schema.sql file.
