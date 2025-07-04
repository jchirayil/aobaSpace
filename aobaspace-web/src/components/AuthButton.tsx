'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

const AuthButton = () => {
  const { isLoggedIn, login, logout } = useAuth(); // Use the auth context

  const handleAuthClick = () => {
    if (isLoggedIn) {
      console.log('Logging out...');
      logout(); // Call logout from context
      alert('Logged out successfully!');
    } else {
      console.log('Logging in...');
      login(); // Call login from context
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