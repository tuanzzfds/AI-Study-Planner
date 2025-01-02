// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Completed', 'Expired', 'Not Started'], default: 'Todo' },
  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });



module.exports = mongoose.model('Task', taskSchema);
