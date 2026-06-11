# AI Notatnik - Stacja Pośredniczta Nieruchomościowego

Aplikacja mobilna do nagrywania i analizy spotkań z klientami nieruchomościowymi.

## Stack

- **Frontend**: Expo React Native
- **Backend**: Node.js (Express) - `/api`
- **AI**: HuggingFace (Whisper) + Groq (LLM)
- **Deploy**: Render.com

## Deploy

```bash
# API
cd api && npm install && npm start

# Frontend  
npm install && expo start
```

## Environment Variables

Ustaw w Render.com:
- `HF_API_KEY`
- `GROQ_API_KEY`  
- `STRIPE_SECRET_KEY`