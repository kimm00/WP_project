const jwt = require('jsonwebtoken');

// JWT authentication middleware
module.exports = (req, res, next) => {
  // Get token from Authorization header (e.g., "Bearer <token>")
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify token and decode payload
    req.user = decoded;  // Attach user info to request object for later use
    next();  // Proceed to the next middleware or route
  } catch {
    res.status(401).json({ error: 'Invalid token' });  // Token is invalid or expired
  }
};