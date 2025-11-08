#!/usr/bin/env python3
"""
Setup script to create the agents table in Supabase
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Error: Supabase credentials not found in .env file")
    exit(1)

print(f"Connecting to Supabase at {supabase_url}...")
supabase = create_client(supabase_url, supabase_key)

# SQL to create the agents table
create_table_sql = """
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  price FLOAT NOT NULL DEFAULT 0.001,
  created_at TIMESTAMP DEFAULT NOW()
);
"""

try:
    # Execute the SQL using Supabase's RPC function
    # Note: This requires the RPC function to be set up in Supabase
    # Alternatively, we can check if the table exists by trying to query it
    print("Checking if 'agents' table exists...")
    
    try:
        # Try to query the table
        response = supabase.table("agents").select("*").limit(1).execute()
        print("✓ Table 'agents' already exists!")
    except Exception as e:
        print(f"Table doesn't exist or error occurred: {str(e)}")
        print("\nPlease create the table manually in Supabase SQL Editor:")
        print("=" * 60)
        print(create_table_sql)
        print("=" * 60)
        print("\nOr run this SQL in your Supabase dashboard > SQL Editor")

except Exception as e:
    print(f"Error: {str(e)}")
    print("\nPlease create the table manually using the SQL above")
