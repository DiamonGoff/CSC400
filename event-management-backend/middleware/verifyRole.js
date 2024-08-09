// Middleware to verify if the user's role is allowed
const verifyRole = (allowedRoles) => (req, res, next) => {
  // Check if the user's role is in the allowedRoles array
  if (!allowedRoles.includes(req.user.role)) {
    console.log('Insufficient permissions for role:', req.user.role);
    return res.status(403).json({ message: 'Insufficient permissions.' }); // If not, respond with 403 Forbidden
  }
  
  console.log('Role verification successful for role:', req.user.role);
  next(); // Proceed to the next middleware or route handler
};

module.exports = verifyRole; // Export the verifyRole middleware
