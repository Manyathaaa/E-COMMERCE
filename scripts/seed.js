import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import categoryModel from "../models/categoryModels.js";
import productModel from "../models/productModels.js";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected To MongoDB Database");
  } catch (error) {
    console.log(`Error in MongoDB ${error}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  console.log("Fetching perfectly curated products from DummyJSON API...");
  const response = await fetch("https://dummyjson.com/products?limit=200");
  const data = await response.json();

  // Mapping DummyJSON categories to our application's premium categories
  const categoryMap = {
    "beauty": "Beauty",
    "fragrances": "Beauty",
    "skin-care": "Beauty",
    "furniture": "Home",
    "home-decoration": "Home",
    "laptops": "Electronics",
    "smartphones": "Electronics",
    "mobile-accessories": "Electronics",
    "tablets": "Electronics",
    "mens-shirts": "Men",
    "mens-shoes": "Men",
    "mens-watches": "Men",
    "womens-bags": "Women",
    "womens-dresses": "Women",
    "womens-jewellery": "Women",
    "womens-shoes": "Women",
    "womens-watches": "Women",
    "tops": "Women",
    "sunglasses": "Men",
  };

  // Filter out unwanted categories like groceries, kitchen-accessories, motorcycles, etc.
  const dummyProducts = data.products.filter(p => categoryMap[p.category]);

  console.log(`Fetched ${dummyProducts.length} premium base products (excluding groceries/kitchen).`);

  const dbCategories = {};

  console.log("Setting up categories in DB...");
  for (const dummyCat in categoryMap) {
    const targetCatName = categoryMap[dummyCat];
    if (!dbCategories[targetCatName]) {
      let existingCat = await categoryModel.findOne({ name: targetCatName });
      if (!existingCat) {
        existingCat = await new categoryModel({
          name: targetCatName,
          slug: slugify(targetCatName),
        }).save();
        console.log(`Created category: ${targetCatName}`);
      }
      dbCategories[targetCatName] = existingCat;
    }
  }

  // Also ensure Kids and Sports exist just in case they were created before
  const extraCategories = ["Kids", "Sports"];
  for (const catName of extraCategories) {
    let existingCat = await categoryModel.findOne({ name: catName });
    if (!existingCat) {
      existingCat = await new categoryModel({ name: catName, slug: slugify(catName) }).save();
    }
    dbCategories[catName] = existingCat;
  }

  console.log("Clearing previously seeded dummy products...");
  const deleted = await productModel.deleteMany({ photoUrl: { $exists: true } });
  console.log(`Cleared ${deleted.deletedCount} dummy products.`);

  console.log("Seeding 1050 perfectly matched premium products...");

  const BATCH_SIZE = 100;
  let productsToInsert = [];
  let totalInserted = 0;
  const targetTotal = 1050;
  
  const modifiers = ["", " Pro", " Plus", " Max", " Ultra", " 2024 Edition", " Signature", " Premium", " Elite", " Limited", " Special"];

  let iteration = 0;
  let dummyIndex = 0;

  // We shuffle the base products slightly so they interleave perfectly
  const shuffledBase = [...dummyProducts].sort(() => 0.5 - Math.random());

  while (totalInserted < targetTotal) {
    const baseProduct = shuffledBase[dummyIndex % shuffledBase.length];
    const modifier = modifiers[Math.floor(dummyIndex / shuffledBase.length) % modifiers.length];
    
    const name = `${baseProduct.title}${modifier}`;
    const slug = slugify(name + " " + totalInserted);
    
    const imageIndex = iteration % baseProduct.images.length;
    const photoUrl = baseProduct.images[imageIndex];

    const targetCatName = categoryMap[baseProduct.category];
    const cat = dbCategories[targetCatName];

    productsToInsert.push({
      name,
      slug,
      description: baseProduct.description,
      price: baseProduct.price,
      quantity: Math.max(10, baseProduct.stock),
      shipping: true,
      category: cat._id,
      photoUrl: photoUrl
    });

    totalInserted++;
    dummyIndex++;
    iteration++;

    if (productsToInsert.length === BATCH_SIZE || totalInserted === targetTotal) {
      await productModel.insertMany(productsToInsert);
      console.log(`Inserted ${totalInserted}/${targetTotal} products`);
      productsToInsert = [];
    }
  }

  console.log("Seeding completed successfully! All images and prices perfectly match.");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
