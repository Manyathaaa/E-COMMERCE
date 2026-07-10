import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const nouns = ["Smartphone", "Laptop", "Tablet", "Smartwatch", "Headphones", "Speaker", "Monitor", "Camera", "Microphone", "Router", "T-Shirt", "Jeans", "Jacket", "Sneakers", "Watch", "Sunglasses", "Suit", "Hoodie", "Sweater", "Boots", "Dress", "Handbag", "Heels", "Skirt", "Blouse", "Necklace", "Earrings", "Purse", "Coat", "Toy", "Onesie", "Action Figure", "Puzzle", "Stroller", "Backpack", "Doll", "Board Game", "Sofa", "Lamp", "Desk", "Chair", "Blanket", "Vase", "Rug", "Bookshelf", "Cushion", "Table", "Lipstick", "Perfume", "Face Cream", "Eyeliner", "Foundation", "Shampoo", "Lotion", "Serum", "Mascara", "Soap", "Basketball", "Yoga Mat", "Dumbbells", "Running Shoes", "Tennis Racket", "Gym Bag", "Soccer Ball", "Water Bottle", "Protein Powder", "Jump Rope"].map(n => n.toLowerCase());

const fixImages = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected To MongoDB Database");

  const products = await productModel.find({ photoUrl: { $exists: true } });
  let count = 0;
  for (const p of products) {
    let matchedNoun = "product";
    const nameLower = p.name.toLowerCase();
    for(const n of nouns) {
      if(nameLower.includes(n)) {
        matchedNoun = encodeURIComponent(n);
        break;
      }
    }
    
    // Fast loremflickr url with a single accurate keyword
    p.photoUrl = `https://loremflickr.com/600/600/${matchedNoun}?lock=${p._id}`;
    await p.save();
    count++;
    if(count % 100 === 0) console.log(`Updated ${count} products...`);
  }
  
  console.log(`Successfully updated all ${count} product images with fast URLs!`);
  process.exit(0);
};

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});
