const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.warn('Authentication failed: no Authorization header');
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Support tokens sent as 'Bearer <token>' or raw token
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  console.log('authenticate: token received:', token ? ('<redacted:' + token.slice(-8) + '>') : null);

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded; // contains { id: userId }
    console.log('authenticate: token valid for user id', decoded.id);
    next();
  } catch (err) {
    console.warn('Authentication failed: invalid token', err.message);
    res.status(400).json({ message: 'Invalid token.' });
  }
};