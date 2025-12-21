const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    linkedin: String,
    avatar: String,
  },
  { _id: false }
);

const startupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    website: String,
    fundingStatus: String,
    fundingAmount: Number,
    teamMembers: [teamMemberSchema],
    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},

rejectionReason: {
  type: String,
},

  },


  { timestamps: true }
);


module.exports = mongoose.model("Startup", startupSchema);
