const express = require('express');
const passport = require('passport');
const router = express.Router();
const { 
    signup, 
    login, 
    googleCallback, 
    getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Email/Password routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false,
        failureRedirect: '/login' 
    }),
    googleCallback
);

module.exports = router;

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ success: true, message: 'Logged out successfully' });
});