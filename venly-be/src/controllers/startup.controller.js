const Startup = require("../models/Startup.model");

/* ================= CREATE ================= */
const createStartup = async (req, res) => {
  try {
    const {
      name,
      description,
      industry,
      website,
      fundingStatus,
      fundingAmount,
      teamMembers,
    } = req.body;

    const startup = await Startup.create({
      user: req.user._id,
      name,
      description,
      industry,
      website,
      fundingStatus,
      fundingAmount,
      teamMembers: teamMembers ? JSON.parse(teamMembers) : [],
    });

    res.status(201).json(startup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= READ ================= */
const getMyStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ user: req.user._id });
    res.json(startups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ✅ FIXED ================= */
const updateStartup = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
    };

    // Parse teamMembers if sent as JSON string (FormData)
    if (req.body.teamMembers) {
      updateData.teamMembers = JSON.parse(req.body.teamMembers);
    }

    const startup = await Startup.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    res.json(startup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!startup) {
      return res.status(404).json({
        message: "Startup not found",
      });
    }

    res.status(200).json({
      message: "Startup deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DASHBOARD ================= */
const getDashboardStats = async (req, res) => {
  const total = await Startup.countDocuments({ user: req.user._id });
  res.json({ totalStartups: total });
};

const getRecentActivity = async (req, res) => {
  const data = await Startup.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json(data);
};

module.exports = {
  createStartup,
  getMyStartups,
  updateStartup,
  deleteStartup,
  getDashboardStats,
  getRecentActivity,
};
