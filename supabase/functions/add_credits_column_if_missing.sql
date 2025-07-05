-- Create a function to safely add the credits column if it doesn't exist
CREATE OR REPLACE FUNCTION add_credits_column_if_missing()
RETURNS void AS $$
BEGIN
  -- Check if the credits column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users_table'
    AND column_name = 'credits'
  ) THEN
    -- Add the credits column with a default value of 100
    EXECUTE 'ALTER TABLE users_table ADD COLUMN credits INTEGER DEFAULT 100';
    
    -- Update existing rows to have the default value
    EXECUTE 'UPDATE users_table SET credits = 100 WHERE credits IS NULL';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
