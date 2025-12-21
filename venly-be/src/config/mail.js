// src/config/mail.js
const nodemailer = require("nodemailer");

if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
  console.error("❌ MAIL_USER or MAIL_PASS is missing in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

/**
 * Verify SMTP connection on startup
 * This prevents silent crashes later
 */
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server connection failed");
    console.error(error.message);
  } else {
    console.log("✅ Mail server is ready to send emails");
  }
});

module.exports = transporter;
