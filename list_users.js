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
    const users = await db.collection('users').find({}).toArray();
    console.log(users.map(u => `${u.name} (role: ${u.role}, email: ${u.email})`).join('\n'));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
};
run();
