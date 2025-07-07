'use client'; // This context needs to be a Client Component to use useState and localStorage

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

// Define the shape of our authentication context
interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null; // Store the JWT token
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap around components that need auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter(); // Initialize useRouter

  // Initialize token state from localStorage
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') { // Check if running in browser
      return localStorage.getItem('authToken');
    }
    return null;
  });

  const isLoggedIn = !!token; // Derive isLoggedIn from token presence

  // Effect to update localStorage whenever token changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
        // Set a simple cookie for middleware to read
        document.cookie = `isLoggedIn=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      } else {
        localStorage.removeItem('authToken');
        // Expire the cookie
        document.cookie = `isLoggedIn=false; path=/; max-age=0`;
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      // Corrected API endpoint to http://localhost:3000
      const response = await fetch('http://localhost:3000/api/auth/login', {
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
      setToken(data.access_token || 'dummy-jwt-token'); // Assuming backend returns a token, or use dummy
      router.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (error: any) {
      console.error('Login error in AuthContext:', error);
      throw error; // Re-throw to be caught by the component
    }
  };

  const register = async (email: string, password: string) => {
    try {
      // Corrected API endpoint to http://localhost:3000
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
    setToken(null);
    router.push('/'); // Redirect to home page on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, register, logout }}>
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