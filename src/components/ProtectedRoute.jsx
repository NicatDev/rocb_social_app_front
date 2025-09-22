import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader } from "@/components/ui";

const ProtectedRoute = () => {
  const { profile, loading } = useAuth();

  if (loading) return <Loader />;

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // daxilindəki route-ları render edir
};

export default ProtectedRoute;
