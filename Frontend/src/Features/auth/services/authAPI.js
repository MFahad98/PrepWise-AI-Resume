import axios from "axios";
import { API_BASE_URL } from "../../../config/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  withCredentials: true,
});

export const registerUser = async ({username,email,password}) => {
  try {
    const response = await api.post("/register", {username,email,password});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({email,password}) => {
    try {
        const response = await api.post("/login", {email,password});
        return response.data;
    }

    catch (error) { 

        throw error;
    }

} 

export const logoutUser = async () => {
    try {
        const response = await api.post("/logout");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const getMe = async () => {
    try {
        const response = await api.get("/get-me");
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

