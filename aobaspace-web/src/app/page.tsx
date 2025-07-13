import React from 'react';
import { getMarkdownPageContent } from '@lib/markdown'; // This is a server-side import
import HomePageClientContent from '@/components/HomePageClientContent'; // Import the new client component

export default async function Home() {
  // Data fetching happens directly in this Server Component
  const { data: markdownData, sections: markdownSections } = await getMarkdownPageContent('home');

  return (
    // Render the client component and pass the fetched data as props
    <HomePageClientContent
      markdownData={markdownData}
      markdownSections={markdownSections}
    />
  );
}