const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['reporter', 'authority'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  passcode: { type: String, required: true, select: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: 'Not specified' },
  category: { type: String, default: 'Other' },
  aiSeverity: { type: String, default: 'Low' },
  aiSummary: { type: String, default: '' },
  sentimentLabel: { type: String, default: 'Neutral' },
  status: { type: String, default: 'Pending' },
  priority: { type: Number, default: 3 },
  messages: [MessageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);