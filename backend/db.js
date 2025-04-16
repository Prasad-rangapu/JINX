// db.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', 
  database: 'blog',
  connectionLimit: 5
});

module.exports = pool;
