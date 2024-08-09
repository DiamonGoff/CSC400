const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token part after 'Bearer'

  if (!token) return res.status(401).json({ message: 'Access Denied' }); // If no token, respond with 401 Unauthorized

  try {
    // Verify the token using the JWT secret
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the verified user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' }); // If token is invalid, respond with 400 Bad Request
  }
};

module.exports = verifyToken; // Export the verifyToken middleware
