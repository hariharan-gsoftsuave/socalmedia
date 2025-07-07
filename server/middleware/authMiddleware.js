const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new HttpError("Unauthorized, Invalid token", 401));
      }

      req.user = decoded;  // ✅ Assign decoded user info to req
      next();
    });
  } else {
    return next(new HttpError("Unauthorized, No token provided", 401));
  }
};

module.exports = authMiddleware;
