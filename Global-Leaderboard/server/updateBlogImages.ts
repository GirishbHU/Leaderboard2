import { db } from "./db";
import { blogArticles } from "@shared/schema";
import { eq } from "drizzle-orm";

const articleImageMap: Record<string, string> = {
  "DevRev: Bridging the Developer-Customer Gap": "/blog-images/leaders/image1.png",
  "Zeroth Principles Extended Series": "/blog-images/leaders/image2.png",
  "The Seven-Year-Old Test": "/blog-images/leaders/image3.png",
  "Niccolo de Masi": "/blog-images/leaders/image4.jpeg",
  "From Prediction to Understanding": "/blog-images/leaders/image5.png",
  "Dheeraj Pandey": "/blog-images/leaders/image6.png",
  "Zeroth Principles - Part Two": "/blog-images/leaders/image7.png",
  "Meta's AI Present and Future": "/blog-images/leaders/image8.jpeg",
  "Zeroth Principles - Part One": "/blog-images/leaders/image9.png",
  "Meta's Mobile Revolution": "/blog-images/leaders/image10.jpeg",
  "Building Artificial Minds": "/blog-images/leaders/image11.png",
  "Meta's Metaverse Pivot": "/blog-images/leaders/image12.jpeg",
  "Physics-Informed Machine Learning": "/blog-images/leaders/image13.png",
  "Meta's Genesis": "/blog-images/leaders/image14.jpeg",
  "The AI Spring": "/blog-images/leaders/image15.png",
  "Entertainment in the AI Era": "/blog-images/leaders/image16.jpeg",
  "Streaming Wars": "/blog-images/leaders/image17.jpeg",
  "Netflix Origins": "/blog-images/leaders/image18.jpeg",
  "Netflix Acquires Warner Bros": "/blog-images/leaders/image19.jpeg",
  "Jacob DeWitte": "/blog-images/leaders/image20.png",
  "Monte Carlo Simulation": "/blog-images/leaders/image21.png",
  "Rajeeb (Raj) Hazra": "/blog-images/leaders/image22.jpeg",
  "Microsoft's AI Future": "/blog-images/leaders/image23.jpeg",
  "Satya Nadella Era Part 2": "/blog-images/leaders/image24.jpeg",
  "Satya Nadella Era Part 1": "/blog-images/leaders/image25.jpeg",
  "The Steve Ballmer": "/blog-images/leaders/image26.png",
  "The Bill Gates Era Part 3": "/blog-images/leaders/image27.jpeg",
  "Einstein: The Measure": "/blog-images/leaders/image28.png",
  "The Bill Gates Era Part 2": "/blog-images/leaders/image29.jpeg",
  "The Bill Gates Era Part 1": "/blog-images/leaders/image30.jpeg",
  "Alphabet's AI Future": "/blog-images/leaders/image31.jpeg",
  "The ChatGPT Wake-Up Call": "/blog-images/leaders/image32.jpeg",
  "The DeepMind Acquisition": "/blog-images/leaders/image33.jpeg",
  "Establishing Leadership": "/blog-images/leaders/image34.jpeg",
  "Google Genesis": "/blog-images/leaders/image35.jpeg",
  "Bryan Hanson": "/blog-images/leaders/image36.jpeg",
  "Alex Kendall": "/blog-images/leaders/image37.jpeg",
  "Rick Klausner": "/blog-images/leaders/image38.jpeg",
  "The Evolution of AI Models": "/blog-images/leaders/image39.png",
  "Jay Chaudhry": "/blog-images/leaders/image40.jpeg",
  "Sridhar Ramaswamy": "/blog-images/leaders/image41.jpeg",
  "Jensen Huang Beyond Nvidia": "/blog-images/leaders/image42.jpeg",
  "Jeff Bezos' AI Empire": "/blog-images/leaders/image43.jpeg",
  "Bezos as Executive Chairman": "/blog-images/leaders/image44.jpeg",
  "AWS and the Cloud Revolution": "/blog-images/leaders/image45.jpeg",
  "Amazon's Global Expansion": "/blog-images/leaders/image46.jpeg",
  "The New Architects of Innovation": "/blog-images/leaders/image47.png",
  "Jeff Bezos' Early Years": "/blog-images/leaders/image48.jpeg",
  "Nvidia's AI Dominance": "/blog-images/leaders/image49.jpeg",
  "Nvidia's Diversification": "/blog-images/leaders/image50.jpeg",
  "Nvidia's Gaming Dominance": "/blog-images/leaders/image51.jpeg",
  "Jensen Huang's GPU Vision": "/blog-images/leaders/image52.jpeg",
  "Dr. Vik Bajaj": "/blog-images/leaders/image53.jpeg",
  "Vitalik Buterin": "/blog-images/leaders/image54.png",
  "Marc Benioff": "/blog-images/leaders/image55.png",
  "Masayoshi Son": "/blog-images/leaders/image56.png",
  "Reid Hoffman": "/blog-images/leaders/image57.png",
  "Emmet Shear": "/blog-images/leaders/image58.jpeg",
  "Max Jaderberg": "/blog-images/leaders/image59.png",
  "Sal Khan": "/blog-images/leaders/image60.jpeg",
  "Andrej Karpathy": "/blog-images/leaders/image61.jpeg",
  "Sam Altman": "/blog-images/leaders/image62.jpeg",
  "Dario Amodei": "/blog-images/leaders/image63.jpeg",
  "Dr. Jim Fan": "/blog-images/leaders/image64.jpeg",
  "Yann LeCun": "/blog-images/leaders/image65.jpeg",
  "Ilya Sutskever": "/blog-images/leaders/image66.jpeg",
  "Fei-Fei Li": "/blog-images/leaders/image67.jpeg",
  "Demis Hassabis": "/blog-images/leaders/image68.jpeg",
  "Larry Ellison": "/blog-images/leaders/image69.jpeg",
  "Geoffrey Hinton": "/blog-images/leaders/image70.jpeg",
  "Jensen Huang": "/blog-images/leaders/image71.jpeg",
  "Anton Osika": "/blog-images/leaders/image72.jpeg",
};

async function updateBlogImages() {
  console.log("Updating blog article images...");
  
  const allArticles = await db.select().from(blogArticles);
  let updated = 0;
  
  for (const article of allArticles) {
    for (const [titleMatch, imageUrl] of Object.entries(articleImageMap)) {
      if (article.title.includes(titleMatch)) {
        await db.update(blogArticles)
          .set({ imageUrl })
          .where(eq(blogArticles.id, article.id));
        console.log(`Updated: ${article.title.substring(0, 50)}... -> ${imageUrl}`);
        updated++;
        break;
      }
    }
  }
  
  console.log(`\nUpdated ${updated} articles with images.`);
  process.exit(0);
}

updateBlogImages().catch(console.error);
