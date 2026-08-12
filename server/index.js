const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectToDB = require("./config/connectToDB");

// Initialize dotenv config
dotenv.config();

// Initialize express app
const app = express();

// Load Database connection
connectToDB();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middlewares
app.use(express.json());
app.use(cors());

// Static file serving for uploads
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Something went wrong",
    success: false,
    error: err.message,
  });
});

// Port configuration
const PORT = process.env.PORT || 8000;

// Starting Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
