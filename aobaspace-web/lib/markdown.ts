import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Root, Content } from 'mdast'; // Import AST types

const pagesDirectory = path.join(process.cwd(), 'content', 'pages');

export function getAllPageSlugs() {
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return fileName.replace(/\.md$/, '');
    });
}

interface MarkdownSection {
  title: string;
  contentHtml: string;
}

interface MarkdownPageContent {
  data: { [key: string]: any }; // YAML front matter
  sections: MarkdownSection[];
}

export async function getPageContent(slug: string) {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Markdown file not found: ${fullPath}`);
    return { contentHtml: null, data: {} };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    data: matterResult.data, // Return front matter data
  };
}

export async function getMarkdownPageContent(slug: string): Promise<MarkdownPageContent> {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Markdown file for sections not found: ${fullPath}`);
    return { data: {}, sections: [] };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const markdownBody = matterResult.content;
  const frontMatterData = matterResult.data;

  const sections: MarkdownSection[] = [];
  let currentSectionTitle: string = '';
  let currentSectionNodes: Content[] = [];

  const processor = remark().use(html);
  const tree = processor.parse(markdownBody) as Root; // Ensure it's a Root node

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];

    if (node.type === 'heading' && node.depth === 2) { // Look for H2 headings
      if (currentSectionTitle) {
        // Process the collected nodes for the previous section
        const sectionTree: Root = { type: 'root', children: currentSectionNodes };
        const processedSectionContent = await processor.process(String(processor.stringify(sectionTree))); // Convert AST subtree to markdown, then process to HTML
        sections.push({
          title: currentSectionTitle,
          contentHtml: processedSectionContent.toString(),
        });
      }
      // Start a new section
      currentSectionTitle = (node.children[0] as any)?.value || ''; // Assuming text node as child of heading
      currentSectionNodes = [];
    } else {
      // Add node to current section content
      currentSectionNodes.push(node);
    }
  }

  // Add the last section if it exists (only if it's a feature section, not CTA)
  if (currentSectionTitle) {
    const sectionTree: Root = { type: 'root', children: currentSectionNodes };
    const processedSectionContent = await processor.process(String(processor.stringify(sectionTree)));
    sections.push({
      title: currentSectionTitle,
      contentHtml: processedSectionContent.toString(),
    });
  }

  return {
    data: frontMatterData,
    sections: sections,
  };
}