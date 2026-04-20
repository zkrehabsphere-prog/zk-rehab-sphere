/**
 * Role-based access control middleware
 * Must be used AFTER the `protect` middleware
 *
 * Usage:
 *   router.delete('/:id', protect, requireRole('admin'), handler)
 *   router.patch('/:id', protect, requireRole('admin', 'doctor'), handler)
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

/**
 * Check ownership or admin/doctor access
 * Allows if: user is admin, user is doctor, or user owns the resource
 * Usage: after protect, pass the userId field name in the resource
 */
const requireOwnerOrRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    if (roles.includes(req.user.role)) {
      return next(); // Admin/Doctor pass through
    }

    // Will be checked in the specific handler using req.user._id
    req.checkOwnership = true;
    next();
  };
};

module.exports = { requireRole, requireOwnerOrRole };
