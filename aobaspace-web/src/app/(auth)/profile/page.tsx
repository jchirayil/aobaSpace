import React from 'react';

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-green-50 text-green-800">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>
      <p className="text-lg text-center max-w-2xl">
        This is your profile page. Here you can view and manage your personal information.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <ul className="list-disc list-inside text-left">
          <li>Name: John Doe</li>
          <li>Email: john.doe@example.com</li>
          <li>Member Since: January 1, 2023</li>
        </ul>
      </div>
    </main>
  );
}