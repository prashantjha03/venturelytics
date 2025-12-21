const express = require("express");
const router = express.Router();

const {
  getAdminProfile,
  upsertAdminProfile,
  uploadAdminAvatar,
} = require("../controllers/adminProfile.controller");

const { isAuth, isAdmin } = require("../middleware/auth.middleware");
const upload = require("../config/multer");

/* =============================
   ADMIN PROFILE
============================= */

router.get(
  "/profile",
  isAuth,
  isAdmin,
  getAdminProfile
);

router.put(
  "/profile",
  isAuth,
  isAdmin,
  upsertAdminProfile
);

router.post(
  "/profile/avatar",
  isAuth,
  isAdmin,
  upload.single("avatar"),
  uploadAdminAvatar
);

module.exports = router;
