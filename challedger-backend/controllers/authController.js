const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed]
    );
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패', detail: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(401).json({ error: '존재하지 않는 사용자' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: '비밀번호 불일치' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, email: user.email });
} catch (err) {
    res.status(500).json({ error: '로그인 실패', detail: err.message });
  }
};