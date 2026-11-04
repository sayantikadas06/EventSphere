
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
    },

    domainInterest: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

// Prevent duplicate registration for the same event and email
registrationSchema.index(
  { event: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
