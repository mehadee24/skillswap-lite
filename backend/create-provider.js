const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

async function createTestProvider() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'mehadee@skillswap.com' });
        
        if (existingUser) {
            console.log('User exists, resetting password...');
            // Reset password
            const hashedPassword = await bcrypt.hash('password123', 10);
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('✅ Password reset for mehadee@skillswap.com');
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = await User.create({
                name: 'Mehadee',
                email: 'mehadee@skillswap.com',
                password: hashedPassword,
                userType: 'provider'
            });
            console.log('✅ User created');

            // Create provider profile
            await ServiceProvider.create({
                userId: user._id,
                name: 'Mehadee',
                email: 'mehadee@skillswap.com',
                skills: ['Web Development', 'Full Stack Developer', 'React', 'Node.js', 'Machine Learning', 'AI Expert'],
                description: 'Full Stack Developer and AI specialist with 5+ years of experience building scalable web applications.',
                projectsCompleted: 45,
                rating: 4.9,
                currentlyWorkingOn: 'Building an AI-powered analytics platform'
            });
            console.log('✅ Provider profile created');
        }

        console.log('\n🎉 Test provider ready!');
        console.log('Email: mehadee@skillswap.com');
        console.log('Password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestProvider();