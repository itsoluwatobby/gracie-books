/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuthContext from '../../context/useAuthContext';
import { PageRoutes } from '../../utils/pageRoutes';
// import LoadingUI from '../ui/Loader';


const AuthLayout: FC = () => {
  const { pathname } = useLocation();
  // const navigator = useNavigate()
  const { isAuthenticated } = useAuthContext();
  // const { isAuthenticated, loading } = useAuthContext();

  // const to = state?.from ?? PageRoutes.auth.login;

  console.log([PageRoutes.auth.login, PageRoutes.auth.signup].includes(pathname as any) && isAuthenticated)
  return (
    <>
      {/* {
        loading 
        ? <LoadingUI />
        :
        ([PageRoutes.auth.login, PageRoutes.auth.signup].includes(pathname as any) && isAuthenticated)
        ? <Outlet />
        : <Navigate to={PageRoutes.auth.login} />
      } */}
      <Outlet />
    </>
  );
};

export default AuthLayout;