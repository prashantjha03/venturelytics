const express = require("express");
const router = express.Router();

const {
  sendContactMessage,
} = require("../controllers/contact.controller");

// Public route
router.post("/", sendContactMessage);

module.exports = router;
