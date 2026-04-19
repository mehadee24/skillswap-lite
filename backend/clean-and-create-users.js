const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Client = require('./models/Client');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// All 28 service providers from your database
const providers = [
    { name: "Alamin", email: "alamin@skillswap.com" },
    { name: "Tanvir Ahmed", email: "tanvir@skillswap.com" },
    { name: "Sarah Khan", email: "sarah@skillswap.com" },
    { name: "Mehadee", email: "mehadee@skillswap.com" },
    { name: "Nusrat Jahan", email: "nusrat@skillswap.com" },
    { name: "Kamal Hossain", email: "kamal@skillswap.com" },
    { name: "Farzana Yesmin", email: "farzana@skillswap.com" },
    { name: "Rakib", email: "rakib@skillswap.com" },
    { name: "Sharmin Akter", email: "sharmin@skillswap.com" },
    { name: "Nazmul Haque", email: "nazmul@skillswap.com" },
    { name: "Hasan Mahmud", email: "hasan@skillswap.com" },
    { name: "Adnan Kabir", email: "adnan@skillswap.com" },
    { name: "Mushfiqur Rahman", email: "mushfiqur@skillswap.com" },
    { name: "Imran Hossain", email: "imran@skillswap.com" },
    { name: "Sumaiya Kabir", email: "sumaiya@skillswap.com" },
    { name: "Nadia Sultana", email: "nadia@skillswap.com" },
    { name: "Shakib Al Hasan", email: "shakib@skillswap.com" },
    { name: "Fatema Tuz Zohra", email: "fatema@skillswap.com" },
    { name: "Rima Chowdhury", email: "rima@skillswap.com" },
    { name: "Rafiqul Islam", email: "rafiqul@skillswap.com" },
    { name: "Tanisha Rahman", email: "tanisha@skillswap.com" },
    { name: "Farhana Akter", email: "farhana@skillswap.com" },
    { name: "Sumon Chakraborty", email: "sumon@skillswap.com" },
    { name: "Rajib Hossain", email: "rajib@skillswap.com" },
    { name: "Rasheda Begum", email: "rasheda@skillswap.com" },
    { name: "Rabiul Islam", email: "rabiul@skillswap.com" },
    { name: "Sohel Rana", email: "sohel@skillswap.com" },
    { name: "Mahmud Hasan", email: "mahmud@skillswap.com" }
];

// Test clients
const clients = [
    { name: "Test Client 1", email: "client1@test.com" },
    { name: "Test Client 2", email: "client2@test.com" },
    { name: "Demo Client", email: "demo@client.com" }
];

async function cleanAndCreate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // STEP 1: Delete ALL existing users
        const deletedUsers = await User.deleteMany({});
        console.log(`🗑️  Deleted ${deletedUsers.deletedCount} existing users\n`);

        // STEP 2: Create fresh provider users
        console.log('📌 CREATING PROVIDER USERS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        let providerCount = 0;

        for (const provider of providers) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            // Create user
            const user = await User.create({
                name: provider.name,
                email: provider.email,
                password: hashedPassword,
                userType: 'provider'
            });
            
            // Link to existing provider profile
            const providerProfile = await ServiceProvider.findOne({ email: provider.email });
            if (providerProfile) {
                providerProfile.userId = user._id;
                await providerProfile.save();
                console.log(`✅ ${provider.email} → linked to profile`);
                providerCount++;
            } else {
                console.log(`⚠️  No profile found for: ${provider.email}`);
            }
        }

        console.log(`\n📊 ${providerCount}/28 providers linked successfully\n`);

        // STEP 3: Create fresh client users
        console.log('📌 CREATING CLIENT USERS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        let clientCount = 0;

        for (const client of clients) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            
            const user = await User.create({
                name: client.name,
                email: client.email,
                password: hashedPassword,
                userType: 'client'
            });
            
            // Create or update client profile
            let clientProfile = await Client.findOne({ email: client.email });
            if (clientProfile) {
                clientProfile.userId = user._id;
                await clientProfile.save();
            } else {
                await Client.create({
                    userId: user._id,
                    name: client.name,
                    email: client.email,
                    projectsPosted: 0,
                    totalSpent: 0,
                    rating: 0
                });
            }
            
            console.log(`✅ Created client: ${client.email}`);
            clientCount++;
        }

        console.log(`\n📊 ${clientCount} clients created successfully\n`);

        // FINAL SUMMARY
        console.log('🎉 COMPLETE! Fresh users created for ALL providers and clients!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n🔐 PASSWORD FOR ALL ACCOUNTS: password123\n`);
        console.log('📋 SERVICE PROVIDERS (28):');
        console.log(`   Example: mehadee@skillswap.com`);
        console.log(`            rakib@skillswap.com`);
        console.log(`            alamin@skillswap.com`);
        console.log(`            tanvir@skillswap.com`);
        console.log(`            sarah@skillswap.com`);
        console.log(`   ... and 23 more\n`);
        console.log('👥 CLIENTS:');
        clients.forEach(c => console.log(`   ${c.email}`));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanAndCreate();