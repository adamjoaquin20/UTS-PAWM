// load .env for local development (SUPABASE_URL/KEY)
try { require('dotenv').config(); } catch (e) { /* ignore if dotenv not installed */ }
const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
// optional Supabase client (used if SUPABASE_URL / SUPABASE_KEY are provided)
let supabase = null;
let useSupabase = false;
try {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = process.env.SUPABASE_URL || null;
  const SUPABASE_KEY = process.env.SUPABASE_KEY || null;
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    useSupabase = true;
    console.log('Supabase client enabled (anon)');
  }
  // optional service role client for server-side operations (auth verification, carts)
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
  let supabaseService = null;
  let useSupabaseService = false;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    useSupabaseService = true;
    console.log('Supabase service client enabled');
  }
} catch (e) {
  // package may not be installed in some environments; server will fallback to SQLite
}

const DB_PATH = path.join(__dirname, 'db', 'products.db');

// NOTE: we open DB writable because we support carts/users storage

const app = express();
app.use(cors());
app.use(express.json());

// open database (read-write so we can persist carts/users)
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.warn('Could not open DB, did you run `npm run init-db`?', err.message);
});

// Simple token-based authentication (demo):
// - POST /api/auth/login { email } -> returns { token, userId }
// - Subsequent requests include Authorization: Bearer <token>
// - Middleware `authenticateToken` resolves token to user and attaches req.user

function generateToken() {
  return require('crypto').randomBytes(24).toString('hex');
}

async function authenticateToken(req, res, next) {
  const auth = req.get('Authorization') || req.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];

  // If Supabase service client is available, validate token via Supabase
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supa = require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supa.auth.getUser(token);
      if (error || !data || !data.user) return res.status(401).json({ error: 'Invalid token' });
      req.user = { id: data.user.id, email: data.user.email };
      return next();
    } catch (e) {
      return res.status(401).json({ error: 'Token verification failed' });
    }
  }

  // fallback: legacy SQLite token lookup
  db.get('SELECT id, email FROM users WHERE token = ?', [token], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Invalid token' });
    req.user = { id: row.id, email: row.email };
    next();
  });
}

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const email = (req.body && req.body.email) ? String(req.body.email).trim().toLowerCase() : null;
  if (!email) return res.status(400).json({ error: 'Email required' });
  // find or create user
  db.get('SELECT id, token FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.json({ token: row.token, userId: row.id });
    const token = generateToken();
    db.run('INSERT INTO users (email, token) VALUES (?, ?)', [email, token], function (insertErr) {
      if (insertErr) return res.status(500).json({ error: insertErr.message });
      return res.json({ token, userId: this.lastID });
    });
  });
});

// Cart endpoints (per-user)
// Cart endpoints (per-user)
app.get('/api/users/me/cart', authenticateToken, async (req, res) => {
  // If Supabase service client available, use it
  if (typeof supabase !== 'undefined' && supabase && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supa = require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data, error } = await supa.from('carts').select('cart').eq('user_id', req.user.id).single();
      if (error && error.code !== 'PGRST116') return res.status(500).json({ error: error.message || error });
      return res.json({ cart: data ? data.cart : [] });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // fallback to SQLite
  db.get('SELECT cart FROM carts WHERE userId = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.json({ cart: [] });
    try { return res.json({ cart: JSON.parse(row.cart) }); } catch (e) { return res.json({ cart: [] }); }
  });
});

app.put('/api/users/me/cart', authenticateToken, async (req, res) => {
  const cart = req.body && req.body.cart ? req.body.cart : [];
  // If Supabase service client available, upsert into carts table
  if (typeof supabase !== 'undefined' && supabase && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supa = require('@supabase/supabase-js').createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      // upsert by user_id
      const payload = { user_id: req.user.id, cart };
      const { data, error } = await supa.from('carts').upsert(payload, { onConflict: 'user_id' }).select();
      if (error) return res.status(500).json({ error: error.message || error });
      return res.json({ ok: true });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // fallback to SQLite
  const payload = JSON.stringify(cart);
  db.get('SELECT id FROM carts WHERE userId = ?', [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      db.run('UPDATE carts SET cart = ? WHERE userId = ?', [payload, req.user.id], (uerr) => {
        if (uerr) return res.status(500).json({ error: uerr.message });
        return res.json({ ok: true });
      });
    } else {
      db.run('INSERT INTO carts (userId, cart) VALUES (?, ?)', [req.user.id, payload], (ierr) => {
        if (ierr) return res.status(500).json({ error: ierr.message });
        return res.json({ ok: true });
      });
    }
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/products', async (req, res) => {
  if (useSupabase && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) return res.status(500).json({ error: error.message });
      // data is expected to include sizes as array (jsonb)
      return res.json(data.map((r) => ({
        id: r.id,
        name: r.name,
        brand: r.brand,
        category: r.category,
        price: r.price,
        originalPrice: r.originalPrice,
        image: r.image,
        material: r.material,
        sizes: r.sizes || [],
        isHot: !!r.isHot,
        description: r.description || ''
      })));
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsed = rows.map((r) => ({
      id: r.id,
      name: r.name,
      brand: r.brand,
      category: r.category,
      price: r.price,
      originalPrice: r.originalPrice,
      image: r.image,
      material: r.material,
      sizes: JSON.parse(r.sizes || '[]'),
      isHot: !!r.isHot,
      description: r.description || ''
    }));
    res.json(parsed);
  });
});

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (useSupabase && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Not found' });
        return res.status(500).json({ error: error.message });
      }
      if (!data) return res.status(404).json({ error: 'Not found' });
      return res.json({
        id: data.id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        price: data.price,
        originalPrice: data.originalPrice,
        image: data.image,
        material: data.material,
        sizes: data.sizes || [],
        isHot: !!data.isHot,
        description: data.description || ''
      });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, r) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!r) return res.status(404).json({ error: 'Not found' });
    const parsed = {
      id: r.id,
      name: r.name,
      brand: r.brand,
      category: r.category,
      price: r.price,
      originalPrice: r.originalPrice,
      image: r.image,
      material: r.material,
      sizes: JSON.parse(r.sizes || '[]'),
      isHot: !!r.isHot,
      description: r.description || ''
    };
    res.json(parsed);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Virtual Lab API listening on http://localhost:${port}`));
