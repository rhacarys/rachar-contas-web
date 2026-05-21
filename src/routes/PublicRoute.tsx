import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export function PublicRoute() {
  const token = useAuthStore((state) => state.token);
  return !token ? <Outlet /> : <Navigate to="/" replace />;
}
