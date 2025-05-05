const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO messages (name, email, subject, message, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, email, subject, message]
    );

    res.json({ 
      success: true,
      message: 'Message received',
      id: result.insertId
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;