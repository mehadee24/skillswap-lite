// MongoDB connection configuration
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable for database URL or defaults to local MongoDB
 */
const connectDB = async () => {
    try {
        // MongoDB connection string - using my Atlas URL
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap');
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;