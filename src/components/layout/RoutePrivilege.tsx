import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../../context/useAuthContext";
import { UserRole } from "../../utils/constants";
import { PageRoutes } from "../../utils/pageRoutes";

export default function RoutePrivilege() {
  const { user, isAuthenticated } = useAuthContext();

  return (
    <>
      {
        (!isAuthenticated || user?.role !== UserRole.admin)
        ? <Navigate to={PageRoutes.auth.unauthorised} replace />
        : <Outlet />
      }
    </>
  )
}