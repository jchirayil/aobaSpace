'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback'; // Assuming you have this component
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { token, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn || !token) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Decode the token to get the user ID (assuming JWT structure with 'sub' as user ID)
        // In a real app, you'd parse the JWT to get the user ID.
        // For now, we'll assume the token itself is the user ID for simplicity, or get it from context if passed.
        // A better way would be to have a /api/me endpoint or decode JWT client-side
        const dummyUserId = token; // This is a placeholder, replace with actual ID from decoded JWT

        // Fetch user profile
        const userResponse = await fetch(`http://localhost:3000/api/users/${dummyUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userJson = await userResponse.json();
        setUserData(userJson);

        // Fetch personal organization for the user
        const orgResponse = await fetch(`http://localhost:3000/api/organizations/user/${dummyUserId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!orgResponse.ok) {
          throw new Error('Failed to fetch organization data');
        }
        const orgsJson = await orgResponse.json();
        // Assuming the first organization returned is the "Personal" one for display
        setOrganizationData(orgsJson[0] || null);

      } catch (err: any) {
        console.error('Error fetching profile data:', err);
        setError(err.message || 'Error loading profile data.');
        // If token is invalid or expired, log out
        if (err.message === 'Failed to fetch user data' || err.message === 'Failed to fetch organization data') {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, token, router, logout]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-gray-800">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-800">
        <h1 className="text-4xl font-bold mb-6">Error</h1>
        <p className="text-lg text-center max-w-2xl">{error}</p>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-gray-800">
        <p>No user data found. Please log in.</p>
      </main>
    );
  }

  const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl my-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>

        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-8">
          <div className="flex-shrink-0 mb-6 md:mb-0">
            <ImageWithFallback
              src={userData.avatarUrl || `https://placehold.co/128x128/E0E7FF/3F51B5?text=${fullName.charAt(0).toUpperCase()}`}
              alt={`${fullName}'s avatar`}
              className="rounded-full w-32 h-32 object-cover border-4 border-blue-200 shadow-md"
            />
          </div>
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">{fullName || userData.username}</h2>
            <p className="text-lg text-gray-600 mb-1">Email: {userData.email}</p>
            <p className="text-lg text-gray-600">Account ID: {userData.id}</p>
            {userData.ssoProvider && (
              <p className="text-md text-gray-500 mt-2">Logged in via: {userData.ssoProvider}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Account Enabled: {userData.isEnabled ? 'Yes' : 'No'}</p>
            {userData.enabledFromDate && (
              <p className="text-sm text-gray-500">Enabled From: {new Date(userData.enabledFromDate).toLocaleDateString()}</p>
            )}
            {userData.disabledOnDate && (
              <p className="text-sm text-gray-500">Disabled On: {new Date(userData.disabledOnDate).toLocaleDateString()}</p>
            )}
            <button
              onClick={() => alert('Password reset functionality coming soon!')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Reset Password
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Organizations</h3>
          {organizationData ? (
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner">
              <h4 className="text-xl font-bold text-blue-800 mb-2">{organizationData.name}</h4>
              <p className="text-gray-700 mb-1">Description: {organizationData.description || 'N/A'}</p>
              <p className="text-gray-700 mb-1">Website: {organizationData.websiteUrl || 'N/A'}</p>
              <p className="text-gray-700 mb-1">Address: {organizationData.address || 'N/A'}</p>
              <p className="text-gray-700 mb-1">Organization ID: {organizationData.id}</p>
              <p className="text-gray-700 mb-1">Your Role: {organizationData.userOrganizations?.[0]?.role || 'admin'}</p> {/* Assuming first org for simplicity */}
              <button
                onClick={() => alert('Organization update functionality coming soon!')}
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Update Organization Info
              </button>
            </div>
          ) : (
            <p className="text-gray-600">No organizations found. A personal organization should be created upon registration.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;