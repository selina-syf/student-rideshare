const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use a simple local connection string
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/student_rideshare', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      bufferCommands: false, // Disable buffering
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message);
    console.log('💡 TIP: Install MongoDB locally or use MongoDB Atlas');
    console.log('📚 For now, continuing without database...');
    return false;
  }
};

module.exports = connectDB;