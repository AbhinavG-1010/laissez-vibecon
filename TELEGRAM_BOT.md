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
User → Telegram Bot → Telegram Servers → Your Webhook → Your Backend → Reply to User
```

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

### Environment Variables
The webhook base URL is configured in `/app/backend/.env`:
```bash
WEBHOOK_BASE_URL=https://demobackend.emergentagent.com
```

### Code Location
- **Webhook setup**: `/app/backend/server.py` - `create_agent_config()` function
- **Message handler**: `/app/backend/server.py` - `telegram_webhook()` function

### Response Message
Currently hardcoded to: `"Hello from Abhinav and Matthew"`

To customize the message, edit line 127 in `/app/backend/server.py`:
```python
"text": "Hello from Abhinav and Matthew"  # Change this!
```

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

## Next Steps

This is a minimal implementation for the hackathon. Future enhancements could include:
- Custom response messages per agent
- Command handling (`/start`, `/help`, etc.)
- Message routing to agent URLs
- Conversation state management
- Multiple bot support
- Error handling and retries
- Analytics and logging
