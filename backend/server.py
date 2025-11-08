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
async def create_agent_config(config: AgentConfig, request: Request):
    """Save agent configuration to Supabase and set up Telegram webhook"""
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
        
        # Set up Telegram webhook
        # Try to get webhook base URL from environment (for preview/production)
        webhook_base = os.environ.get("WEBHOOK_BASE_URL") or os.environ.get("base_url")
        if webhook_base:
            webhook_url = f"{webhook_base}/api/telegram-webhook/{config.bot_token}"
        else:
            # Fallback to request host
            host = request.headers.get("host", "localhost:8001")
            scheme = "https" if "preview.emergentagent.com" in host or "emergentagent.com" in host else "http"
            webhook_url = f"{scheme}://{host}/api/telegram-webhook/{config.bot_token}"
        
        print(f"Setting webhook URL: {webhook_url}")
        webhook_result = await setup_telegram_webhook(config.bot_token, webhook_url)
        
        return {
            "success": True,
            "message": "Agent configuration saved successfully",
            "data": response.data,
            "webhook_info": {
                "webhook_url": webhook_url,
                "telegram_response": webhook_result
            }
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


@app.post("/api/telegram-webhook/{bot_token}")
async def telegram_webhook(bot_token: str, request: Request):
    """
    Receive updates from Telegram and reply with greeting.
    Telegram will POST updates to this endpoint.
    """
    try:
        # Parse the incoming update from Telegram
        update_data = await request.json()
        
        # Check if there's a message with text
        if "message" in update_data and "text" in update_data["message"]:
            chat_id = update_data["message"]["chat"]["id"]
            
            # Send reply using Telegram API
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"https://api.telegram.org/bot{bot_token}/sendMessage",
                    json={
                        "chat_id": chat_id,
                        "text": "Hello from Abhinav and Matthew"
                    }
                )
        
        # Always return 200 OK to Telegram
        return {"ok": True}
    
    except Exception as e:
        print(f"Error processing webhook: {e}")
        # Return 200 anyway to avoid Telegram retrying
        return {"ok": False, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)