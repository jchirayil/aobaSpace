import React from 'react';

export default function SettingsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-yellow-50 text-yellow-800">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>
      <p className="text-lg text-center max-w-2xl">
        This is your settings page. Here you can configure various aspects of your account and preferences.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
        <ul className="list-disc list-inside text-left">
          <li>Notification Preferences</li>
          <li>Security Settings</li>
          <li>Language Preferences</li>
        </ul>
      </div>
    </main>
  );
}