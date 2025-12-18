import { db } from '../server/db';
import { blogArticles } from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ArticleMapping {
  title: string;
  imageUrl: string;
}

async function updateArticleImages() {
  const mappingPath = path.join(__dirname, 'articleImageMapping.json');
  const mapping: ArticleMapping[] = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  
  console.log(`Loaded ${mapping.length} article mappings`);
  
  let updated = 0;
  let notFound = 0;
  
  for (const article of mapping) {
    const result = await db
      .update(blogArticles)
      .set({ imageUrl: article.imageUrl })
      .where(eq(blogArticles.title, article.title));
    
    updated++;
  }
  
  console.log(`Updated ${updated} articles with image URLs`);
  
  const allArticles = await db.select().from(blogArticles).limit(5);
  console.log('Sample articles with images:');
  allArticles.forEach(a => {
    console.log(`  - ${a.title.substring(0, 50)}... -> ${a.imageUrl}`);
  });
}

updateArticleImages()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
