import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar'; // Import the Navbar component
import Footer from '@/components/Footer'; // NEW: Import the Footer component
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AobaSpace Platform Core',
  description: 'The central portal for AobaForms management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " flex flex-col min-h-screen"}> {/* NEW: Added flex classes for sticky footer */}
        {/* Wrap the entire application with AuthProvider to make auth state available */}
        <AuthProvider>
          <Navbar /> {/* Include the Navbar at the top of your layout */}
          <div className="flex-grow"> {/* NEW: This div ensures content pushes footer down */}
            {children}
          </div>
          <Footer /> {/* NEW: Include the Footer at the bottom of your layout */}
        </AuthProvider>
      </body>
    </html>
  );
}