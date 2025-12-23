// src/utils/sendMail.js
const transporter = require("../config/mail");

const sendMail = async ({ to, subject, html }) => {
  if (!transporter?.options?.auth) {
    console.warn("⚠️ Email skipped: mail service not configured");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"Venturelytics" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.warn("⚠️ Email send failed");
    return false;
  }
};

module.exports = sendMail;
