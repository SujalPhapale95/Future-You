-- Run this in your Supabase SQL Editor

-- 1. Add reflection_note to reminders table (Safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reminders' AND column_name = 'reflection_note') THEN
        ALTER TABLE reminders ADD COLUMN reflection_note TEXT;
    END IF;
END $$;

-- 2. Add is_recurring to conditions table (Safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conditions' AND column_name = 'is_recurring') THEN
        ALTER TABLE conditions ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. Add index for faster stats queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_reminders_contract_id ON reminders(contract_id);
CREATE INDEX IF NOT EXISTS idx_reminders_response ON reminders(response);

-- 4. Add signature to contracts table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contracts' AND column_name = 'signature') THEN
        ALTER TABLE contracts ADD COLUMN signature TEXT;
    END IF;
END $$;

-- 5. (Optional) Check if user_metadata is accessible/updatable via client
-- No SQL needed for user_metadata as it's a JSONB column on auth.users, 
-- updated via supabase.auth.updateUser() client-side.
-- Note: 'streak_freezes_available' is stored in user_metadata.
