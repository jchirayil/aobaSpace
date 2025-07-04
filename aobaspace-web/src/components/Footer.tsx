import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-auto"> {/* mt-auto pushes it to the bottom */}
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} AobaSpace. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;