import axios from "axios";

// Trailing slash ho ya na ho, URL hamesha sahi banega
// e.g. "https://prep-wise-ai-resume.vercel.app" -> "https://prep-wise-ai-resume.vercel.app/api/auth"
const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  withCredentials: true,
});

export const registerUser = async ({ username, email, password }) => {
  const response = await api.post("/register", { username, email, password });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/get-me");
  return response.data;
};
