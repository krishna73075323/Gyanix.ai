const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`${err.name || 'Error'}: ${err.message}`);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
}

module.exports = errorHandler;