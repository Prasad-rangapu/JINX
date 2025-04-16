// routes/contact.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    conn.release();
    res.json({ message: 'Message received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
