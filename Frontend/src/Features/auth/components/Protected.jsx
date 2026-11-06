import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";
import { PageLoader } from "../../../components/ui/Spinner";

export const Protected = ({ children }) => {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading && !user) {
    return <PageLoader label="Checking your session..." />;
  }

  if (!user) {
    // Login ke baad user ko wapas isi page par bhejne ke liye location save karo
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
