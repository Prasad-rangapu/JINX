// server.js
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
