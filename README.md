# Laissez - Agent Configuration App

A simple, elegant single-page application for managing agent configurations with Telegram bot integration.

## Features

- 🎨 Clean, centered card UI with custom styling
- 📝 Agent URL input field
- 🤖 Telegram Bot Token input field
- 💰 Price stepper (minimum $0.001, increment by $0.001)
- 💾 Persistent storage with Supabase PostgreSQL
- ✅ Form validation and success/error messaging
- 🔄 Auto-reset form after successful submission

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase PostgreSQL

## Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Supabase account

### Setup

1. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   yarn install
   ```

2. **Configure Supabase**:
   - Update `backend/.env` with your Supabase credentials
   - Create the database table (see SQL below)

3. **Run services**:
   ```bash
   sudo supervisorctl restart all
   ```

### Database Setup

Run this SQL in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS agents (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  bot_token TEXT NOT NULL,
  price FLOAT NOT NULL DEFAULT 0.001,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

The app uses **relative URLs** for API calls (`/api/*`), which works automatically with Kubernetes ingress routing:

- Frontend calls `/api/agents`
- Ingress routes `/api/*` to backend (port 8001)
- No CORS issues in production!

### Environment Variables

**Backend** (`/app/backend/.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Frontend** (`/app/frontend/.env`):
```
# Not used in production - app uses relative URLs
REACT_APP_BACKEND_URL=http://localhost:8001
```

## API Endpoints

- `POST /api/agents` - Create new agent configuration
- `GET /api/agents` - Get all agent configurations
- `GET /api/health` - Health check

## Project Structure

```
/app/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Component styles
│   │   └── index.css     # Global styles with custom CSS vars
│   ├── package.json      # Node dependencies + proxy config
│   └── .env             # Frontend environment variables
└── README.md
```

## Testing

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

Test the API directly:
```bash
curl -X POST http://localhost:8001/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "bot_token": "123456:ABC-DEF",
    "price": 0.005
  }'
```
