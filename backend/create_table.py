#!/usr/bin/env python3
"""
Create the agents table in Supabase using REST API
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Error: Supabase credentials not found")
    exit(1)

# SQL to create table
sql = """
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  price FLOAT NOT NULL DEFAULT 0.001,
  created_at TIMESTAMP DEFAULT NOW()
);
"""

# Try to execute SQL via the Supabase REST API
# Note: This requires proper permissions
headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json"
}

print(f"Attempting to create table at {supabase_url}...")
print("\nNote: If this fails, please run the following SQL in your Supabase dashboard:")
print("=" * 60)
print(sql)
print("=" * 60)
print("\nGo to: Supabase Dashboard > SQL Editor > New Query")
print("Paste the SQL above and click 'Run'")
