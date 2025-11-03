const jwt = require('jsonwebtoken');
const commonUtils = require('../utils/common');

const checkToken = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('token');
      
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check permissions if required
      if (requiredPermissions.length > 0) {
        const hasPermission = await commonUtils.checkUserPermissions(
          decoded.userId, 
          requiredPermissions
        );
        
        if (!hasPermission) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };
};

module.exports = { checkToken };