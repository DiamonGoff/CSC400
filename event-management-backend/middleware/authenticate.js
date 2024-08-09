const User = require('../models/User');

// Middleware to check if the user is authenticated
const authenticate = async (req, res, next) => {
  // Check if userId is present in session
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' }); // If not, respond with 401 Unauthorized
  }

  try {
    // Find the user by the session's userId
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' }); // If user is not found, respond with 401
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message }); // Handle any server errors
  }
};

module.exports = authenticate; // Export the authenticate middleware
