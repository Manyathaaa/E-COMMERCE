import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const fixImages = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected To MongoDB Database");

  const products = await productModel.find({ photoUrl: { $exists: true } });
  let count = 0;
  for (const p of products) {
    // Extract the noun from the name or use the whole name
    const imageKeyword = encodeURIComponent(p.name);
    // Use pollinations.ai for perfect image generation
    const newUrl = `https://image.pollinations.ai/prompt/premium%20${imageKeyword}%20product%20shot?width=600&height=600&nologo=true`;
    p.photoUrl = newUrl;
    await p.save();
    count++;
    if(count % 50 === 0) console.log(`Updated ${count} products...`);
  }
  
  console.log(`Successfully updated all ${count} product images!`);
  process.exit(0);
};

fixImages().catch(err => {
  console.error(err);
  process.exit(1);
});
