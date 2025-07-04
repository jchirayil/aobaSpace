'use client'; // This component needs to be a Client Component to use `usePathname` and `useAuth`

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth(); // Get login status from context

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
          AobaSpace
        </Link>
        <ul className="flex space-x-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`text-lg hover:text-gray-300 transition-colors ${
                  pathname === link.href ? 'font-bold text-blue-400' : ''
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {isLoggedIn && ( // Conditionally render Dashboard link if logged in
            <li>
              <Link
                href="/dashboard"
                className={`text-lg hover:text-gray-300 transition-colors ${
                  pathname === '/dashboard' ? 'font-bold text-blue-400' : ''
                }`}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;