import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

async function extractImagesFromDocx() {
  const docxPath = path.join(__dirname, '../../attached_assets/LinkedIn_Latest_Articles2_1765956474126.docx');
  const outputDir = path.join(__dirname, '../client/public/article-images');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const docxBuffer = fs.readFileSync(docxPath);
  
  const imageList: ImageData[] = [];
  let imageIndex = 0;

  const result = await mammoth.convertToHtml({
    buffer: docxBuffer
  }, {
    convertImage: mammoth.images.imgElement(async (image) => {
      const extension = image.contentType.split('/')[1] || 'png';
      const imageName = `article-${imageIndex}.${extension}`;
      const imagePath = path.join(outputDir, imageName);
      
      const imageBuffer = await image.read();
      fs.writeFileSync(imagePath, imageBuffer);
      
      console.log(`Extracted image ${imageIndex}: ${imageName}`);
      imageIndex++;
      
      return { src: `/article-images/${imageName}` };
    })
  });

  console.log(`\nTotal images extracted: ${imageIndex}`);
  
  const textResult = await mammoth.extractRawText({ buffer: docxBuffer });
  const lines = textResult.value.split('\n').filter(line => line.trim());
  
  const titles: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 20 && 
        !trimmed.startsWith('Published') && 
        !trimmed.startsWith('Girish') &&
        !trimmed.includes('Feed post') &&
        !trimmed.includes('LinkedIn') &&
        !trimmed.match(/^\d+ comment/) &&
        !trimmed.match(/^[\d\w]+ and \d+ other/)) {
      if (!titles.includes(trimmed)) {
        titles.push(trimmed);
      }
    }
  }

  console.log(`\nFound ${titles.length} article titles`);
  
  const mapping: { title: string; imageUrl: string }[] = [];
  for (let i = 0; i < titles.length; i++) {
    const imageUrl = i < imageIndex ? `/article-images/article-${i}.png` : null;
    mapping.push({
      title: titles[i],
      imageUrl: imageUrl || ''
    });
  }

  fs.writeFileSync(
    path.join(__dirname, 'articleImages.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`\nSaved mapping to scripts/articleImages.json`);
}

extractImagesFromDocx().catch(console.error);
