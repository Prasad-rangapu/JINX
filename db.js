const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'blog',
  connectionLimit: 5,
  allowPublicKeyRetrieval: true // Required for newer MariaDB versions
});

// Verify connection
pool.getConnection()
  .then(conn => {
    console.log('Connected to MariaDB database!');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = pool;