const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '2560',
  database: 'jinx',
  connectionLimit: 5,
  allowPublicKeyRetrieval: true
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
