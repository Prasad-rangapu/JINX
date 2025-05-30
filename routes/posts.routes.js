const express = require('express');
const router = express.Router();
const db = require('../db');
<<<<<<< HEAD
const { authenticateJWT } = require('./auth');

// Get recent posts
router.get('/recent', async (req, res) => {
  const [rows] = await db.query('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY posts.created_at DESC LIMIT 10');
=======

// // Helper function to convert BigInt values to strings
// function rows {
//   return JSON.parse(JSON.stringify(rows, (key, value) =>
//     typeof value === 'bigint' ? value.toString() : value
//   ));
// }

// Get recent posts
router.get('/recent', async (req, res) => {
  const rows= await db.execute('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY posts.created_at DESC LIMIT 10');
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
  res.json(rows);
});

// Get random posts
router.get('/random', async (req, res) => {
<<<<<<< HEAD
  const [rows] = await db.query('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY rand() LIMIT 10');
=======
  const rows= await db.execute('SELECT posts.*,users.username FROM posts join users on posts.user_id=users.id ORDER BY rand() LIMIT 10');
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
  res.json(rows);
});

// Search posts
router.get('/search', async (req, res) => {
  const q = req.query.q;
<<<<<<< HEAD
  const [rows] = await db.query(
=======
  const rows= await db.execute(
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
    'SELECT * FROM posts WHERE title LIKE ? OR content LIKE ?',
    [`%${q}%`, `%${q}%`]
  );
  res.json(rows);
});

// Get user posts
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

<<<<<<< HEAD
  const [rows] = await db.query('SELECT * FROM posts WHERE user_id = ?', [userId]);
=======
  const rows= await db.execute('SELECT * FROM posts WHERE user_id = ?', [userId]);
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
  res.json(rows);
});

// Create new post
<<<<<<< HEAD
router.post('/', authenticateJWT, async (req, res) => {
  // Now req.user is available
  const { title, description } = req.body;
  const id = req.user.id;

  await db.query(
=======
router.post('/', async (req, res) => {
  const { id, title, description } = req.body; 
  // Make sure userId is sent in the body or get from auth

  await db.execute(
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
    'INSERT INTO posts (user_id, title, content, likes) VALUES (?, ?, ?, ?)',
    [id, title, description, 0]
  );
  res.status(201).json({ message: 'Post created' });
});

<<<<<<< HEAD
// Update post (like/unlike)
=======
// Update post
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
router.post(`/:postId/like`, async (req, res) => {
  const postId = req.params.postId;
  const { userId } = req.body;

<<<<<<< HEAD
  const [rows] = await db.query(
=======
  const rows = await db.execute(
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
    'select * from likes where post_id=? and user_id=?',
    [postId, userId]
  );
  if (!rows.length) {
<<<<<<< HEAD
    await db.query(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
    await db.query(
      'UPDATE posts SET likes = likes + 1 WHERE id = ?',
      [postId]
    );
    const [post] = await db.query(
      'select * from posts where id=?',
      [postId]);
    res.status(201).json(post[0]);
  }
  else{
    await db.query(
      'delete from likes where post_id=? and user_id=?',
      [postId, userId]
    );
    await db.query(
      'UPDATE posts SET likes = likes - 1 WHERE id = ?',
      [postId]
    );
    const [post] = await db.query(
=======
    await db.execute(
      'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
      [postId, userId]
    );
    await db.execute(
      'UPDATE posts SET likes = likes + 1 WHERE id = ?',
      [postId]
    );
    const post= await db.execute(
      'select * from posts where id=?',
      [postId]);
    res.status(201).json(post[0]);
   
  }
  else{
    await db.execute(
      'delete from likes where post_id=? and user_id=?',
      [postId, userId]
    );
    await db.execute(
      'UPDATE posts SET likes = likes - 1 WHERE id = ?',
      [postId]
    );
   const post= await db.execute(
>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
      'select * from posts where id=?',
      [postId]);
    res.status(201).json(post[0]);
  } 
});

<<<<<<< HEAD
=======

>>>>>>> 4385678e9a673fe7864d096d661695029b280bbc
module.exports = router;
