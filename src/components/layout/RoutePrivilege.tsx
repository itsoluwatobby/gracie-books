import { Outlet } from "react-router-dom";
import useAuthContext from "../../context/useAuthContext";
import { UserRole } from "../../utils/constants";

export default function RoutePrivilege() {
  const { user, isAuthenticated } = useAuthContext();

  // Check if user is authenticated and is admin
  if (!isAuthenticated || user?.role !== UserRole.admin) {
    // return <Navigate to="/login" replace />;
  }

  return (
    <Outlet />
  )
}