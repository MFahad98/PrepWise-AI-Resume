# Resume AI – Backend (Express + MongoDB)

## Local
```
npm install
npm run dev        # http://localhost:3000
```

## Vercel deploy
1. Vercel par project import karo → Framework Preset: **Other**.
2. Environment Variables set karo:
   - `MONGO_URI` – MongoDB Atlas connection string
   - `JWT_SECRET` – long random string
   - `GOOGLE_GENAI_API_KEY` – Gemini API key
   - `CLIENT_URL` – frontend URL, e.g. `https://your-frontend.vercel.app`
3. MongoDB Atlas → Network Access → `0.0.0.0/0` allow karo (Vercel ke IP fixed nahi hote).
