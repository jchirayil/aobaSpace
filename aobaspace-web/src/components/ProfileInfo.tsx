import React, { useState, useEffect } from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  ssoProvider?: string;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface PasswordChangeData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ProfileInfoProps {
  userData: UserData;
  onUpdateProfile: (profileData: ProfileUpdateData) => void;
  onChangePassword: (passwordData: PasswordChangeData) => void;
  loading: boolean;
  profileMessage: string;
  profileError: string;
  passwordMessage: string;
  passwordError: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userData,
  onUpdateProfile,
  onChangePassword,
  profileMessage,
  profileError,
  passwordMessage,
  passwordError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [avatarUrl, setAvatarUrl] = useState(userData.avatarUrl || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setAvatarUrl(userData.avatarUrl || '');
    }
  }, [userData]);

  const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();

  return (
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
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 mr-2"
        >
          {isEditing ? 'Cancel Edit Profile' : 'Edit Profile'}
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
      {isEditing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            onUpdateProfile({ firstName, lastName, avatarUrl });
            setIsEditing(false);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
            <input type="text" id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
            <input type="text" id="lastName" value={lastName} onChange={e => setLastName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </div>
          <div>
            <label htmlFor="avatarUrl" className="block text-gray-700 text-sm font-bold mb-2">Avatar URL:</label>
            <input type="text" id="avatarUrl" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)}
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
        <form
          onSubmit={e => {
            e.preventDefault();
            onChangePassword({ oldPassword, newPassword, confirmNewPassword });
            setIsChangingPassword(false);
          }}
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">Old Password:</label>
            <input type="password" id="oldPassword" value={oldPassword} onChange={e => setOldPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">New Password:</label>
            <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm New Password:</label>
            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200">
            Change Password
          </button>
        </form>
      )}
    </section>
  );
};

export default ProfileInfo;