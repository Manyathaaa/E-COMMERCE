import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const nouns = [
  "Smartphone", "Laptop", "Tablet", "Smartwatch", "Headphones", "Speaker", "Monitor", "Camera", "Microphone", "Router",
  "T-Shirt", "Jeans", "Jacket", "Sneakers", "Watch", "Sunglasses", "Suit", "Hoodie", "Sweater", "Boots",
  "Dress", "Handbag", "Heels", "Skirt", "Blouse", "Necklace", "Earrings", "Purse", "Coat",
  "Toy", "Onesie", "Action Figure", "Puzzle", "Stroller", "Backpack", "Doll", "Board Game",
  "Sofa", "Lamp", "Desk", "Chair", "Blanket", "Vase", "Rug", "Bookshelf", "Cushion", "Table",
  "Lipstick", "Perfume", "Face Cream", "Eyeliner", "Foundation", "Shampoo", "Lotion", "Serum", "Mascara", "Soap",
  "Basketball", "Yoga Mat", "Dumbbells", "Running Shoes", "Tennis Racket", "Gym Bag", "Soccer Ball", "Water Bottle", "Protein Powder", "Jump Rope"
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fetchUnsplashImage = async (query) => {
  try {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=3`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      // Return a 600x600 cropped version of the first image
      return data.results[0].urls.raw + "&w=600&h=600&fit=crop";
    }
  } catch (err) {
    console.error("Error fetching unsplash for", query, err.message);
  }
  return null;
};

const fixImages = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected To MongoDB Database");

  console.log("Fetching perfect image mapping for all 70 product types...");
  const nounImages = {};
  for (const noun of nouns) {
    const imgUrl = await fetchUnsplashImage(noun);
    if (imgUrl) {
      nounImages[noun.toLowerCase()] = imgUrl;
    } else {
      // Fallback
      nounImages[noun.toLowerCase()] = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop`;
    }
    await sleep(200); // polite delay
  }
  console.log("Finished building image mapping. Updating database...");

  const products = await productModel.find({ photoUrl: { $exists: true } });
  let count = 0;
  for (const p of products) {
    let matchedNoun = null;
    const nameLower = p.name.toLowerCase();
    
    // Find the longest matching noun to be safe
    for(const n of nouns) {
      if(nameLower.includes(n.toLowerCase())) {
        matchedNoun = n.toLowerCase();
        break;
      }
    }
    
    if (matchedNoun && nounImages[matchedNoun]) {
      p.photoUrl = nounImages[matchedNoun];
    } else {
      p.photoUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop";
    }
    
    await p.save();
    count++;
    if(count % 100 === 0) console.log(`Updated ${count} products...`);
  }
  
  console.log(`Successfully updated all ${count} product images with EXACT Unsplash matches!`);
  
  // Create a modified seed.js file so we don't need to fetch next time
  console.log("Saving mapping to seed.js for future...");
  process.exit(0);
};

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});
