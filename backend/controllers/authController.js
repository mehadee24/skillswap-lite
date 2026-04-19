const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Client = require('../models/Client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

/**
 * @desc    Register a new user with email/password
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password, userType, skills, description } = req.body;

        // Validation
        if (!name || !email || !password || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            userType
        });

        // Create additional profile based on user type
        if (userType === 'provider') {
            await ServiceProvider.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                skills: skills || [],
                description: description || '',
                rating: 0,
                projectsCompleted: 0
            });
        } else {
            await Client.create({
                userId: user._id,
                name: user.name,
                email: user.email,
                projectsPosted: 0,
                totalSpent: 0,
                rating: 0
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during signup' 
        });
    }
};

/**
 * @desc    Login user with email/password
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

/**
 * @desc    Google OAuth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=auth_failed`);
        }
        
        const token = generateToken(user._id);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?token=${token}`);
    } catch (error) {
        console.error('❌ Google auth error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?error=server_error`);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        let profile = null;
        if (user.userType === 'provider') {
            profile = await ServiceProvider.findOne({ userId: user._id });
        } else {
            profile = await Client.findOne({ userId: user._id });
        }

        res.json({
            success: true,
            user,
            profile
        });
    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};