// Production (Vercel / HTTPS) mein frontend aur backend alag domains par hote hain,
// is liye cookie ko SameSite=None + Secure hona zaroori hai.
const isProduction =
  process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const authCookieOptions = {
  ...baseCookieOptions,
  maxAge: 24 * 60 * 60 * 1000, // 1 day (JWT expiry ke barabar)
};

module.exports = { baseCookieOptions, authCookieOptions };
