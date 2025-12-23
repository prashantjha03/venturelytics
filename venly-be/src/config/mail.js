// src/config/mail.js
const nodemailer = require("nodemailer");

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  NODE_ENV,
} = process.env;

/* ======================
   Environment Validation
====================== */
if (!MAIL_USER || !MAIL_PASS) {
  console.warn("⚠️ Mail credentials are missing. Emails will be disabled.");
}

/* ======================
   Transporter
====================== */
const transporter = nodemailer.createTransport({
  host: MAIL_HOST || "smtp.gmail.com",
  port: MAIL_PORT ? Number(MAIL_PORT) : 587,
  secure: false, // TLS
  auth: MAIL_USER && MAIL_PASS
    ? {
        user: MAIL_USER,
        pass: MAIL_PASS, // App Password
      }
    : undefined,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

/* ======================
   Soft Verify (non-blocking)
====================== */
if (MAIL_USER && MAIL_PASS && NODE_ENV !== "test") {
  transporter.verify()
    .then(() => {
      console.log("📧 Mail server ready");
    })
    .catch(() => {
      console.warn("⚠️ Mail server unavailable (will retry on send)");
    });
}

module.exports = transporter;
