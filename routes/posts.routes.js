const express = require('express');
const router = express.Router();
const db = require('../db');

// // Helper function to convert BigInt values to strings
// function rows {
//   return JSON.parse(JSON.stringify(rows, (key, value) =>
//     typeof value === 'bigint' ? value.toString() : value
//   ));
// }

// Get recent posts
router.get('/recent', async (req, res) => {
  const rows= await db.execute('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY posts.created_at DESC LIMIT 10');
  res.json(rows);
});

// Get random posts
router.get('/random', async (req, res) => {
  const rows= await db.execute('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY rand() LIMIT 10');
  res.json(rows);
});

// Search posts
router.get('/search', async (req, res) => {
  const q = req.query.q;
  const rows= await db.execute(
    'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?',
    [`%${q}%`, `%${q}%`]
  );
  res.json(rows);
});

// Get user posts
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const rows= await db.execute('SELECT * FROM posts WHERE user_id = ?', [userId]);
  res.json(rows);
});

// Create new post
router.post('/', async (req, res) => {
  const { id, title, description } = req.body; 
  // Make sure userId is sent in the body or get from auth

  await db.execute(
    'INSERT INTO posts (user_id, title, content, likes) VALUES (?, ?, ?, ?)',
    [id, title, description, 0]
  );
  res.status(201).json({ message: 'Post created' });
});

module.exports = router;
