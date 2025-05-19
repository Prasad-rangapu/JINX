const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to convert BigInt values to strings
function safeJson(rows) {
  return JSON.parse(JSON.stringify(rows, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

// Get recent posts
router.get('/recent', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM posts ORDER BY created_at DESC LIMIT 10');
  res.json(safeJson(rows));
});

// Get random posts
router.get('/random', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM posts ORDER BY RAND() LIMIT 10');
  res.json(safeJson(rows));
});

// Search posts
router.get('/search', async (req, res) => {
  const q = req.query.q;
  const [rows] = await db.execute(
    'SELECT * FROM posts WHERE title LIKE ? OR description LIKE ?',
    [`%${q}%`, `%${q}%`]
  );
  res.json(safeJson(rows));
});

// Get user posts
router.get('/user', async (req, res) => {
  const userId = req.user.id;
  const [rows] = await db.execute('SELECT * FROM posts WHERE user_id = ?', [userId]);
  res.json(safeJson(rows));
});

// Create new post
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;
  await db.execute(
    'INSERT INTO posts (user_id, title, description, created_at) VALUES (?, ?, ?, NOW())',
    [userId, title, description]
  );
  res.status(201).json({ message: 'Post created' });
});

module.exports = router;
