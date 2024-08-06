const jwt = require('jsonwebtoken');

let tokenVerifiedLogged = false; // Flag to track if the message has been logged

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    console.log('No token provided.');
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Invalid or expired token.');
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    req.userId = decoded._id;
    req.userRole = decoded.role; // Add role to request
    if (!tokenVerifiedLogged) {
      tokenVerifiedLogged = true; // Set the flag to true after logging
    }
    req.userDecoded = decoded; // Store decoded token for potential future use
    next();
  });
};

module.exports = verifyToken;