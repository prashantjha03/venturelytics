const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User.model");
const generateOtp = require("../utils/otp");
const generateToken = require("../utils/token");
const transporter = require("../config/mail");

/**
 * SIGNUP
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "startup",
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    await transporter.sendMail({
      to: email,
      subject: "Verify your email",
      html: `<h2>Your OTP: ${otp}</h2>`,
    });

    res.status(201).json({ message: "Signup successful, verify email" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/**
 * VERIFY OTP
 */
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
};

/**
 * RESEND OTP
 */
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ message: "User not found" });

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Your new OTP",
    html: `<h2>Your OTP: ${otp}</h2>`,
  });

  res.json({ message: "OTP resent successfully" });
};

/**
 * LOGIN (ROLE BASED)
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ MongoDB se
    },
  });
};


/**
 * FORGOT PASSWORD
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.json({ message: "If email exists, reset link sent" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    to: email,
    subject: "Reset Password",
    html: `<p>Your reset token: <b>${resetToken}</b></p>`,
  });

  res.json({ message: "Reset email sent" });
};

/**
 * RESET PASSWORD
 */
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: "Password reset successful" });
};
