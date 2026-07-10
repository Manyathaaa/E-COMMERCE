import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import slugify from "slugify";
import categoryModel from "../models/categoryModels.js";
import productModel from "../models/productModels.js";

// Load environment variables from the root .env file
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

  console.log("Setting up categories...");

  // Realistic data dictionary
  const categoriesData = [
    { 
      name: "Kids", 
      subcategories: [
        { 
          type: "Kids Shoes", 
          brands: ["Nike", "Adidas", "Puma", "Vans", "Converse"],
          models: ["Air Force 1", "Stan Smith", "Suede", "Old Skool", "Chuck Taylor"],
          priceRange: [30, 80],
          images: [
            "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Kids Clothing", 
          brands: ["Carter's", "Gap Kids", "OshKosh", "H&M Kids", "Zara Kids"],
          models: ["Graphic Tee", "Denim Jacket", "Summer Dress", "Polo Shirt", "Winter Coat"],
          priceRange: [15, 50],
          images: [
            "https://images.unsplash.com/photo-1519238263530-99abad67b86e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Toys", 
          brands: ["LEGO", "Hasbro", "Mattel", "Fisher-Price", "Nerf"],
          models: ["Classic Building Blocks", "Action Figure", "Board Game", "Dollhouse", "Blaster"],
          priceRange: [20, 150],
          images: [
            "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1558060370-d64111d20163?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Women", 
      subcategories: [
        { 
          type: "Women Shoes", 
          brands: ["Nike", "Steve Madden", "Gucci", "Jimmy Choo", "Vans"],
          models: ["Running Sneakers", "Ankle Boots", "Classic Heels", "Platform Sandals", "Slip-ons"],
          priceRange: [50, 400],
          images: [
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1515347619362-673471ba65ae?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Handbags", 
          brands: ["Michael Kors", "Coach", "Kate Spade", "Louis Vuitton", "Chanel"],
          models: ["Crossbody Bag", "Tote Bag", "Shoulder Bag", "Clutch", "Satchel"],
          priceRange: [150, 2000],
          images: [
            "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Women Dress", 
          brands: ["Zara", "H&M", "Reformation", "ASOS", "Mango"],
          models: ["Floral Maxi", "Cocktail Dress", "Summer Wrap Dress", "Slip Dress", "Midi Dress"],
          priceRange: [40, 250],
          images: [
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Men", 
      subcategories: [
        { 
          type: "Men Shoes", 
          brands: ["Nike", "Adidas", "Timberland", "Clarks", "Dr. Martens"],
          models: ["Air Max", "Ultraboost", "Premium Boot", "Desert Boot", "1460 Boot"],
          priceRange: [80, 250],
          images: [
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1520108873727-4a0082c5d18e?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Watches", 
          brands: ["Rolex", "Seiko", "Casio", "Omega", "Tag Heuer"],
          models: ["Submariner", "Chronograph", "G-Shock", "Speedmaster", "Carrera"],
          priceRange: [100, 5000],
          images: [
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1587836374828-cb4387df3c7c?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Men Shirt", 
          brands: ["Ralph Lauren", "Tommy Hilfiger", "Levi's", "Hugo Boss", "Calvin Klein"],
          models: ["Oxford Shirt", "Polo Shirt", "Denim Shirt", "Dress Shirt", "Casual Button-down"],
          priceRange: [40, 150],
          images: [
            "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1598032895397-b9472444bf93?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Electronics", 
      subcategories: [
        { 
          type: "Laptops", 
          brands: ["Apple", "Dell", "HP", "Lenovo", "Asus"],
          models: ["MacBook Pro 16\"", "XPS 13", "Spectre x360", "ThinkPad X1", "ROG Zephyrus"],
          priceRange: [800, 3000],
          images: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1531297172864-8b2c286576b5?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Smartphones", 
          brands: ["Apple", "Samsung", "Google", "OnePlus", "Sony"],
          models: ["iPhone 15 Pro", "Galaxy S24 Ultra", "Pixel 8 Pro", "OnePlus 12", "Xperia 1 V"],
          priceRange: [600, 1400],
          images: [
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1533228100845-08145b01de14?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Headphones", 
          brands: ["Sony", "Bose", "Sennheiser", "Apple", "Beats"],
          models: ["WH-1000XM5", "QuietComfort 45", "Momentum 4", "AirPods Max", "Studio Pro"],
          priceRange: [200, 550],
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Cameras", 
          brands: ["Sony", "Canon", "Nikon", "Fujifilm", "Panasonic"],
          models: ["Alpha a7 IV", "EOS R5", "Z6 II", "X-T5", "Lumix GH6"],
          priceRange: [1200, 4000],
          images: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1564466809058-bf4114d55352?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Home", 
      subcategories: [
        { 
          type: "Furniture", 
          brands: ["IKEA", "West Elm", "Wayfair", "Ashley", "CB2"],
          models: ["Modern Sofa", "Coffee Table", "Lounge Chair", "Dining Set", "Bookshelf"],
          priceRange: [150, 1500],
          images: [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80"
          ]
        },
        { 
          type: "Lamp", 
          brands: ["Philips", "Lamps Plus", "Target", "Herman Miller", "Artemide"],
          models: ["Floor Lamp", "Table Lamp", "Pendant Light", "Desk Lamp", "Chandelier"],
          priceRange: [40, 300],
          images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1513506003901-1e6a229e9d15?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Sports", 
      subcategories: [
        { 
          type: "Running Shoes", 
          brands: ["Brooks", "Asics", "Hoka", "Saucony", "New Balance"],
          models: ["Ghost 15", "Gel-Kayano", "Clifton 9", "Endorphin Speed", "1080v12"],
          priceRange: [100, 200],
          images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    },
    { 
      name: "Beauty", 
      subcategories: [
        { 
          type: "Skincare", 
          brands: ["CeraVe", "The Ordinary", "Neutrogena", "La Roche-Posay", "Drunk Elephant"],
          models: ["Hydrating Cleanser", "Niacinamide Serum", "Water Gel", "Moisturizer", "Vitamin C Serum"],
          priceRange: [10, 80],
          images: [
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477eb31f76e?auto=format&fit=crop&w=400&q=80"
          ]
        }
      ]
    }
  ];

  const categories = [];

  for (const cat of categoriesData) {
    let existingCat = await categoryModel.findOne({ name: cat.name });
    if (!existingCat) {
      existingCat = await new categoryModel({
        name: cat.name,
        slug: slugify(cat.name),
      }).save();
      console.log(`Created category: ${cat.name}`);
    }
    categories.push({ doc: existingCat, subcategories: cat.subcategories });
  }

  console.log("Clearing previously seeded dummy products...");
  const deleted = await productModel.deleteMany({ photoUrl: { $exists: true } });
  console.log(`Cleared ${deleted.deletedCount} dummy products.`);

  console.log("Categories ready. Seeding 1050 products...");

  const BATCH_SIZE = 100;
  const TOTAL_PRODUCTS = 1050; // To make it > 1K+
  let productsToInsert = [];

  for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
    const categoryInfo = faker.helpers.arrayElement(categories);
    const cat = categoryInfo.doc;
    const sub = faker.helpers.arrayElement(categoryInfo.subcategories);

    const brand = faker.helpers.arrayElement(sub.brands);
    const model = faker.helpers.arrayElement(sub.models);
    
    // Generate realistic price ending in .99
    const rawPrice = faker.number.float({ min: sub.priceRange[0], max: sub.priceRange[1], fractionDigits: 0 });
    const price = rawPrice - 0.01;

    // Use a high-quality fixed image
    const photoUrl = faker.helpers.arrayElement(sub.images);

    // Realistic Name
    const name = `${brand} ${model} ${faker.string.alphanumeric(4).toUpperCase()}`;
    const slug = slugify(name);
    const description = `${faker.commerce.productDescription()} Enjoy the premium quality of ${brand}'s signature ${model}.`;
    
    const quantity = faker.number.int({ min: 5, max: 200 });
    const shipping = faker.datatype.boolean();

    productsToInsert.push({
      name,
      slug,
      description,
      price,
      quantity,
      shipping,
      category: cat._id,
      photoUrl,
    });

    if (productsToInsert.length === BATCH_SIZE || i === TOTAL_PRODUCTS) {
      await productModel.insertMany(productsToInsert);
      console.log(`Inserted ${i}/${TOTAL_PRODUCTS} products`);
      productsToInsert = [];
    }
  }

  console.log("Seeding completed successfully!");
  process.exit(0);
};

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
