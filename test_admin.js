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
    const db = mongoose.connection.db;
    const adminUser = await db.collection('users').findOne({ role: 1 });
    
    if (!adminUser) {
        console.log("NO ADMIN FOUND");
        process.exit(1);
    }
    
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ _id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const res = await fetch('http://localhost:5000/api/v1/orders/admin/all-orders', {
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
