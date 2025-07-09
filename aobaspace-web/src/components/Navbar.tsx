'use client'; // This component needs to be a Client Component to use `usePathname` and `useAuth`

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import navigationData from '@/config/navigation.json'; // Import navigation data

// Define types for navigation items for better type safety
interface NavLinkItem {
  name: string;
  href: string;
  protected?: boolean; // Optional, indicates if link requires authentication
  className?: string; // Optional, for custom CSS classes
}

interface DropdownItem {
  name: string;
  type: 'dropdown';
  protected?: boolean; // Optional, indicates if dropdown itself requires authentication
  children: (NavLinkItem | ActionItem)[]; // Can contain links or action items
  className?: string;
}

interface ActionItem {
  name: string;
  action: 'logout'; // Specific action for logout (literal type)
  protected?: boolean; // Optional protected property for action items
  className?: string;
}

type NavItem = NavLinkItem | DropdownItem | ActionItem;

// Define the structure of the imported JSON data
interface NavigationData {
  mainNav: NavItem[]; // Changed to NavItem[] to include dropdowns
  authNav: NavLinkItem[];
  unauthenticatedAction: NavLinkItem;
  authenticatedAction: ActionItem;
  accountDropdown: DropdownItem; // NEW: Added accountDropdown
}

const Navbar = () => {
  const pathname = usePathname();
  const { isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const handleLogoutClick = () => {
    console.log('Logging out...');
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to render a single navigation item
  const renderNavItem = (item: NavItem, isMobile: boolean = false, isDropdownItem: boolean = false) => {
    // Check if the item should be rendered based on authentication status
    if (item.protected && !isLoggedIn) {
      return null;
    }

    // Base classes for dropdown items to ensure consistent padding and font weight
    // Apply px-4 py-2 for all dropdown items to ensure consistent padding
    const dropdownBaseClasses = isDropdownItem ? 'px-4 py-2 font-normal' : '';

    if ('href' in item) { // It's a regular link
      return (
        <Link
          href={item.href}
          className={`block transition-colors ${
            isMobile ? 'py-2' : 'text-lg' // Mobile links are full height, desktop links have specific font size
          } ${
            pathname === item.href
              ? 'font-bold text-blue-400' // Active link styling
              : `${isDropdownItem ? 'text-white hover:bg-gray-600' : 'text-white hover:text-gray-300'}` // Normal vs. dropdown item styling
          } ${dropdownBaseClasses} ${item.className || ''}`} // Apply dropdown specific classes
          onClick={() => {
            if (isMobile) setIsMobileMenuOpen(false);
            setIsDropdownOpen(false);
          }}
        >
          {item.name}
        </Link>
      );
    } else if ('action' in item && item.action === 'logout') { // It's a logout action
      return (
        <button
          onClick={handleLogoutClick}
          className={`block w-full text-left transition-colors ${
            isMobile ? 'py-2' : 'text-lg' // Mobile buttons are full height, desktop buttons have specific font size
          } ${dropdownBaseClasses} text-white hover:bg-gray-600 ${item.className || ''}`} // Apply dropdown specific classes
        >
          {item.name}
        </button>
      );
    } else if ('type' in item && item.type === 'dropdown') { // It's a dropdown menu
      return (
        <li className="relative" ref={dropdownRef} key={item.name}>
          <button
            onClick={toggleDropdown}
            className="text-lg hover:text-gray-300 transition-colors focus:outline-none"
            aria-label={`Toggle ${item.name} menu`}
          >
            {item.name}
            <svg
              className={`w-4 h-4 ml-1 inline-block transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
              {/* Render children of the dropdown */}
              {renderDropdownContent(item.children, isMobile)}
            </div>
          )}
        </li>
      );
    }
    return null; // Should not happen with well-defined types
  };

  // Helper to render dropdown content
  const renderDropdownContent = (items: (NavLinkItem | ActionItem)[], isMobile: boolean) => (
    <>
      {items.map((item, idx) => {
        // Filter dropdown items based on authentication status
        if (item.protected && !isLoggedIn) {
          return null;
        }
        // Special handling for unauthenticated/authenticated actions within the dropdown
        if (item.name === navigationData.unauthenticatedAction.name && isLoggedIn) {
          return null; // Don't show login/signup if logged in
        }
        if (item.name === navigationData.authenticatedAction.name && !isLoggedIn) {
          return null; // Don't show logout if not logged in
        }

        return (
          <React.Fragment key={item.name}>
            {renderNavItem(item, isMobile, true)} {/* Pass true for isDropdownItem */}
            {/* Add a divider before logout if it's the last item in authNav */}
            {'action' in item && item.action === 'logout' && idx === items.length - 1 && <div className="border-t border-gray-600 my-1"></div>}
          </React.Fragment>
        );
      })}
    </>
  );

  // Cast navigationData to the new NavigationData interface
  const typedNavigationData = navigationData as NavigationData;

  // Prepare the dynamic account dropdown children based on login status
  const accountDropdownChildren = isLoggedIn
    ? [...typedNavigationData.authNav, typedNavigationData.authenticatedAction]
    : [typedNavigationData.unauthenticatedAction];

  // Create a dynamic account dropdown item
  const dynamicAccountDropdown: DropdownItem = {
    ...typedNavigationData.accountDropdown,
    children: accountDropdownChildren,
    protected: false // The dropdown itself is not protected, its children are
  };


  // Filter main navigation links based on authentication status and include the dynamic account dropdown
  const filteredMainNav = typedNavigationData.mainNav.filter(link => !link.protected || isLoggedIn);

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg fixed top-0 left-0 w-full z-50">
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
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
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
          {filteredMainNav.map((link) => (
            <li key={link.name}>
              {renderNavItem(link)}
            </li>
          ))}
          {/* Render the dynamic account dropdown using renderNavItem */}
          {renderNavItem(dynamicAccountDropdown)}
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
              xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <ul className="flex flex-col space-y-6 text-xl">
            {filteredMainNav.map((link) => (
              <li key={link.name}>
                {renderNavItem(link, true)}
              </li>
            ))}
            {/* Render the dynamic account dropdown's children directly in mobile menu */}
            {renderDropdownContent(dynamicAccountDropdown.children, true)}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;