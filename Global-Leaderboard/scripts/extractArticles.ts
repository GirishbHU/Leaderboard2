import mammoth from "mammoth";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractArticles() {
  const docPath = path.resolve(__dirname, "../../attached_assets/LinkedIn_Latest_Articles2_1765953909027.docx");
  
  try {
    const result = await mammoth.extractRawText({ path: docPath });
    const text = result.value;
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const articles: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "Girish Hukkeri" && i > 0) {
        let title = lines[i - 1];
        if (title && 
            title.length > 10 && 
            !title.match(/^\d+$/) &&
            !title.includes("comments") &&
            !title.includes("comment") &&
            !title.match(/^Feed post/) &&
            !title.match(/^Published/) &&
            !title.match(/and \d+ others$/) &&
            title !== "LinkedIn Latest Articles") {
          if (!articles.includes(title)) {
            articles.push(title);
          }
        }
      }
    }
    
    console.log(`Found ${articles.length} unique articles:\n`);
    articles.forEach((title, idx) => {
      console.log(`${idx + 1}. ${title}`);
    });
    
    fs.writeFileSync(
      path.join(__dirname, "articles.json"),
      JSON.stringify(articles, null, 2)
    );
    
    console.log(`\nSaved to scripts/articles.json`);
    
  } catch (error) {
    console.error("Error extracting articles:", error);
  }
}

extractArticles();
