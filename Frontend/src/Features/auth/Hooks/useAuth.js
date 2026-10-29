import {useContext} from "react";
import { AuthContext } from "../services/auth.content.jsx";
import { loginUser, logoutUser, registerUser } from "../services/authAPI.js";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);
  

  const handleLogin = async ({email,password}) => {
    setLoading(true);
    try {
      const data = await loginUser({email,password});
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async ({username,email,password}) => {
    setLoading(true);
    const data = await registerUser({username,email,password});
    setUser(data.user);
    setLoading(false);
  }

  const handleLogout = async () => {
    setLoading(true);
    const data = await logoutUser();
    setUser(null);
    setLoading(false);
  } 

  return { user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout };

}
     