import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // optional spinner

  return user ? children : <Navigate to="/form" />;
}
