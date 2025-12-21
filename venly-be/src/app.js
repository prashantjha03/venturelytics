// src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

/* ======================
   Route Imports
====================== */
const startupRoutes = require("./routes/startup.routes");
// const userRoutes = require("./routes/user.routes");
// const notificationRoutes = require("./routes/notification.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const adminProfileRoutes = require("./routes/adminProfile.routes");
const contactRoutes = require("./routes/contact.routes");
const protectedRoutes = require("./routes/protected.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");


const app = express();

/* ======================
   Middlewares
====================== */
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Static Files (IMPORTANT)
====================== */
// This allows frontend to access uploaded files
// Example: http://localhost:5000/uploads/logo.png
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

/* ======================
   API Routes
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/startups", startupRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", protectedRoutes);
app.use("/api/dashboard", dashboardRoutes);  
app.use("/api/profile", profileRoutes);

/* ======================
   Health Check
====================== */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running 🚀",
  });
});

/* ======================
   Global Error Handler (Recommended)
====================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ======================
   Export App
====================== */
module.exports = app;
