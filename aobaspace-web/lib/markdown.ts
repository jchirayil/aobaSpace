import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const pagesDirectory = path.join(process.cwd(), 'content', 'pages');

export function getAllPageSlugs() {
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md$/, '');
  });
}

export async function getPageContent(slug: string) {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  
  // Check if the file exists
  if (!fs.existsSync(fullPath)) {
    console.warn(`Markdown file not found: ${fullPath}`);
    return { contentHtml: null, data: {} };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    slug,
    contentHtml,
    data: matterResult.data,
  };
}