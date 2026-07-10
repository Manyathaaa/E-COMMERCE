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
    const adminUser = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId('6a508dba77c5dd193cfc9aa8') });
    console.log("User role:", adminUser?.role);
    console.log("User name:", adminUser?.name);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};
run();
