'use client'; // This is a Client Component

import React, { useState, useEffect } from 'react'; // NEW: Import useEffect
import ImageWithFallback from '@/components/ImageWithFallback';
// Removed LoginRegisterForm import
import { useAuth } from '@/context/AuthContext';
// Removed useAuthFormVisibility import and usage
import Link from 'next/link'; // Import Link for navigation

interface HomePageClientContentProps {
  markdownData: any;
  markdownSections: any[];
}

const HomePageClientContent: React.FC<HomePageClientContentProps> = ({ markdownData, markdownSections }) => {
  const { isLoggedIn } = useAuth();
  // Removed showAuthForm and setShowAuthForm from context
  const [mounted, setMounted] = useState(false); // NEW: State to track if component is mounted on client

  // NEW: Set mounted to true after component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!markdownData) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
        <p>Loading content...</p>
      </main>
    );
  }

  return (
    <>
      <main className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 min-h-screen">
        {/* Hero Section - Conditionally rendered from YAML front matter */}
        {markdownData.heroTitle && markdownData.heroSubtitle && markdownData.heroButtonText && (
          <section className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 text-center">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                {markdownData.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {markdownData.heroSubtitle}
              </p>
              {/* Only show button if mounted on client AND not logged in */}
              {mounted && !isLoggedIn && (
                <Link
                  href="/login" // Changed to Link to login page
                  className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  {markdownData.heroButtonText}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Removed Login/Register Form Overlay */}

        {/* Dynamically rendered Feature Sections */}
        {markdownSections.map((section: any, index: number) => {
          const isImageLeft = index % 2 === 0; // Alternate image left/right
          // Find the image URL from sectionsMetadata based on section title
          const sectionMeta = markdownData.sectionsMetadata?.find((meta: any) => meta.title === section.title);
          const imageUrl = sectionMeta?.imageUrl;

          const sectionBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

          return (
            <section key={index} className={`w-full py-16 px-4 ${sectionBg}`}>
              <div className={`max-w-6xl mx-auto flex flex-col items-center ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} md:space-x-12`}>
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div
                    className="prose lg:prose-xl text-left max-w-full" // Use prose for markdown styling
                    dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                  />
                </div>
                {imageUrl && (
                  <div className="md:w-1/2 flex justify-center">
                    <ImageWithFallback
                      src={imageUrl}
                      alt={section.title}
                      className="rounded-lg shadow-xl max-w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* Final Call to Action Section - Conditionally rendered from YAML front matter */}
        {markdownData.ctaTitle && markdownData.ctaSubtitle && markdownData.ctaButtonText && (
          <section className="w-full bg-gradient-to-l from-blue-600 to-purple-700 text-white py-20 px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{markdownData.ctaTitle}</h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {markdownData.ctaSubtitle}
              </p>
              {/* Only show button if mounted on client AND not logged in */}
              {mounted && !isLoggedIn && (
                <Link
                  href="/login" // Changed to Link to login page
                  className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mt-8"
                >
                  {markdownData.ctaButtonText}
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default HomePageClientContent;