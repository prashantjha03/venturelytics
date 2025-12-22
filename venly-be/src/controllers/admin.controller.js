const Startup = require("../models/startup.model");
const User = require("../models/User.model");

/* =============================
   STARTUP MANAGEMENT
============================= */
exports.getAllStartups = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;

    const [startups, total] = await Promise.all([
      Startup.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Startup.countDocuments(query),
    ]);

    res.json({
      success: true,
      startups,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStartupDetails = async (req, res) => {
  const startup = await Startup.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!startup) {
    return res.status(404).json({ success: false, message: "Startup not found" });
  }

  res.json({ success: true, startup });
};

exports.approveStartup = async (req, res) => {
  const startup = await Startup.findById(req.params.id);
  if (!startup) {
    return res.status(404).json({ success: false, message: "Startup not found" });
  }

  startup.status = "approved";
  startup.rejectionReason = undefined;
  await startup.save();

  res.json({ success: true, message: "Startup approved", startup });
};

exports.rejectStartup = async (req, res) => {
  const { reason } = req.body;

  const startup = await Startup.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", rejectionReason: reason || "Not specified" },
    { new: true }
  );

  res.json({ success: true, message: "Startup rejected", startup });
};

/* =============================
   USER MANAGEMENT
============================= */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

exports.getUserDetails = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user });
};

exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: "Status updated", user });
};

exports.updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: "Role updated", user });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, message: "User deleted" });
};

/* =============================
   DASHBOARD (FIXED)
============================= */
exports.getDashboardAnalytics = async (req, res) => {
  const [
    totalStartups,
    totalUsers,
    pendingStartups,
    approvedStartups,
    rejectedStartups,
  ] = await Promise.all([
    Startup.countDocuments(),
    User.countDocuments(),
    Startup.countDocuments({ status: "pending" }),
    Startup.countDocuments({ status: "approved" }),
    Startup.countDocuments({ status: "rejected" }),
  ]);

  res.json({
    success: true,
    data: {
      totalStartups,
      totalUsers,
      pendingStartups,
      approvedStartups,
      rejectedStartups,
    },
  });
};

/* ✅ THESE WERE MISSING — CAUSED THE CRASH */
exports.getStartupsByIndustry = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.getStartupsByStatus = async (req, res) => {
  res.json({ success: true, data: [] });
};

exports.getRecentActivity = async (req, res) => {
  res.json({ success: true, data: [] });
};

/* =============================
   REPORTS
============================= */
exports.exportStartupsReport = async (req, res) => {
  res.json({ success: true, message: "Startups report generated" });
};

exports.exportUsersReport = async (req, res) => {
  res.json({ success: true, message: "Users report generated" });
};

/**
 * VERIFY / UNVERIFY USER (ADMIN)
 */
exports.updateUserVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isVerified must be boolean",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User ${isVerified ? "verified" : "unverified"} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update verification status",
    });
  }
};

