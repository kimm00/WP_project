const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: '토큰 없음' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 요청에서 req.user.id 사용 가능
    next();
  } catch {
    res.status(401).json({ error: '유효하지 않은 토큰' });
  }
};