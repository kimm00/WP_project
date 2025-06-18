const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET /api/debug/tables
router.get('/tables', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    res.json({ tables: result.rows });
  } catch (err) {
    console.error('❌ Failed to fetch table list:', err);
    res.status(500).json({ error: 'Failed to fetch table list', detail: err.message });
  }
});

module.exports = router;