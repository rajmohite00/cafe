const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'db.json')
  : path.join(__dirname, '../data/db.json');

// Ensure data directory exists
if (!process.env.VERCEL && !fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initial DB template with some seeded data so the site is beautiful right away
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [],
    orders: [],
    activities: [],
    menu: [
      {
        _id: "65c1bc25c27803a123456781",
        name: "Special Tandoori Chai",
        tag: "Bestseller",
        category: "Beverages",
        price: 75,
        emoji: "☕",
        visible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: "65c1bc25c27803a123456782",
        name: "Gourmet Avocado Toast",
        tag: "Chef's Pick",
        category: "Mains",
        price: 220,
        emoji: "🥑",
        visible: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    reservations: [],
    contacts: [],
    posts: [
      {
        _id: "65c1bc25c27803a123456791",
        title: "Brewing the Perfect Cup at Home",
        excerpt: "Learn the secrets of temperature, grind size, and water ratios for coffee masterclass.",
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    settings: [
      {
        key: "seo",
        value: {
          title: "Raj's Cafe — Live Aroma & Ambiance",
          description: "Experience artisan coffee and authentic gourmet delights at Raj's Cafe, New Delhi.",
          keywords: "coffee, cafe, new delhi, gourmet"
        }
      },
      {
        key: "design",
        value: {
          color: "#c27803"
        }
      },
      {
        key: "hours",
        value: [
          { day: "Monday", open: "08:00", close: "22:00", closed: false },
          { day: "Tuesday", open: "08:00", close: "22:00", closed: false },
          { day: "Wednesday", open: "08:00", close: "22:00", closed: false },
          { day: "Thursday", open: "08:00", close: "22:00", closed: false },
          { day: "Friday", open: "08:00", close: "23:00", closed: false },
          { day: "Saturday", open: "08:00", close: "23:00", closed: false },
          { day: "Sunday", open: "09:00", close: "22:00", closed: false }
        ]
      }
    ]
  }, null, 2));
}

function readDb() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback DB:", err);
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing fallback DB:", err);
  }
}

function createFallbackModel(collectionName) {
  function Model(data) {
    this._id = data._id || Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    Object.assign(this, data);
  }

  Model.prototype.save = async function() {
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    
    // Hash password if users collection and password isn't already hashed
    if (collectionName === 'users' && this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }

    const index = db[collectionName].findIndex(x => x._id === this._id);
    this.updatedAt = new Date().toISOString();
    const plain = { ...this };
    if (index !== -1) {
      db[collectionName][index] = plain;
    } else {
      db[collectionName].push(plain);
    }
    writeDb(db);
    return new Model(plain);
  };

  if (collectionName === 'users') {
    Model.prototype.comparePassword = async function(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    };
  }

  Model.create = async function(data) {
    if (Array.isArray(data)) {
      const results = [];
      for (const item of data) {
        const instance = new Model(item);
        results.push(await instance.save());
      }
      return results;
    }
    const instance = new Model(data);
    return instance.save();
  };

  class Query {
    constructor(execFn) {
      this.execFn = execFn;
      this.modifiers = [];
    }

    sort(sortOpt) {
      this.modifiers.push((list) => {
        if (typeof sortOpt === 'object') {
          const key = Object.keys(sortOpt)[0];
          const order = sortOpt[key];
          return [...list].sort((a, b) => {
            const valA = a[key];
            const valB = b[key];
            if (valA < valB) return order === -1 ? 1 : -1;
            if (valA > valB) return order === -1 ? -1 : 1;
            return 0;
          });
        }
        return list;
      });
      return this;
    }

    limit(n) {
      this.modifiers.push((list) => list.slice(0, n));
      return this;
    }

    skip(n) {
      this.modifiers.push((list) => list.slice(n));
      return this;
    }

    lean() {
      return this;
    }

    async exec() {
      let result = this.execFn();
      for (const mod of this.modifiers) {
        result = mod(result);
      }
      return result;
    }

    then(resolve, reject) {
      return this.exec().then(resolve, reject);
    }
  }

  function matches(item, query) {
    if (!query) return true;
    for (const key in query) {
      // Use string coercion to handle ObjectId vs string mismatches
      if (String(query[key]) !== String(item[key])) return false;
    }
    return true;
  }

  Model.find = function(query) {
    return new Query(() => {
      const db = readDb();
      const list = db[collectionName] || [];
      const filtered = list.filter(item => matches(item, query));
      return filtered.map(item => new Model(item));
    });
  };

  Model.findOne = function(query) {
    return new Query(() => {
      const db = readDb();
      const list = db[collectionName] || [];
      const found = list.find(item => matches(item, query));
      return found ? new Model(found) : null;
    });
  };

  Model.findById = function(id) {
    return new Query(() => {
      const db = readDb();
      const list = db[collectionName] || [];
      const found = list.find(item => item._id === id);
      return found ? new Model(found) : null;
    });
  };

  Model.findByIdAndUpdate = async function(id, update, options = {}) {
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    const index = db[collectionName].findIndex(item => item._id === id);
    if (index === -1) return null;
    
    const current = db[collectionName][index];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString()
    };
    db[collectionName][index] = updated;
    writeDb(db);
    return new Model(updated);
  };

  Model.findByIdAndDelete = async function(id) {
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    const index = db[collectionName].findIndex(item => item._id === id);
    if (index === -1) return null;
    const deleted = db[collectionName].splice(index, 1)[0];
    writeDb(db);
    return new Model(deleted);
  };

  Model.findOneAndUpdate = async function(query, update, options = {}) {
    const db = readDb();
    if (!db[collectionName]) db[collectionName] = [];
    let index = db[collectionName].findIndex(item => matches(item, query));
    
    if (index === -1) {
      if (options.upsert) {
        const newItem = {
          _id: Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...query,
          ...update
        };
        db[collectionName].push(newItem);
        writeDb(db);
        return new Model(newItem);
      }
      return null;
    }

    const current = db[collectionName][index];
    const updated = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString()
    };
    db[collectionName][index] = updated;
    writeDb(db);
    return new Model(updated);
  };

  Model.countDocuments = async function(query) {
    const db = readDb();
    const list = db[collectionName] || [];
    return list.filter(item => matches(item, query)).length;
  };

  return Model;
}

function getModelProxy(collectionName, mongooseModel) {
  const fallbackModel = createFallbackModel(collectionName);
  
  const isFallback = () => !process.env.MONGODB_URI || mongoose.connection.readyState !== 1;
  
  return new Proxy(mongooseModel, {
    construct(target, args, newTarget) {
      if (isFallback()) {
        return Reflect.construct(fallbackModel, args, fallbackModel);
      } else {
        return Reflect.construct(target, args, newTarget);
      }
    },
    get(target, prop, receiver) {
      if (isFallback()) {
        return Reflect.get(fallbackModel, prop, fallbackModel);
      } else {
        return Reflect.get(target, prop, receiver);
      }
    }
  });
}

module.exports = {
  getModelProxy
};
