import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articles = JSON.parse(fs.readFileSync(path.join(__dirname, 'articles.json'), 'utf-8')) as string[];

const imageDir = path.join(__dirname, '../client/public/article-images');
const imageFiles = fs.readdirSync(imageDir).filter(f => f.startsWith('article-'));

const imageExtensions: { [key: number]: string } = {};
for (const file of imageFiles) {
  const match = file.match(/article-(\d+)\.(jpeg|png)/);
  if (match) {
    imageExtensions[parseInt(match[1])] = match[2];
  }
}

const mapping: { title: string; imageUrl: string }[] = [];

for (let i = 0; i < articles.length; i++) {
  const ext = imageExtensions[i] || 'png';
  mapping.push({
    title: articles[i],
    imageUrl: `/article-images/article-${i}.${ext}`
  });
}

fs.writeFileSync(
  path.join(__dirname, 'articleImageMapping.json'),
  JSON.stringify(mapping, null, 2)
);

console.log(`Created mapping for ${mapping.length} articles`);
console.log('Sample:', mapping.slice(0, 5));
