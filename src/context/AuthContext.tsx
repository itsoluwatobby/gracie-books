/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState, ReactNode } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isAuthenticated = user !== null;

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