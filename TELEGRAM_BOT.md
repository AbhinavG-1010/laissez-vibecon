# Telegram Bot Integration

## Overview

When you save an agent configuration with a Telegram bot token, the system automatically:
1. Saves the configuration to Supabase
2. Sets up a webhook with Telegram
3. Starts listening for messages to that bot

## How It Works

### 1. Webhook Setup (Automatic)

When you submit the form, the backend:
- Calls Telegram's `setWebhook` API
- Registers the webhook URL: `https://demobackend.emergentagent.com/api/telegram-webhook/{bot_token}`
- Telegram confirms the webhook is set

### 2. Receiving Messages

When someone sends a message to your bot:
1. Telegram sends a POST request to the webhook URL
2. Our backend receives the update at `/api/telegram-webhook/{bot_token}`
3. The bot replies with: **"Hello from Abhinav and Matthew"**

### 3. Message Flow

```
User → Telegram Bot → Telegram Servers → Your Webhook → Your Backend
                                                              ↓
                                                    Try Agent URL
                                                    POST {"input": message}
                                                              ↓
                                                 Success? → Use agent's "output"
                                                              ↓
                                                  Fail? → LLM Fallback (GPT-5-mini)
                                                              ↓
                                                    Reply to User via Telegram
```

**Agent URL Contract:**
- Request: `POST {agent_url}` with body `{"input": "<telegram_message>"}`
- Expected Response: `{"output": "<response_text>"}`
- Timeout: 30 seconds

**LLM Fallback:**
- Triggered when agent URL fails (timeout, error, unreachable, malformed response)
- Uses GPT-5-mini via Emergent LLM key
- Provides helpful response while acknowledging the agent is unavailable

## Testing Your Bot

### Step 1: Create a Telegram Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Save the bot token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Configure in Laissez
1. Fill in the form:
   - Agent URL: Your agent's URL
   - Telegram Bot Token: The token from BotFather
   - Price: Set your price (min $0.001)
2. Click "Save Configuration"
3. Wait for success message (includes webhook info)

### Step 3: Test the Bot
1. Open Telegram
2. Search for your bot (the username you gave it)
3. Start a chat and send any message
4. You should receive: **"Hello from Abhinav and Matthew"**

## Technical Details

### Webhook URL Structure
```
https://demobackend.emergentagent.com/api/telegram-webhook/{bot_token}
```

### Automatic Domain Detection
The webhook URL is **automatically detected** from incoming request headers:
- Uses `X-Forwarded-Proto` and `X-Forwarded-Host` headers (set by Kubernetes ingress)
- Falls back to `Host` header if forwarded headers aren't present
- Automatically uses HTTPS for `emergentagent.com` domains

**No manual configuration needed!** The system adapts to your deployment environment.

### Code Location
- **Webhook setup**: `/app/backend/server.py` - `create_agent_config()` function
- **Message handler**: `/app/backend/server.py` - `telegram_webhook()` function

### Response Handling

**Primary Response (Agent URL):**
The bot proxies messages to your configured agent URL and uses its response.

**Fallback Response (LLM):**
If your agent URL is unavailable, GPT-5-mini generates a helpful fallback response that:
- Acknowledges the agent is unavailable
- Provides the best possible answer to the user's query
- Maintains a helpful and empathetic tone

## Troubleshooting

### Webhook Not Setting
**Error**: "bad webhook: An HTTPS URL must be provided for webhook"
- **Cause**: Telegram requires HTTPS webhooks
- **Solution**: Ensure `WEBHOOK_BASE_URL` in `.env` uses HTTPS

### Bot Not Responding
1. **Check webhook status**:
   ```bash
   curl https://api.telegram.org/bot{YOUR_TOKEN}/getWebhookInfo
   ```
   Should show your webhook URL

2. **Check backend logs**:
   ```bash
   tail -f /var/log/supervisor/backend.out.log
   ```

3. **Verify bot token**: Make sure it's correct and active

### Message Not Received
- Check if the webhook URL is publicly accessible
- Verify Telegram can reach your server
- Check for errors in backend logs

## Example API Response

When saving an agent, you get:
```json
{
  "success": true,
  "message": "Agent configuration saved successfully",
  "data": [...],
  "webhook_info": {
    "webhook_url": "https://demobackend.emergentagent.com/api/telegram-webhook/8263135536:AAGKx...",
    "telegram_response": {
      "ok": true,
      "result": true,
      "description": "Webhook was set"
    }
  }
}
```

## UI Features

### Toast Notifications
The app now uses **Sonner** (Shadcn UI) for elegant toast notifications:
- ✅ Success toast when agent is saved (with webhook confirmation)
- ❌ Error toast if something goes wrong (with detailed description)
- 🔔 Appears in bottom-right corner with smooth animations
- Auto-dismisses after a few seconds

## Next Steps

This is a minimal implementation for the hackathon. Future enhancements could include:
- Custom response messages per agent
- Command handling (`/start`, `/help`, etc.)
- Message routing to agent URLs
- Conversation state management
- Multiple bot support
- Error handling and retries
- Analytics and logging
