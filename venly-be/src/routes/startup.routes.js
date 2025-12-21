const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const {
  createStartup,
  getMyStartups,
  updateStartup,
  deleteStartup,
} = require("../controllers/startup.controller");

const { isAuth } = require("../middleware/auth.middleware");

/* ================= CREATE ================= */
router.post(
  "/",
  isAuth,
  upload.none(), // FormData support
  createStartup
);

/* ================= READ ================= */
router.get("/my", isAuth, getMyStartups);

/* ================= UPDATE ✅ FIXED ================= */
router.put(
  "/:id",
  isAuth,
  upload.none(), // FormData support
  updateStartup
);

/* ================= DELETE ================= */
router.delete("/:id", isAuth, deleteStartup);

module.exports = router;
