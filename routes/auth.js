const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 30* 60 * 1000, // 30 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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
// router.get('/check-auth', (req, res) => {
//   if (req.isAuthenticated()) {
//     const { password, ...safeUser } = req.user;
//     res.json({ isAuthenticated: true, user: safeUser });
//   } else {
//     res.json({ isAuthenticated: false });
//   }
// });

// ✅ Fixed route path (added '/')
router.post('/signup', authLimiter, validateSignup, async (req, res) => {
  const { fname, lname, username, email, pnumber, password1 } = req.body;

  try {
    const emailCheck = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    const usernameCheck= await pool.query('SELECT id FROM users WHERE username = ?', [username]);

    if (emailCheck[0]) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (usernameCheck[0]) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password1, salt);

    const result = await pool.query(
      `INSERT INTO users (firstname, lastname, username, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)`,
      [fname, lname, username, email, pnumber, hashedPassword]
    );

    const newUserRows = await pool.query(
      'SELECT id, username, firstname, lastname, email, phone FROM users WHERE id = ?',
      [result.insertId]
    );
    newUser=newUserRows[0];
console.log(newUser);
if (newUser===undefined) {
      return res.status(500).json({ error: 'User not found after registration' });
    }
    const { password, ...userData } = newUser;

     res.json({ success: true, user: userData });
    
    // req.login(newUser[0], (err) => {
    //   if (err) return res.status(500).json({ error: 'Session error' });
    //   res.json({ success: true, user: newUser[0] });
    // });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});


router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const conn = await pool.getConnection();
    const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();

    // .query always returns an array; the first element (index 0) is the column names, so we start from index 0 or 1 depending on driver version
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userData } = user;

     res.json({ success: true, user: userData });
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
