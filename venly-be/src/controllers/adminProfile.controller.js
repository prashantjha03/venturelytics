const AdminProfile = require("../models/adminProfile.model");
const cloudinary = require("../config/cloudinary");

/**
 * GET ADMIN PROFILE
 * GET /api/admin/profile
 */
exports.getAdminProfile = async (req, res) => {
  try {
    const profile = await AdminProfile.findOne({ adminId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * CREATE OR UPDATE ADMIN PROFILE
 * PUT /api/admin/profile
 */
exports.upsertAdminProfile = async (req, res) => {
  try {
    const profileData = {
      adminId: req.user.id,
      ...req.body,
    };

    const profile = await AdminProfile.findOneAndUpdate(
      { adminId: req.user.id },
      profileData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPLOAD ADMIN AVATAR
 * POST /api/admin/profile/avatar
 */
exports.uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "admin-profiles",
    });

    // Save avatar URL
    const profile = await AdminProfile.findOneAndUpdate(
      { adminId: req.user.id },
      { avatar: result.secure_url },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      avatar: result.secure_url,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
