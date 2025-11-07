import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { userService } from '../services';
import { browserAPI } from '../composables/local-storage';
import { StorageKey } from '../utils/constants';
// import { useLocation } from 'react-router-dom';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appName, setAppName] = useState<AppConfig>(
    {
      name: import.meta.env.VITE_NAME,
      email: import.meta.env.VITE_EMAIL,
      contact: import.meta.env.VITE_CONTACT,
      socials: {
        instagram: import.meta.env.VITE_INSTAGRAM,
        facebook: import.meta.env.VITE_FACEBOOK,
        twitter: import.meta.env.VITE_TWITTER
      }
    }
  );
  const [user, setUser] = useState<Partial<UserInfo> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true)
      setLoading(false);
    } else {
      (async () => {
        try {
          // setLoading(true);
          const userId = browserAPI.get(StorageKey.userKey) as string;
          if (userId) {
            const userInfo = await userService.getUserById(userId);
            if (userInfo) {
              setUser(userInfo);
              setIsAuthenticated(true);
            } else {
              throw Error("Account not found")
            }
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.log(`Error::500 - Message: ${err.message}`);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user])

  const value = {
    appName,
    isAuthenticated,
    loading,
    user,
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