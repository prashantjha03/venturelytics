const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * AUTH MIDDLEWARE
 */
const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/**
 * ADMIN ONLY
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

/**
 * STARTUP ONLY
 */
const isStartup = (req, res, next) => {
  if (req.user.role !== "startup") {
    return res.status(403).json({
      success: false,
      message: "Startup access only",
    });
  }
  next();
};

module.exports = {
  isAuth,
  isAdmin,
  isStartup,
};
