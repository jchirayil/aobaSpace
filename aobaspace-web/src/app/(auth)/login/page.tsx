'use client'; // This is a Client Component

import React from 'react';
import AuthForm from '@/components/AuthForm'; // Import the AuthForm component

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gray-100 text-gray-800">
      <AuthForm isRegisterMode={false} />
    </main>
  );
}