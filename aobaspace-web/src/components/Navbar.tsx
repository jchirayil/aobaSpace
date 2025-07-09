'use client'; // This component needs to be a Client Component to use `usePathname` and `useAuth`

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook
import navigationData from '@/config/navigation.json'; // Import navigation data

// Define types for navigation items for better type safety
interface BaseNavItem {
  name: string;
  className?: string;
  protected?: boolean; // Can apply to any item that needs authentication check
}

interface LinkItem extends BaseNavItem {
  type: "link" | "unauthenticated-link"; // Specific types for links
  href: string;
}

interface ActionItem extends BaseNavItem {
  type: "action";
  action: "logout"; // Literal type for specific actions
}

interface DropdownItem extends BaseNavItem {
  type: "dropdown";
  children: NavItem[]; // Recursive definition
}

type NavItem = LinkItem | ActionItem | DropdownItem;

// Define the structure of the imported JSON data
interface NavigationData {
  mainNav: NavItem[]; // Changed to NavItem[] to include dropdowns
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

  // Helper to render a single navigation item (can be recursive for dropdowns)
  const renderNavItem = (item: NavItem, isMobile: boolean = false, isDropdownChild: boolean = false) => {
    // Conditional rendering based on 'protected' and 'type'
    if (item.protected && !isLoggedIn) {
      return null; // Don't render protected items if not logged in
    }
    if (item.type === "unauthenticated-link" && isLoggedIn) {
      return null; // Don't render login/signup if already logged in
    }
    if (item.type === "action" && item.action === 'logout' && !isLoggedIn) {
      return null; // Don't render logout if not logged in
    }

    // Determine base classes for styling
    const baseClasses = `block transition-colors ${isMobile ? 'py-2' : 'text-lg'} ${item.className || ''}`;
    const dropdownItemClasses = isDropdownChild ? 'px-4 py-2 font-normal text-white hover:bg-gray-600' : '';
    const activeLinkClasses = pathname === ('href' in item ? item.href : '') ? 'font-bold text-blue-400' : '';

    if (item.type === "link" || item.type === "unauthenticated-link") {
      const linkItem = item as LinkItem; // Type assertion for type narrowing
      return (
        <Link
          href={linkItem.href}
          className={`${baseClasses} ${dropdownItemClasses} ${activeLinkClasses} ${isDropdownChild ? '' : 'hover:text-gray-300'}`}
          onClick={() => {
            if (isMobile) setIsMobileMenuOpen(false);
            setIsDropdownOpen(false);
          }}
        >
          {linkItem.name}
        </Link>
      );
    } else if (item.type === "action" && item.action === "logout") {
      const actionItem = item as ActionItem; // Type assertion for type narrowing
      return (
        <button
          onClick={handleLogoutClick}
          className={`${baseClasses} ${dropdownItemClasses} w-full text-left`}
        >
          {actionItem.name}
        </button>
      );
    } else if (item.type === "dropdown") {
      const dropdownItem = item as DropdownItem; // Type assertion for type narrowing

      // Filter children based on authentication status before mapping
      const filteredChildren = dropdownItem.children.filter(childItem => {
        if (childItem.protected && !isLoggedIn) return false;
        if (childItem.type === "unauthenticated-link" && isLoggedIn) return false;
        if (childItem.type === "action" && childItem.action === 'logout' && !isLoggedIn) return false;
        return true;
      });

      // For desktop, render as a dropdown with its own button and nested div
      if (!isMobile) {
        return (
          <li className="relative" ref={dropdownRef} key={dropdownItem.name}>
            <button
              onClick={toggleDropdown}
              className="text-lg hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={`Toggle ${dropdownItem.name} menu`}
            >
              {dropdownItem.name}
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
                {filteredChildren.map((childItem, idx, arr) => ( // Use filteredChildren here, and get 'arr' for length
                  <React.Fragment key={childItem.name}>
                    {renderNavItem(childItem, isMobile, true)} {/* Recursive call for children */}
                    {/* Add a divider only if there's more than one *visible* item AND it's not the last item */}
                    {arr.length > 1 && idx < arr.length - 1 && (
                      <div className="border-t border-gray-600 my-1"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </li>
        );
      } else {
        // For mobile, render dropdown children directly as flat list items
        return (
          <>
            {filteredChildren.map((childItem, idx, arr) => ( // Use filteredChildren here, and get 'arr' for length
              <React.Fragment key={childItem.name}>
                {renderNavItem(childItem, isMobile, true)}
                {arr.length > 1 && idx < arr.length - 1 && (
                  <div className="border-t border-gray-600 my-2"></div>
                )}
              </React.Fragment>
            ))}
          </>
        );
      }
    }
    return null; // Should not happen with well-defined types
  };

  // Cast navigationData to the new NavigationData interface
  const typedNavigationData = navigationData as NavigationData;

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
          {typedNavigationData.mainNav.map((item) => (
            // Render top-level items. renderNavItem will handle <li> for dropdowns.
            // For other types (links), wrap them in <li> here.
            item.type === 'dropdown' ? renderNavItem(item) : <li key={item.name}>{renderNavItem(item)}</li>
          ))}
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
            {typedNavigationData.mainNav.map((item) => (
              <li key={item.name}>
                {/* For mobile, if it's a dropdown, render its children directly */}
                {item.type === 'dropdown' ? renderNavItem(item, true) : renderNavItem(item, true)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;