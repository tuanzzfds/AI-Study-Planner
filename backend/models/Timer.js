// backend/models/Timer.js
const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  startTime: { type: Date, required: true },
  endTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Timer', timerSchema);