import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PageRoutes } from "../../utils/pageRoutes"
import LoadingUI from "../ui/Loader"
import useAuthContext from "../../context/useAuthContext"

export const ProtectedRoutes = () => {
  const { pathname } = useLocation();
  const { loading, isAuthenticated } = useAuthContext() as AuthContextType;

  return (
    <>
      {
        loading ?
          <LoadingUI />
        :
        !isAuthenticated ?
          <Navigate to={PageRoutes.auth.login} state={ { from: pathname }} replace />
        : <Outlet />
      }
    </>
  )
}