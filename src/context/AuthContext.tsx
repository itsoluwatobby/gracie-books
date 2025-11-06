import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { userService } from '../services';
import { browserAPI } from '../composables/local-storage';
import { StorageKey } from '../utils/constants';
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
      setIsAuthenticated(true)
    } else {
      (async () => {
        const userId = browserAPI.get(StorageKey.userKey) as string;
        if (userId) {
          const userInfo = await userService.getUserById(userId);
          if (userInfo) {
            setUser(userInfo);
            setIsAuthenticated(true);
          }
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