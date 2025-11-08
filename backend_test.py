#!/usr/bin/env python3
"""
Backend API Testing for Telegram Bot Webhook Integration
Tests the Laissez API endpoints for agent configuration and webhook setup
"""

import requests
import json
import sys
import os
from typing import Dict, Any

# Get the backend URL from environment or use default
BACKEND_URL = "http://localhost:8001"

def test_health_check() -> Dict[str, Any]:
    """Test the health check endpoint"""
    print("🔍 Testing Health Check Endpoint...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=10)
        
        result = {
            "endpoint": "/api/health",
            "method": "GET",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response_data": response.json() if response.status_code == 200 else None,
            "error": None
        }
        
        if result["success"]:
            print("✅ Health check endpoint working correctly")
            print(f"   Response: {result['response_data']}")
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            
        return result
        
    except Exception as e:
        result = {
            "endpoint": "/api/health",
            "method": "GET",
            "status_code": None,
            "success": False,
            "response_data": None,
            "error": str(e)
        }
        print(f"❌ Health check failed with error: {e}")
        return result

def test_save_agent_configuration() -> Dict[str, Any]:
    """Test saving agent configuration with webhook setup"""
    print("\n🔍 Testing Save Agent Configuration with Webhook Setup...")
    
    # Test data as specified in the review request
    test_data = {
        "url": "https://test-agent.example.com",
        "bot_token": "8263135536:AAGKxApmhIUeYyNsSVbujmgYz0SA-QtvCvY",
        "price": 0.001
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/agents",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        result = {
            "endpoint": "/api/agents",
            "method": "POST",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response_data": response.json() if response.status_code in [200, 400, 500] else None,
            "error": None,
            "test_data": test_data
        }
        
        if result["success"] and result["response_data"]:
            response_data = result["response_data"]
            
            # Verify required fields in response
            required_fields = ["success", "data", "webhook_info"]
            missing_fields = [field for field in required_fields if field not in response_data]
            
            if missing_fields:
                result["success"] = False
                result["error"] = f"Missing required fields in response: {missing_fields}"
                print(f"❌ Response missing required fields: {missing_fields}")
            else:
                # Check webhook_info structure
                webhook_info = response_data.get("webhook_info", {})
                webhook_required = ["webhook_url", "telegram_response"]
                webhook_missing = [field for field in webhook_required if field not in webhook_info]
                
                if webhook_missing:
                    result["success"] = False
                    result["error"] = f"Missing webhook_info fields: {webhook_missing}"
                    print(f"❌ Webhook info missing required fields: {webhook_missing}")
                else:
                    # Verify webhook URL pattern
                    webhook_url = webhook_info.get("webhook_url", "")
                    expected_pattern = f"/api/telegram-webhook/{test_data['bot_token']}"
                    
                    if expected_pattern not in webhook_url:
                        result["success"] = False
                        result["error"] = f"Webhook URL doesn't match expected pattern. Got: {webhook_url}, Expected to contain: {expected_pattern}"
                        print(f"❌ Webhook URL pattern mismatch")
                    else:
                        print("✅ Agent configuration saved successfully")
                        print(f"   Success: {response_data.get('success')}")
                        print(f"   Webhook URL: {webhook_url}")
                        print(f"   Telegram Response: {webhook_info.get('telegram_response')}")
        else:
            print(f"❌ Agent configuration failed with status {response.status_code}")
            if result["response_data"]:
                print(f"   Error: {result['response_data']}")
                
        return result
        
    except Exception as e:
        result = {
            "endpoint": "/api/agents",
            "method": "POST",
            "status_code": None,
            "success": False,
            "response_data": None,
            "error": str(e),
            "test_data": test_data
        }
        print(f"❌ Agent configuration failed with error: {e}")
        return result

def test_telegram_webhook_endpoint() -> Dict[str, Any]:
    """Test the Telegram webhook endpoint"""
    print("\n🔍 Testing Telegram Webhook Endpoint...")
    
    bot_token = "8263135536:AAGKxApmhIUeYyNsSVbujmgYz0SA-QtvCvY"
    
    # Sample Telegram update payload as specified in review request
    test_payload = {
        "message": {
            "chat": {
                "id": 123456789
            },
            "text": "Hello bot!"
        }
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/telegram-webhook/{bot_token}",
            json=test_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        result = {
            "endpoint": f"/api/telegram-webhook/{bot_token}",
            "method": "POST",
            "status_code": response.status_code,
            "success": response.status_code == 200,
            "response_data": response.json() if response.status_code == 200 else None,
            "error": None,
            "test_payload": test_payload
        }
        
        if result["success"] and result["response_data"]:
            response_data = result["response_data"]
            
            # Should return {"ok": true}
            if response_data.get("ok") is True:
                print("✅ Telegram webhook endpoint working correctly")
                print(f"   Response: {response_data}")
            else:
                result["success"] = False
                result["error"] = f"Expected 'ok': true, got: {response_data}"
                print(f"❌ Webhook response incorrect: {response_data}")
        else:
            print(f"❌ Telegram webhook failed with status {response.status_code}")
            
        return result
        
    except Exception as e:
        result = {
            "endpoint": f"/api/telegram-webhook/{bot_token}",
            "method": "POST",
            "status_code": None,
            "success": False,
            "response_data": None,
            "error": str(e),
            "test_payload": test_payload
        }
        print(f"❌ Telegram webhook failed with error: {e}")
        return result

def run_all_tests() -> Dict[str, Any]:
    """Run all backend tests and return comprehensive results"""
    print("🚀 Starting Backend API Tests for Telegram Bot Webhook Integration")
    print("=" * 70)
    
    results = {
        "health_check": test_health_check(),
        "agent_configuration": test_save_agent_configuration(),
        "telegram_webhook": test_telegram_webhook_endpoint()
    }
    
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result["success"])
    
    for test_name, result in results.items():
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"{status} {test_name.replace('_', ' ').title()}")
        if not result["success"] and result["error"]:
            print(f"      Error: {result['error']}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    return results

if __name__ == "__main__":
    results = run_all_tests()
    
    # Exit with error code if any tests failed
    if not all(result["success"] for result in results.values()):
        sys.exit(1)
    else:
        print("\n🎉 All tests passed successfully!")
        sys.exit(0)