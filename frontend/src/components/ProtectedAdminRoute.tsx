// components/ProtectedAdminRoute.tsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
