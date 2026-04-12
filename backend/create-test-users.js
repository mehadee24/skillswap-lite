const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Client = require('./models/Client');
const ServiceProvider = require('./models/ServiceProvider');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

const testUsers = [
    // Service Providers
    { name: 'Mehadee', email: 'mehadee@skillswap.com', password: 'password123', userType: 'provider', skills: ['Full Stack', 'AI', 'React'], description: 'Full Stack & AI Developer' },
    { name: 'Rakib', email: 'rakib@skillswap.com', password: 'password123', userType: 'provider', skills: ['Game Dev', 'Unreal Engine'], description: 'Game Developer' },
    { name: 'Alamin', email: 'alamin@skillswap.com', password: 'password123', userType: 'provider', skills: ['UI/UX', 'Mobile'], description: 'UI/UX Designer' },
    { name: 'Tanvir Ahmed', email: 'tanvir@skillswap.com', password: 'password123', userType: 'provider', skills: ['AWS', 'Cloud'], description: 'Cloud Architect' },
    { name: 'Sarah Khan', email: 'sarah@skillswap.com', password: 'password123', userType: 'provider', skills: ['Security', 'Ethical Hacking'], description: 'Cybersecurity Expert' },
    
    // Clients
    { name: 'Test Client 1', email: 'client1@test.com', password: 'password123', userType: 'client' },
    { name: 'Test Client 2', email: 'client2@test.com', password: 'password123', userType: 'client' },
];

async function createTestUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        for (const userData of testUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`⚠️ User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Create user
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                userType: userData.userType
            });

            // Create profile based on user type
            if (userData.userType === 'provider') {
                await ServiceProvider.create({
                    userId: user._id,
                    name: userData.name,
                    email: userData.email,
                    skills: userData.skills || ['General IT'],
                    description: userData.description || 'Professional service provider',
                    projectsCompleted: 0,
                    rating: 0
                });
                console.log(`✅ Created Provider: ${userData.email}`);
            } else {
                await Client.create({
                    userId: user._id,
                    name: userData.name,
                    email: userData.email,
                    projectsPosted: 0,
                    totalSpent: 0,
                    rating: 0
                });
                console.log(`✅ Created Client: ${userData.email}`);
            }
        }

        console.log('\n🎉 All test users created successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('Password for ALL: password123');
        console.log('\nProviders:');
        testUsers.filter(u => u.userType === 'provider').forEach(u => console.log(`   ${u.email}`));
        console.log('\nClients:');
        testUsers.filter(u => u.userType === 'client').forEach(u => console.log(`   ${u.email}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestUsers();