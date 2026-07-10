import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const brands = ["Apple", "Samsung", "Sony", "Dell", "HP", "Nike", "Adidas", "Puma", "Reebok", "LG", "Panasonic", "Zara", "H&M", "IKEA", "L'Oreal", "MAC"];

const migrateProducts = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected To MongoDB Database");

  const products = await productModel.find({});
  let count = 0;
  for (const p of products) {
    if (!p.brand || p.brand === "Generic") {
       p.brand = brands[Math.floor(Math.random() * brands.length)];
    }
    if (p.discount === 0 || p.discount === undefined) {
       p.discount = [0, 5, 10, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 9)];
    }
    if (p.rating === 0 || p.rating === undefined) {
       p.rating = (Math.random() * (5.0 - 3.0) + 3.0).toFixed(1); // 3.0 to 5.0
    }
    if (!p.availabilityStatus) {
       p.availabilityStatus = Math.random() > 0.1 ? "In Stock" : "Out of Stock";
    }
    if (!p.images || p.images.length === 0) {
       p.images = [p.photoUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"];
    }
    await p.save();
    count++;
    if(count % 100 === 0) console.log(`Migrated ${count} products...`);
  }
  console.log(`Successfully migrated all ${count} products!`);
  process.exit(0);
};

migrateProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
