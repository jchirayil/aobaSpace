import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

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
      <body className={inter.className + " flex flex-col min-h-screen"}>
        {/* Wrap the entire application with AuthProvider to make auth state available */}
        <AuthProvider>
          <Navbar /> {/* Include the Navbar at the top of your layout */}
          {/* Added pt-16 to push content down below the fixed Navbar */}
          <div className="flex-grow pt-16">
            {children}
          </div>
          <Footer /> {/* Include the Footer at the bottom of your layout */}
        </AuthProvider>
      </body>
    </html>
  );
}