const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isLocalMode, getLocalCollection } = require('../config/db');

async function findUser(query) {
  return isLocalMode() ? getLocalCollection('users').findOne(query) : User.findOne(query).select('+password');
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@gyanix.ai';
  const exist = await findUser({ email });
  if (!exist) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 10);
    const user = { name: 'Super Admin', email, password: hashed, role: 'admin' };
    if (isLocalMode()) await getLocalCollection('users').create(user);
    else await User.create(user);
  }
}

async function login(req, res, next) {
  try {
    await ensureAdmin();
    const { email, password } = req.body;
    const user = await findUser({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'gyanix_secret',
      { expiresIn: '12h' }
    );
    res.json({ success: true, data: { token, user: { name: user.name, email: user.email, role: user.role } } });
  } catch (err) { next(err); }
}

module.exports = { login, register: async () => {}, getMe: async () => {} };