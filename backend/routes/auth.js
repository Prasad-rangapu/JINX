// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstname, lastname, username, email, phone, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    await conn.query(
      'INSERT INTO users (firstname, lastname, username, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [firstname, lastname, username, email, phone, hash]
    );
    conn.release();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();

    if (!users.length) return res.status(400).json({ error: 'Invalid email or password' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
