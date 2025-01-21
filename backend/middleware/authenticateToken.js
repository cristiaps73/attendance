const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  console.log('AuthenticateToken middleware called');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Forbidden' });
    }
    console.log('Token verified successfully');
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
