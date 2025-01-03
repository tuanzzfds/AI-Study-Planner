// filepath: /c:/Users/ADMIN/Documents/Downloads/code/mystdudyclone/backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Changed to optional
  fullName: { type: String, required: true },
  profilePicture: { type: String }, // URL or path to profile picture
  uid: { type: String, required: true, unique: true },
  username: { type: String, sparse: true }, // Add sparse index if username is optional
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);