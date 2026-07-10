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
    await db.collection('users').updateOne({ email: 'mailtomanyatha@gmail.com' }, { $set: { role: 1 } });
    await db.collection('users').updateOne({ email: 'admin@gmail.com' }, { $set: { role: 1 } });
    console.log("Made both users admins.");

    const adminUser = await db.collection('users').findOne({ email: 'mailtomanyatha@gmail.com' });
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign({ _id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const res = await fetch('http://localhost:5000/api/v1/orders/admin/all-orders', {
      headers: { 'Authorization': token }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response length:", text.length);
    if (res.status === 200) {
      const data = JSON.parse(text);
      console.log("Orders count:", data.orders?.length);
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};
run();
