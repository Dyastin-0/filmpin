const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  verificationToken: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  recoveryToken: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: [String],
  },
  roles: {
    type: [String],
    default: ["122602"],
  },
  backdropPath: {
    type: String,
  },
  profileImageURL: {
    type: String,
  },
  lists: {
    type: [String],
  },
  created_on: {
    type: Number,
    default: Date.now,
  },
  googleId: {
    type: String,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
