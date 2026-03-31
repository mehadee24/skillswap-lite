// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Import Passport config
require('./config/passport')(passport);

// Initialize Express app
const app = express();

//(required for HTTPS detection)
app.enable('trust proxy');

// Connect to MongoDB before starting server
(async () => {
    await connectDB();

// Force HTTPS redirect in production
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

// Update CORS for production
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://skillswap-lite-1.netlify.app', // Your Netlify frontend
    'https://skillswap-lite-1.onrender.com' // Your Render backend
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Update session configuration for production
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', searchRoutes);

//Health check endpoint (useful for Render)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Define port
const PORT = process.env.PORT || 3000;

// Start server
    app.listen(PORT, () => {
        console.log(`Server is running on ${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://localhost:${PORT}`);
        console.log(`Frontend served from: ${path.join(__dirname, '../frontend')}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
})();