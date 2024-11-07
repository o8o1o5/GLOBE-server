const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
