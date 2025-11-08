from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import httpx

load_dotenv()

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    print("Warning: Supabase credentials not found in environment variables")
    supabase: Client = None
else:
    supabase: Client = create_client(supabase_url, supabase_key)

class AgentConfig(BaseModel):
    url: str
    bot_token: str
    price: float


async def setup_telegram_webhook(bot_token: str, webhook_url: str) -> dict:
    """Set up Telegram webhook for a bot"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.telegram.org/bot{bot_token}/setWebhook",
            json={"url": webhook_url}
        )
        result = response.json()
        if not result.get("ok"):
            raise Exception(f"Failed to set webhook: {result.get('description')}")
        return result


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "Laissez API"}

@app.post("/api/agents")
async def create_agent_config(config: AgentConfig):
    """Save agent configuration to Supabase"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Validate price minimum
        if config.price < 0.001:
            raise HTTPException(status_code=400, detail="Price must be at least $0.001")
        
        # Insert into Supabase
        data = {
            "url": config.url,
            "bot_token": config.bot_token,
            "price": config.price
        }
        
        response = supabase.table("agents").insert(data).execute()
        
        return {
            "success": True,
            "message": "Agent configuration saved successfully",
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save configuration: {str(e)}")

@app.get("/api/agents")
async def get_agent_configs():
    """Get all agent configurations"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        response = supabase.table("agents").select("*").execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch configurations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)