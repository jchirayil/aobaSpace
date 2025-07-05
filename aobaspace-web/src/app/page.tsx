import React from 'react';
import { getMarkdownPageContent } from '../../lib/markdown'; // Import the new function

export default async function Home() {
  const { data, sections } = await getMarkdownPageContent('home'); // Get data (YAML) and sections from home.md

  // Define image URLs corresponding to each section title (or a default)
  const sectionImages: { [key: string]: string } = {
    "Effortless Data Entry, Any Way You Work": "https://placehold.co/600x400/E0E7FF/3F51B5?text=Voice+%26+Image+Input",
    "Beyond Simple Forms: Intelligent Workflows & Powerful Insights": "https://placehold.co/600x400/E0E7FF/3F51B5?text=Workflows+%26+Analytics",
    "Designed for Teams, Scaled for Enterprise": "https://placehold.co/600x400/E0E7FF/3F51B5?text=Scalable+for+Teams",
  };

  return (
    <main className="flex flex-col items-center justify-center bg-gray-100 text-gray-800 min-h-screen">
      {/* Hero Section - Conditionally rendered from YAML front matter */}
      {data.heroTitle && data.heroSubtitle && data.heroButtonText && (
        <section className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              {data.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {data.heroSubtitle}
            </p>
            <button className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              {data.heroButtonText}
            </button>
          </div>
        </section>
      )}

      {/* Dynamically rendered Feature Sections */}
      {sections.map((section, index) => {
        const isImageLeft = index % 2 === 0; // Alternate image left/right
        const imageUrl = sectionImages[section.title];
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
                  <img
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
      {data.ctaTitle && data.ctaSubtitle && data.ctaButtonText && (
        <section className="w-full bg-gradient-to-l from-blue-600 to-purple-700 text-white py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{data.ctaTitle}</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {data.ctaSubtitle}
            </p>
            <button className="bg-white text-blue-700 hover:bg-blue-100 font-bold py-3 px-8 rounded-full text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mt-8">
              {data.ctaButtonText}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}