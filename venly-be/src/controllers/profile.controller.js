const Profile = require("../models/profile.model");
const cloudinary = require("../config/cloudinary");


/**
 * GET USER PROFILE
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
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
 * CREATE OR UPDATE PROFILE
 */
exports.upsertProfile = async (req, res) => {
  try {
    const profileData = {
      userId: req.user.id,
      ...req.body,
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
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
 * UPLOAD PROFILE AVATAR
 */
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided",
      });
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profiles",
    });

    // Save avatar URL
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
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
