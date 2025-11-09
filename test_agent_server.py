#!/usr/bin/env python3
"""
Simple test agent server that responds to requests
Usage: python test_agent_server.py
"""
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI()

class AgentRequest(BaseModel):
    input: str

@app.post("/")
async def handle_request(request: AgentRequest):
    """Handle agent requests"""
    user_input = request.input
    # Simple echo response with some processing
    response = f"You said: '{user_input}'. This is a test agent response!"
    return {"output": response}

if __name__ == "__main__":
    print("Starting test agent server on port 9000...")
    uvicorn.run(app, host="0.0.0.0", port=9000)
