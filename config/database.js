const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  console.log("🗄️ Database configuration loaded");
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("⚠️ MongoDB connection failed:", err.message);
    console.log("💡 Using development mode - server will still run");
  }
};

module.exports = connectDB;
