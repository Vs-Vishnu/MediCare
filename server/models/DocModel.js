const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      set: function (val) {
        if (!val) return val;
        return val.charAt(0).toUpperCase() + val.slice(1);
      },
    },
    email: {
      type: String,
      required: true,
    },
    timings: {
      type: Array, // Expected range picker timing data
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending", // can be 'pending', 'approved', 'rejected'
    },
    experience: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const DocModel = mongoose.model("doctor", doctorSchema);

module.exports = DocModel;
