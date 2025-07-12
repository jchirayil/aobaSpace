'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ImageWithFallback from '@/components/ImageWithFallback'; // Assuming you have this component
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/app.config'; // NEW: Import API_BASE_URL

const ProfilePage = () => {
  const { userId, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for editing profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // State for changing password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State for organization management
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [orgMessage, setOrgMessage] = useState('');
  const [orgError, setOrgError] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isManagingOrgUsers, setIsManagingOrgUsers] = useState(false);
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [currentOrgName, setCurrentOrgName] = useState('');
  const [currentOrgDescription, setCurrentOrgDescription] = useState('');
  const [currentOrgWebsite, setCurrentOrgWebsite] = useState('');
  const [currentOrgAddress, setCurrentOrgAddress] = useState('');
  const [orgDetailsMessage, setOrgDetailsMessage] = useState('');
  const [orgDetailsError, setOrgDetailsError] = useState('');


  const fetchUserData = async () => {
    if (!isLoggedIn || !userId) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userResponse = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userJson = await userResponse.json();
      setUserData(userJson);
      setFirstName(userJson.firstName || '');
      setLastName(userJson.lastName || '');
      setAvatarUrl(userJson.avatarUrl || '');

      // Set initial values for organization editing if a personal org exists
      const personalOrg = userJson.organizations?.find((org: any) => org.role === 'admin' && org.name.includes('Personal Org'));
      if (personalOrg) {
        setSelectedOrgId(personalOrg.id);
        setCurrentOrgName(personalOrg.name);
        setCurrentOrgDescription(personalOrg.description || '');
        setCurrentOrgWebsite(personalOrg.websiteUrl || '');
        setCurrentOrgAddress(personalOrg.address || '');
      } else if (userJson.organizations && userJson.organizations.length > 0) {
        // If no "Personal Org" but other orgs exist, default to the first one for management
        setSelectedOrgId(userJson.organizations[0].id);
        setCurrentOrgName(userJson.organizations[0].name);
        setCurrentOrgDescription(userJson.organizations[0].description || '');
        setCurrentOrgWebsite(userJson.organizations[0].websiteUrl || '');
        setCurrentOrgAddress(userJson.organizations[0].address || '');
      }

    } catch (err: any) {
      console.error('Error fetching profile data:', err);
      setError(err.message || 'Error loading profile data.');
      logout(); // Log out if data fetching fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isLoggedIn, userId, router, logout]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, avatarUrl }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update profile');
      }
      setProfileMessage('Profile updated successfully!');
      setIsEditingProfile(false);
      fetchUserData(); // Re-fetch data to update UI
    } catch (err: any) {
      setProfileError(err.message || 'Error updating profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to change password');
      }
      setPasswordMessage('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      setPasswordError(err.message || 'Error changing password.');
    }
  };

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgMessage('');
    setOrgError('');
    if (!newOrgName) {
      setOrgError('Organization name is required.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOrgName, description: newOrgDescription, isEnabled: true }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to add organization');
      }
      const newOrg = await response.json();
      // Automatically add the current user as admin to the new organization
      await fetch(`${API_BASE_URL}/organizations/${newOrg.id}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId, role: 'admin' }),
      });

      setOrgMessage('Organization added successfully!');
      setNewOrgName('');
      setNewOrgDescription('');
      setIsAddingOrg(false);
      fetchUserData(); // Re-fetch data to update UI
    } catch (err: any) {
      setOrgError(err.message || 'Error adding organization.');
    }
  };

  const handleEditOrganizationDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    if (!currentOrgName) {
      setOrgDetailsError('Organization name cannot be empty.');
      return;
    }
    if (!selectedOrgId) {
      setOrgDetailsError('No organization selected for editing.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentOrgName,
          description: currentOrgDescription,
          websiteUrl: currentOrgWebsite,
          address: currentOrgAddress,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update organization details');
      }
      setOrgDetailsMessage('Organization details updated successfully!');
      setIsEditingOrg(false);
      fetchUserData(); // Re-fetch data to update UI
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error updating organization details.');
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteMessage('');
    setInviteError('');
    if (!inviteEmail || !selectedOrgId) {
      setInviteError('Email and selected organization are required.');
      return;
    }

    try {
      // Use the new secure endpoint to find a user by email
      const findUserResponse = await fetch(`${API_BASE_URL}/users/find-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!findUserResponse.ok) {
        if (findUserResponse.status === 404) {
          throw new Error(`User with email "${inviteEmail}" not found.`);
        }
        const errData = await findUserResponse.json();
        throw new Error(errData.message || 'Failed to find user by email');
      }
      const userToInvite = await findUserResponse.json();
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToInvite.id, role: inviteRole }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to invite user');
      }
      setInviteMessage(`User ${inviteEmail} invited successfully to organization!`);
      setInviteEmail('');
      setInviteRole('member');
      handleViewOrgUsers(); // Refresh user list
    } catch (err: any) {
      setInviteError(err.message || 'Error inviting user.');
    }
  };

  const handleViewOrgUsers = async () => {
    // If the user list is already showing, this button should hide it.
    if (isManagingOrgUsers) {
      setIsManagingOrgUsers(false);
      return;
    }

    if (!selectedOrgId) {
      setOrgUsers([]);
      return;
    }
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}/users`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to fetch organization users');
      }
      const users = await response.json();
      setOrgUsers(users);
      setIsManagingOrgUsers(true);
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error fetching organization users.');
      setOrgUsers([]);
    }
  };

  const handleRemoveUserFromOrg = async (userToRemoveId: string) => {
    if (!selectedOrgId || !userToRemoveId) return;
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}/users/${userToRemoveId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to remove user from organization');
      }
      setOrgDetailsMessage('User removed successfully!');
      handleViewOrgUsers(); // Refresh user list
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error removing user.');
    }
  };

  const handleUpdateUserRole = async (userToUpdateId: string, newRole: string) => {
    if (!selectedOrgId || !userToUpdateId) return;
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}/users/${userToUpdateId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update user role');
      }
      setOrgDetailsMessage('User role updated successfully!');
      handleViewOrgUsers(); // Refresh user list
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error updating user role.');
    }
  };

  const handleForcePasswordReset = async (userTargetId: string) => {
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userTargetId}/force-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to send password reset link');
      }
      setOrgDetailsMessage(`Password reset link simulated sent for user ID: ${userTargetId}`);
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error sending password reset link.');
    }
  };


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
  // Determine the user's role in the currently selected organization
  const currentUserOrganization = userData.organizations?.find((org: any) => org.id === selectedOrgId);
  const isCurrentUserOrgAdmin = currentUserOrganization?.role === 'admin';
  // Define which roles can edit organization details
  const canEditOrgDetails = currentUserOrganization && ['admin', 'billing_admin', 'support_admin'].includes(currentUserOrganization.role);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl my-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>

        {/* User Profile Section */}
        <section className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Details</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-4">
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <ImageWithFallback
                src={userData.avatarUrl || `https://placehold.co/128x128/E0E7FF/3F51B5?text=${fullName.charAt(0).toUpperCase()}`}
                alt={`${fullName}'s avatar`}
                className="rounded-full w-32 h-32 object-cover border-4 border-blue-200 shadow-md"
              />
            </div>
            <div className="text-center md:text-left flex-grow">
              <p className="text-xl font-semibold text-gray-900 mb-2">{fullName || userData.username}</p>
              <p className="text-lg text-gray-600 mb-1">Email: {userData.email}</p>
              <p className="text-lg text-gray-600">Account ID: {userData.id}</p>
              {userData.ssoProvider && (
                <p className="text-md text-gray-500 mt-2">Logged in via: {userData.ssoProvider}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mr-2"
            >
              {isEditingProfile ? 'Cancel Edit Profile' : 'Edit Profile'}
            </button>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              {isChangingPassword ? 'Cancel Change Password' : 'Change Password'}
            </button>
          </div>

          {profileMessage && <p className="text-green-600 mt-4">{profileMessage}</p>}
          {profileError && <p className="text-red-600 mt-4">{profileError}</p>}

          {isEditingProfile && (
            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-gray-700 text-sm font-bold mb-2">Avatar URL:</label>
                <input type="text" id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                Save Profile
              </button>
            </form>
          )}

          {passwordMessage && <p className="text-green-600 mt-4">{passwordMessage}</p>}
          {passwordError && <p className="text-red-600 mt-4">{passwordError}</p>}

          {isChangingPassword && (
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password:</label>
                <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
                <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
                <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                Change Password
              </button>
            </form>
          )}
        </section>

        {/* Organization Management Section */}
        <section className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Organizations</h2>

          {orgMessage && <p className="text-green-600 mt-4">{orgMessage}</p>}
          {orgError && <p className="text-red-600 mt-4">{orgError}</p>}

          <button
            onClick={() => setIsAddingOrg(!isAddingOrg)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mr-2 mb-4"
          >
            {isAddingOrg ? 'Cancel Add Organization' : 'Add New Organization'}
          </button>

          {isAddingOrg && (
            <form onSubmit={handleAddOrganization} className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold mb-2">Create New Organization</h3>
              <div>
                <label htmlFor="newOrgName" className="block text-gray-700 text-sm font-bold mb-2">Organization Name:</label>
                <input type="text" id="newOrgName" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>
              <div>
                <label htmlFor="newOrgDescription" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional):</label>
                <textarea id="newOrgDescription" value={newOrgDescription} onChange={(e) => setNewOrgDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
              </div>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                Create Organization
              </button>
            </form>
          )}

          {userData.organizations && userData.organizations.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Your Organizations</h3>
              <select
                value={selectedOrgId || ''}
                onChange={(e) => {
                  const newSelectedOrgId = e.target.value;
                  setSelectedOrgId(newSelectedOrgId);
                  const selectedOrg = userData.organizations.find((org: any) => org.id === newSelectedOrgId);
                  if (selectedOrg) {
                    setCurrentOrgName(selectedOrg.name);
                    setCurrentOrgDescription(selectedOrg.description || '');
                    setCurrentOrgWebsite(selectedOrg.websiteUrl || '');
                    setCurrentOrgAddress(selectedOrg.address || '');
                  }
                  setIsManagingOrgUsers(false); // Reset user management view
                  setIsEditingOrg(false); // Reset org editing view
                }}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label="Select Organization"
              >
                {userData.organizations.map((org: any) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.role})
                  </option>
                ))}
              </select>

              {selectedOrgId && (
                <div className="mt-6 p-6 bg-blue-50 rounded-lg shadow-inner">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">
                    Details for: {userData.organizations.find((org: any) => org.id === selectedOrgId)?.name}
                  </h4>
                  {orgDetailsMessage && <p className="text-green-600 mb-2">{orgDetailsMessage}</p>}
                  {orgDetailsError && <p className="text-red-600 mb-2">{orgDetailsError}</p>}

                  {canEditOrgDetails && (
                    <button
                      onClick={() => setIsEditingOrg(!isEditingOrg)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mr-2 mb-4"
                    >
                      {isEditingOrg ? 'Cancel Edit Org Details' : 'Edit Organization Details'}
                    </button>
                  )}
                  {isCurrentUserOrgAdmin && (
                    <button
                      onClick={handleViewOrgUsers}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200 mb-4"
                    >
                      {isManagingOrgUsers ? 'Hide Users' : 'Manage Organization Users'}
                    </button>
                  )}


                  {isEditingOrg && (
                    <form onSubmit={handleEditOrganizationDetails} className="mt-4 space-y-4 p-4 border rounded-lg bg-white">
                      <h5 className="text-lg font-semibold mb-2">Edit Details</h5>
                      <div>
                        <label htmlFor="currentOrgName" className="block text-gray-700 text-sm font-bold mb-2">Organization Name:</label>
                        <input type="text" id="currentOrgName" value={currentOrgName} onChange={(e) => setCurrentOrgName(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
                      </div>
                      <div>
                        <label htmlFor="currentOrgDescription" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea id="currentOrgDescription" value={currentOrgDescription} onChange={(e) => setCurrentOrgDescription(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
                      </div>
                      <div>
                        <label htmlFor="currentOrgWebsite" className="block text-gray-700 text-sm font-bold mb-2">Website URL:</label>
                        <input type="url" id="currentOrgWebsite" value={currentOrgWebsite} onChange={(e) => setCurrentOrgWebsite(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                      </div>
                      <div>
                        <label htmlFor="currentOrgAddress" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                        <input type="text" id="currentOrgAddress" value={currentOrgAddress} onChange={(e) => setCurrentOrgAddress(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                      </div>
                      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Save Changes
                      </button>
                    </form>
                  )}

                  {isManagingOrgUsers && (
                    <div className="mt-6 p-4 border rounded-lg bg-white">
                      <h5 className="text-lg font-semibold mb-4">Users in this Organization</h5>
                      {inviteMessage && <p className="text-green-600 mb-2">{inviteMessage}</p>}
                      {inviteError && <p className="text-red-600 mb-2">{inviteError}</p>}

                      {isCurrentUserOrgAdmin && (
                        <form onSubmit={handleInviteUser} className="mb-6 space-y-3">
                          <h6 className="text-md font-semibold">Invite New User</h6>
                          <div>
                            <label htmlFor="inviteEmail" className="block text-gray-700 text-sm font-bold mb-1">User Email:</label>
                            <input type="email" id="inviteEmail" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="user@example.com" required />
                          </div>
                          <div>
                            <label htmlFor="inviteRole" className="block text-gray-700 text-sm font-bold mb-1">Role:</label>
                            <select id="inviteRole" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              aria-label="Select Invite Role"
                            >
                              <option value="member">Member</option>
                              <option value="admin">Admin</option>
                              <option value="billing_admin">Billing Admin</option>
                              <option value="support_admin">Support Admin</option>
                            </select>
                          </div>
                          <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition duration-200">
                            Invite User
                          </button>
                        </form>
                      )}

                      {orgUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {orgUsers.map((user) => (
                            <li key={user.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div>
                                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName} ({user.email})</p>
                                <p className="text-sm text-gray-600">ID: {user.id} | Role: {user.role}</p>
                              </div>
                              {isCurrentUserOrgAdmin && (
                                <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                                  <select
                                    value={user.role}
                                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                    className="p-1 border border-gray-300 rounded-md text-sm"
                                    aria-label={`Change role for ${user.firstName} ${user.lastName}`}
                                  >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="billing_admin">Billing Admin</option>
                                    <option value="support_admin">Support Admin</option>
                                  </select>
                                  <button
                                    onClick={() => handleRemoveUserFromOrg(user.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-2 rounded transition duration-200"
                                  >
                                    Remove
                                  </button>
                                  <button
                                    onClick={() => handleForcePasswordReset(user.id)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-2 rounded transition duration-200"
                                    title="Send password reset link (dummy)"
                                  >
                                    Force Reset
                                  </button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No users found in this organization.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">You are not associated with any organizations yet. Add one above!</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;