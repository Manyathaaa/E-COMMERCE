import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env') });

const run = async () => {
  try {
    // Connect to DB to get admin user
    await mongoose.connect(process.env.MONGO_URL);
    const db = mongoose.connection.db;
    const adminUser = await db.collection('users').findOne({ role: 1 });
    
    // We need a valid token to bypass requireSignIn and isAdmin
    // I can generate one using jsonwebtoken
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ _id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("Fetching /api/v1/orders/admin/all-orders...");
    const res = await axios.get('http://localhost:5000/api/v1/orders/admin/all-orders', {
      headers: { Authorization: token }
    });
    console.log("Admin orders status:", res.status);
    console.log("Admin orders length:", res.data.orders?.length);

    console.log("Fetching /api/v1/orders/user-orders...");
    const res2 = await axios.get('http://localhost:5000/api/v1/orders/user-orders', {
      headers: { Authorization: token }
    });
    console.log("User orders status:", res2.status);
    console.log("User orders length:", res2.data.orders?.length);

  } catch (error) {
    console.log("Error:", error.response?.data || error.message);
  }
  process.exit(0);
};
run();
