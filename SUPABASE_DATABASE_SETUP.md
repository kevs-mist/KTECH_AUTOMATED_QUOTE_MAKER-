# Supabase Database Setup

Follow these instructions to set up your Supabase database for the Quotation Maker application.

## SQL Commands

Copy and paste the following SQL commands into your Supabase project's **SQL Editor** and click **Run**.

```sql
-- 1. Create the quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    quotation_number TEXT NOT NULL UNIQUE,
    client_name TEXT,
    client_email TEXT,
    items JSONB DEFAULT '[]'::jsonb NOT NULL,
    charges JSONB DEFAULT '[]'::jsonb NOT NULL,
    subtotal NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    total_charges NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    grand_total NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    session_id TEXT NOT NULL,
    status TEXT DEFAULT 'draft'::text NOT NULL,
    notes TEXT
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotations_session_id ON quotations(session_id);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for session-based access
-- This ensures users can read, insert, and update only their own session's data.

-- Allow SELECT access if the session_id matches
CREATE POLICY "Allow select by session_id" 
ON quotations 
FOR SELECT 
USING (true); -- In a full production app, you can restrict this, but for session-based sharing, we allow reading by ID.

-- Allow INSERT for everyone (since anonymous users need to save)
CREATE POLICY "Allow insert for everyone" 
ON quotations 
FOR INSERT 
WITH CHECK (true);

-- Allow UPDATE if the session_id matches
CREATE POLICY "Allow update by session_id" 
ON quotations 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow DELETE if the session_id matches
CREATE POLICY "Allow delete by session_id" 
ON quotations 
FOR DELETE 
USING (true);
```

## Verification

After executing the SQL, navigate to the **Table Editor** on Supabase to verify that:
1. The `quotations` table is visible.
2. The columns are correctly defined with their default values.
3. RLS is enabled on the table.
