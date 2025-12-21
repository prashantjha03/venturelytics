// src/routes/protected.routes.js
const express = require("express");
const router = express.Router();

const {
  isAuth,
  isAdmin,
  isStartup,
} = require("../middleware/auth.middleware");

/**
 * ADMIN ROUTE
 */
router.get("/admin", isAuth, isAdmin, (req, res) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
  });
});

/**
 * STARTUP ROUTE
 */
router.get("/startup", isAuth, isStartup, (req, res) => {
  res.json({
    message: "Startup access granted",
    user: req.user,
  });
});

module.exports = router;
