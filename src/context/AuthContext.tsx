/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState, ReactNode } from 'react';
import { users } from '../data/users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appName, setAppName] = useState<AppConfig>(
    {
      name: 'GracieBooks',
      email: 'crazywandyte@gmail.com',
      isLoggedIn: false,
      contact: '(+234) 813-4657-528',
      socials: {
        instagram: '',
        facebook: '',
        twitter: ''
      }
    }
  );
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you'd make an API call to validate credentials
    // For demo purposes, we'll just check if the email exists in our mock data
    // and assume the password is correct
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      // In a real app, you'd verify the credential with your backend
      // For demo purposes, we'll create a mock user
      const mockGoogleUser: User = {
        id: 'google-user-1',
        name: 'Google User',
        email: 'google.user@example.com',
        isAdmin: false
      };
      
      setUser(mockGoogleUser);
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return false;
      }

      // Create new user (in a real app, this would be handled by the backend)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        isAdmin: false
      };

      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={
      {
        user, login,
        logout, isAuthenticated,
        appName, signup,
        setAppName, loginWithGoogle,
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthContext,
  AuthProvider,
};