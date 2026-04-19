const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// List of all service providers from your API response
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

async function createMissingUsers() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        let created = 0;
        let skipped = 0;

        for (const provider of providers) {
            // Check if user already exists
            let user = await User.findOne({ email: provider.email });
            
            if (user) {
                // User exists, just reset password
                const hashedPassword = await bcrypt.hash('password123', 10);
                user.password = hashedPassword;
                await user.save();
                console.log(`🔄 Reset password for: ${provider.email}`);
                skipped++;
            } else {
                // Create new user
                const hashedPassword = await bcrypt.hash('password123', 10);
                user = await User.create({
                    name: provider.name,
                    email: provider.email,
                    password: hashedPassword,
                    userType: 'provider'
                });
                console.log(`✅ Created user: ${provider.email}`);
                created++;

                // Check if provider profile exists and link it
                const providerProfile = await ServiceProvider.findOne({ email: provider.email });
                if (providerProfile && !providerProfile.userId) {
                    providerProfile.userId = user._id;
                    await providerProfile.save();
                    console.log(`🔗 Linked provider profile: ${provider.email}`);
                }
            }
        }

        console.log(`\n🎉 Complete!`);
        console.log(`   ✅ Created: ${created} new users`);
        console.log(`   🔄 Reset: ${skipped} existing users`);
        console.log(`\n🔐 All passwords are now: password123`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createMissingUsers();