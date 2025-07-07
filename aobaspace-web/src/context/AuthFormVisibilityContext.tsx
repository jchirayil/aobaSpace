'use client'; // This context needs to be a Client Component

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthFormVisibilityContextType {
  showAuthForm: boolean;
  setShowAuthForm: (show: boolean) => void;
}

const AuthFormVisibilityContext = createContext<AuthFormVisibilityContextType | undefined>(undefined);

export const AuthFormVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [showAuthForm, setShowAuthForm] = useState(false);

  return (
    <AuthFormVisibilityContext.Provider value={{ showAuthForm, setShowAuthForm }}>
      {children}
    </AuthFormVisibilityContext.Provider>
  );
};

export const useAuthFormVisibility = () => {
  const context = useContext(AuthFormVisibilityContext);
  if (context === undefined) {
    throw new Error('useAuthFormVisibility must be used within an AuthFormVisibilityProvider');
  }
  return context;
};