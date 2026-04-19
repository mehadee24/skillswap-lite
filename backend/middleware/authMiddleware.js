const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and attaches user to request
 */
exports.protect = async (req, res, next) => {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized - No token provided'
        });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - User not found'
            });
        }
        
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized - Invalid token'
        });
    }
};

/**
 * Role-based authorization middleware
 * Checks if user has required role
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - Please login first'
            });
        }
        
        if (!roles.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. ${req.user.userType} role is not authorized for this route`
            });
        }
        
        next();
    };
};