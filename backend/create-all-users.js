const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Client = require('./models/Client');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// All Service Providers from your API
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

// Test Clients
const clients = [
    { name: "Test Client 1", email: "client1@test.com" },
    { name: "Test Client 2", email: "client2@test.com" },
    { name: "Demo Client", email: "demo@client.com" },
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" }
];

async function createAllUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        let providerCreated = 0;
        let providerReset = 0;
        let clientCreated = 0;
        let clientReset = 0;

        // ========== CREATE PROVIDERS ==========
        console.log('📌 PROCESSING PROVIDERS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        for (const provider of providers) {
            let user = await User.findOne({ email: provider.email });
            
            if (user) {
                // User exists, reset password
                const hashedPassword = await bcrypt.hash('password123', 10);
                user.password = hashedPassword;
                await user.save();
                console.log(`🔄 Reset password for provider: ${provider.email}`);
                providerReset++;
            } else {
                // Create new user
                const hashedPassword = await bcrypt.hash('password123', 10);
                user = await User.create({
                    name: provider.name,
                    email: provider.email,
                    password: hashedPassword,
                    userType: 'provider'
                });
                console.log(`✅ Created provider user: ${provider.email}`);
                providerCreated++;

                // Link to existing provider profile
                const providerProfile = await ServiceProvider.findOne({ email: provider.email });
                if (providerProfile && !providerProfile.userId) {
                    providerProfile.userId = user._id;
                    await providerProfile.save();
                    console.log(`   🔗 Linked to existing profile`);
                }
            }
        }

        console.log(`\n📊 PROVIDERS SUMMARY: ✅ ${providerCreated} created, 🔄 ${providerReset} reset\n`);

        // ========== CREATE CLIENTS ==========
        console.log('📌 PROCESSING CLIENTS:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        for (const client of clients) {
            let user = await User.findOne({ email: client.email });
            
            if (user) {
                // User exists, reset password
                const hashedPassword = await bcrypt.hash('password123', 10);
                user.password = hashedPassword;
                await user.save();
                console.log(`🔄 Reset password for client: ${client.email}`);
                clientReset++;
            } else {
                // Create new user
                const hashedPassword = await bcrypt.hash('password123', 10);
                user = await User.create({
                    name: client.name,
                    email: client.email,
                    password: hashedPassword,
                    userType: 'client'
                });
                console.log(`✅ Created client user: ${client.email}`);
                clientCreated++;

                // Check if client profile exists, if not create one
                let clientProfile = await Client.findOne({ email: client.email });
                if (!clientProfile) {
                    await Client.create({
                        userId: user._id,
                        name: client.name,
                        email: client.email,
                        projectsPosted: 0,
                        totalSpent: 0,
                        rating: 0
                    });
                    console.log(`   📝 Created client profile`);
                } else if (!clientProfile.userId) {
                    clientProfile.userId = user._id;
                    await clientProfile.save();
                    console.log(`   🔗 Linked to existing client profile`);
                }
            }
        }

        console.log(`\n📊 CLIENTS SUMMARY: ✅ ${clientCreated} created, 🔄 ${clientReset} reset\n`);

        // ========== FINAL SUMMARY ==========
        console.log('🎉 ALL USER ACCOUNTS ARE READY!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`\n🔐 PASSWORD FOR ALL ACCOUNTS: password123\n`);
        
        console.log('📋 SERVICE PROVIDERS (28 total):');
        providers.slice(0, 10).forEach(p => console.log(`   • ${p.email}`));
        console.log(`   ... and ${providers.length - 10} more\n`);
        
        console.log('👥 CLIENTS:');
        clients.forEach(c => console.log(`   • ${c.email}`));
        
        console.log('\n✅ You can now login with any of these emails and password: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createAllUsers();