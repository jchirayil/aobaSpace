import React from 'react';
import { getPageContent } from '../../lib/markdown'; // Adjust path as needed

export default async function Home() {
  // Fetch the marketing content for the homepage
  const { contentHtml } = await getPageContent('home'); // Assuming 'home.md' for marketing content

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-gray-800">
      {/* Removed the fixed header content that was causing overlap */}
      {/* <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to&nbsp;
          <code className="font-bold">AobaSpace Platform Core</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Next.js & NestJS
          </a>
        </div>
      </div> */}

      {/* Removed z-[-1] from this div to ensure it's in normal flow */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 lg:before:h-[360px]">
        <h1 className="text-4xl font-semibold text-center mt-8">
          Your Central Hub for AobaForms Management
        </h1>
      </div>

      {contentHtml && (
        <div
          className="prose lg:prose-xl text-center max-w-4xl mt-12" // Apply prose for markdown styling
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
    </main>
  );
}