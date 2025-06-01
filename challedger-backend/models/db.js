const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,                    // e.g., 'localhost'
  user: process.env.DB_USER,                    // e.g., 'root'
  password: process.env.DB_PASSWORD || '',      // May be empty
  database: process.env.DB_NAME,                // May be empty
  waitForConnections: true,                     
  connectionLimit: 10,                          // Max simultaneous connections
  queueLimit: 0,                                // Unlimited queued requests
});

// Export the pool with Promise support
module.exports = pool.promise();