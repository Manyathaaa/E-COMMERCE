import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ _id: '6a508dba77c5dd193cfc9aa8' }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Token:", token.substring(0, 20) + "...");

    console.log("Fetching /api/v1/orders/user-orders...");
    const res = await fetch('http://localhost:5000/api/v1/orders/user-orders', {
      headers: { 'Authorization': token }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 500));

  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};
run();
