const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT firstname, lastname, username, email, phone, created_at 
       FROM users 
       WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;