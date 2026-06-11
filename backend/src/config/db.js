const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const DATA_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

class LocalDB {
  constructor(collectionName) {
    this.file = path.join(DATA_DIR, `${collectionName}.json`);
    this._ensureFile();
  }
  _ensureFile() {
    if (!fs.existsSync(this.file)) fs.writeFileSync(this.file, JSON.stringify([]));
  }
  _read() { return JSON.parse(fs.readFileSync(this.file, 'utf-8')); }
  _write(data) { fs.writeFileSync(this.file, JSON.stringify(data, null, 2)); }
  
  find(query = {}) {
    let docs = this._read();
    Object.keys(query).forEach(k => { docs = docs.filter(d => d[k] === query[k]); });
    return Promise.resolve(docs);
  }
  findOne(query = {}) { return this.find(query).then(docs => docs[0] || null); }
  create(data) {
    const docs = this._read();
    const doc = { ...data, _id: `local_${Date.now()}`, createdAt: new Date().toISOString() };
    docs.push(doc);
    this._write(docs);
    return Promise.resolve(doc);
  }
  findOneAndUpdate(query, update) {
    const docs = this._read();
    const idx = docs.findIndex(d => Object.keys(query).every(k => d[k] === query[k]));
    if (idx === -1) return Promise.resolve(null);
    if (update.$set) Object.assign(docs[idx], update.$set);
    if (update.$push) {
      Object.keys(update.$push).forEach(k => {
        if (!docs[idx][k]) docs[idx][k] = [];
        docs[idx][k].push(update.$push[k]);
      });
    }
    this._write(docs);
    return Promise.resolve(docs[idx]);
  }
  countDocuments(query = {}) { return this.find(query).then(d => d.length); }
}

let useLocal = false;
const localCollections = {};

function getLocalCollection(name) {
  if (!localCollections[name]) localCollections[name] = new LocalDB(name);
  return localCollections[name];
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    useLocal = true;
    return;
  }
  try {
    await mongoose.connect(uri);
    logger.info('✅ Database connected successfully');
  } catch (err) {
    logger.warn(`⚠️ MongoDB connection failed: ${err.message}. Falling back to local file-based database (data/)`);
    useLocal = true;
  }
}

module.exports = { connectDB, isLocalMode: () => useLocal, getLocalCollection };