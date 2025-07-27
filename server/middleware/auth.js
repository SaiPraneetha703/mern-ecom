// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 's0m3R@nd0mS3cr3tK3yF0rJvWtS!gn1ngApl!cat!0nPr0d#ct!0n';

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided', logout: true });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token', logout: true });
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { authenticateUser };
