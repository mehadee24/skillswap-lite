const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// Test users to create
const testUsers = [
    // Providers
    { name: "Mehadee", email: "mehadee@skillswap.com", password: "password123", userType: "provider" },
    { name: "Rakib", email: "rakib@skillswap.com", password: "password123", userType: "provider" },
    { name: "Alamin", email: "alamin@skillswap.com", password: "password123", userType: "provider" },
    { name: "Tanvir Ahmed", email: "tanvir@skillswap.com", password: "password123", userType: "provider" },
    { name: "Sarah Khan", email: "sarah@skillswap.com", password: "password123", userType: "provider" },
    // Clients
    { name: "Test Client 1", email: "client1@test.com", password: "password123", userType: "client" },
    { name: "Test Client 2", email: "client2@test.com", password: "password123", userType: "client" }
];

async function fixLogin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // First, check what users exist
        const existingUsers = await User.find({});
        console.log(`📊 Existing users in database: ${existingUsers.length}`);
        existingUsers.forEach(u => console.log(`   - ${u.email} (${u.userType})`));
        
        console.log('\n🔧 Creating/updating test users...\n');

        for (const userData of testUsers) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            // Delete if exists (to start fresh)
            await User.deleteOne({ email: userData.email });
            
            // Create new user
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                userType: userData.userType
            });
            
            console.log(`✅ Created: ${userData.email} (${userData.userType})`);
            
            // Verify the password works
            const isValid = await bcrypt.compare('password123', user.password);
            console.log(`   🔐 Password test: ${isValid ? '✓ WORKING' : '✗ FAILED'}`);
        }

        console.log('\n🎉 FIX COMPLETE!');
        console.log('\n🔐 TEST CREDENTIALS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Password for ALL: password123\n');
        console.log('Providers:');
        console.log('   mehadee@skillswap.com');
        console.log('   rakib@skillswap.com');
        console.log('   alamin@skillswap.com');
        console.log('   tanvir@skillswap.com');
        console.log('   sarah@skillswap.com');
        console.log('\nClients:');
        console.log('   client1@test.com');
        console.log('   client2@test.com');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixLogin();