#!/usr/bin/env python3
"""
Verify if the agents table exists in Supabase
"""
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("❌ Error: Supabase credentials not found in .env file")
    exit(1)

print(f"Connecting to Supabase at {supabase_url}...")
supabase = create_client(supabase_url, supabase_key)

try:
    # Try to query the table
    response = supabase.table("agents").select("*").limit(1).execute()
    print("✓ SUCCESS! Table 'agents' exists and is accessible!")
    print(f"  Current records: {len(response.data)}")
    if response.data:
        print("\n  Sample data:")
        for record in response.data:
            print(f"    - ID: {record.get('id')}, URL: {record.get('url')}, Price: ${record.get('price')}")
except Exception as e:
    print(f"❌ Table doesn't exist or error occurred: {str(e)}")
    print("\n📝 Please create the table by running this SQL in Supabase:")
    print("=" * 70)
    print("""
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  price FLOAT NOT NULL DEFAULT 0.001,
  created_at TIMESTAMP DEFAULT NOW()
);
""")
    print("=" * 70)
    print("\nSteps:")
    print("1. Go to: https://supabase.com/dashboard/project/mhycwrnqmzpkteewrgok/editor")
    print("2. Click 'SQL Editor' in the left sidebar")
    print("3. Click 'New query'")
    print("4. Paste the SQL above and click 'Run'")
    exit(1)
