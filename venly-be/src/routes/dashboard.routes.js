const express = require("express");
const router = express.Router();
const { isAuth } = require("../middleware/auth.middleware");
const {
  getDashboardStats,
  getRecentActivity,
} = require("../controllers/startup.controller");

router.get("/stats", isAuth, getDashboardStats);
router.get("/activity", isAuth, getRecentActivity);

module.exports = router;
