const { v4: uuidv4 } = require('uuid');

function generateTrackingId() {
  const year = new Date().getFullYear();
  const suffix = uuidv4().replace(/-/g, '').toUpperCase().slice(0, 6);
  return `GYA-${year}-${suffix}`;
}

function generatePasscode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

module.exports = { generateTrackingId, generatePasscode };