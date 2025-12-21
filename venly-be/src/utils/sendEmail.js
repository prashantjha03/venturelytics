// src/utils/sendMail.js
const transporter = require("../config/mail");

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Venturelytics" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return false;
  }
};

module.exports = sendMail;
