import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MongoDBUrl =
  process.env.MONGODB_URI || "mongodb://localhost/127.0.0.1:27017/test";

export const connectDB = async () => {
  try {
    await mongoose.connect(MongoDBUrl);
    console.log("MongoDB Connected...");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("Unknown error connecting to MongoDB");
    }
    process.exit(1);
  }
};
