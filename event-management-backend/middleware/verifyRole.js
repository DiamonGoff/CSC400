const verifyRole = (allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    console.log('Insufficient permissions for role:', req.user.role);
    return res.status(403).json({ message: 'Insufficient permissions.' });
  }
  console.log('Role verification successful for role:', req.user.role);
  next();
};

module.exports = verifyRole;
