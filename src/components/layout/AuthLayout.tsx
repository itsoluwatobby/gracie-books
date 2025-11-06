/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthContext from '../../context/useAuthContext';
import { PageRoutes } from '../../utils/pageRoutes';


const AuthLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigator = useNavigate()
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    const { auth } = PageRoutes;
    if ([auth.login, auth.signup].includes(pathname as any) && isAuthenticated) {
      console.log("BLOCKER")
      navigator(-1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isAuthenticated])

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;