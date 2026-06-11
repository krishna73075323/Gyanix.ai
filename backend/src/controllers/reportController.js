const Report = require('../models/Report');
const { classifyReport } = require('../services/aiClassifier');
const { analyzeSentiment } = require('../services/sentimentAnalyzer');
const { generateSummary } = require('../services/summaryGenerator');
const { generateTrackingId, generatePasscode } = require('../utils/generateTrackingId');
const { isLocalMode, getLocalCollection } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

function getReportCollection() {
  return isLocalMode() ? getLocalCollection('reports') : null;
}

async function findReport(query) {
  return isLocalMode() ? getReportCollection().findOne(query) : Report.findOne(query);
}

async function createReport(req, res, next) {
  try {
    const { title, description, location } = req.body;
    if (!title || !description) return res.status(400).json({ success: false, message: 'Required fields missing' });

    const trackingId = generateTrackingId();
    const passcode = generatePasscode();
    const hashedPasscode = await bcrypt.hash(passcode, 10);

    const [aiResult, sentimentResult] = await Promise.all([
      classifyReport(title, description),
      analyzeSentiment(`${title} ${description}`)
    ]);
    const aiSummary = await generateSummary(title, description, aiResult.category, aiResult.severity);
    const priorityMap = { Critical: 1, High: 2, Medium: 3, Low: 4 };

    const reportData = {
      trackingId, passcode: hashedPasscode, title, description,
      location: location || 'Not specified',
      category: aiResult.category, aiSeverity: aiResult.severity, aiSummary,
      sentimentLabel: sentimentResult.label, priority: priorityMap[aiResult.severity] || 3,
      status: 'Pending', messages: []
    };

    if (isLocalMode()) {
      await getReportCollection().create(reportData);
    } else {
      await Report.create(reportData);
    }

    res.status(201).json({
      success: true,
      data: { 
        trackingId, 
        passcode, 
        category: aiResult.category, 
        severity: aiResult.severity, 
        status: 'Pending',
        sentiment: sentimentResult.label,
        summary: aiSummary
      }
    });
  } catch (err) { next(err); }
}

async function trackReport(req, res, next) {
  try {
    const { trackingId } = req.params;
    const { passcode } = req.query;
    let report = isLocalMode() ? await getReportCollection().findOne({ trackingId }) : await Report.findOne({ trackingId }).select('+passcode');
    if (!report) return res.status(404).json({ success: false, message: 'Not found' });

    const valid = await bcrypt.compare(passcode, report.passcode);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid passcode' });

    res.json({ success: true, data: report });
  } catch (err) { next(err); }
}

async function getAllReports(req, res, next) {
  try {
    let reports = isLocalMode() ? await getReportCollection().find({}) : await Report.find({});
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
}

async function getReportById(req, res, next) {
  try {
    const { id } = req.params;
    let report = isLocalMode() ? (await getReportCollection().find({})).find(r => r._id === id) : await Report.findById(id);
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let updated = isLocalMode() 
      ? await getReportCollection().findOneAndUpdate({ _id: id }, { $set: { status } }) 
      : await Report.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

async function addMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { content, sender } = req.body;
    const message = { sender, content, timestamp: new Date() };
    let updated = isLocalMode() 
      ? await getReportCollection().findOneAndUpdate({ _id: id }, { $push: { messages: message } }) 
      : await Report.findByIdAndUpdate(id, { $push: { messages: message } }, { new: true });
    res.json({ success: true, data: message });
  } catch (err) { next(err); }
}

module.exports = { createReport, trackReport, getAllReports, getReportById, updateStatus, addMessage };