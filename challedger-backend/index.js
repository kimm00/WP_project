const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// .env 파일 불러오기
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 미들웨어
app.use(cors());
app.use(express.json()); // JSON 바디 파싱

// 기본 라우터
app.get('/', (req, res) => {
  res.send('ChalLedger backend is running!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


const db = require('./models/db');

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    res.json({ result: rows[0].result }); // { result: 2 }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB 연결 실패' });
  }
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);
