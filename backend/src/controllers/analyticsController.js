const Report = require('../models/Report');
const { isLocalMode, getLocalCollection } = require('../config/db');

async function getAnalytics(req, res, next) {
  try {
    let all = isLocalMode() ? await getLocalCollection('reports').find({}) : await Report.find({});
    const stats = {
      total: all.length,
      byCategory: { Harassment: 0, Ragging: 0, Corruption: 0, 'Academic Grievance': 0, Other: 0 },
      bySeverity: { Critical: 0, High: 0, Medium: 0, Low: 0 },
      resolved: all.filter(r => r.status === 'Resolved').length,
      pending: all.filter(r => r.status !== 'Resolved').length,
    };
    all.forEach(r => {
      if (stats.byCategory[r.category] !== undefined) stats.byCategory[r.category]++;
      if (stats.bySeverity[r.aiSeverity] !== undefined) stats.bySeverity[r.aiSeverity]++;
    });
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
}

module.exports = { getAnalytics };