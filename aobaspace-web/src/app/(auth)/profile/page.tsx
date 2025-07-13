'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/app.config'; // NEW: Import API_BASE_URL
import ProfileInfo, { PasswordChangeData, ProfileUpdateData } from '@/components/ProfileInfo';
import Organization from '@/components/Organization';
import OrganizationUsers from '@/components/OrganizationUsers';

const ProfilePage = () => {
  const { userId, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for profile/password feedback messages
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // State for organization management
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [orgFormState, setOrgFormState] = useState({ name: '', description: '' });
  const [orgMessage, setOrgMessage] = useState('');
  const [orgError, setOrgError] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [isManagingOrgUsers, setIsManagingOrgUsers] = useState(false);
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [inviteState, setInviteState] = useState({ email: '', role: 'member' });
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [orgDetailsMessage, setOrgDetailsMessage] = useState('');
  const [orgDetailsError, setOrgDetailsError] = useState('');
  const [editingOrgDetails, setEditingOrgDetails] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    address: '',
  });

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

      // Set initial values for organization editing if a personal org exists
      const personalOrg = userJson.organizations?.find((org: any) => org.role === 'admin' && org.name.includes('Personal Org'));
      if (personalOrg) {
        setSelectedOrgId(personalOrg.id);
        setEditingOrgDetails({
          name: personalOrg.name,
          description: personalOrg.description || '',
          websiteUrl: personalOrg.websiteUrl || '',
          address: personalOrg.address || '',
        });
      } else if (userJson.organizations && userJson.organizations.length > 0) {
        // If no "Personal Org" but other orgs exist, default to the first one for management
        const firstOrg = userJson.organizations[0];
        setSelectedOrgId(firstOrg.id);
        setEditingOrgDetails({
          name: firstOrg.name,
          description: firstOrg.description || '',
          websiteUrl: firstOrg.websiteUrl || '',
          address: firstOrg.address || '',
        });
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

  // When selected org changes, update the form details for editing
  useEffect(() => {
    if (userData?.organizations) {
      const org = userData.organizations.find((o: any) => o.id === selectedOrgId);
      if (org) {
        setEditingOrgDetails({
          name: org.name || '',
          description: org.description || '',
          websiteUrl: org.websiteUrl || '',
          address: org.address || '',
        });
      }
    }
  }, [selectedOrgId, userData?.organizations]);

  const handleUpdateProfile = async (profileData: ProfileUpdateData) => {
    setProfileMessage('');
    setProfileError('');
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update profile');
      }
      setProfileMessage('Profile updated successfully!');
      fetchUserData(); // Re-fetch data to update UI
    } catch (err: any) {
      setProfileError(err.message || 'Error updating profile.');
    }
  };

  const handleChangePassword = async (passwordData: PasswordChangeData) => {
    setPasswordMessage('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to change password');
      }
      setPasswordMessage('Password changed successfully!');
    } catch (err: any) {
      setPasswordError(err.message || 'Error changing password.');
    }
  };

  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgMessage('');
    setOrgError('');
    if (!orgFormState.name) {
      setOrgError('Organization name is required.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgFormState.name, description: orgFormState.description, isEnabled: true }),
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
      setOrgFormState({ name: '', description: '' });
      setIsAddingOrg(false);
      fetchUserData(); // Re-fetch data to update UI
    } catch (err: any) {
      setOrgError(err.message || 'Error adding organization.');
    }
  };

  const handleRemoveOrg = async (orgId: string) => {
    if (!orgId) return;
    if (!confirm(`Are you sure you want to remove this organization? This action cannot be undone.`)) {
      return;
    }
    setOrgMessage('');
    setOrgError('');
    try {
      const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to remove organization');
      }
      setOrgMessage('Organization removed successfully!');
      setSelectedOrgId(null);
      fetchUserData(); // Refresh user and org list
    } catch (err: any) {
      setOrgError(err.message || 'Error removing organization.');
    }
  };

  const handleEditOrganizationDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgDetailsMessage('');
    setOrgDetailsError('');
    if (!editingOrgDetails.name) {
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
        body: JSON.stringify(editingOrgDetails),
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
    if (!inviteState.email || !selectedOrgId) {
      setInviteError('Email and selected organization are required.');
      return;
    }

    try {
      // Use the new secure endpoint to find a user by email
      const findUserResponse = await fetch(`${API_BASE_URL}/users/find-by-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteState.email }),
      });

      if (!findUserResponse.ok) {
        if (findUserResponse.status === 404) {
          throw new Error(`User with email "${inviteState.email}" not found.`);
        }
        const errData = await findUserResponse.json();
        throw new Error(errData.message || 'Failed to find user by email');
      }
      const userToInvite = await findUserResponse.json();
      const response = await fetch(`${API_BASE_URL}/organizations/${selectedOrgId}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToInvite.id, role: inviteState.role }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to invite user');
      }
      setInviteMessage(`User ${inviteState.email} invited successfully to organization!`);
      setInviteState({ email: '', role: 'member' });
      fetchOrgUsers(); // Refresh user list
    } catch (err: any) {
      setInviteError(err.message || 'Error inviting user.');
    }
  };

  const fetchOrgUsers = async () => {
    if (!selectedOrgId) {
      setOrgUsers([]);
      setIsManagingOrgUsers(false);
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
      setIsManagingOrgUsers(true); // Ensure list is visible after fetch/refresh
    } catch (err: any) {
      setOrgDetailsError(err.message || 'Error fetching organization users.');
      setOrgUsers([]);
    }
  };

  const handleViewOrgUsers = async () => {
    // If the user list is already showing, this button should hide it.
    if (isManagingOrgUsers) {
      setIsManagingOrgUsers(false);
      return;
    }
    // Otherwise, fetch and show it.
    await fetchOrgUsers();
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
      fetchOrgUsers(); // Refresh user list
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
      fetchOrgUsers(); // Refresh user list
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

  // Determine the user's role in the currently selected organization
  const currentUserOrganization = userData.organizations?.find((org: any) => org.id === selectedOrgId);
  // Define which roles can edit organization details
  const canEditOrgDetails = currentUserOrganization && ['admin', 'billing_admin', 'support_admin'].includes(currentUserOrganization.role);
  // Define which roles can manage users (invite, revoke, force password reset)
  const canManageUsers = currentUserOrganization && ['admin', 'billing_admin', 'support_admin'].includes(currentUserOrganization.role);

  return (
  <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-12 bg-gray-100 text-gray-800">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl my-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>
      <ProfileInfo
        userData={userData}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        loading={loading}
        profileMessage={profileMessage}
        profileError={profileError}
        passwordMessage={passwordMessage}
        passwordError={passwordError}
      />
      <Organization
        organizations={userData.organizations}
        selectedOrgId={selectedOrgId}
        setSelectedOrgId={setSelectedOrgId}
        onAddOrg={handleAddOrganization}
        onEditOrg={handleEditOrganizationDetails}
        onRemoveOrg={handleRemoveOrg}
        orgMessage={orgMessage}
        orgError={orgError}
        isAddingOrg={isAddingOrg}
        setIsAddingOrg={setIsAddingOrg}
        isEditingOrg={isEditingOrg}
        setIsEditingOrg={setIsEditingOrg}
        orgFormState={orgFormState}
        setOrgFormState={setOrgFormState}
        canEditOrgDetails={!!canEditOrgDetails}
        editingOrgDetails={editingOrgDetails}
        setEditingOrgDetails={setEditingOrgDetails}
      />
      <OrganizationUsers
        orgUsers={orgUsers}
        canManage={!!canManageUsers}
        onInviteUser={handleInviteUser}
        onRemoveUser={handleRemoveUserFromOrg}
        onUpdateUserRole={handleUpdateUserRole}
        onForcePasswordReset={handleForcePasswordReset}
        inviteState={inviteState}
        setInviteState={setInviteState}
        inviteMessage={inviteMessage}
        inviteError={inviteError}
      />
    </div>
  </main>
);
};
export default ProfilePage;