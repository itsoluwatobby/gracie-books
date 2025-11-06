/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from 'react';
// import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
// import { useLocation, useNavigate } from 'react-router-dom';
// import useAuthContext from '../../context/useAuthContext';
// import { auth } from '../../firebase/config';
// import { useLocation } from 'react-router-dom';
// import LoadingUI from '../ui/Loader';
// import { LoaderIcon } from 'lucide-react';
// import { PageRoutes } from '../../utils/pageRoutes';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // const { pathname } = useLocation();
  // const [isLoading, setIsLoading] = useState(false);
  // const { setIsAuthenticated, user, setUser } = useAuthContext();

  // useEffect(() => {
  //   if (user) {
  //     console.log(pathname)
  //     console.log(user)
  //     setIsAuthenticated(true);
  //   } else {
  //     (async () => {
  //       setIsLoading(true)
  //       const currentUser = auth.currentUser;
  //       if (currentUser) {
  //         const accessToken = await currentUser.getIdToken(true);
  //         const userInfo: Partial<UserInfo> = {
  //           id: currentUser.uid,
  //           fullName: null,
  //           email: currentUser.email!,
  //           profilePicture: currentUser.photoURL ?? null,
  //           phoneNumber: currentUser.phoneNumber ?? null,
  //           accessToken: accessToken,
  //           refreshToken: currentUser.refreshToken,
  //         };

  //         console.log(user)
  //         setUser(userInfo);
  //         setIsLoading(false);
  //         setIsAuthenticated(true);
  //       }
  //     })();
  //   }
  // }, [user, pathname, setIsAuthenticated, setUser])

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-grow bg-gray-50">
        {/* {
          !isLoading 
            ? <LoaderIcon className='' /> 
            : children
        } */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;