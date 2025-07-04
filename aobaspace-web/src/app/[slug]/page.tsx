import React from 'react';
import { getPageContent, getAllPageSlugs } from '../../../lib/markdown'; // Adjust path as needed

// This component will dynamically render static pages based on their slug (filename)
export default async function StaticPage({ params }: { params: { slug: string } }) {
  const { contentHtml, data } = await getPageContent(params.slug);

  if (!contentHtml) {
    // Handle case where page is not found (e.g., return a 404 page)
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-red-50 text-red-800">
        <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
        <p className="text-lg text-center max-w-2xl">
          The page you are looking for does not exist.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">{data.title || params.slug.replace(/-/g, ' ').toUpperCase()}</h1>
      <div
        className="prose lg:prose-xl text-center max-w-2xl" // 'prose' class from Tailwind Typography plugin (if installed) or custom styles
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  );
}

// Function to generate static paths for SSG (Static Site Generation)
export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}