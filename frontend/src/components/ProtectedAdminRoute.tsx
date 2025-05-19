import { Navigate } from "react-router-dom";
import { ReactNode, FC } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

const ProtectedAdminRoute: FC<Props> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedAdminRoute;
