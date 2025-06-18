const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware setup
app.use(cors({
  origin: 'https://challedger.onrender.com',
  credentials: true
}));
app.use(express.json()); // Parse incoming JSON requests

// Root route for health check
app.get('/', (req, res) => {
  res.send('ChalLedger backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// DB connection test route
const db = require('./models/db');

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ result: rows[0].result }); // { result: 2 }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB connection failed' });
  }
});

// Route imports and usage
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);

const challengeRoutes = require('./routes/challenges');
app.use('/api/challenges', challengeRoutes);

const badgeRoutes = require('./routes/badge');
app.use('/api/badges', badgeRoutes);

const debugRoutes = require('./routes/debug');
app.use('/api/debug', debugRoutes);