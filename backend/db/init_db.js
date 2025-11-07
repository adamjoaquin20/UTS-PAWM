const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'products.db');
const SEED_PATH = path.join(__dirname, 'seed.json');

function init() {
  if (!fs.existsSync(SEED_PATH)) {
    console.error('Seed file not found:', SEED_PATH);
    process.exit(1);
  }

  const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new sqlite3.Database(DB_PATH);

  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS products');
    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        brand TEXT,
        category TEXT,
        price INTEGER,
        originalPrice INTEGER,
        image TEXT,
        material TEXT,
        sizes TEXT,
        isHot INTEGER,
        description TEXT
      )
    `);

    const stmt = db.prepare(`INSERT INTO products (id,name,brand,category,price,originalPrice,image,material,sizes,isHot,description) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
    seed.forEach((p) => {
      stmt.run(
        p.id,
        p.name,
        p.brand || '',
        p.category || '',
        p.price || 0,
        p.originalPrice || 0,
        p.image || '',
        p.material || '',
        JSON.stringify(p.sizes || []),
        p.isHot ? 1 : 0,
        p.description || ''
      );
    });
    stmt.finalize();

    // create users & carts tables for simple auth + cart persistence
    db.run('DROP TABLE IF EXISTS users');
    db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, token TEXT)`);
    db.run('DROP TABLE IF EXISTS carts');
    db.run(`CREATE TABLE carts (id INTEGER PRIMARY KEY, userId INTEGER, cart TEXT, FOREIGN KEY(userId) REFERENCES users(id))`);

    console.log('Database initialized at', DB_PATH);
    db.close();
  });
}

init();
