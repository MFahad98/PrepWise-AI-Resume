
import { createContext, useEffect, useState } from "react";
import {getMe} from "./authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserAndSet = async () => {
      try {
        const userData = await getMe();
        setUser(userData.user);
      }

      catch (error) { 
        setUser(null);
      }
      finally {
        setLoading(false);
      }
    };

    getUserAndSet();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
