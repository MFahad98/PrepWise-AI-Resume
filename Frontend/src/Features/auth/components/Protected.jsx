import {useAuth} from "../Hooks/useAuth";
import { Navigate } from "react-router-dom";

export const Protected = ({children}) => {
  const {loading,user} = useAuth();

    if (loading) {
    return <div>Loading...</div>;
  }

    if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}