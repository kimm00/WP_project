// Import the Pool class from the 'pg' module (used to manage PostgreSQL connections)
const { Pool } = require('pg');
// Import and configure the dotenv package to load environment variables from a .env file
const dotenv = require('dotenv');

dotenv.config();  // Loads variables from .env into process.env

// Create a PostgreSQL connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // URL contains user, password, host, port, and DB name
  ssl: {
    rejectUnauthorized: false // Required for hosting services like Render to accept self-signed SSL
  }
});

// Export the pool object so it can be used elsewhere in the project to query the database
module.exports = pool;