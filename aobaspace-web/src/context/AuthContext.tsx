'use client'; // This context needs to be a Client Component to use useState and localStorage

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around components that need auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize isLoggedIn state from localStorage or default to false
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  });

  // Effect to update localStorage whenever isLoggedIn changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
      // Also set/clear a simple cookie for middleware to read
      document.cookie = `isLoggedIn=${isLoggedIn}; path=/; max-age=${isLoggedIn ? 60 * 60 * 24 * 7 : 0}`; // 7 days or immediately expire
    }
  }, [isLoggedIn]);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};