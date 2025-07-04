import React from 'react';

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-blue-50 text-blue-800">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Dashboard!</h1>
      <p className="text-lg text-center max-w-2xl">
        This is a protected page. You can only see this content because you are logged in.
        Here you would find your personalized AobaForms data and management tools.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
        <ul className="list-disc list-inside text-left">
          <li>Total Forms: 15</li>
          <li>Active Instances: 3</li>
          <li>Recent Submissions: 247</li>
        </ul>
      </div>
    </main>
  );
}