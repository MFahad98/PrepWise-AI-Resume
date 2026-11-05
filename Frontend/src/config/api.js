// Backend API ka base URL.
// - Local development: .env.development se http://localhost:3000 aata hai.
// - Production (Vercel): khaali chhoro -> requests same domain ke /api par jati hain
//   aur vercel.json ka rewrite unhe backend par forward kar deta hai
//   (is se cookies Safari/iPhone par bhi kaam karti hain).
// - Agar direct backend call karni ho to Vercel env mein REACT_APP_API_URL set kar do.
export const API_BASE_URL = (process.env.REACT_APP_API_URL || "").replace(
  /\/+$/,
  ""
);
