const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createReport,
  trackReport,
  getAllReports,
  getReportById,
  updateStatus,
  addMessage,
} = require('../controllers/reportController');

router.post('/', createReport);
router.get('/track/:trackingId', trackReport);
router.get('/', authMiddleware, getAllReports);
router.get('/:id', authMiddleware, getReportById);
router.patch('/:id/status', authMiddleware, updateStatus);
router.post('/:id/message', addMessage);

module.exports = router;