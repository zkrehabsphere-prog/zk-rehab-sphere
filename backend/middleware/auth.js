const admin = require('../config/firebase');
const User = require('../models/User');

/**
 * Middleware: Verify Firebase ID Token and attach user to req.user
 * Accepts token from Authorization header: `Bearer <token>`
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated. Please login.' });
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Fetch user from MongoDB using firebaseUid
    const user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-firebaseUid -__v');

    if (!user) {
      return res.status(401).json({ error: 'User profile not found. Please verify your account.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Your account has been deactivated.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Firebase Auth Error:', err);
    return res.status(401).json({ error: 'Invalid or expired token. Please login again.' });
  }
};

/**
 * Optional auth — attaches user if token provided, but doesn't block if not
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-firebaseUid -__v');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    next();
  } catch {
    next(); // Silently ignore token errors for optional auth
  }
};

module.exports = { protect, optionalAuth };
