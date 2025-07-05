import React from 'react';

export default function BillingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-800">
      <h1 className="text-4xl font-bold mb-6">Billing & Subscriptions</h1>
      <p className="text-lg text-center max-w-2xl">
        This is your billing page. Here you can manage your subscription, view invoices, and update payment methods.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Subscription Details</h2>
        <ul className="list-disc list-inside text-left">
          <li>Current Plan: Pro</li>
          <li>Next Billing Date: July 15, 2025</li>
          <li>Payment Method: **** **** **** 1234</li>
        </ul>
      </div>
    </main>
  );
}