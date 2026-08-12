const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_DB || process.env.MONGO_URI || "mongodb://localhost:27017/doctor";
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
