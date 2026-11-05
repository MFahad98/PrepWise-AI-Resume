# Resume AI – Frontend (Create React App)

## Local
```
npm install
npm start          # http://localhost:5000  (backend: http://localhost:3000)
```

## Vercel deploy
1. `vercel.json` mein `https://YOUR-BACKEND-URL.vercel.app` ko apne backend ke URL se replace karo.
2. Vercel par project import karo → Framework: **Create React App** (auto-detect hota hai).
3. Environment variable ki zaroorat **nahi** (REACT_APP_API_URL khaali chhoro, `/api` proxy use hota hai).
