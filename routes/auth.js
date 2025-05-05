const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Check authentication
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        username: req.user.username,
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        phone: req.user.phone
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  const { fname, lname, username, email, pnumber, password1 } = req.body;
  
  try {
    // Validate password match (client-side should handle this too)
    const hashedPassword = await bcrypt.hash(password1, 10);
    
    const [result] = await pool.query(
      `INSERT INTO users 
      (firstname, lastname, username, email, phone, password) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [fname, lname, username, email, pnumber, hashedPassword]
    );
    
    // Automatically log in after signup
    const [newUser] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    
    req.login(newUser[0], (err) => {
      if (err) return res.status(500).json({ error: 'Login after signup failed' });
      res.json({ success: true, user: newUser[0] });
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, users[0].password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    req.login(users[0], (err) => {
      if (err) return res.status(500).json({ error: 'Session error' });
      res.json({ success: true, user: users[0] });
    });

  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;