#!/usr/bin/env python3
"""
Initialize the agents table by making a test insert (will create schema)
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

print("Please create the 'agents' table in Supabase:")
print("\n1. Go to: https://supabase.com/dashboard/project/mhycwrnqmzpkteewrgok/editor")
print("2. Click 'SQL Editor' in the left sidebar")
print("3. Click 'New query'")
print("4. Paste and run this SQL:\n")
print("-" * 60)
print("""
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  price FLOAT NOT NULL DEFAULT 0.001,
  created_at TIMESTAMP DEFAULT NOW()
);
""")
print("-" * 60)
print("\n5. After running the SQL, the table will be ready!")
print("\nOnce you've done this, the backend will be able to save agent configurations.")
