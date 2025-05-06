const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many attempts, please try again later'
});

// Input validation middleware
const validateSignup = (req, res, next) => {
  const { fname, lname, username, email, pnumber, password1 } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (!fname || !lname || !username || !email || !pnumber || !password1) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!phoneRegex.test(pnumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  if (password1.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  next();
};

// Check authentication
router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    // Exclude sensitive data
    const { password, ...safeUser } = req.user;
    res.json({ isAuthenticated: true, user: safeUser });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Signup
router.post('/signup', authLimiter, validateSignup, async (req, res) => {
  const { fname, lname, username, email, pnumber, password1 } = req.body;

  try {
    // Check for existing user
    const [emailCheck] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    const [usernameCheck] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (emailCheck.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (usernameCheck.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);

    // Create user
    const [result] = await pool.query(
      `INSERT INTO users 
      (firstname, lastname, username, email, phone, password) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [fname, lname, username, email, pnumber, hashedPassword]
    );

    // Get new user data (excluding password)
    const [newUser] = await pool.query(
      'SELECT id, username, firstname, lastname, email, phone FROM users WHERE id = ?',
      [result.insertId]
    );

    // Login user
    req.login(newUser[0], (err) => {
      if (err) return res.status(500).json({ error: 'Session error' });
      res.json({ success: true, user: newUser[0] });
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic input check
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get user
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, users[0].password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Exclude password from user data
    const { password: _, ...userData } = users[0];

    // Login user
    req.login(userData, (err) => {
      if (err) return res.status(500).json({ error: 'Session error' });
      res.json({ success: true, user: userData });
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout error' });
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;