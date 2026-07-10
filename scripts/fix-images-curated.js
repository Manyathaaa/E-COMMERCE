import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModels.js";
import categoryModel from "../models/categoryModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const curatedImages = {
  "Electronics": [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&q=80"
  ],
  "Men": [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    "https://images.unsplash.com/photo-1593030761756-1d98280f5856?w=600&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80"
  ],
  "Women": [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
    "https://images.unsplash.com/photo-1509631179647-0c37cb5f0fc9?w=600&q=80",
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80"
  ],
  "Kids": [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80",
    "https://images.unsplash.com/photo-1566006014517-810ce84b39b0?w=600&q=80",
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&q=80",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80"
  ],
  "Home": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"
  ],
  "Beauty": [
    "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=600&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    "https://images.unsplash.com/photo-1617897903246-719242758050?w=600&q=80"
  ],
  "Sports": [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"
  ]
};

const fixImages = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected To MongoDB Database");

  const products = await productModel.find({ photoUrl: { $exists: true } }).populate('category');
  let count = 0;
  for (const p of products) {
    const categoryName = p.category?.name || "Electronics";
    
    // Pick an image corresponding directly to the category!
    const images = curatedImages[categoryName] || curatedImages["Electronics"];
    
    // Hash the product ID to always pick the same image from the list for the same product
    const hash = p._id.toString().split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const index = Math.abs(hash) % images.length;
    
    p.photoUrl = images[index];
    
    await p.save();
    count++;
    if(count % 100 === 0) console.log(`Updated ${count} products...`);
  }
  
  console.log(`Successfully updated all ${count} product images with curated URLs!`);
  process.exit(0);
};

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});
