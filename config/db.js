import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to server ${conn.connection.host}`);
  } catch (error) {
    console.log(`error found ${error}`);
  }
};

export default connectDB;
