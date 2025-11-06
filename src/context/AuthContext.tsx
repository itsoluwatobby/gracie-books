import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { auth } from "../firebase/config";
// import { useLocation } from 'react-router-dom';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appName, setAppName] = useState<AppConfig>(
    {
      name: 'Wandyte Book Sales',
      email: 'crazywandyte@gmail.com',
      isLoggedIn: false,
      contact: '(+234) 813-4657-528',
      socials: {
        instagram: 'https://t.co/tv74l1c4K1',
        facebook: '',
        twitter: 'https://x.com/WandyteBookSale'
      }
    }
  );
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      console.log(user) 
      setIsAuthenticated(true)
    } else {
      (async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const accessToken = await currentUser.getIdToken(true);
          const userInfo: Partial<UserInfo> = {
            id: currentUser.uid,
            fullName: null,
            email: currentUser.email!,
            profilePicture: currentUser.photoURL ?? null,
            phoneNumber: currentUser.phoneNumber ?? null,
            accessToken: accessToken,
            refreshToken: currentUser.refreshToken,
          };

          console.log("called")
          setUser(userInfo);
          setIsAuthenticated(true);
        }
      })();
    }
  }, [user])
  // }, [user, pathname])

  const logout = () => {};

  const value = {
    appName,
    isAuthenticated,
    loading,
    user,
    logout,
    setAppName,
    setUser,
    setLoading,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthContext,
  AuthProvider,
};