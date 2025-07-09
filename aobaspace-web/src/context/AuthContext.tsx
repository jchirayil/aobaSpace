'use client'; // This context needs to be a Client Component to use useState and localStorage

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { API_BASE_URL } from '@/config/app.config'; // NEW: Import API_BASE_URL

// Define the shape of our authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null; // Changed from token to userId
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around components that need auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter(); // Initialize useRouter

  // Initialize userId state from localStorage
  const [userId, setUserId] = useState<string | null>(() => { // Changed from token to userId
    if (typeof window !== 'undefined') { // Check if running in browser
      return localStorage.getItem('currentUserId'); // Use a different key for userId
    }
    return null;
  });

  const isLoggedIn = !!userId; // Derive isLoggedIn from userId presence

  // Effect to update localStorage whenever userId changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userId) {
        localStorage.setItem('currentUserId', userId); // Store userId
        // Set a simple cookie for middleware to read
        document.cookie = `isLoggedIn=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      } else {
        localStorage.removeItem('currentUserId'); // Remove userId
        // Expire the cookie
        document.cookie = `isLoggedIn=false; path=/; max-age=0`;
      }
    }
  }, [userId]); // Depend on userId

  const login = async (email: string, password: string) => {
    try {
      // Corrected API endpoint using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }), // Backend expects 'username'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login API Error Response:', errorData); // Log error response
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login API Success Response:', data); // Log success response
      setUserId(data.userId); // Set the actual userId from the response
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (error: any) {
      console.error('Login error in AuthContext:', error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Corrected API endpoint using API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username: email, password }), // Backend expects 'username' and 'email'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Register API Error Response:', errorData); // Log error response
        throw new Error(errorData.message || errorData.detail || 'Registration failed');
      }

      console.log('Registration successful!');
      router.push('/login?registered=true'); // Redirect to login page after successful registration
    } catch (error: any) {
      console.error('Registration error in AuthContext:', error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const logout = () => {
    setUserId(null); // Clear userId on logout
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, register, logout }}>
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