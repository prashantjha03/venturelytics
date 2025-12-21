const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: String,
    bio: String,
    linkedin: String,
    twitter: String,
    github: String,
    avatar: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
