import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('❌ [AUTH] No token provided for:', req.path);
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ [AUTH] Token verified for user:', { id: decoded.id, role: decoded.role, path: req.path });
    next();
  } catch (error) {
    console.log('❌ [AUTH] Invalid token for:', req.path, error.message);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('❌ [ROLE] User not authenticated for:', req.path);
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ [ROLE] Access denied for role:', req.user.role, 'Required:', allowedRoles, 'Path:', req.path);
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }

    console.log('✅ [ROLE] Access granted for role:', req.user.role, 'Path:', req.path);
    next();
  };
};
