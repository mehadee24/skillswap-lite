// MongoDB connection configuration
const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * Uses environment variable for database URL or defaults to local MongoDB
 */
const connectDB = async () => {
    try {
        // MongoDB connection string - update this with your actual MongoDB URL
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;