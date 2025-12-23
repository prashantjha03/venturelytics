// src/app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

/* ======================
   Route Imports
====================== */
const startupRoutes = require("./routes/startup.routes");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const adminProfileRoutes = require("./routes/adminProfile.routes");
const contactRoutes = require("./routes/contact.routes");
const protectedRoutes = require("./routes/protected.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const profileRoutes = require("./routes/profile.routes");

const app = express();

/* ======================
   Allowed Origins
====================== */
const allowedOrigins = [
  "https://venturelytics.vercel.app",
  "https://venturelytics-git-master-prashant-jhas-projects-1e280b00.vercel.app",
  "http://localhost:8080",
  "http://localhost:5173",
];

/* ======================
   Middlewares
====================== */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ======================
   Static Files
====================== */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);

/* ======================
   Root Route (FIXES 404)
====================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Venturelytics API is live 🚀",
  });
});

/* ======================
   API Routes
====================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/startups", startupRoutes);
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
    timestamp: new Date().toISOString(),
  });
});

/* ======================
   404 Handler (API only)
====================== */
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* ======================
   Global Error Handler
====================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* ======================
   Export App
====================== */
module.exports = app;
