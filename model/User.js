const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensures usernames are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures emails are unique
  },
  roles: {
    User: { type: Number, default: 2001 },
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  tokenExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
