
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
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
