'use client'; // This directive makes the component a Client Component in Next.js

import React, { useState } from 'react';

// This is a placeholder component for demonstration.
// In a real application, you would integrate with Auth0, Firebase, or your backend for authentication.

const AuthButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Simulate logout
      console.log('Logging out...');
      setIsLoggedIn(false);
      alert('Logged out successfully!');
    } else {
      // Simulate login
      console.log('Logging in...');
      // In a real app, this would redirect to SSO provider or show login form
      setIsLoggedIn(true);
      alert('Logged in successfully! (Simulated)');
    }
  };

  return (
    <button
      onClick={handleAuthClick}
      className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200"
    >
      {isLoggedIn ? 'Logout' : 'Login / Sign Up'}
    </button>
  );
};

export default AuthButton;
