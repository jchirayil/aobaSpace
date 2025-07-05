'use client'; // This component needs to be a Client Component to use `usePathname` and `useAuth`

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import { useState, useRef, useEffect } from 'react'; // For dropdown functionality

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, login, logout } = useAuth(); // Get login status from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu
  const dropdownRef = useRef<HTMLLIElement>(null); // Corrected type to HTMLLIElement

  const handleAuthClick = () => {
    if (isLoggedIn) {
      console.log('Logging out...');
      logout(); // Call logout from context
    } else {
      console.log('Logging in...');
      login(); // Call login from context
    }
    setIsDropdownOpen(false); // Close dropdown after action
    setIsMobileMenuOpen(false); // Close mobile menu after action
  };

  const toggleDropdown = () => {
    console.log('Toggling desktop dropdown. Current state:', isDropdownOpen, 'New state:', !isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => { // New function for mobile menu
    console.log('Toggling mobile menu. Current state:', isMobileMenuOpen, 'New state:', !isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown or mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the dropdownRef element
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Click outside desktop dropdown detected. Closing dropdown.');
        setIsDropdownOpen(false);
      }
      // For mobile menu, we rely on the explicit close button or link clicks to close it.
      // A general outside click for a full-screen overlay can be tricky and sometimes unwanted.
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // No dependencies needed here as it only attaches/detaches event listener

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg fixed top-0 left-0 w-full z-50"> {/* Added fixed positioning and high z-index */}
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
          AobaSpace
        </Link>

        {/* Hamburger menu button for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}>
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 items-center">
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
          {/* Your Account Dropdown Menu for Desktop */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="text-lg hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Toggle account menu"
            >
              Your Account
              <svg
                className={`w-4 h-4 ml-1 inline-block transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                {!isLoggedIn ? (
                  <button
                    onClick={handleAuthClick}
                    className="block w-full text-left px-4 py-2 text-lg text-white hover:bg-gray-600"
                  >
                    Login / Sign Up
                  </button>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-lg text-white hover:bg-gray-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {/* New placeholder links for GitHub-like menu */}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-lg text-white hover:bg-gray-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-lg text-white hover:bg-gray-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/billing"
                      className="block px-4 py-2 text-lg text-white hover:bg-gray-600"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Billing
                    </Link>
                    <div className="border-t border-gray-600 my-1"></div>
                    <button
                      onClick={handleAuthClick}
                      className="block w-full text-left px-4 py-2 text-lg text-white hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-95 z-40 flex flex-col items-center justify-center">
          <button onClick={toggleMobileMenu} className="absolute top-4 right-4 text-white focus:outline-none" aria-label="Close mobile menu">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <ul className="flex flex-col space-y-6 text-xl">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`block py-2 ${
                    pathname === link.href ? 'font-bold text-blue-400' : 'text-white hover:text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {/* Your Account options for Mobile */}
            <li>
              {!isLoggedIn ? (
                <button
                  onClick={handleAuthClick}
                  className="block w-full text-center py-2 text-white hover:text-gray-300"
                >
                  Login / Sign Up
                </button>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-white hover:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {/* New placeholder links for GitHub-like menu in mobile */}
                  <Link
                    href="/profile"
                    className="block py-2 text-white hover:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block py-2 text-white hover:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/billing"
                    className="block py-2 text-white hover:text-gray-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Billing
                  </Link>
                  <div className="border-t border-gray-600 my-2"></div>
                  <button
                    onClick={handleAuthClick}
                    className="block w-full text-center py-2 text-white hover:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;