import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  console.log("🗄️ Database configuration loaded");

  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (error) {
    console.error("⚠️ MongoDB connection failed:", error.message);
    console.log("💡 Using development mode - server will still run");
  }
};

export default connectDB;
