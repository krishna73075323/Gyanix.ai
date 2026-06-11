const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));

app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

module.exports = app;