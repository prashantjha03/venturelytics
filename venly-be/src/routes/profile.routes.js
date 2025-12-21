const express = require("express");
const {
  getProfile,
  upsertProfile,
  uploadAvatar,
} = require("../controllers/profile.controller");
const { isAuth } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", isAuth, getProfile);
router.post("/", isAuth, upsertProfile);
router.post(
  "/avatar",
  isAuth,
  upload.single("avatar"),
  uploadAvatar
);

module.exports = router;
