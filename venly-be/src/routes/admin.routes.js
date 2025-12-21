const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");
const { isAuth, isAdmin } = require("../middleware/auth.middleware");

/* =============================
   STARTUP MANAGEMENT
============================= */
router.get(
  "/startups",
  isAuth,
  isAdmin,
  adminController.getAllStartups
);

router.get(
  "/startups/:id",
  isAuth,
  isAdmin,
  adminController.getStartupDetails
);

router.patch(
  "/startups/:id/approve",
  isAuth,
  isAdmin,
  adminController.approveStartup
);

router.patch(
  "/startups/:id/reject",
  isAuth,
  isAdmin,
  adminController.rejectStartup
);

/* =============================
   USER MANAGEMENT
============================= */
router.get(
  "/users",
  isAuth,
  isAdmin,
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  isAuth,
  isAdmin,
  adminController.getUserDetails
);

router.patch(
  "/users/:id/status",
  isAuth,
  isAdmin,
  adminController.updateUserStatus
);

/* ✅ MISSING ROUTE — THIS FIXES THE CRASH */
router.patch(
  "/users/:id/role",
  isAuth,
  isAdmin,
  adminController.updateUserRole
);

router.delete(
  "/users/:id",
  isAuth,
  isAdmin,
  adminController.deleteUser
);

/* =============================
   DASHBOARD
============================= */
router.get(
  "/dashboard/analytics",
  isAuth,
  isAdmin,
  adminController.getDashboardAnalytics
);

router.get(
  "/dashboard/startups-by-industry",
  isAuth,
  isAdmin,
  adminController.getStartupsByIndustry
);

router.get(
  "/dashboard/startups-by-status",
  isAuth,
  isAdmin,
  adminController.getStartupsByStatus
);

router.get(
  "/dashboard/recent-activity",
  isAuth,
  isAdmin,
  adminController.getRecentActivity
);

/* =============================
   REPORTS
============================= */
router.get(
  "/reports/startups",
  isAuth,
  isAdmin,
  adminController.exportStartupsReport
);

router.get(
  "/reports/users",
  isAuth,
  isAdmin,
  adminController.exportUsersReport
);

/* =============================
   USER VERIFICATION
============================= */
router.patch(
  "/users/:id/verify",
  isAuth,
  isAdmin,
  adminController.updateUserVerification
);


module.exports = router;
