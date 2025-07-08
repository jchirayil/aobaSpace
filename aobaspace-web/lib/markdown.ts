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

export async function getMarkdownPageContent(slug: string): Promise<MarkdownPageContent> {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    console.warn(`Markdown file for sections not found: ${fullPath}`);
    return { data: {}, sections: [] };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  console.log('--- Raw Markdown File Contents ---');
  console.log(fileContents);
  console.log('----------------------------------');

  const matterResult = matter(fileContents);
  const markdownBody = matterResult.content;
  const frontMatterData = matterResult.data;

  console.log('--- Parsed YAML Front Matter Data ---');
  console.log(frontMatterData);
  console.log('-------------------------------------');

  const sections: MarkdownSection[] = [];
  let currentSectionTitle: string = '';
  let currentSectionNodes: Content[] = [];

  // Determine heading level for splitting sections, default to 2 (H2)
  const sectionLevel = frontMatterData.sectionHeadingLevel || 2;

  const processor = remark(); // Initialize remark without html for parsing and stringifying to markdown
  const tree = processor.parse(markdownBody) as Root;

  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];

    if (node.type === 'heading' && node.depth === sectionLevel) {
      if (currentSectionTitle) {
        // Process the collected nodes for the previous section
        const sectionMarkdown = processor.stringify({ type: 'root', children: currentSectionNodes });
        const processedSectionContent = await remark().use(html).process(sectionMarkdown);
        sections.push({
          title: currentSectionTitle,
          contentHtml: processedSectionContent.toString(),
        });
        console.log(`Generated section: "${currentSectionTitle}" HTML length: ${processedSectionContent.toString().length}`);
      }
      // Start a new section
      currentSectionTitle = (node.children[0] && 'value' in node.children[0] ? node.children[0].value : '') || '';
      currentSectionNodes = [];
    } else {
      currentSectionNodes.push(node);
    }
  }

  // Add the last section if it exists
  if (currentSectionTitle) {
    const sectionMarkdown = processor.stringify({ type: 'root', children: currentSectionNodes });
    const processedSectionContent = await remark().use(html).process(sectionMarkdown);
    sections.push({
      title: currentSectionTitle,
      contentHtml: processedSectionContent.toString(),
    });
    console.log(`Generated final section: "${currentSectionTitle}" HTML length: ${processedSectionContent.toString().length}`);
  }

  return {
    data: frontMatterData,
    sections: sections,
  };
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