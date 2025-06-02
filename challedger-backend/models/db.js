const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a PostgreSQL connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Render PostgreSQL에 필요
  }
});

module.exports = pool;