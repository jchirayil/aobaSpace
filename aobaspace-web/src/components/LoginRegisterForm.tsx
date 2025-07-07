'use client'; // This component needs to be a Client Component

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAuthFormVisibility } from '@/context/AuthFormVisibilityContext'; // NEW: Import AuthFormVisibilityContext

interface LoginRegisterFormProps {
  onClose: () => void; // Callback to close the form/modal
}

const LoginRegisterForm: React.FC<LoginRegisterFormProps> = ({ onClose }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { setShowAuthForm } = useAuthFormVisibility(); // NEW: Get setShowAuthForm from context

  const validateForm = () => {
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (isRegisterMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      if (isRegisterMode) {
        await register(email, password);
        setMessage('Registration successful! Please log in.');
        setIsRegisterMode(false); // Switch to login mode after successful registration
        setEmail(''); // Clear form
        setPassword('');
        setConfirmPassword('');
      } else {
        console.log('Attempting login with:', email);
        await login(email, password);
        setMessage('Login successful!');
        setShowAuthForm(false); // Close the form using context on successful login
      }
    } catch (err: any) {
      console.error('Login/Register error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setMessage(''); // Clear any success message on error
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {isRegisterMode ? 'Register' : 'Login'}
      </h2>

      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegisterMode && (
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            {isRegisterMode ? 'Register' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(''); // Clear errors when switching modes
              setMessage('');
              setPassword(''); // Clear passwords when switching modes
              setConfirmPassword('');
            }}
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            {isRegisterMode ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegisterForm;